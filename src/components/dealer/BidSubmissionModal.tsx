
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ServiceRequest } from '@/types/service';
import { useToast } from '@/hooks/use-toast';

interface BidSubmissionModalProps {
  request: ServiceRequest | null;
  isOpen: boolean;
  onClose: () => void;
}

export const BidSubmissionModal: React.FC<BidSubmissionModalProps> = ({
  request,
  isOpen,
  onClose,
}) => {
  const [bidData, setBidData] = useState({
    estimatedPrice: '',
    turnaroundTime: '',
    deliveryMethod: '',
    notes: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Mock bid submission
    await new Promise(resolve => setTimeout(resolve, 1000));

    toast({
      title: 'Bid Submitted Successfully',
      description: `Your bid of $${bidData.estimatedPrice} has been submitted for ${request?.watchBrand} ${request?.watchModel}.`,
    });

    setBidData({
      estimatedPrice: '',
      turnaroundTime: '',
      deliveryMethod: '',
      notes: '',
    });
    setIsSubmitting(false);
    onClose();
  };

  const handleChange = (field: string, value: string) => {
    setBidData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  if (!request) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Submit Bid</DialogTitle>
          <DialogDescription>
            Submit your bid for {request.watchBrand} {request.watchModel}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="price">Estimated Price ($)</Label>
            <Input
              id="price"
              type="number"
              value={bidData.estimatedPrice}
              onChange={(e) => handleChange("estimatedPrice", e.target.value)}
              placeholder="450"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="turnaround">Turnaround Time (days)</Label>
            <Input
              id="turnaround"
              type="number"
              value={bidData.turnaroundTime}
              onChange={(e) => handleChange("turnaroundTime", e.target.value)}
              placeholder="7"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="delivery">Delivery Method</Label>
            <Select
              value={bidData.deliveryMethod}
              onValueChange={(value) => handleChange("deliveryMethod", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select delivery method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pickup">Pickup</SelectItem>
                <SelectItem value="shipping">Shipping</SelectItem>
                <SelectItem value="drop-off">Drop-off</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes (Optional)</Label>
            <Textarea
              id="notes"
              value={bidData.notes}
              onChange={(e) => handleChange("notes", e.target.value)}
              placeholder="Any additional information about your service..."
              rows={3}
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 hover:bg-[#CC5500]"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-[#CC5500] text-white hover:bg-[#CC5500]/90"
            >
              {isSubmitting ? "Submitting..." : "Submit Bid"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
