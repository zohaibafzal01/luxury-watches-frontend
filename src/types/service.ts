export interface ServiceRequest {
  id: string;
  consumerId: string;
  watchBrand: string;
  brand: string; // Added for consistency
  watchModel: string;
  model: string; // Added for consistency
  description: string; // Changed from issueDescription
  deliveryPreference: "drop-off" | "shipping" | "pickup";
  photos: ServicePhoto[];
  location?: {
    latitude: number;
    longitude: number;
    address: string;
  };
  status:
    | "open"
    | "pending"
    | "bidding"
    | "accepted"
    | "assigned"
    | "in_progress"
    | "completed"
    | "cancelled";
  createdAt: string;
  updatedAt: string;
  bids: Bid[];
  referenceId: string;
  biddingCount?: number; // Number of bids from API
  createdBy?: {
    firstName: string;
    lastName: string;
    email: string;
  };
}

export interface ServicePhoto {
  id: string;
  url: string;
  timestamp: string;
  description?: string;
}

export interface Bid {
  id: string;
  dealerId: string;
  serviceRequestId: string;
  estimatedPrice: number;
  turnaroundTime: number; // in days
  deliveryMethod: "pickup" | "shipping" | "drop-off";
  notes?: string;
  status: "submitted" | "accepted" | "rejected" | "expired";
  submittedAt: string;
  expiresAt: string;
}

export interface CreateServiceRequestData {
  watchBrand: string;
  watchModel: string;
  description: string; // Changed from issueDescription
  deliveryPreference: "drop-off" | "shipping" | "pickup";
  photos: File[];
  location?: {
    latitude: number;
    longitude: number;
    address: string;
  };
}
