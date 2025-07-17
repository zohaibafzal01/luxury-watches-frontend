import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Package, MapPin, DollarSign, Clock, MessageSquare, Eye } from 'lucide-react';
import { ServiceRequest } from '@/types/service';
import { ViewRequestModal } from '@/components/common/ViewRequestModal';

export const MyRequestsComponent: React.FC = () => {
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  // Mock data - replace with real API calls
  useEffect(() => {
    const mockRequests: ServiceRequest[] = [
      {
        id: 'sr1',
        consumerId: 'c1',
        watchBrand: 'Rolex',
        watchModel: 'Submariner',
        description: 'Crown is not screwing down properly and the watch is losing time.',
        deliveryPreference: 'shipping',
        photos: [
          { id: '1', url: '/api/placeholder/300/300', timestamp: new Date().toISOString() }
        ],
        status: 'bidding',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString(),
        bids: ['b1'],
        referenceId: 'CR-1001'
      },
      {
        id: 'sr2',
        consumerId: 'c1',
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
        bids: ['b2'],
        referenceId: 'CR-1002'
      },
      {
        id: 'sr3',
        consumerId: 'c1',
        watchBrand: 'Tag Heuer',
        watchModel: 'Carrera',
        description: 'Watch band is broken and needs replacement. Also, the clasp is not working.',
        deliveryPreference: 'shipping',
        photos: [
          { id: '3', url: '/api/placeholder/300/300', timestamp: new Date().toISOString() }
        ],
        status: 'pending',
        createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString(),
        bids: [],
        referenceId: 'CR-1003'
      },
      {
        id: 'sr4',
        consumerId: 'c1',
        watchBrand: 'Seiko',
        watchModel: 'Presage',
        description: 'Automatic movement is not winding properly. Needs a full service.',
        deliveryPreference: 'drop-off',
        photos: [
          { id: '4', url: '/api/placeholder/300/300', timestamp: new Date().toISOString() }
        ],
        status: 'completed',
        createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString(),
        bids: [],
        referenceId: 'CR-1004'
      },
      {
        id: 'sr5',
        consumerId: 'c1',
        watchBrand: 'Patek Philippe',
        watchModel: 'Nautilus',
        description: 'Crystal has a crack and needs replacement. Also, the watch is running fast.',
        deliveryPreference: 'shipping',
        photos: [
          { id: '5', url: '/api/placeholder/300/300', timestamp: new Date().toISOString() }
        ],
        status: 'cancelled',
        createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString(),
        bids: [],
        referenceId: 'CR-1005'
      }
    ];

    setServiceRequests(mockRequests);
  }, []);

  const handleViewDetails = (request: ServiceRequest) => {
    setSelectedRequest(request);
    setIsViewModalOpen(true);
  };

  const filteredRequests = serviceRequests.filter(request => {
    const searchText = `${request.watchBrand} ${request.watchModel} ${request.referenceId}`.toLowerCase();
    const matchesSearch = searchText.includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
    return matchesSearch && matchesStatus;
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 p-4">
      <div className="container mx-auto">
        <div className="mb-8">
          <h1 className="luxury-title text-3xl mb-2">My Service Requests</h1>
          <p className="text-muted-foreground">
            Track the status of your watch service requests and manage your bids
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <Input
              placeholder="Search by watch brand, model, or reference ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="luxury-input"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-48 luxury-input">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="bidding">Bidding</SelectItem>
              <SelectItem value="accepted">Accepted</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
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
                <p className="text-2xl font-bold text-green-500">{serviceRequests.filter(r => r.status === 'completed').length}</p>
                <p className="text-sm text-muted-foreground">Completed Requests</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Service Requests List */}
        <div className="grid gap-6">
          {filteredRequests.map((request) => (
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
                      Reference: {request.referenceId} • Created {new Date(request.createdAt).toLocaleDateString()}
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
                    <Button variant="outline">
                      View Bids
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
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
