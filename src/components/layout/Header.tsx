import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
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
  Home,
  FileText,
  Search,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Logo } from '@/svg';

export const Header: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Detect scroll
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Determine if on a dashboard/admin page
  const isDashboardPage = location.pathname.includes('/dashboard') ||
    location.pathname.includes('/admin') ||
    location.pathname.includes('/dealer') ||
    location.pathname.includes('/wholesaler');

  // Final header class logic
  // const headerClasses = isDashboardPage
  //   ? 'bg-white'
  //   : isScrolled
  //     ? 'bg-white'
  //     : isAuthenticated && user
  //       ? 'bg-blur'
  //       : 'bg-black';

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
        // { to: '/bid-listing', label: 'Browse Bids', icon: ShoppingCart },
      ],
      dealer: [
        { to: '/dealer/dashboard', label: 'Dashboard', icon: Home },
        // { to: '/dealer/inventory', label: 'Inventory', icon: Package },
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

    // commonItems.forEach((item) => {
    //   if (item.roles.includes(user.role)) {
    //     items.push(item);
    //   }
    // });

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
    <header className={`sticky top-0 z-50 w-full transition-all duration-300  ${isAuthenticated && user ? "bg-white" : "bg-black"}`}>
      <div className="container mx-auto px-2 sm:px-4 h-14 sm:h-16 flex items-center justify-between">
        {/* Left Section: Logo, Search Bar, Static Nav */}
        <div className="flex items-center space-x-4">
          {/* Logo */}
          {/* <Link  className="flex items-center space-x-2 sm:space-x-3 group"> */}
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl overflow-hidden flex items-center justify-center">
            <Logo />
          </div>
          <span className={`font-guyot  text-lg sm:text-xl md:text-[24px] cursor-pointer ${isAuthenticated && user ? "text-black" : "text-white"} font-guyot`}>
            <a
              href={isAuthenticated && user ? "/" : "#"}
              onClick={(e) => {
                if (isAuthenticated || user) {
                  e.preventDefault(); 
                }
              }}
            >
              <span className={isAuthenticated && user ? '' : ''}>ChronoBid</span>
            </a>

          </span>
          {/* </Link> */}

          {/* Search Bar (hidden on mobile) */}
          {!isAuthenticated && (
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
                <a href="#why-choose-us" className="hover:text-[#F59F0A] whitespace-nowrap">Why choose us</a>
                <a href="#what-we-offer" className="hover:text-[#F59F0A] whitespace-nowrap">What we offer</a>
                <a href="#the-process" className="hover:text-[#F59F0A] whitespace-nowrap">The Process</a>
                <a href="#faqs" className="hover:text-[#F59F0A]">FAQs</a>
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
                    {/* <Link to="/settings" className="cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </Link> */}
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

              <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-3">
                {/* Mobile Menu for Non-Authenticated Users */}
                <Sheet>
                  <SheetTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="md:hidden h-8 w-8 sm:h-10 sm:w-10 flex flex-col items-center justify-center space-y-1 text-white"
                    >
                      <div className="w-5 h-0.5 bg-white"></div>
                      <div className="w-5 h-0.5 bg-white"></div>
                      <div className="w-5 h-0.5 bg-white"></div>
                      <span className="sr-only">Toggle menu</span>
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-80 sm:w-96 bg-black text-white border-l border-gray-800 p-0">
                    <div className="flex flex-col h-full">
                      {/* Fixed Mobile Header with Logo */}
                      <div className="flex items-center justify-between p-6 border-b border-gray-800 flex-shrink-0">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center">
                            <Logo />
                          </div>
                          <span className="font-bold text-xl text-white font-guyot">ChronoBid</span>
                        </div>
                      </div>

                      {/* Scrollable Content Area */}
                      <div className="flex-1 overflow-y-auto">
                        <div className="px-6">
                          {/* Mobile Search */}
                          <div className="py-6 border-b border-gray-800">
                            <div className="relative">
                              <input
                                type="search"
                                placeholder="Search service"
                                className="w-full rounded-full py-3 pl-12 pr-4 text-white placeholder:text-gray-400
                                         bg-gradient-to-br from-[#2c2c2e] via-[#2c2c2e] to-[#005670]/100
                                         backdrop-blur-md border border-gray-700 outline-none focus:ring-2 focus:ring-[#F59F0A] transition-all"
                              />
                              <Search className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400" size={20} />
                            </div>
                          </div>

                          {/* Navigation Links */}
                          <nav className="py-6 pb-6">
                            <div className="space-y-1">
                              <div className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                Navigation
                              </div>
                              <Button variant="ghost" className="w-full justify-start text-white hover:bg-gray-800 hover:text-[#F59F0A] py-3 px-3" asChild>
                                <Link to="/why-choose-us" className="flex items-center " id="WhyChooseBid">
                                  <div className="w-2 h-2 bg-[#F59F0A] rounded-full mr-3"></div>
                                  Why choose us
                                </Link>
                              </Button>
                              <Button variant="ghost" className="w-full justify-start text-white hover:bg-gray-800 hover:text-[#F59F0A] py-3 px-3" asChild>
                                <Link to="/what-we-offer" className="flex items-center">
                                  <div className="w-2 h-2 bg-[#F59F0A] rounded-full mr-3"></div>
                                  What we offer
                                </Link>
                              </Button>
                              <Button variant="ghost" className="w-full justify-start text-white hover:bg-gray-800 hover:text-[#F59F0A] py-3 px-3" asChild>
                                <Link to="/the-process" className="flex items-center">
                                  <div className="w-2 h-2 bg-[#F59F0A] rounded-full mr-3"></div>
                                  The Process
                                </Link>
                              </Button>
                              <Button variant="ghost" className="w-full justify-start text-white hover:bg-gray-800 hover:text-[#F59F0A] py-3 px-3" asChild>
                                <Link to="/faqs" className="flex items-center">
                                  <div className="w-2 h-2 bg-[#F59F0A] rounded-full mr-3"></div>
                                  FAQs
                                </Link>
                              </Button>
                            </div>
                          </nav>
                        </div>
                      </div>

                      {/* Fixed Bottom Action Buttons */}
                      <div className="border-t border-gray-800 p-6 space-y-3 flex-shrink-0">
                        <Button
                          asChild
                          className="w-full bg-black border border-gray-700 hover:bg-[#F59F0A] text-white font-semibold py-3"
                        >
                          <Link to="/">Order Lookup</Link>
                        </Button>
                        <Button
                          asChild
                          className="w-full bg-white text-[#F59F0A] hover:bg-[#F59F0A] hover:text-white font-semibold py-3"
                        >
                          <Link to="/">Contact Us</Link>
                        </Button>
                        <Button
                          asChild
                          className="w-full bg-[#F59F0A] text-white hover:bg-[#e09000] font-semibold py-3"
                        >
                          <Link to="/login">Sign In</Link>
                        </Button>
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>

                {/* Desktop Buttons - Hidden on mobile */}
                <div className="hidden md:flex items-center space-x-2 md:space-x-3">
                  <Button
                    asChild
                    className="bg-black border hover:bg-[#F59F0A] text-white font-semibold text-xs sm:text-sm md:text-[14px] px-2 sm:px-4 h-8 sm:h-9 md:h-10"
                  >
                    <Link to="/">
                      <span className="hidden sm:inline">Order Lookup</span>
                      <span className="sm:hidden">Order</span>
                    </Link>
                  </Button>
                  <Button
                    asChild
                    className="bg-white text-[#F59F0A] hover:bg-[#F59F0A] hover:text-white font-semibold text-xs sm:text-sm md:text-[14px] px-2 sm:px-4 h-8 sm:h-9 md:h-10"
                  >
                    <Link to="/">
                      <span className="hidden sm:inline">Contact Us</span>
                      <span className="sm:hidden">Contact</span>
                    </Link>
                  </Button>
                  <Button variant="ghost" asChild className='bg-[#F59F0A] text-white text-xs sm:text-sm md:text-[14px] px-2 sm:px-4 h-8 sm:h-9 md:h-10'>
                    <Link to="/login">Sign In</Link>
                  </Button>
                </div>
              </div>
            </>
          )}

          {/* Mobile Menu Button */}
          {/* <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
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
          </Sheet> */}
        </div>
      </div>
    </header>
  );
};