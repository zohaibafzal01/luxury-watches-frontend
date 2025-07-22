import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { DealerDashboard } from '@/components/dealer/DealerDashboard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { 
  Crown, 
  Plus, 
  Clock, 
  Package, 
  Users, 
  Settings,
  MessageSquare,
  TrendingUp,
  Star
} from 'lucide-react';

const Dashboard = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="luxury-shimmer p-8 rounded-lg">
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Dealer users get redirected to the full dealer dashboard
  if (user.role === 'dealer') {
    return <Navigate to="/dealer/dashboard" replace />;
  }

  // Admin users get redirected to admin dashboard
  if (user.role === 'admin') {
    return <Navigate to="/admin/dashboard" replace />;
  }

  // Wholesaler users get redirected to wholesaler dashboard
  if (user.role === 'wholesaler') {
    return <Navigate to="/wholesaler/dashboard" replace />;
  }

  // Consumer Dashboard
  if (user.role === 'consumer') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 p-4">
        <div className="container mx-auto">
          {/* Welcome Section */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-luxury-gradient rounded-full flex items-center justify-center">
                <Crown className="w-6 h-6 text-luxury-black" />
              </div>
              <div>
                <h1 className="luxury-title text-2xl">Welcome back, {user.firstName}!</h1>
                <p className="text-muted-foreground">Ready to service your luxury timepieces?</p>
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

            {/* <Card className="luxury-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-green-500" />
                  Messages
                </CardTitle>
                <CardDescription>
                  Communicate with dealers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full" variant="outline">
                  <Link to="/messages">Open Messages</Link>
                </Button>
              </CardContent>
            </Card> */}
          </div>

          {/* Recent Activity */}
          <Card className="luxury-card mb-8">
            <CardHeader>
              <CardTitle>Recent Service Requests</CardTitle>
              <CardDescription>Your latest watch service activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Mock recent requests */}
                <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div>
                    <h4 className="font-medium">Rolex Submariner - Crown Repair</h4>
                    <p className="text-sm text-muted-foreground">Reference: CR-1001 • 2 days ago</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-blue-500/20 text-blue-700">3 Bids</Badge>
                    <Badge className="bg-green-500/20 text-green-700">Active</Badge>
                    <Button variant="outline" size="sm" asChild>
                      <Link to="/my-requests">View Details</Link>
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div>
                    <h4 className="font-medium">Omega Speedmaster - Service</h4>
                    <p className="text-sm text-muted-foreground">Reference: CR-1002 • 1 week ago</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-purple-500/20 text-purple-700">In Progress</Badge>
                    <Button variant="outline" size="sm" asChild>
                      <Link to="/my-requests">View Details</Link>
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div>
                    <h4 className="font-medium">Cartier Santos - Polish & Service</h4>
                    <p className="text-sm text-muted-foreground">Reference: CR-1003 • 2 weeks ago</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-green-500/20 text-green-700">Completed</Badge>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm">5.0</span>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <Link to="/my-requests">View Details</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
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
