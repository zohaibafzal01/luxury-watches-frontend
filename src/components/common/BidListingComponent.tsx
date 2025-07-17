import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ServiceRequest, Bid } from '@/types/service';
import { User } from '@/types/auth';
import { 
  Search, 
  Filter, 
  Eye, 
  Calendar, 
  MapPin, 
  Package,
  Clock,
  DollarSign,
  User as UserIcon
} from 'lucide-react';
import { ViewRequestModal } from './ViewRequestModal';

export const BidListingComponent: React.FC = () => {
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>([]);
  const [consumers, setConsumers] = useState<User[]>([]);
  const [bids, setBids] = useState<Bid[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [brandFilter, setBrandFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  // Mock data - replace with real API calls
  useEffect(() => {
    const mockConsumers: User[] = [
      {
        id: 'c1',
        email: 'jane@example.com',
        role: 'consumer',
        firstName: 'Jane',
        lastName: 'Smith',
        isEmailVerified: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'c2',
        email: 'john@example.com',
        role: 'consumer',
        firstName: 'John',
        lastName: 'Doe',
        isEmailVerified: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
    ];

    const mockBids: Bid[] = [
      {
        id: 'b1',
        dealerId: 'd1',
        serviceRequestId: 'sr1',
        estimatedPrice: 450,
        turnaroundTime: 7,
        deliveryMethod: 'pickup',
        status: 'submitted',
        submittedAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'b2',
        dealerId: 'd2',
        serviceRequestId: 'sr1',
        estimatedPrice: 380,
        turnaroundTime: 5,
        deliveryMethod: 'shipping',
        status: 'submitted',
        submittedAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'b3',
        dealerId: 'd1',
        serviceRequestId: 'sr2',
        estimatedPrice: 650,
        turnaroundTime: 10,
        deliveryMethod: 'pickup',
        status: 'accepted',
        submittedAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
      }
    ];

    const mockServiceRequests: ServiceRequest[] = [
      {
        id: 'sr1',
        consumerId: 'c1',
        watchBrand: 'Rolex',
        watchModel: 'Submariner',
        description: 'Crown is not screwing down properly and the watch is losing time. Needs professional servicing.',
        deliveryPreference: 'shipping',
        photos: [
          { id: '1', url: '/api/placeholder/300/300', timestamp: new Date().toISOString() }
        ],
        status: 'bidding',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString(),
        bids: ['b1', 'b2'],
        referenceId: 'CR-1001',
        location: {
          latitude: 40.7128,
          longitude: -74.0060,
          address: 'New York, NY'
        }
      },
      {
        id: 'sr2',
        consumerId: 'c2',
        watchBrand: 'Omega',
        watchModel: 'Speedmaster',
        description: 'Chronograph function is not working properly. Second hand gets stuck occasionally.',
        deliveryPreference: 'drop-off',
        photos: [
          { id: '2', url: '/api/placeholder/300/300', timestamp: new Date().toISOString() }
        ],
        status: 'accepted',
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString(),
        bids: ['b3'],
        referenceId: 'CR-1002',
        location: {
          latitude: 34.0522,
          longitude: -118.2437,
          address: 'Los Angeles, CA'
        }
      },
      {
        id: 'sr3',
        consumerId: 'c1',
        watchBrand: 'Cartier',
        watchModel: 'Santos',
        description: 'Watch face has scratches and needs polishing. Also needs a full service.',
        deliveryPreference: 'shipping',
        photos: [
          { id: '3', url: '/api/placeholder/300/300', timestamp: new Date().toISOString() }
        ],
        status: 'pending',
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString(),
        bids: [],
        referenceId: 'CR-1003'
      }
    ];

    setConsumers(mockConsumers);
    setBids(mockBids);
    setServiceRequests(mockServiceRequests);
  }, []);

  const handleViewDetails = (request: ServiceRequest) => {
    setSelectedRequest(request);
    setIsViewModalOpen(true);
  };

  const filteredRequests = serviceRequests.filter(request => {
    const consumer = consumers.find(c => c.id === request.consumerId);
    const searchText = `${request.watchBrand} ${request.watchModel} ${consumer?.firstName} ${consumer?.lastName} ${request.referenceId}`.toLowerCase();
    const matchesSearch = searchText.includes(searchTerm.toLowerCase());
    const matchesBrand = brandFilter === 'all' || request.watchBrand.toLowerCase() === brandFilter.toLowerCase();
    const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
    return matchesSearch && matchesBrand && matchesStatus;
  });

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

  const getConsumerName = (consumerId: string) => {
    const consumer = consumers.find(c => c.id === consumerId);
    return consumer ? `${consumer.firstName} ${consumer.lastName}` : 'Unknown Consumer';
  };

  const getRequestBids = (requestId: string) => {
    return bids.filter(bid => bid.serviceRequestId === requestId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 p-4">
      <div className="container mx-auto">
        <div className="mb-8">
          <h1 className="luxury-title text-3xl mb-2">Consumer Watch Bids</h1>
          <p className="text-muted-foreground">
            Browse active service requests from consumers and view bidding activity
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <Input
              placeholder="Search by watch brand, model, consumer name, or reference ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="luxury-input"
            />
          </div>
          <Select value={brandFilter} onValueChange={setBrandFilter}>
            <SelectTrigger className="w-48 luxury-input">
              <SelectValue placeholder="Filter by brand" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Brands</SelectItem>
              <SelectItem value="Rolex">Rolex</SelectItem>
              <SelectItem value="Omega">Omega</SelectItem>
              <SelectItem value="Cartier">Cartier</SelectItem>
              <SelectItem value="Patek Philippe">Patek Philippe</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-48 luxury-input">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="bidding">Active Bidding</SelectItem>
              <SelectItem value="accepted">Accepted</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="luxury-card">
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">{serviceRequests.length}</p>
                <p className="text-sm text-muted-foreground">Total Requests</p>
              </div>
            </CardContent>
          </Card>
          <Card className="luxury-card">
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-500">{serviceRequests.filter(r => r.status === 'bidding').length}</p>
                <p className="text-sm text-muted-foreground">Active Bidding</p>
              </div>
            </CardContent>
          </Card>
          <Card className="luxury-card">
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-500">{bids.length}</p>
                <p className="text-sm text-muted-foreground">Total Bids</p>
              </div>
            </CardContent>
          </Card>
          <Card className="luxury-card">
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-500">{consumers.length}</p>
                <p className="text-sm text-muted-foreground">Active Consumers</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Service Requests List */}
        <div className="grid gap-6">
          {filteredRequests.map((request) => {
            const requestBids = getRequestBids(request.id);
            const consumer = consumers.find(c => c.id === request.consumerId);
            
            return (
              <Card key={request.id} className="luxury-card">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2 mb-2">
                        {request.watchBrand} {request.watchModel}
                        <Badge className={getStatusColor(request.status)}>
                          {request.status}
                        </Badge>
                      </CardTitle>
                      <CardDescription className="space-y-1">
                        <div className="flex items-center gap-4">
                          <span className="flex items-center gap-1">
                            <UserIcon className="w-4 h-4" />
                            {getConsumerName(request.consumerId)}
                          </span>
                          <span>Ref: {request.referenceId}</span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {new Date(request.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        {request.location && (
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {request.location.address}
                          </div>
                        )}
                      </CardDescription>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => handleViewDetails(request)}>
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground mb-4">
                      {request.description}
                    </p>
                    
                    <div className="flex items-center gap-4 text-sm">
                      <span className="flex items-center gap-1">
                        <Package className="w-4 h-4" />
                        {request.deliveryPreference}
                      </span>
                      <span>{request.photos.length} photos</span>
                    </div>

                    {/* Bids Section */}
                    {requestBids.length > 0 && (
                      <div className="space-y-3">
                        <h4 className="font-medium flex items-center gap-2">
                          Bids ({requestBids.length})
                        </h4>
                        <div className="grid gap-2">
                          {requestBids.map((bid) => (
                            <div key={bid.id} className="p-3 border border-border rounded-lg bg-muted/20">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                  <Badge className={getBidStatusColor(bid.status)}>
                                    {bid.status}
                                  </Badge>
                                  <span className="flex items-center gap-1 text-sm">
                                    <DollarSign className="w-4 h-4" />
                                    ${bid.estimatedPrice}
                                  </span>
                                  <span className="flex items-center gap-1 text-sm">
                                    <Clock className="w-4 h-4" />
                                    {bid.turnaroundTime} days
                                  </span>
                                  <span className="text-sm capitalize">
                                    {bid.deliveryMethod}
                                  </span>
                                </div>
                                <span className="text-xs text-muted-foreground">
                                  {new Date(bid.submittedAt).toLocaleDateString()}
                                </span>
                              </div>
                              {bid.notes && (
                                <p className="text-xs text-muted-foreground mt-2">
                                  {bid.notes}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {requestBids.length === 0 && request.status === 'pending' && (
                      <div className="text-sm text-muted-foreground italic">
                        No bids submitted yet
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filteredRequests.length === 0 && (
          <Card className="luxury-card text-center py-12">
            <CardContent>
              <h3 className="text-lg font-medium mb-2">No service requests found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search or filter criteria
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      <ViewRequestModal
        request={selectedRequest}
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
      />
    </div>
  );
};
