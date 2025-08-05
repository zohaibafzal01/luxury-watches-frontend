import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Package, MessageSquare, Eye } from "lucide-react";
import { ViewRequestModal } from "../common/ViewRequestModal";
import { ViewBidsModal } from "../common/ViewBidsModel";
import { ServiceRequest, Bid } from "@/types/service";
import consumerApi from "@/api/consumer";
import { useToast } from "@/hooks/use-toast";

export const MyRequestsComponent: React.FC = () => {
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(
    null
  );
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isViewBidsModalOpen, setIsViewBidsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [bids] = useState<Bid[]>([]);
  const { toast } = useToast();

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const fetchRequests = async () => {
    try {
      const response = await consumerApi.getServiceRequest(
        page,
        10,
        debouncedSearchTerm,
        statusFilter
      );
      const apiData = response?.data || [];

      const mapped = apiData.map((item: any) => ({
        ...item,
        watchBrand: item.brand,
        watchModel: item.model,
        description: item.issueDescription,
      }));

      const sorted = mapped.sort(
        (a: any, b: any) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );

      setRequests(sorted);
      setTotalPages(response?.pagination?.totalPages || 1);
    } catch (error: any) {
      if (error?.response?.status === 404) {
        setRequests([]);
        setTotalPages(1);
      } else {
        toast({
          title: "Error fetching requests",
          description: "Please try again later.",
          variant: "destructive",
        });
      }
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [page, debouncedSearchTerm, statusFilter]);

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: "bg-yellow-500/20 text-yellow-700",
      bidding: "bg-blue-500/20 text-blue-700",
      accepted: "bg-green-500/20 text-green-700",
      "in-progress": "bg-purple-500/20 text-purple-700",
      completed: "bg-gray-500/20 text-gray-700",
      cancelled: "bg-red-500/20 text-red-700",
    };
    return colors[status] || "bg-gray-500/20 text-gray-700";
  };

  return (
    <div className="min-h-screen p-4">
      <div className="container mx-auto">
        <h1 className="text-3xl mb-4">My Service Requests</h1>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <Input
            placeholder="Search by brand, model, or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="bidding">Bidding</SelectItem>
              <SelectItem value="accepted">Accepted</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Service Requests */}
        <div className="grid gap-6">
          {requests.map((request) => (
            <Card key={request?.id}>
              <CardHeader>
                <div className="flex justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {request?.watchBrand || "Brand"}{" "}
                      {request?.watchModel || "Model"}
                      {request?.status && (
                        <Badge className={getStatusColor(request.status)}>
                          {request.status}
                        </Badge>
                      )}
                    </CardTitle>
                    <CardDescription className="mt-2">
                      Ref: {request?.id} • Created:{" "}
                      {new Date(request?.createdAt).toLocaleDateString()}
                    </CardDescription>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedRequest(request);
                      setIsViewModalOpen(true);
                    }}
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    View Details
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-3">{request?.description}</p>
                <div className="flex justify-between items-center text-sm">
                  <div className="flex gap-4">
                    <span className="flex items-center gap-1">
                      <Package className="w-4 h-4" />
                      {request?.deliveryPreference}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageSquare className="w-4 h-4" />
                      {request?.bids?.length || 0} bids
                    </span>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => {
                      setSelectedRequest(request);
                      setIsViewBidsModalOpen(true);
                    }}
                  >
                    View Bids
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {requests.length === 0 && (
          <Card className="text-center p-8 mt-6">
            <CardContent>
              <p>No service requests found.</p>
            </CardContent>
          </Card>
        )}

        {/* Pagination */}
        <div className="flex justify-center items-center gap-4 mt-6">
          <Button
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
            variant="outline"
            size="sm"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      </div>

      {/* Modals */}
      <ViewRequestModal
        request={selectedRequest}
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
      />
      <ViewBidsModal
        request={selectedRequest}
        isOpen={isViewBidsModalOpen}
        onClose={() => setIsViewBidsModalOpen(false)}
        bids={bids}
      />
    </div>
  );
};
