
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/contexts/AuthContext';
import { Crown, User, Settings, LogOut, MessageSquare, Package, ShoppingCart } from 'lucide-react';

export const Header: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const getRoleColor = (role: string) => {
    const colors = {
      admin: 'text-red-400',
      dealer: 'text-blue-400',
      wholesaler: 'text-green-400',
      consumer: 'text-purple-400',
    };
    return colors[role as keyof typeof colors] || 'text-gray-400';
  };

  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2 group">
          <div className="w-10 h-10 bg-luxury-gradient rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
            <Crown className="w-6 h-6 text-luxury-black" />
          </div>
          <div className="flex flex-col">
            <span className="font-luxury text-xl font-bold text-foreground">ChronoBid</span>
            <span className="text-xs text-muted-foreground -mt-1">Luxury Timepieces</span>
          </div>
        </Link>

        {/* Navigation & User Menu */}
        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              {/* Navigation based on role */}
              {user?.role === 'dealer' && (
                <div className="hidden md:flex items-center space-x-2">
                  <Button variant="ghost" asChild>
                    <Link to="/dealer/dashboard">Dashboard</Link>
                  </Button>
                  <Button variant="ghost" asChild>
                    <Link to="/dealer/inventory">
                      <Package className="w-4 h-4 mr-2" />
                      Inventory
                    </Link>
                  </Button>
                  <Button variant="ghost" asChild>
                    <Link to="/messages">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Messages
                    </Link>
                  </Button>
                  <Button variant="ghost" asChild>
                    <Link to="/bid-listing">Browse Bids</Link>
                  </Button>
                </div>
              )}

              {user?.role === 'consumer' && (
                <div className="hidden md:flex items-center space-x-2">
                  <Button variant="ghost" asChild>
                    <Link to="/dashboard">Dashboard</Link>
                  </Button>
                  <Button variant="ghost" asChild>
                    <Link to="/my-requests">My Requests</Link>
                  </Button>
                  <Button variant="ghost" asChild>
                    <Link to="/messages">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Messages
                    </Link>
                  </Button>
                </div>
              )}

              {user?.role === 'wholesaler' && (
                <div className="hidden md:flex items-center space-x-2">
                  <Button variant="ghost" asChild>
                    <Link to="/wholesaler/dashboard">Dashboard</Link>
                  </Button>
                  <Button variant="ghost" asChild>
                    <Link to="/bid-listing">
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Browse Inventory
                    </Link>
                  </Button>
                  <Button variant="ghost" asChild>
                    <Link to="/messages">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Messages
                    </Link>
                  </Button>
                </div>
              )}

              {user?.role === 'admin' && (
                <div className="hidden md:flex items-center space-x-2">
                  <Button variant="ghost" asChild>
                    <Link to="/admin/dashboard">Admin Dashboard</Link>
                  </Button>
                  <Button variant="ghost" asChild>
                    <Link to="/bid-listing">Browse Bids</Link>
                  </Button>
                  <Button variant="ghost" asChild>
                    <Link to="/messages">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Messages
                    </Link>
                  </Button>
                </div>
              )}

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10 border-2 border-primary/20">
                      <AvatarImage src={user?.profileImage} alt={user?.firstName} />
                      <AvatarFallback className="bg-primary/10 text-primary font-medium">
                        {user ? getInitials(user.firstName, user.lastName) : 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">
                        {user?.firstName} {user?.lastName}
                      </p>
                      <p className="text-xs text-muted-foreground">{user?.email}</p>
                      <p className={`text-xs font-medium capitalize ${getRoleColor(user?.role || '')}`}>
                        {user?.role}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile-settings">
                      <Settings className="mr-2 h-4 w-4" />
                      Profile Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <div className="flex items-center space-x-2">
              <Button variant="ghost" asChild>
                <Link to="/login">Sign In</Link>
              </Button>
              <Button asChild className="luxury-button">
                <Link to="/register">Get Started</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
