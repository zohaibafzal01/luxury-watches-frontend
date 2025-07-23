import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import { CreateServiceRequestData } from '@/types/service';
import { Camera, MapPin, Upload, X, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const ServiceRequestForm: React.FC = () => {
  const [formData, setFormData] = useState<CreateServiceRequestData>({
    watchBrand: '',
    watchModel: '',
    description: '',
    deliveryPreference: 'shipping',
    photos: [],
    location: undefined,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [referenceId, setReferenceId] = useState<string | null>(null);
  const { toast } = useToast();

  const watchBrands = [
    'Rolex', 'Patek Philippe', 'Audemars Piguet', 'Omega', 'Cartier',
    'Breitling', 'TAG Heuer', 'IWC', 'Jaeger-LeCoultre', 'Vacheron Constantin',
    'Tudor', 'Seiko', 'Citizen', 'Casio', 'Other'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleBrandChange = (brand: string) => {
    setFormData(prev => ({ ...prev, watchBrand: brand }));
  };

  const handleDeliveryChange = (delivery: 'drop-off' | 'shipping') => {
    setFormData(prev => ({ ...prev, deliveryPreference: delivery }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setFormData(prev => ({
      ...prev,
      photos: [...prev.photos, ...files].slice(0, 5), // Max 5 photos
    }));
  };

  const removePhoto = (index: number) => {
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index),
    }));
  };

  const captureLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData(prev => ({
            ...prev,
            location: {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              address: 'Current Location', // In real app, reverse geocode this
            },
          }));
          toast({
            title: 'Location captured',
            description: 'Your location has been added to the request.',
          });
        },
        (error) => {
          toast({
            title: 'Location error',
            description: 'Could not capture your location. Please enter manually.',
            variant: 'destructive',
          });
        }
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Mock API call - replace with real implementation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const refId = `CR-${Date.now()}`;
      setReferenceId(refId);

      toast({
        title: 'Service request submitted!',
        description: `Your request ${refId} has been created and sent to dealers.`,
      });
    } catch (error) {
      toast({
        title: 'Submission failed',
        description: 'Please try again or contact support.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (referenceId) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md luxury-card text-center">
          <CardContent className="pt-6">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
            <h2 className="luxury-title text-xl mb-2">Request Submitted!</h2>
            <p className="text-muted-foreground mb-4">
              Your service request has been created with reference ID:
            </p>
            <Badge variant="outline" className="text-lg px-4 py-2 mb-6">
              {referenceId}
            </Badge>
            <p className="text-sm text-muted-foreground mb-6">
              You will receive notifications when dealers submit bids for your watch service.
            </p>
            <Button
              onClick={() => {
                setReferenceId(null);
                setFormData({
                  watchBrand: '',
                  watchModel: '',
                  description: '',
                  deliveryPreference: 'shipping',
                  photos: [],
                  location: undefined,
                });
              }}
              className="luxury-button"
            >
              Submit Another Request
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 p-4">
      <div className="container mx-auto max-w-2xl">
        <Card className="luxury-card">
          <CardHeader>
            <CardTitle className="luxury-title">Service Request</CardTitle>
            <CardDescription>
              Tell us about your watch and the service you need. Our network of certified dealers will provide competitive bids.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Watch Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Watch Information</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="watchBrand">Brand</Label>
                  <Select value={formData.watchBrand} onValueChange={handleBrandChange}>
                    <SelectTrigger className="luxury-input">
                      <SelectValue placeholder="Select watch brand" />
                    </SelectTrigger>
                    <SelectContent>
                      {watchBrands.map(brand => (
                        <SelectItem key={brand} value={brand}>
                          {brand}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="watchModel">Model</Label>
                  <Input
                    id="watchModel"
                    name="watchModel"
                    value={formData.watchModel}
                    onChange={handleInputChange}
                    className="luxury-input"
                    placeholder="e.g., Submariner, Speedmaster, Daytona"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Issue Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="luxury-input min-h-[100px]"
                    placeholder="Describe the issue with your watch in detail..."
                    required
                  />
                </div>
              </div>

              {/* Photo Upload */}
              {/* <div className="space-y-4">
                <h3 className="text-lg font-semibold">Photos</h3>
                <p className="text-sm text-muted-foreground">
                  Upload photos of your watch to help dealers provide accurate estimates (max 5 photos)
                </p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {formData.photos.map((photo, index) => (
                    <div key={index} className="relative">
                      <img
                        src={URL.createObjectURL(photo)}
                        alt={`Watch photo ${index + 1}`}
                        className="w-20 h-20 object-cover rounded-lg border"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                        onClick={() => removePhoto(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('photo-upload')?.click()}
                    disabled={formData.photos.length >= 5}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Photos
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('camera-upload')?.click()}
                    disabled={formData.photos.length >= 5}
                  >
                    <Camera className="w-4 h-4 mr-2" />
                    Take Photo
                  </Button>
                </div>

                <input
                  id="photo-upload"
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <input
                  id="camera-upload"
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div> */}

              {/* Delivery Preference */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Delivery Preference</h3>
                <RadioGroup
                  value={formData.deliveryPreference}
                  onValueChange={handleDeliveryChange}
                  className="space-y-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="shipping" id="shipping" />
                    <Label htmlFor="shipping">Shipping (send and receive via courier)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="drop-off" id="drop-off" />
                    <Label htmlFor="drop-off">Drop-off (visit dealer location)</Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Location */}
              {/* <div className="space-y-4">
                <h3 className="text-lg font-semibold">Location</h3>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={captureLocation}
                  >
                    <MapPin className="w-4 h-4 mr-2" />
                    Use Current Location
                  </Button>
                  {formData.location && (
                    <Badge variant="outline" className="px-3 py-1">
                      Location captured
                    </Badge>
                  )}
                </div>
              </div> */}

              <Button
                type="submit"
                className="w-full luxury-button"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting Request...' : 'Submit Service Request'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
