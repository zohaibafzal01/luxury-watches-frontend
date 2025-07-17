import React from 'react';
import { ServiceRequest } from '@/types/service';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Calendar, Package, MapPin, DollarSign, Clock, MessageSquare } from 'lucide-react';

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
      pending: 'bg-yellow-500/20 text-yellow-700',
      bidding: 'bg-blue-500/20 text-blue-700',
      accepted: 'bg-green-500/20 text-green-700',
      'in-progress': 'bg-purple-500/20 text-purple-700',
      completed: 'bg-gray-500/20 text-gray-700',
      cancelled: 'bg-red-500/20 text-red-700',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-500/20 text-gray-700';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {request.watchBrand} {request.watchModel}
            <Badge className={getStatusColor(request.status)}>
              {request.status}
            </Badge>
          </DialogTitle>
          <DialogDescription>
            Service Request #{request.referenceId}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Request Details */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm">
                Created: {new Date(request.createdAt).toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Package className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm capitalize">
                Delivery: {request.deliveryPreference}
              </span>
            </div>
          </div>

          <Separator />

          {/* Issue Description */}
          <div>
            <h3 className="font-semibold mb-2">Issue Description</h3>
            <p className="text-sm text-muted-foreground">{request.description}</p>
          </div>

          {/* Photos */}
          {request.photos && request.photos.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2">Photos</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {request.photos.map((photo) => (
                  <img
                    key={photo.id}
                    src={photo.url}
                    alt="Watch photo"
                    className="w-full h-32 object-cover rounded-lg border"
                  />
                ))}
              </div>
            </div>
          )}

          {/* Bids Section - For now showing bid count since bids are stored as IDs */}
          {request.bids && request.bids.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2">Bids ({request.bids.length})</h3>
              <div className="p-3 border rounded-lg">
                <p className="text-sm text-muted-foreground">
                  This request has received {request.bids.length} bid{request.bids.length !== 1 ? 's' : ''}.
                </p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4">
            <Button variant="outline" className="flex-1">
              <MessageSquare className="w-4 h-4 mr-2" />
              Contact Dealer
            </Button>
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
