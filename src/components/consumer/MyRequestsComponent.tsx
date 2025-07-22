import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Package, MessageSquare, Eye } from 'lucide-react';
import { ServiceRequest, Bid } from '@/types/service';
import { ViewRequestModal } from '../common/ViewRequestModal';
import { ViewBidsModal } from '../common/ViewBidsModel';

export const MyRequestsComponent: React.FC = () => {
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>([]);
  const [bids, setBids] = useState<Bid[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isViewBidsModalOpen, setIsViewBidsModalOpen] = useState(false);

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
      // {
      //   id: 'sr3',
      //   consumerId: 'c1',
      //   watchBrand: 'Tag Heuer',
      //   watchModel: 'Carrera',
      //   description: 'Watch band is broken and needs replacement. Also, the clasp is not working.',
      //   deliveryPreference: 'shipping',
      //   photos: [
      //     { id: '3', url: '/api/placeholder/300/300', timestamp: new Date().toISOString() }
      //   ],
      //   status: 'pending',
      //   createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
      //   updatedAt: new Date().toISOString(),
      //   bids: [],
      //   referenceId: 'CR-1003'
      // },
      // {
      //   id: 'sr4',
      //   consumerId: 'c1',
      //   watchBrand: 'Seiko',
      //   watchModel: 'Presage',
      //   description: 'Automatic movement is not winding properly. Needs a full service.',
      //   deliveryPreference: 'drop-off',
      //   photos: [
      //     { id: '4', url: '/api/placeholder/300/300', timestamp: new Date().toISOString() }
      //   ],
      //   status: 'completed',
      //   createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
      //   updatedAt: new Date().toISOString(),
      //   bids: [],
      //   referenceId: 'CR-1004'
      // },
      // {
      //   id: 'sr5',
      //   consumerId: 'c1',
      //   watchBrand: 'Patek Philippe',
      //   watchModel: 'Nautilus',
      //   description: 'Crystal has a crack and needs replacement. Also, the watch is running fast.',
      //   deliveryPreference: 'shipping',
      //   photos: [
      //     { id: '5', url: '/api/placeholder/300/300', timestamp: new Date().toISOString() }
      //   ],
      //   status: 'cancelled',
      //   createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      //   updatedAt: new Date().toISOString(),
      //   bids: [],
      //   referenceId: 'CR-1005'
      // }
    ];
  const mockBids: Bid[] = [
      {
        id: 'b1',
        serviceRequestId: 'sr1',
        dealerId: 'd1',
        status: 'submitted',
        estimatedPrice: 450,
        turnaroundTime: 7,
        deliveryMethod: 'pickup',
        submittedAt: new Date().toISOString(),
        notes: 'Includes full inspection and cleaning.',
        expiresAt: ''
      },
      {
        id: 'b2',
        serviceRequestId: 'sr2',
        dealerId: 'd2',
        status: 'submitted',
        estimatedPrice: 380,
        turnaroundTime: 5,
        deliveryMethod: 'shipping',
        submittedAt: new Date().toISOString(),
        notes: 'Chronograph repair included. Shipping covered.',
        expiresAt: ''
      }
    ];

    setServiceRequests(mockRequests);
  }, []);


  const handleViewDetails = (request: ServiceRequest) => {
    setSelectedRequest(request);
    setIsViewModalOpen(true);
  };

  const handleViewBids = (request: ServiceRequest) => {
    setSelectedRequest(request);
    setIsViewBidsModalOpen(true);
  };

  const filteredRequests = serviceRequests.filter((request) => {
    const searchText = `${request.watchBrand} ${request.watchModel} ${request.referenceId}`.toLowerCase();
    const matchesSearch = searchText.includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-500/20 text-yellow-700',
      bidding: 'bg-blue-500/20 text-blue-700',
      accepted: 'bg-green-500/20 text-green-700',
      'in-progress': 'bg-purple-500/20 text-purple-700',
      completed: 'bg-gray-500/20 text-gray-700',
      cancelled: 'bg-red-500/20 text-red-700',
    };
    return colors[status] || 'bg-gray-500/20 text-gray-700';
  };

  return (
    <div className="min-h-screen p-4">
      <div className="container mx-auto">
        <h1 className="text-3xl mb-4">My Service Requests</h1>

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

        <div className="grid gap-6">
          {filteredRequests.map((request) => (
            <Card key={request.id}>
              <CardHeader>
                <div className="flex justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {request.watchBrand} {request.watchModel}
                      <Badge className={getStatusColor(request.status)}>
                        {request.status}
                      </Badge>
                    </CardTitle>
                    <CardDescription>
                      Ref: {request.referenceId} • Created: {new Date(request.createdAt).toLocaleDateString()}
                    </CardDescription>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => handleViewDetails(request)}>
                    <Eye className="w-4 h-4 mr-1" />
                    View Details
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-3">{request.description}</p>
                <div className="flex justify-between items-center text-sm">
                  <div className="flex gap-4">
                    <span className="flex items-center gap-1"><Package className="w-4 h-4" />{request.deliveryPreference}</span>
                    <span className="flex items-center gap-1"><MessageSquare className="w-4 h-4" />{request.bids.length} bids</span>
                  </div>
                  <Button size="sm" onClick={() => handleViewBids(request)}>View Bids</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredRequests.length === 0 && (
          <Card className="text-center p-8 mt-6">
            <CardContent>
              <p>No matching service requests found.</p>
            </CardContent>
          </Card>
        )}
      </div>

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
