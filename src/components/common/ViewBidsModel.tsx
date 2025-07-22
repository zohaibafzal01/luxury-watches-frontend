import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog';
import { DollarSign, Clock, Package, MessageSquare, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ServiceRequest, Bid } from '@/types/service';

interface ViewBidsModalProps {
  isOpen: boolean;
  onClose: () => void;
  request: ServiceRequest | null;
  bids: Bid[];
}

export const ViewBidsModal: React.FC<ViewBidsModalProps> = ({ isOpen, onClose, request, bids }) => {
  if (!request) return null;

  const requestBids = bids.filter((bid) => bid.serviceRequestId === request.id);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            Bids for {request.watchBrand} {request.watchModel}
          </DialogTitle>
          <DialogDescription>Reference ID: {request.referenceId}</DialogDescription>
        </DialogHeader>

        {requestBids.length > 0 ? (
          <div className="space-y-4 mt-2">
            {requestBids.map((bid) => (
              <div
                key={bid.id}
                className="p-4 border border-border rounded-lg bg-muted/20 relative"
              >
                {/* Submitted Date - Top Right */}
                <div className="absolute top-2 right-4 text-xs text-muted-foreground">
                  Submitted: {new Date(bid.submittedAt).toLocaleDateString()}
                </div>

                {/* Notes (if any) */}
                {bid.notes && (
                  <p className="text-sm text-muted-foreground italic mb-2">
                    "{bid.notes}"
                  </p>
                )}

                {/* Bid Info */}
                <div className="flex flex-wrap gap-4 items-center mb-3">
                  <span className="flex items-center gap-1 text-sm">
                    <DollarSign className="w-4 h-4 text-primary" />
                    <span className="font-medium">${bid.estimatedPrice}</span>
                  </span>
                  <span className="flex items-center gap-1 text-sm">
                    <Clock className="w-4 h-4 text-primary" />
                    {bid.turnaroundTime} days
                  </span>
                  <span className="flex items-center gap-1 text-sm capitalize">
                    <Package className="w-4 h-4 text-primary" />
                    {bid.deliveryMethod}
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mt-3">
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={onClose}>
                      <CheckCircle className="w-4 h-4 mr-1 text-green-600" />
                      Accept
                    </Button>
                    <Button variant="outline" onClick={onClose}>
                      <XCircle className="w-4 h-4 mr-1 text-red-600" />
                      Reject
                    </Button>
                  </div>
                  <Button variant="outline" className="flex items-center">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Contact
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground italic mt-4">
            No bids submitted yet for this request.
          </p>
        )}

        {/* Modal Close Button */}
        <div className="flex justify-end mt-6">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
