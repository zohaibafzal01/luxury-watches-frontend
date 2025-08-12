import React, { useState, useEffect, useCallback } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ServiceRequest, Bid } from "@/types/service";
import {
  Package,
  Clock,
  DollarSign,
  TrendingUp,
  Eye,
  MessageSquare,
} from "lucide-react";
import { ViewRequestModal } from "@/components/common/ViewRequestModal";
import { BidSubmissionModal } from "./BidSubmissionModal";
import dealerApi from "@/api/dealer";

export const DealerDashboard: React.FC = () => {
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(
    null
  );
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isBidModalOpen, setIsBidModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [biddingRequests, setBiddingRequests] = useState<ServiceRequest[]>([]);
  const [biddingPage, setBiddingPage] = useState(1);
  const [biddingTotalPages, setBiddingTotalPages] = useState(1);
  const [activeTab, setActiveTab] = useState<"requests" | "bids">("requests");

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const res = await dealerApi.serviceRequest(page, limit);

        const formattedRequests: ServiceRequest[] = res.data.map(
          (req: any) => ({
            id: req?.id,
            consumerId: req?.createdBy?.id || "",
            watchBrand: req?.brand,
            watchModel: req?.model,
            description: req?.issueDescription,
            deliveryPreference:
              req?.deliveryPreference?.toLowerCase() || "shipping",
            photos: req?.photos || [],
            status: req?.status?.toLowerCase(),
            createdAt: req?.createdAt,
            updatedAt: req?.updatedAt,
            bids: Array.isArray(req?.biddings)
              ? req.biddings.map((bid: any) => ({
                  id: bid?.id,
                  dealerId: bid?.dealerId,
                  serviceRequestId: bid?.serviceRequestId,
                  estimatedPrice: bid?.estimatedPrice,
                  turnaroundTime: bid?.turnaroundTime,
                  deliveryMethod: bid?.deliveryMethod,
                  status: bid?.status,
                  submittedAt: bid?.submittedAt,
                  expiresAt: bid?.expiresAt,
                  notes: bid?.notes,
                }))
              : [],
            referenceId: req?.id || "",
            location: req?.location || undefined,
            biddingCount: typeof req?.biddings === "number" ? req.biddings : 0,
            createdBy: {
              firstName: req?.createdBy?.firstName || "",
              lastName: req?.createdBy?.lastName || "",
              email: req?.createdBy?.email || "",
            },
          })
        );

        setServiceRequests(formattedRequests);
        setTotalPages(res.pagination?.totalPages || 1);
      } catch (error) {
        console.error("Failed to fetch service requests:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [page, limit]);

  useEffect(() => {
    const fetchBiddingData = async () => {
      try {
        const res = await dealerApi.serviceRequestBidding(biddingPage, limit);

        const formattedBiddingRequests: ServiceRequest[] = res.data.map(
          (req: any) => ({
            id: req?.id,
            consumerId: req?.createdBy?.id || "",
            watchBrand: req?.brand,
            watchModel: req?.model,
            description: req?.issueDescription,
            deliveryPreference:
              req?.deliveryPreference?.toLowerCase() || "shipping",
            photos: req?.photos || [],
            status: req?.status?.toLowerCase(),
            createdAt: req?.createdAt,
            updatedAt: req?.updatedAt,
            referenceId: req?.referenceId || "",
            location: req?.location || undefined,
            bids: (req?.biddings || []).map((bid: any) => ({
              id: bid?.id,
              dealerId: bid?.createdBy?.id,
              serviceRequestId: bid?.serviceRequestId,
              estimatedPrice: bid?.estimatedPrice,
              turnaroundTime: bid?.turnAroundTime,
              deliveryMethod: bid?.deliveryMethod,
              status: bid?.status?.toLowerCase(),
              submittedAt: bid?.createdAt,
              expiresAt: "",
              notes: bid?.notes,
            })),
          })
        );

        setBiddingRequests(formattedBiddingRequests);
        setBiddingTotalPages(res.pagination?.totalPages || 1);
      } catch (error) {
        console.error("Failed to fetch bidding requests:", error);
      }
    };

    fetchBiddingData();
  }, [biddingPage, limit]);

  const fetchServiceRequests = async () => {
    setIsLoading(true);
    try {
      const res = await dealerApi.serviceRequest(page, limit);
      const formattedRequests: ServiceRequest[] = res.data.map((req: any) => ({
        id: req?.id,
        consumerId: req?.createdBy?.id || "",
        watchBrand: req?.brand,
        watchModel: req?.model,
        description: req?.issueDescription,
        deliveryPreference:
          req?.deliveryPreference?.toLowerCase() || "shipping",
        photos: req?.photos || [],
        status: req?.status?.toLowerCase(),
        createdAt: req?.createdAt,
        updatedAt: req?.updatedAt,
        bids: Array.isArray(req?.biddings)
          ? req.biddings.map((bid: any) => ({
              id: bid?.id,
              dealerId: bid?.dealerId,
              serviceRequestId: bid?.serviceRequestId,
              estimatedPrice: bid?.estimatedPrice,
              turnaroundTime: bid?.turnaroundTime,
              deliveryMethod: bid?.deliveryMethod,
              status: bid?.status,
              submittedAt: bid?.submittedAt,
              expiresAt: bid?.expiresAt,
              notes: bid?.notes,
            }))
          : [],
        referenceId: req?.id || "",
        location: req?.location || undefined,
        biddingCount: typeof req?.biddings === "number" ? req.biddings : 0,
        createdBy: {
          firstName: req?.createdBy?.firstName || "",
          lastName: req?.createdBy?.lastName || "",
          email: req?.createdBy?.email || "",
        },
      }));

      setServiceRequests(formattedRequests);
      setTotalPages(res.pagination?.totalPages || 1);
    } catch (error) {
      console.error("Failed to fetch service requests:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBidSubmitted = useCallback(() => {
    fetchServiceRequests();
  }, [fetchServiceRequests]);

  const fetchBiddingRequests = async () => {
    try {
      const res = await dealerApi.serviceRequestBidding(biddingPage, limit);
      const formattedBids: ServiceRequest[] = res.data.map((bid: any) => ({
        id: bid?.serviceRequestId,
        consumerId: bid?.createdBy?.id || "",
        watchBrand: bid?.watchBrand || "",
        watchModel: bid?.watchModel || "",
        description: "",
        deliveryPreference: (bid?.deliveryMethod || "shipping").toLowerCase(),
        photos: [],
        status: (bid?.status || "").toLowerCase(),
        createdAt: bid?.createdAt,
        updatedAt: bid?.updatedAt,
        referenceId: bid?.referenceId || "",
        location: undefined,
        bids: [
          {
            id: bid?.id,
            dealerId: bid?.createdBy?.id,
            serviceRequestId: bid?.serviceRequestId,
            estimatedPrice: bid?.estimatedPrice ?? 0,
            turnaroundTime: bid?.turnAroundTime,
            deliveryMethod: bid?.deliveryMethod,
            status: (bid?.status || "").toLowerCase(),
            submittedAt: bid?.createdAt,
            expiresAt: "",
            notes: bid?.notes,
          },
        ],
      }));

      setBiddingRequests(formattedBids);
      setBiddingTotalPages(res.pagination?.totalPages || 1);
    } catch (error) {
      console.error("Failed to fetch bidding requests:", error);
    }
  };

  useEffect(() => {
    if (activeTab === "requests") {
      fetchServiceRequests();
    } else if (activeTab === "bids") {
      fetchBiddingRequests();
    }
  }, [activeTab]);

  const handleViewDetails = (request: ServiceRequest) => {
    setSelectedRequest(request);
    setIsViewModalOpen(true);
  };

  const handleSubmitBid = (request: ServiceRequest) => {
    setSelectedRequest(request);
    setIsBidModalOpen(true);
  };

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

  const getBidStatusColor = (status: string) => {
    const colors = {
      submitted: "bg-blue-500/20 text-blue-700",
      accepted: "bg-green-500/20 text-green-700",
      rejected: "bg-red-500/20 text-red-700",
      expired: "bg-gray-500/20 text-gray-700",
    };
    return (
      colors[status as keyof typeof colors] || "bg-gray-500/20 text-gray-700"
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-[#CC5500] p-8 rounded-lg">
          <p className="text-center text-white">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 p-4">
      <div className="container mx-auto">
        <div className="mb-8">
          <h1 className="luxury-title text-3xl mb-2">Dashboard</h1>
          <p className="text-muted-foreground">
            Manage service requests, track bids, and grow your watch service
            business
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="luxury-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Active Requests
                  </p>
                  <p className="text-2xl font-bold text-[#CC5500]">
                    {serviceRequests.length}
                  </p>
                </div>
                {/* <Package className="w-8 h-8 text-primary" /> */}
              </div>
            </CardContent>
          </Card>

          <Card className="luxury-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pending Bids</p>
                  <p className="text-2xl font-bold text-blue-500">
                    {
                      biddingRequests
                        .flatMap((r) => r.bids)
                        .filter((b) => b.status === "submitted").length
                    }
                  </p>
                </div>
                {/* <Clock className="w-8 h-8 text-blue-500" /> */}
              </div>
            </CardContent>
          </Card>

          <Card className="luxury-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Revenue</p>
                  <p className="text-2xl font-bold text-green-500">
                    $
                    {biddingRequests
                      .flatMap((r) => r.bids)
                      .reduce((sum, bid) => sum + bid.estimatedPrice, 0)}
                  </p>
                </div>
                {/* <DollarSign className="w-8 h-8 text-green-500" /> */}
              </div>
            </CardContent>
          </Card>

          {/* <Card className="luxury-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Win Rate</p>
                  <p className="text-2xl font-bold text-purple-500">85%</p>
                </div>
                <TrendingUp className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card> */}
        </div>

        <Tabs
          value={activeTab}
          onValueChange={(val) => setActiveTab(val as "requests" | "bids")}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="requests">Service Requests</TabsTrigger>
            <TabsTrigger value="bids">My Bids</TabsTrigger>
          </TabsList>

          <TabsContent value="requests" className="space-y-4">
            {serviceRequests.length === 0 ? (
              <p className="text-center text-muted-foreground">
                No service requests found.
              </p>
            ) : (
              <div className="grid gap-4">
                {serviceRequests.map((request) => (
                  <Card key={request.id} className="luxury-card">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="flex items-center gap-2 mb-3">
                            {request.watchBrand} - {request.watchModel}
                            <Badge
                              className={`hover:bg-[#CC5500] ${getStatusColor(
                                request.status
                              )}`}
                            >
                              {request.status.charAt(0).toUpperCase() +
                                request.status.slice(1)}
                            </Badge>
                          </CardTitle>
                          <CardDescription>
                            <strong>Created by:</strong>{" "}
                            {request.createdBy?.firstName}{" "}
                            {request.createdBy?.lastName} •
                            <strong> Created at:</strong>{" "}
                            {new Date(request.createdAt).toLocaleDateString()}
                          </CardDescription>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewDetails(request)}
                            className=" hover:bg-[#CC5500]"
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">
                        {request.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm">
                          <span className="flex items-center gap-1">
                            <Package className="w-4 h-4" />
                            {request.deliveryPreference
                              .charAt(0)
                              .toUpperCase() +
                              request.deliveryPreference.slice(1)}
                          </span>
                          <span className="flex items-center gap-1">
                            <MessageSquare className="w-4 h-4" />
                            {request.biddingCount || request.bids.length} bids
                          </span>
                        </div>
                        <Button
                          className="bg-[#CC5500] text-white hover:bg-[#CC5500]/90"
                          onClick={() => handleSubmitBid(request)}
                        >
                          Submit Bid
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
            {/* Pagination */}
            {serviceRequests.length > 0 && (
              <div className="flex justify-center items-center gap-4 mt-6">
                <Button
                  className=" hover:bg-[#CC5500]/90"
                  variant="outline"
                  size="sm"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  Previous
                </Button>
                <span className="text-sm text-muted-foreground">
                  Page {page} of {totalPages}
                </span>
                <Button
                  className=" hover:bg-[#CC5500]/90"
                  variant="outline"
                  size="sm"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                >
                  Next
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="bids" className="space-y-4">
            {biddingRequests.flatMap((r) => r.bids).length === 0 ? (
              <p className="text-center text-muted-foreground">
                No bids found.
              </p>
            ) : (
              <div className="grid gap-4">
                {biddingRequests.flatMap((request) =>
                  request.bids.map((bid) => (
                    <Card key={bid.id} className="luxury-card">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="flex items-center gap-2">
                              Bid for {request.watchBrand} {request.watchModel}
                              <Badge className={getBidStatusColor(bid.status)}>
                                {bid.status}
                              </Badge>
                            </CardTitle>
                            <CardDescription>
                              Submitted:{" "}
                              {new Date(bid.submittedAt).toLocaleDateString()}
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">
                              Estimated Price
                            </p>
                            <p className="font-semibold text-green-600">
                              ${bid.estimatedPrice}
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Turnaround</p>
                            <p className="font-semibold">
                              {bid.turnaroundTime} days
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">
                              Delivery Method
                            </p>
                            <p className="font-semibold capitalize">
                              {bid.deliveryMethod}
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Request ID</p>
                            <p className="font-semibold">{request.id}</p>
                          </div>
                        </div>
                        {bid.notes && (
                          <div className="mt-4">
                            <p className="text-sm text-muted-foreground">
                              Notes:
                            </p>
                            <p className="text-sm">{bid.notes}</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            )}
            {/* Pagination for Bids */}
            {biddingRequests.flatMap((r) => r.bids).length > 0 && (
              <div className="flex justify-center items-center gap-4 mt-6">
                <Button
                  className="hover:bg-[#CC5500]/90"
                  variant="outline"
                  size="sm"
                  disabled={biddingPage <= 1}
                  onClick={() => setBiddingPage((p) => Math.max(1, p - 1))}
                >
                  Previous
                </Button>
                <span className="text-sm text-muted-foreground">
                  Page {biddingPage} of {biddingTotalPages}
                </span>
                <Button
                  className="hover:bg-[#CC5500]/90"
                  variant="outline"
                  size="sm"
                  disabled={biddingPage >= biddingTotalPages}
                  onClick={() =>
                    setBiddingPage((p) => Math.min(biddingTotalPages, p + 1))
                  }
                >
                  Next
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <ViewRequestModal
        request={selectedRequest}
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
      />

      <BidSubmissionModal
        request={selectedRequest}
        isOpen={isBidModalOpen}
        onClose={() => setIsBidModalOpen(false)}
        onSuccess={handleBidSubmitted}
      />
    </div>
  );
};
