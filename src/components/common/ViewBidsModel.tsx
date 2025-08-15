import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  DollarSign,
  Clock,
  Package,
  MessageSquare,
  CheckCircle,
  XCircle,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ServiceRequest, Bid } from "@/types/service";
import dealerApi from "@/api/dealer";
import { useToast } from "@/hooks/use-toast";

export enum BidStatus {
  SUBMITTED = "submitted",
  ACCEPTED = "accepted",
  REJECTED = "rejected",
  COMPLETED = "completed",
}

interface ViewBidsModalProps {
  isOpen: boolean;
  onClose: () => void;
  request: ServiceRequest | null;
  bids?: Bid[];
  onBidStatusUpdate?: (bidId: string, newStatus: string) => void;
}

export const ViewBidsModal: React.FC<ViewBidsModalProps> = ({
  isOpen,
  onClose,
  request,
  bids = [],
  onBidStatusUpdate,
}) => {
  const [processingBids, setProcessingBids] = useState<Set<string>>(new Set());
  const [bidStatuses, setBidStatuses] = useState<Record<string, string>>({});
  const { toast } = useToast();

  if (!request) return null;

  const requestBids =
    request.biddings ||
    bids.filter((bid) => bid?.serviceRequestId === request?.id);

  const handleBidAction = async (
    bidId: string,
    action: "accept" | "reject"
  ) => {
    if (!bidId) {
      console.error("Bid ID is required");
      toast({
        title: "Error",
        description: "Bid ID is required",
        variant: "destructive",
      });
      return;
    }

    setProcessingBids((prev) => new Set([...prev, bidId]));

    try {
      const status =
        action === "accept" ? BidStatus.ACCEPTED : BidStatus.REJECTED;
      const response = await dealerApi.biddingStatusUpdate(bidId, status);

      if (response?.success) {
        setBidStatuses((prev) => ({
          ...prev,
          [bidId]: status,
        }));

        if (onBidStatusUpdate) {
          onBidStatusUpdate(bidId, status);
        }

        toast({
          title: "Success",
          description: `Bid ${action}ed successfully`,
        });

        console.log(`Bid ${action}ed successfully:`, response);
      } else {
        toast({
          title: "Error",
          description: `Failed to ${action} bid`,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error(`Error ${action}ing bid:`, error);
      toast({
        title: "Error",
        description: `Error ${action}ing bid. Please try again.`,
        variant: "destructive",
      });
    } finally {
      setProcessingBids((prev) => {
        const newSet = new Set(prev);
        newSet.delete(bidId);
        return newSet;
      });
    }
  };

  const handleAcceptBid = (bidId: string) => {
    handleBidAction(bidId, "accept");
  };

  const handleRejectBid = (bidId: string) => {
    handleBidAction(bidId, "reject");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            Bids for {request?.brand} - {request?.model}
          </DialogTitle>
          <DialogDescription>Reference ID: {request?.id}</DialogDescription>
        </DialogHeader>

        {requestBids?.length > 0 ? (
          <div className="space-y-4 mt-2">
            {requestBids.map((bid) => {
              const isProcessing = processingBids.has(bid?.id);
              const currentStatus = bidStatuses[bid?.id] || bid?.status;

              return (
                <div
                  key={bid?.id}
                  className="p-4 border border-border rounded-lg bg-muted/20 relative"
                >
                  {/* Submitted Date - Top Right */}
                  <div className="absolute top-2 right-4 text-xs text-muted-foreground">
                    Submitted:{" "}
                    {new Date(
                      bid?.submittedAt || (bid as any).createdAt
                    ).toLocaleDateString()}
                  </div>

                  {/* Notes (if any) */}
                  {bid.notes && (
                    <p className="text-sm text-muted-foreground italic mb-2">
                      "{bid?.notes}"
                    </p>
                  )}

                  {/* Bid Info */}
                  <div className="flex flex-wrap gap-4 items-center mb-3">
                    <span className="flex items-center gap-1 text-sm">
                      <DollarSign className="w-4 h-4 text-primary" />
                      <span className="font-medium">
                        {bid?.estimatedPrice}
                      </span>
                    </span>
                    <span className="flex items-center gap-1 text-sm">
                      <Clock className="w-4 h-4 text-primary" />
                      {(bid as any).turnAroundTime || bid?.turnaroundTime} days
                    </span>
                    <span className="flex items-center gap-1 text-sm capitalize">
                      <Package className="w-4 h-4 text-primary" />
                      {bid?.deliveryMethod}
                    </span>
                  </div>

                  {/* Bid Status Badge */}
                  {currentStatus !== "submitted" && (
                    <div className="mb-3">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          currentStatus === "accepted"
                            ? "bg-green-100 text-green-800 border border-green-200"
                            : currentStatus === "rejected"
                            ? "bg-red-100 text-red-800 border border-red-200"
                            : "bg-gray-100 text-gray-800 border border-gray-200"
                        }`}
                      >
                        {currentStatus === "accepted" && (
                          <CheckCircle className="w-3 h-3 mr-1" />
                        )}
                        {currentStatus === "rejected" && (
                          <XCircle className="w-3 h-3 mr-1" />
                        )}
                        {currentStatus?.charAt(0).toUpperCase() +
                          currentStatus?.slice(1)}
                      </span>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mt-3">
                    {/* Show Accept/Reject buttons only if bid is still in submitted status */}
                    {currentStatus === "submitted" ? (
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          onClick={() => handleAcceptBid(bid?.id)}
                          disabled={isProcessing}
                          className="hover:bg-[#CC5500]/90 disabled:opacity-50"
                        >
                          {isProcessing ? (
                            <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                          ) : (
                            <CheckCircle className="w-4 h-4 mr-1 text-green-600" />
                          )}
                          Accept
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => handleRejectBid(bid?.id)}
                          disabled={isProcessing}
                          className="hover:bg-[#CC5500]/90 disabled:opacity-50"
                        >
                          {isProcessing ? (
                            <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                          ) : (
                            <XCircle className="w-4 h-4 mr-1 text-red-600" />
                          )}
                          Reject
                        </Button>
                      </div>
                    ) : (
                      <div className="text-sm text-muted-foreground">
                        This bid has been {currentStatus}
                      </div>
                    )}

                    {/* <Button
                      variant="outline"
                      className="flex items-center hover:bg-[#CC5500]/90"
                      disabled={isProcessing}
                    >
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Contact
                    </Button> */}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground italic mt-4">
            No bids submitted yet for this request.
          </p>
        )}

        {/* Modal Close Button */}
        <div className="flex justify-end mt-6 ">
          <Button
            variant="outline"
            onClick={onClose}
            className="hover:bg-[#CC5500]/90"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
