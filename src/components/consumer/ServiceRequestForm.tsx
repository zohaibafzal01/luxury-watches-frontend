import React, { useState, useCallback, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CreateServiceRequestData } from "@/types/service";
import {
  Camera,
  MapPin,
  Upload,
  X,
  CheckCircle,
  ChevronDown,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import consumerApi from "@/api/consumer";
import dealerApi from "@/api/dealer";

export const ServiceRequestForm: React.FC = () => {
  const [formData, setFormData] = useState<CreateServiceRequestData>({
    watchBrand: "",
    watchModel: "",
    description: "",
    deliveryPreference: "shipping",
    photos: [],
    location: undefined,
  });
  const [dealerData, setDealerData] = useState({
    businessName: "",
    phoneNo: "",
    address: "",
    email: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [referenceId, setReferenceId] = useState<string | null>(null);
  const [selectedAction, setSelectedAction] =
    useState<string>("ServiceRequestType");
  const [dealerSearchResults, setDealerSearchResults] = useState<any[]>([]);
  const [isUserExists, setIsUserExists] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState({
    businessName: false,
    phoneNo: false,
    address: false,
    email: false,
  });
  const { toast } = useToast();

  const watchBrands = [
    "Rolex",
    "Patek Philippe",
    "Audemars Piguet",
    "Omega",
    "Cartier",
    "Breitling",
    "TAG Heuer",
    "IWC",
    "Jaeger-LeCoultre",
    "Vacheron Constantin",
    "Tudor",
    "Seiko",
    "Citizen",
    "Casio",
    "Other",
  ];

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e?.target?.name ?? ""]: e?.target?.value ?? "",
    }));
  };

  const handleBrandChange = (brand: string) => {
    setFormData((prev) => ({ ...prev, watchBrand: brand }));
  };

  const handleDeliveryChange = (delivery: "drop-off" | "shipping") => {
    setFormData((prev) => ({ ...prev, deliveryPreference: delivery }));
  };

  // Check if all dealer fields are empty and reset isUserExists accordingly
  useEffect(() => {
    const { businessName, phoneNo, address, email } = dealerData;
    const allFieldsEmpty = !businessName && !phoneNo && !address && !email;

    if (allFieldsEmpty) {
      setIsUserExists(false);
    }
  }, [dealerData]);

  const handleDealerDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e?.target || {};
    setDealerData((prev) => ({
      ...prev,
      [name ?? ""]: value ?? "",
    }));

    // Trigger search for the current field
    if (name && value) {
      debouncedSearch(value, name);
    } else {
      setShowSuggestions((prev) => ({ ...prev, [name ?? ""]: false }));
    }
  };

  const handleActionSelect = (action: string) => {
    setSelectedAction(action);
  };

  // Ref to store the timeout ID
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Debounced search function
  const searchDealers = useCallback(
    async (searchQuery: string, field: string) => {
      if (!searchQuery.trim()) {
        setDealerSearchResults([]);
        setShowSuggestions((prev) => ({ ...prev, [field]: false }));
        return;
      }

      setIsSearching(true);
      try {
        const searchParams = {
          businessName: field === "businessName" ? searchQuery : "",
          phoneNo: field === "phoneNo" ? searchQuery : "",
          address: field === "address" ? searchQuery : "",
          email: field === "email" ? searchQuery : "",
        };

        const response = await dealerApi.dealerSearch(
          searchParams.businessName,
          searchParams.phoneNo,
          searchParams.address,
          searchParams.email
        );

        const results = response?.data || [];
        setDealerSearchResults(results);
        setShowSuggestions((prev) => ({
          ...prev,
          [field]: results.length > 0,
        }));
      } catch (error) {
        console.error("Dealer search error:", error);
        setDealerSearchResults([]);
        setShowSuggestions((prev) => ({ ...prev, [field]: false }));
      } finally {
        setIsSearching(false);
      }
    },
    []
  );

  // Debounced search with proper cleanup
  const debouncedSearch = useCallback(
    (searchQuery: string, field: string) => {
      // Clear existing timeout
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }

      // Set new timeout
      searchTimeoutRef.current = setTimeout(() => {
        searchDealers(searchQuery, field);
      }, 300);
    },
    [searchDealers]
  );

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  // Handle dealer selection from dropdown
  const handleDealerSelect = (dealer: any) => {
    setDealerData({
      businessName: dealer?.companyName ?? dealer?.businessName ?? "",
      phoneNo: dealer?.phoneNo ?? "",
      address: dealer?.address ?? "",
      email: dealer?.email ?? "",
    });

    // Set isUserExists to true when user selects from search suggestions
    setIsUserExists(true);

    setShowSuggestions({
      businessName: false,
      phoneNo: false,
      address: false,
      email: false,
    });
    setDealerSearchResults([]);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e?.target?.files || []);
    setFormData((prev) => ({
      ...prev,
      photos: [...(prev?.photos ?? []), ...files].slice(0, 5), // Max 5 photos
    }));
  };

  const removePhoto = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      photos: (prev?.photos ?? []).filter((_, i) => i !== index),
    }));
  };

  const captureLocation = () => {
    if (navigator?.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData((prev) => ({
            ...prev,
            location: {
              latitude: position?.coords?.latitude ?? 0,
              longitude: position?.coords?.longitude ?? 0,
              address: "Current Location", // In real app, reverse geocode this
            },
          }));
          toast({
            title: "Location captured",
            description: "Your location has been added to the request.",
          });
        },
        (error) => {
          toast({
            title: "Location error",
            description:
              "Could not capture your location. Please enter manually.",
            variant: "destructive",
          });
        }
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate that user has selected an action
    if (selectedAction === "ServiceRequestType") {
      toast({
        title: "Action Required",
        description: "Please select an action from the dropdown menu.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { watchBrand, watchModel, description, deliveryPreference } =
        formData ?? {};

      let payload;

      if (selectedAction === "request-bid") {
        // Send payload wrapped in serviceRequest object for request-bid
        payload = {
          serviceRequest: {
            brand: watchBrand ?? "",
            model: watchModel ?? "",
            issueDescription: description ?? "",
            deliveryPreference: deliveryPreference ?? "shipping",
            serviceRequestType: selectedAction,
          },
        };
      } else if (selectedAction === "dealer") {
        // For dealer selection, send two separate objects
        payload = {
          serviceRequest: {
            brand: watchBrand ?? "",
            serviceRequestType: selectedAction,
            model: watchModel ?? "",
            issueDescription: description ?? "",
            deliveryPreference: deliveryPreference ?? "shipping",
          },
          dealer: {
            businessName: dealerData?.businessName ?? "",
            phoneNo: dealerData?.phoneNo ?? "",
            address: dealerData?.address ?? "",
            email: dealerData?.email ?? "",
            isUserExists: isUserExists,
          },
        };
      }

      const response = await consumerApi.serviceRequest(
        watchBrand ?? "",
        watchModel ?? "",
        description ?? "",
        deliveryPreference ?? "shipping",
        payload
      );

      const refId = response?.data?.id || `CR-${Date.now()}`;
      setReferenceId(refId);

      toast({
        title: "Service request submitted!",
        description: `Your request ${refId} has been created and sent to dealers.`,
      });
    } catch (error: any) {
      toast({
        title: "Submission failed",
        description: error?.message || "Please try again or contact support.",
        variant: "destructive",
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
              You will receive notifications when dealers submit bids for your
              watch service.
            </p>
            <Button
              onClick={() => {
                setReferenceId(null);
                setSelectedAction("ServiceRequestType");
                setFormData({
                  watchBrand: "",
                  watchModel: "",
                  description: "",
                  deliveryPreference: "shipping",
                  photos: [],
                  location: undefined,
                });
                setDealerData({
                  businessName: "",
                  phoneNo: "",
                  address: "",
                  email: "",
                });
                setIsUserExists(false);
                setDealerSearchResults([]);
                setShowSuggestions({
                  businessName: false,
                  phoneNo: false,
                  address: false,
                  email: false,
                });
              }}
              className="luxury-button bg-[#CC5500] text-white hover:bg-[#CC5500]/90"
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
              Tell us about your watch and the service you need. Our network of
              certified dealers will provide competitive bids.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Watch Information */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Watch Information</h3>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        className="flex items-center gap-2 hover:bg-[#CC5500]"
                      >
                        {selectedAction}
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => handleActionSelect("dealer")}
                      >
                        Dealer
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleActionSelect("request-bid")}
                      >
                        Request Bid
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Dealer-specific fields - only show when dealer option is selected */}
                {selectedAction === "dealer" && (
                  <>
                    <div className="space-y-2 relative">
                      <Label htmlFor="businessName">Business Name</Label>
                      <Input
                        id="businessName"
                        name="businessName"
                        value={dealerData?.businessName ?? ""}
                        onChange={handleDealerDataChange}
                        onFocus={() =>
                          setShowSuggestions((prev) => ({
                            ...prev,
                            businessName:
                              (dealerSearchResults?.length ?? 0) > 0,
                          }))
                        }
                        onBlur={() =>
                          setTimeout(
                            () =>
                              setShowSuggestions((prev) => ({
                                ...prev,
                                businessName: false,
                              })),
                            200
                          )
                        }
                        className="luxury-input"
                        placeholder="e.g., John Doe Watch Repair"
                        required
                      />
                      {showSuggestions.businessName && (
                        <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-y-auto">
                          {isSearching ? (
                            <div className="p-2 text-center text-gray-500">
                              Searching dealers...
                            </div>
                          ) : dealerSearchResults.length > 0 ? (
                            dealerSearchResults.map((dealer, index) => (
                              <div
                                key={index}
                                className="p-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                                onClick={() => handleDealerSelect(dealer)}
                              >
                                <div className="font-medium">
                                  {dealer?.companyName ??
                                    dealer?.businessName ??
                                    "N/A"}
                                </div>
                                <div className="text-sm text-gray-600">
                                  {dealer?.email ?? "N/A"}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {dealer?.phoneNo ?? "N/A"} •{" "}
                                  {dealer?.address ?? "N/A"}
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="p-2 text-center text-gray-500">
                              No dealers found. You can create a new entry.
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="space-y-2 relative">
                      <Label htmlFor="phoneNo">Phone Number</Label>
                      <Input
                        id="phoneNo"
                        name="phoneNo"
                        value={dealerData?.phoneNo ?? ""}
                        onChange={handleDealerDataChange}
                        onFocus={() =>
                          setShowSuggestions((prev) => ({
                            ...prev,
                            phoneNo: dealerSearchResults.length > 0,
                          }))
                        }
                        onBlur={() =>
                          setTimeout(
                            () =>
                              setShowSuggestions((prev) => ({
                                ...prev,
                                phoneNo: false,
                              })),
                            200
                          )
                        }
                        className="luxury-input"
                        placeholder="e.g., +1234567890"
                        required
                      />
                      {showSuggestions.phoneNo && (
                        <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-y-auto">
                          {isSearching ? (
                            <div className="p-2 text-center text-gray-500">
                              Searching dealers...
                            </div>
                          ) : dealerSearchResults.length > 0 ? (
                            dealerSearchResults.map((dealer, index) => (
                              <div
                                key={index}
                                className="p-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                                onClick={() => handleDealerSelect(dealer)}
                              >
                                <div className="font-medium">
                                  {dealer?.companyName ??
                                    dealer?.businessName ??
                                    "N/A"}
                                </div>
                                <div className="text-sm text-gray-600">
                                  {dealer?.email ?? "N/A"}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {dealer?.phoneNo ?? "N/A"} •{" "}
                                  {dealer?.address ?? "N/A"}
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="p-2 text-center text-gray-500">
                              No dealers found. You can create a new entry.
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="space-y-2 relative">
                      <Label htmlFor="address">Address</Label>
                      <Input
                        id="address"
                        name="address"
                        value={dealerData?.address ?? ""}
                        onChange={handleDealerDataChange}
                        onFocus={() =>
                          setShowSuggestions((prev) => ({
                            ...prev,
                            address: dealerSearchResults.length > 0,
                          }))
                        }
                        onBlur={() =>
                          setTimeout(
                            () =>
                              setShowSuggestions((prev) => ({
                                ...prev,
                                address: false,
                              })),
                            200
                          )
                        }
                        className="luxury-input"
                        placeholder="e.g., 123 Main St, Anytown, USA"
                        required
                      />
                      {showSuggestions.address && (
                        <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-y-auto">
                          {isSearching ? (
                            <div className="p-2 text-center text-gray-500">
                              Searching dealers...
                            </div>
                          ) : dealerSearchResults.length > 0 ? (
                            dealerSearchResults.map((dealer, index) => (
                              <div
                                key={index}
                                className="p-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                                onClick={() => handleDealerSelect(dealer)}
                              >
                                <div className="font-medium">
                                  {dealer?.companyName ??
                                    dealer?.businessName ??
                                    "N/A"}
                                </div>
                                <div className="text-sm text-gray-600">
                                  {dealer?.email ?? "N/A"}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {dealer?.phoneNo ?? "N/A"} •{" "}
                                  {dealer?.address ?? "N/A"}
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="p-2 text-center text-gray-500">
                              No dealers found. You can create a new entry.
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="space-y-2 relative">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={dealerData?.email ?? ""}
                        onChange={handleDealerDataChange}
                        onFocus={() =>
                          setShowSuggestions((prev) => ({
                            ...prev,
                            email: dealerSearchResults.length > 0,
                          }))
                        }
                        onBlur={() =>
                          setTimeout(
                            () =>
                              setShowSuggestions((prev) => ({
                                ...prev,
                                email: false,
                              })),
                            200
                          )
                        }
                        className="luxury-input"
                        placeholder="e.g., john.doe@example.com"
                        required
                      />
                      {showSuggestions.email && (
                        <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-y-auto">
                          {isSearching ? (
                            <div className="p-2 text-center text-gray-500">
                              Searching dealers...
                            </div>
                          ) : dealerSearchResults.length > 0 ? (
                            dealerSearchResults.map((dealer, index) => (
                              <div
                                key={index}
                                className="p-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                                onClick={() => handleDealerSelect(dealer)}
                              >
                                <div className="font-medium">
                                  {dealer?.companyName ??
                                    dealer?.businessName ??
                                    "N/A"}
                                </div>
                                <div className="text-sm text-gray-600">
                                  {dealer?.email ?? "N/A"}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {dealer?.phoneNo ?? "N/A"} •{" "}
                                  {dealer?.address ?? "N/A"}
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="p-2 text-center text-gray-500">
                              No dealers found. You can create a new entry.
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </>
                )}

                <div className="space-y-2">
                  <Label htmlFor="watchBrand">Brand</Label>
                  <Select
                    value={formData?.watchBrand ?? ""}
                    onValueChange={handleBrandChange}
                  >
                    <SelectTrigger className="luxury-input">
                      <SelectValue placeholder="Select watch brand" />
                    </SelectTrigger>
                    <SelectContent>
                      {watchBrands?.map((brand) => (
                        <SelectItem key={brand} value={brand}>
                          {brand}
                        </SelectItem>
                      )) ?? []}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="watchModel">Model</Label>
                  <Input
                    id="watchModel"
                    name="watchModel"
                    value={formData?.watchModel ?? ""}
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
                    value={formData?.description ?? ""}
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
                  {(formData?.photos ?? []).map((photo, index) => (
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
                    disabled={(formData?.photos?.length ?? 0) >= 5}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Photos
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('camera-upload')?.click()}
                    disabled={(formData?.photos?.length ?? 0) >= 5}
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
                  value={formData?.deliveryPreference ?? "shipping"}
                  onValueChange={handleDeliveryChange}
                  className="space-y-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="shipping" id="shipping" />
                    <Label htmlFor="shipping">
                      Shipping (send and receive via courier)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="drop-off" id="drop-off" />
                    <Label htmlFor="drop-off">
                      Drop-off (visit dealer location)
                    </Label>
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
                className="w-full luxury-button bg-[#CC5500] text-white hover:bg-[#CC5500]/90"
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? "Submitting Request..."
                  : "Submit Service Request"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
