import React, { useEffect, useState } from "react";
import { Navigate, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Crown, Plus, Clock, Star } from "lucide-react";
import { selectUserInfo } from "@/redux/selectors/userSelectors";
import consumerApi from "@/api/consumer";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";


const Dashboard = () => {
  const user = useSelector(selectUserInfo);
  const [serviceRequests, setServiceRequests] = useState<any[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (request: any) => {
    setSelectedRequest(request);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedRequest(null);
    setIsModalOpen(false);
  };

  useEffect(() => {
    const fetchServiceRequests = async () => {
      try {
        const response = await consumerApi.getServiceRequest(1);
        if (response?.success && Array.isArray(response?.data)) {
          const sorted = response?.data
            .sort(
              (a, b) =>
                new Date(a.createdAt).getTime() -
                new Date(b.createdAt).getTime()
            )
            .slice(-5)
            .reverse();

          setServiceRequests(sorted);
        }
      } catch (error) {
        console.error("Failed to fetch service requests:", error);
      }
    };

    if (user?.role === "consumer") {
      fetchServiceRequests();
    }
  }, [user]);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role === "dealer") {
    return <Navigate to="/dealer/dashboard" replace />;
  }

  if (user.role === "admin") {
    return <Navigate to="/admin/dashboard" replace />;
  }

  if (user.role === "wholesaler") {
    return <Navigate to="/wholesaler/dashboard" replace />;
  }

  if (user.role === "consumer") {
    return (
      <>
        <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 p-4">
          <div className="container mx-auto">
            {/* Welcome Section */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-luxury-gradient rounded-full flex items-center justify-center">
                  <Crown className="w-6 h-6 text-luxury-black" />
                </div>
                <div>
                  <h1 className="luxury-title text-2xl">
                    Welcome back, {user.firstName}!
                  </h1>
                  <p className="text-muted-foreground">
                    Ready to service your luxury timepieces?
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <Card className="luxury-card group hover:scale-105 transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="w-5 h-5 text-primary" />
                    New Service Request
                  </CardTitle>
                  <CardDescription>
                    Submit a new watch for professional service
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild className="w-full luxury-button">
                    <Link to="/service-request">Create Request</Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="luxury-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-blue-500" />
                    My Requests
                  </CardTitle>
                  <CardDescription>
                    View and manage your service requests
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild className="w-full" variant="outline">
                    <Link to="/my-requests">View Requests</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            {serviceRequests?.length > 0 && (
              <Card className="luxury-card mb-8">
                <CardHeader>
                  <CardTitle>Recent Service Requests</CardTitle>
                  <CardDescription>
                    Your latest watch service activities
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {serviceRequests.map((req) => (
                      <div
                        key={req?.id}
                        className="flex items-center justify-between p-4 border border-border rounded-lg"
                      >
                        <div>
                          <h4 className="font-medium">
                            {req?.brand} {req?.model} - {req?.issueDescription}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            Ref: {req?.id.slice(-5).toUpperCase()} •{" "}
                            {dayjs(req?.updatedAt).fromNow()}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className="bg-primary/10 text-primary">
                            {req?.deliveryPreference}
                          </Badge>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openModal(req)}
                          >
                            View Details
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Service Request Details</DialogTitle>
            </DialogHeader>
            {selectedRequest && (
              <div className="space-y-3 text-sm text-muted-foreground">
                <div>
                  <strong>Brand:</strong> {selectedRequest.brand}
                </div>
                <div>
                  <strong>Model:</strong> {selectedRequest.model}
                </div>
                <div>
                  <strong>Description:</strong>{" "}
                  {selectedRequest.issueDescription}
                </div>
                <div>
                  <strong>Delivery:</strong>{" "}
                  {selectedRequest.deliveryPreference}
                </div>
                <div>
                  <strong>Created At:</strong>{" "}
                  {new Date(selectedRequest.createdAt).toLocaleString()}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </>
    );
  }

  // Fallback for unknown roles
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 p-4">
      <div className="container mx-auto">
        <div className="mb-8">
          <h1 className="luxury-title text-3xl mb-2">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome, {user.firstName}! Your dashboard is being prepared.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
