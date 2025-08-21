export interface ServiceRequest {
  id: string;
  consumerId?: string;
  watchBrand?: string;
  brand: string; // Added for consistency
  watchModel?: string;
  model: string; // Added for consistency
  description?: string; // Changed from issueDescription
  issueDescription?: string; // Alternative from API
  deliveryPreference: "drop-off" | "shipping" | "pickup";
  photos?: ServicePhoto[];
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
  bids?: Bid[];
  biddings?: Bid[]; // From API response
  referenceId?: string;
  biddingCount?: number; // Number of bids from API
  totalBids?: number; // Total number of bids for the request
  createdBy?: {
    firstName: string;
    lastName: string;
    email: string;
    id: string;
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
  dealerId?: string;
  serviceRequestId: string;
  estimatedPrice: number;
  turnaroundTime?: number; // in days
  turnAroundTime?: number; // Alternative naming from API
  deliveryMethod: "pickup" | "shipping" | "drop-off";
  notes?: string;
  status: "submitted" | "accepted" | "rejected" | "expired";
  submittedAt?: string;
  createdAt?: string; // Alternative from API
  expiresAt?: string;
  createdBy?: {
    firstName: string;
    lastName: string;
    email: string;
    id: string;
  };
  updatedAt?: string;
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

export enum BidStatus {
  SUBMITTED = "submitted",
  ACCEPTED = "accepted",
  REJECTED = "rejected",
  COMPLETED = "completed",
}
