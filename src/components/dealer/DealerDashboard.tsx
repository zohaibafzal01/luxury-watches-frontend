import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ServiceRequest, Bid } from '@/types/service';
import { Package, Clock, DollarSign, TrendingUp, Eye, MessageSquare } from 'lucide-react';
import { ViewRequestModal } from '@/components/common/ViewRequestModal';
import { BidSubmissionModal } from './BidSubmissionModal';

export const DealerDashboard: React.FC = () => {
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>([]);
  const [myBids, setMyBids] = useState<Bid[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isBidModalOpen, setIsBidModalOpen] = useState(false);

  // Mock data - replace with real API calls
  useEffect(() => {
    const mockRequests: ServiceRequest[] = [
      {
        id: '1',
        consumerId: 'c1',
        watchBrand: 'Rolex',
        watchModel: 'Submariner',
        description: 'Crown is not screwing down properly and the watch is losing time.',
        deliveryPreference: 'shipping',
        photos: [
          // { id: '1', url: '/api/placeholder/300/300', timestamp: new Date().toISOString() }
        ],
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        bids: [],
        referenceId: 'CR-1001'
      },
      {
        id: '2',
        consumerId: 'c2',
        watchBrand: 'Omega',
        watchModel: 'Speedmaster',
        description: 'Chronograph function is not working, second hand gets stuck.',
        deliveryPreference: 'drop-off',
        photos: [
          // { id: '2', url: '/api/placeholder/300/300', timestamp: new Date().toISOString() }
        ],
        status: 'bidding',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        bids: [],
        referenceId: 'CR-1002'
      }
    ];

    const mockBids: Bid[] = [
      {
        id: 'b1',
        dealerId: 'dealer1',
        serviceRequestId: '2',
        estimatedPrice: 450,
        turnaroundTime: 7,
        deliveryMethod: 'pickup',
        status: 'submitted',
        submittedAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
      }
    ];

    setTimeout(() => {
      setServiceRequests(mockRequests);
      setMyBids(mockBids);
      setIsLoading(false);
    }, 1000);
  }, []);

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
      pending: 'bg-yellow-500/20 text-yellow-700',
      bidding: 'bg-blue-500/20 text-blue-700',
      accepted: 'bg-green-500/20 text-green-700',
      'in-progress': 'bg-purple-500/20 text-purple-700',
      completed: 'bg-gray-500/20 text-gray-700',
      cancelled: 'bg-red-500/20 text-red-700',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-500/20 text-gray-700';
  };

  const getBidStatusColor = (status: string) => {
    const colors = {
      submitted: 'bg-blue-500/20 text-blue-700',
      accepted: 'bg-green-500/20 text-green-700',
      rejected: 'bg-red-500/20 text-red-700',
      expired: 'bg-gray-500/20 text-gray-700',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-500/20 text-gray-700';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="luxury-shimmer p-8 rounded-lg">
          <p className="text-center">Loading dashboard...</p>
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
            Manage service requests, track bids, and grow your watch service business
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="luxury-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Requests</p>
                  <p className="text-2xl font-bold text-primary">{serviceRequests.length}</p>
                </div>
                <Package className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="luxury-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pending Bids</p>
                  <p className="text-2xl font-bold text-blue-500">{myBids.filter(b => b.status === 'submitted').length}</p>
                </div>
                <Clock className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="luxury-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Revenue</p>
                  <p className="text-2xl font-bold text-green-500">
                    ${myBids.reduce((sum, bid) => sum + bid.estimatedPrice, 0)}
                  </p>
                </div>
                <DollarSign className="w-8 h-8 text-green-500" />
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

        <Tabs defaultValue="requests" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="requests">Service Requests</TabsTrigger>
            <TabsTrigger value="bids">My Bids</TabsTrigger>
          </TabsList>

          <TabsContent value="requests" className="space-y-4">
            <div className="grid gap-4">
              {serviceRequests.map((request) => (
                <Card key={request.id} className="luxury-card">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          {request.watchBrand} {request.watchModel}
                          <Badge className={getStatusColor(request.status)}>
                            {request.status}
                          </Badge>
                        </CardTitle>
                        <CardDescription>
                          Reference: {request.referenceId} • {new Date(request.createdAt).toLocaleDateString()}
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleViewDetails(request)}>
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
                          {request.deliveryPreference}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageSquare className="w-4 h-4" />
                          {request.bids.length} bids
                        </span>
                      </div>
                      <Button className="luxury-button" onClick={() => handleSubmitBid(request)}>
                        Submit Bid
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="bids" className="space-y-4">
            <div className="grid gap-4">
              {myBids.map((bid) => {
                const request = serviceRequests.find(r => r.id === bid.serviceRequestId);
                return (
                  <Card key={bid.id} className="luxury-card">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            Bid for {request?.watchBrand} {request?.watchModel}
                            <Badge className={getBidStatusColor(bid.status)}>
                              {bid.status}
                            </Badge>
                          </CardTitle>
                          <CardDescription>
                            Submitted: {new Date(bid.submittedAt).toLocaleDateString()}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Estimated Price</p>
                          <p className="font-semibold text-green-600">${bid.estimatedPrice}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Turnaround</p>
                          <p className="font-semibold">{bid.turnaroundTime} days</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Delivery Method</p>
                          <p className="font-semibold capitalize">{bid.deliveryMethod}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Expires</p>
                          <p className="font-semibold">{new Date(bid.expiresAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                      {bid.notes && (
                        <div className="mt-4">
                          <p className="text-sm text-muted-foreground">Notes:</p>
                          <p className="text-sm">{bid.notes}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
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
      />
    </div>
  );
};
