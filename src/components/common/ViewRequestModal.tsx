import React from "react";
import { ServiceRequest } from "@/types/service";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Calendar, Package, MapPin, MessageSquare, Image } from "lucide-react";

interface ViewRequestModalProps {
  request: ServiceRequest | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ViewRequestModal: React.FC<ViewRequestModalProps> = ({
  request,
  isOpen,
  onClose,
}) => {
  if (!request) return null;

  const getStatusColor = (status: string) => {
    const colors = {
      pending: "bg-[#CC5500]/20 text-[#CC5500]",
      bidding: "bg-blue-500/20 text-blue-700",
      accepted: "bg-green-500/20 text-green-700",
      "in-progress": "bg-purple-500/20 text-purple-700",
      completed: "bg-gray-500/20 text-gray-700",
      cancelled: "bg-red-500/20 text-red-700",
    };
    return (
      colors[status as keyof typeof colors] || "bg-gray-500/20 text-gray-700"
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {request?.watchBrand} {request?.watchModel}
            <Badge className={getStatusColor(request?.status)}>
              {request?.status}
            </Badge>
          </DialogTitle>
          <DialogDescription>
            Request ID: <strong>{request?.id}</strong>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4" />
              Created on: {new Date(request?.createdAt).toLocaleDateString()}
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Package className="w-4 h-4" />
              Delivery: {request?.deliveryPreference}
            </div>
          </div>

          {/* Location (optional) */}
          {request?.location && request?.location?.address && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="w-4 h-4" />
              Location: {request?.location?.address}
            </div>
          )}

          <Separator />

          {/* Description */}
          <div>
            <h3 className="font-semibold mb-2">Issue Description</h3>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
              {request?.description}
            </p>
          </div>

          {/* Photos */}
          {request?.photos && request?.photos.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Image className="w-4 h-4" /> Photos
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {request.photos.map((photo) => (
                  <img
                    key={photo?.id}
                    src={photo?.url}
                    alt="Uploaded photo"
                    className="w-full h-32 object-cover rounded-md border"
                  />
                ))}
              </div>
            </div>
          )}

          {/* Bids */}
          {request?.bids && request?.bids.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2">Bids Received</h3>
              <p className="text-sm text-muted-foreground">
                This request has received{" "}
                <strong>{request?.bids.length}</strong> bid(s).
              </p>
            </div>
          )}

          <Separator />

          {/* Close button */}
          <div className="flex justify-end">
            <Button
              onClick={onClose}
              variant="outline"
              className="hover:bg-[#CC5500]"
            >
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
