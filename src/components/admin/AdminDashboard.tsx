import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User } from '@/types/auth';
import { ServiceRequest } from '@/types/service';
import { 
  Users, 
  Settings, 
  Shield, 
  TrendingUp, 
  Activity,
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  UserCheck,
  UserX
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  // Mock data - replace with real API calls
  useEffect(() => {
    const mockUsers: User[] = [
      {
        id: '1',
        email: 'admin@chronobid.com',
        role: 'admin',
        firstName: 'Admin',
        lastName: 'User',
        isEmailVerified: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '2',
        email: 'dealer@chronobid.com',
        role: 'dealer',
        firstName: 'John',
        lastName: 'Dealer',
        company: 'Luxury Timepieces Inc.',
        isEmailVerified: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '3',
        email: 'consumer@chronobid.com',
        role: 'consumer',
        firstName: 'Jane',
        lastName: 'Consumer',
        isEmailVerified: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '4',
        email: 'wholesaler@chronobid.com',
        role: 'admin',
        firstName: 'Mike',
        lastName: 'Wholesaler',
        company: 'Global Watch Supply',
        isEmailVerified: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    const mockServiceRequests: ServiceRequest[] = [
      {
        id: '1',
        consumerId: '3',
        watchBrand: 'Rolex',
        watchModel: 'Submariner',
        description: 'Crown not screwing properly',
        deliveryPreference: 'shipping',
        photos: [],
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        bids: [],
        referenceId: 'CR-1001'
      }
    ];

    setUsers(mockUsers);
    setServiceRequests(mockServiceRequests);
  }, []);

  const filteredUsers = users.filter(user => {
    const matchesSearch = `${user.firstName} ${user.lastName} ${user.email}`.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const getRoleColor = (role: string) => {
    const colors = {
      admin: 'bg-red-500/20 text-red-700',
      dealer: 'bg-blue-500/20 text-blue-700',
      wholesaler: 'bg-green-500/20 text-green-700',
      consumer: 'bg-purple-500/20 text-purple-700',
    };
    return colors[role as keyof typeof colors] || 'bg-gray-500/20 text-gray-700';
  };

  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-yellow-500/20 text-yellow-700',
      active: 'bg-green-500/20 text-green-700',
      suspended: 'bg-red-500/20 text-red-700',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-500/20 text-gray-700';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 p-4">
      <div className="container mx-auto">
        <div className="mb-8">
          <h1 className="luxury-title text-3xl mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Manage users, monitor platform activity, and oversee system operations
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="luxury-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Users</p>
                  <p className="text-2xl font-bold text-primary">{users.length}</p>
                </div>
                <Users className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="luxury-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Dealers</p>
                  <p className="text-2xl font-bold text-blue-500">{users.filter(u => u.role === 'dealer').length}</p>
                </div>
                <Shield className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          
          {/* <Card className="luxury-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Service Requests</p>
                  <p className="text-2xl font-bold text-green-500">{serviceRequests.length}</p>
                </div>
                <Activity className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card> */}
          
          {/* <Card className="luxury-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Platform Growth</p>
                  <p className="text-2xl font-bold text-purple-500">+12%</p>
                </div>
                <TrendingUp className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card> */}
        </div>

        <Tabs defaultValue="users" className="space-y-6 ">
          <TabsList className=" grid grid-cols-1 max-w-[15%]">
            <TabsTrigger value="users">Users</TabsTrigger>
            {/* <TabsTrigger value="requests">Service Requests</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger> */}
          </TabsList>

          <TabsContent value="users" className="space-y-4">
            {/* Filters */}
            <div className="flex gap-4 mb-6">
              <div className="flex-1">
                <Input
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="luxury-input"
                />
              </div>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-48 luxury-input">
                  <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="consumer">Consumer</SelectItem>
                  <SelectItem value="dealer">Dealer</SelectItem>
                  <SelectItem value="wholesaler">Wholesaler</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Users List */}
            <div className="grid gap-4">
              {filteredUsers.map((user) => (
                <Card key={user.id} className="luxury-card">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          {user.firstName} {user.lastName}
                          <Badge className={getRoleColor(user.role)}>
                            {user.role}
                          </Badge>
                          {user.isEmailVerified && (
                            <Badge className="bg-green-500/20 text-green-700">
                              Verified
                            </Badge>
                          )}
                        </CardTitle>
                        <CardDescription>
                          {user.email} • {user.company && `${user.company} • `}
                          Joined {new Date(user.createdAt).toLocaleDateString()}
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4 mr-2" />
                          View
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm">
                        <span>ID: {user.id}</span>
                        {user.phone && <span>Phone: {user.phone}</span>}
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="text-green-600">
                          <UserCheck className="w-4 h-4 mr-2" />
                          Activate
                        </Button>
                        <Button variant="outline" size="sm" className="text-red-600">
                          <UserX className="w-4 h-4 mr-2" />
                          Suspend
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

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
                          Reference: {request.referenceId} • Consumer ID: {request.consumerId}
                        </CardDescription>
                      </div>
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      {request.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm">
                        <span>Created: {new Date(request.createdAt).toLocaleDateString()}</span>
                        <span>Delivery: {request.deliveryPreference}</span>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          Monitor
                        </Button>
                        <Button variant="outline" size="sm" className="text-red-600">
                          <Trash2 className="w-4 h-4 mr-2" />
                          Remove
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <Card className="luxury-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-6 h-6" />
                  Platform Settings
                </CardTitle>
                <CardDescription>
                  Configure system-wide settings and preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium">User Registration</h4>
                    <p className="text-sm text-muted-foreground">
                      Allow new users to register on the platform
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">Email Notifications</h4>
                    <p className="text-sm text-muted-foreground">
                      System-wide email notification settings
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">Platform Maintenance</h4>
                    <p className="text-sm text-muted-foreground">
                      Schedule maintenance windows and system updates
                    </p>
                  </div>
                </div>
                <Button className="luxury-button">
                  Save Settings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
