import React, { useState } from 'react';
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
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  Crown,
  User,
  Settings,
  LogOut,
  MessageSquare,
  Package,
  ShoppingCart,
  Menu,
  X,
  Home,
  FileText,
  Search,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Logo } from '@/svg';

export const Header: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMobileMenuOpen(false);
  };

  const getInitials = (firstName: string, lastName: string) =>
    `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();

  const getRoleBadgeColor = (role: string) => {
    const colors = {
      admin: 'bg-red-100 text-red-700 border-red-200',
      dealer: 'bg-blue-100 text-blue-700 border-blue-200',
      wholesaler: 'bg-green-100 text-green-700 border-green-200',
      consumer: 'bg-purple-100 text-purple-700 border-purple-200',
    };
    return colors[role as keyof typeof colors] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  const getNavigationItems = () => {
    if (!isAuthenticated || !user) return [];

    const commonItems = [
      {
        to: '/messages',
        label: 'Messages',
        icon: MessageSquare,
        roles: ['dealer', 'wholesaler', 'admin'],
      },
    ];

    const roleSpecificItems = {
      admin: [
        { to: '/admin/dashboard', label: 'Admin Dashboard', icon: Crown },
        { to: '/bid-listing', label: 'Browse Bids', icon: ShoppingCart },
      ],
      dealer: [
        { to: '/dealer/dashboard', label: 'Dashboard', icon: Home },
        { to: '/dealer/inventory', label: 'Inventory', icon: Package },
        { to: '/bid-listing', label: 'Browse Bids', icon: ShoppingCart },
      ],
      wholesaler: [
        { to: '/wholesaler/dashboard', label: 'Dashboard', icon: Home },
        { to: '/bid-listing', label: 'Browse Inventory', icon: ShoppingCart },
      ],
      consumer: [
        { to: '/dashboard', label: 'Dashboard', icon: Home },
        { to: '/my-requests', label: 'My Requests', icon: FileText },
      ],
    };

    const items = roleSpecificItems[user.role as keyof typeof roleSpecificItems] || [];

    commonItems.forEach((item) => {
      if (item.roles.includes(user.role)) {
        items.push(item);
      }
    });

    return items;
  };

  const navigationItems = getNavigationItems();

  const NavItems = ({ isMobile = false, onItemClick }: { isMobile?: boolean; onItemClick?: () => void }) => (
    <div className={`flex ${isMobile ? 'flex-col space-y-2' : 'items-center space-x-2'}`}>
      {navigationItems.map((item) => {
        const Icon = item.icon;
        return (
          <Button
            key={item.to}
            variant="ghost"
            asChild
            className={isMobile ? 'justify-start w-full' : ''}
            onClick={onItemClick}
          >
            <Link to={item.to}>
              <Icon className="w-4 h-4 mr-2" />
              {item.label}
            </Link>
          </Button>
        );
      })}
    </div>
  );

  return (
    <header className={`sticky top-0 z-50 w-full ${isAuthenticated && user ? "" : "bg-black"} `}>
      <div className="container mx-auto px-2 sm:px-4 h-14 sm:h-16 flex items-center justify-between">
        {/* Left Section: Logo, Search Bar, Static Nav */}
        <div className="flex items-center space-x-4">
          {/* Logo */}
          {/* <Link  className="flex items-center space-x-2 sm:space-x-3 group"> */}
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl overflow-hidden flex items-center justify-center">
            <Logo />
          </div>
          <span className={`font-bold text-lg sm:text-xl md:text-[24px] ${isAuthenticated && user ? "text-black" : "text-white"} font-guyot`}>
            ChronoBid
          </span>
          {/* </Link> */}

          {/* Search Bar (hidden on mobile) */}
          {!isAuthenticated  && (
          <div className='flex items-center gap-4'>
                <div className="relative w-[200px] md:w-[300px] lg:w-[300px] hidden md:block">
                  <input
                    type="search"
                    placeholder="Search service"
                    className="w-full rounded-full py-2 pl-10 pr-4 text-white placeholder:text-gray-300
                bg-gradient-to-br from-[#2c2c2e] via-[#2c2c2e] to-[#005670]/100
                backdrop-blur-md border-none outline-none focus:ring-2 focus:ring-[#F59F0A] transition-all text-sm"
                  />
                  <Search className="absolute top-1/2 left-3 -translate-y-1/2 text-white opacity-70" size={18} />
                </div>

                {/* Static Nav Links (desktop only) */}
                <nav className="hidden xl:flex space-x-4 lg:space-x-6 text-white font-stevie text-xs lg:text-[14px]">
                  <Link to="/why-choose-us" className="hover:text-[#F59F0A] whitespace-nowrap">Why choose us</Link>
                  <Link to="/what-we-offer" className="hover:text-[#F59F0A] whitespace-nowrap">What we offer</Link>
                  <Link to="/the-process" className="hover:text-[#F59F0A] whitespace-nowrap">The Process</Link>
                  <Link to="/faqs" className="hover:text-[#F59F0A]">FAQs</Link>
                </nav>
              </div>
          )}

        </div>

        {/* Right Section: Auth/User Navigation */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          {isAuthenticated && user ? (
            <>
              {/* Desktop Nav for Authenticated Users */}
              <nav className="hidden lg:block">
                <NavItems />
              </nav>

              {/* User Avatar & Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 sm:h-10 sm:w-10 rounded-full">
                    <Avatar className="h-8 w-8 sm:h-10 sm:w-10 border-2 border-primary/20 hover:border-primary/40 transition-colors">
                      <AvatarImage src={user?.profileImage} alt={user?.firstName} />
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white font-bold text-xs sm:text-sm">
                        {getInitials(user.firstName, user.lastName)}
                      </AvatarFallback>
                    </Avatar>
                    {user?.role === 'admin' && (
                      <Crown className="absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 text-yellow-500 fill-current" />
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 sm:w-64" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-2">
                      <div className="flex items-center space-x-2">
                        <p className="text-sm font-semibold truncate">{user.firstName} {user.lastName}</p>
                        <span className={`text-xs px-2 py-1 rounded-full border font-medium capitalize ${getRoleBadgeColor(user.role)}`}>
                          {user.role}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile-settings" className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      Profile Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/settings" className="cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              
              <div className='flex gap-2'>
                {/* <Button asChild variant="outline" className="text-white border-white hover:text-white hover:border-[#F59F0A]">
                  <Link to="/login">Sign in</Link>
                </Button> */}
                 <Button asChild className="bg-black text-white border hover:bg-[#d88c05]">
                  <Link to="/">Order Lookup</Link>
                </Button>
                 <Button asChild className="bg-white text-[#F59F0A] hover:bg-[#d88c05] hover:text-white">
                  <Link to="/">Contact us</Link>
                </Button>
                <Button asChild className="bg-[#F59F0A] text-white hover:bg-[#d88c05]">
                  <Link to="/login">Sign in</Link>
                </Button>
              </div>
            </>
          )}

          {/* Mobile Menu Button */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden">
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[250px] sm:w-[300px]">
              <div className="grid gap-4 py-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold">Menu</h2>
                </div>
                <div className="space-y-2">
                  <NavItems isMobile onItemClick={() => setIsMobileMenuOpen(false)} />
                  <Button onClick={handleLogout} variant="ghost" className="w-full justify-start">
                    <LogOut className="w-4 h-4 mr-2" />
                    Log out
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};
