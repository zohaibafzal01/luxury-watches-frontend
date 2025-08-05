import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
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
} from "lucide-react";
import { Logo, PersonIcon, SrchIcon } from "@/svg";
import { useSelector } from "react-redux";
import { selectUserInfo } from "@/redux/selectors/userSelectors";
import { useDispatch } from "react-redux";
import { login, logout } from "@/redux/slices/userSlice";

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const sidebarRef = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const user = useSelector(selectUserInfo);
  const isAuthenticated = !!user;
  const dispatch = useDispatch();

  // Detect scroll
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  // Determine if on a dashboard/admin page
  const isDashboardPage =
    location.pathname.includes("/dashboard") ||
    location.pathname.includes("/admin") ||
    location.pathname.includes("/dealer") ||
    location.pathname.includes("/wholesaler");

  // Final header class logic
  // const headerClasses = isDashboardPage
  //   ? 'bg-white'
  //   : isScrolled
  //     ? 'bg-white'
  //     : isAuthenticated && user
  //       ? 'bg-blur'
  //       : 'bg-black';

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("isAuthenticated");
    dispatch(login(null));
    if (user?.accountType === "admin") {
      navigate("/admin/login");
    } else {
      navigate("/login");
    }
    setIsMobileMenuOpen(false);
  };

  const getInitials = (firstName?: string, lastName?: string) => {
    const first = firstName?.charAt(0) ?? "";
    const last = lastName?.charAt(0) ?? "";
    return `${first}${last}`.toUpperCase();
  };

  const getRoleBadgeColor = (role: string) => {
    const colors = {
      admin: "bg-red-100 text-red-700 border-red-200",
      dealer: "bg-blue-100 text-blue-700 border-blue-200",
      wholesaler: "bg-green-100 text-green-700 border-green-200",
      consumer: "bg-purple-100 text-purple-700 border-purple-200",
    };
    return (
      colors[role as keyof typeof colors] ||
      "bg-gray-100 text-gray-700 border-gray-200"
    );
  };

  const getNavigationItems = () => {
    if (!isAuthenticated || !user) return [];

    const commonItems = [
      {
        to: "/messages",
        label: "Messages",
        icon: MessageSquare,
        roles: ["dealer", "wholesaler", "admin"],
      },
    ];

    const roleSpecificItems = {
      admin: [
        { to: "/admin/dashboard", label: "Admin Dashboard", icon: Crown },
        // { to: '/bid-listing', label: 'Browse Bids', icon: ShoppingCart },
      ],
      dealer: [
        { to: "/dealer/dashboard", label: "Dashboard", icon: Home },
        // { to: '/dealer/inventory', label: 'Inventory', icon: Package },
        // { to: '/bid-listing', label: 'Browse Bids', icon: ShoppingCart },
      ],
      wholesaler: [
        { to: "/wholesaler/dashboard", label: "Dashboard", icon: Home },
        { to: "/bid-listing", label: "Browse Inventory", icon: ShoppingCart },
      ],
      consumer: [
        { to: "/dashboard", label: "Dashboard", icon: Home },
        { to: "/my-requests", label: "My Requests", icon: FileText },
      ],
    };

    const userRole = user?.role || user?.accountType?.toLowerCase();
    const items =
      roleSpecificItems[userRole as keyof typeof roleSpecificItems] || [];

    // commonItems.forEach((item) => {
    //   if (item.roles.includes(user.role)) {
    //     items.push(item);
    //   }
    // });

    return items;
  };

  const navigationItems = getNavigationItems();

  // Define userRole for use in JSX
  const userRole = user?.role || user?.accountType?.toLowerCase();

  const NavItems = ({
    isMobile = false,
    onItemClick,
  }: {
    isMobile?: boolean;
    onItemClick?: () => void;
  }) => (
    <div
      className={`flex ${
        isMobile ? "flex-col space-y-2" : "items-center space-x-2"
      }`}
    >
      {navigationItems.map((item) => {
        const Icon = item.icon;
        return (
          <Button
            key={item.to}
            variant="ghost"
            asChild
            className={isMobile ? "justify-start w-full" : ""}
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
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300  ${
        isAuthenticated && user ? "bg-white" : "bg-black"
      }`}
    >
      <div className="  px-2 sm:px-4 h-14 sm:h-20 flex items-center justify-between  sm:space-x-4">
        {!isAuthenticated && (
          <div
            className="hidden  lg:block relative inline-block"
            ref={sidebarRef}
          >
            <button
              className="text-white hover:text-[#F59F0A] text-lg md:text-xl"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {/* Always show burger icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>

            {menuOpen && (
              <div className="fixed top-0 left-4 z-50">
                {/* Backdrop */}
                <div
                  className="fixed inset-0 bg-black bg-opacity-50"
                  onClick={() => setMenuOpen(false)}
                />

                {/* Sidebar container */}
                <div
                  ref={sidebarRef}
                  className="relative bg-[#1A1A1A] text-white shadow-lg rounded-md px-6 py-6 mt-[72px] mr-4 min-w-[220px] max-w-xs flex flex-col space-y-3 transition-all duration-300"
                >
                  {[
                    { href: "/#why-choose-us", label: "Why choose us" },
                    { href: "/#what-we-offer", label: "What we offer" },
                    { href: "/#the-process", label: "The Process" },
                    { href: "/#faqs", label: "FAQs" },
                  ].map(({ href, label }) => (
                    <a
                      key={href}
                      href={href}
                      onClick={() => setMenuOpen(false)}
                      className="w-full px-3 py-2 text-sm rounded hover:bg-[#2C2C2C] hover:text-[#F59F0A] transition"
                    >
                      {label}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
        <div className="flex items-center space-x-4">
          <div className="flex flex-col items-center justify-center space-y-1 mx-auto">
            <div className="flex items-center space-x-2 cursor-pointer xl:ml-[50px] md:ml-[100px] sm:ml-[300px]">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl overflow-hidden flex items-center justify-center">
                <Logo />
              </div>
              <span
                className={`font-guyot text-lg sm:text-xl md:text-[24px] ${
                  isAuthenticated && user ? "text-black" : "text-white"
                }`}
              >
                <a
                  href={isAuthenticated && user ? "/" : "#"}
                  onClick={(e) => {
                    if (isAuthenticated || user) {
                      e.preventDefault();
                    }
                  }}
                >
                  <a href="/" className="text-white text-lg font-bold">
                    ChronoBid
                  </a>
                </a>
              </span>
            </div>
          </div>
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
                  <Button
                    variant="ghost"
                    className="relative h-8 w-8 sm:h-10 sm:w-10 rounded-full"
                  >
                    <Avatar className="h-8 w-8 sm:h-10 sm:w-10 border-2 border-primary/20 hover:border-primary/40 transition-colors">
                      <AvatarImage
                        src={user?.profileImage}
                        alt={user?.firstName}
                      />
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white font-bold text-xs sm:text-sm">
                        {getInitials(user.firstName, user.lastName)}
                      </AvatarFallback>
                    </Avatar>
                    {userRole === "admin" && (
                      <Crown className="absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 text-yellow-500 fill-current" />
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-56 sm:w-64"
                  align="end"
                  forceMount
                >
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-2">
                      <div className="flex items-center space-x-2">
                        <p className="text-sm font-semibold truncate">
                          {user.firstName} {user.lastName}
                        </p>
                        <span
                          className={`text-xs px-2 py-1 rounded-full border font-medium capitalize ${getRoleBadgeColor(
                            user.role
                          )}`}
                        >
                          {userRole}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground truncate">
                        {user.email}
                      </p>
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
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="cursor-pointer"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-3">
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
                  <SheetContent
                    side="right"
                    className="w-80 sm:w-96 bg-black text-white border-l border-gray-800 p-0"
                  >
                    <div className="flex flex-col h-full">
                      <div className="flex items-center justify-between p-6 border-b border-gray-800 flex-shrink-0">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center">
                            <Logo />
                          </div>
                          <span className="font-bold text-xl text-white font-guyot">
                            ChronoBid
                          </span>
                        </div>
                      </div>
                      <div className="flex-1 overflow-y-auto">
                        <div className="px-6">
                          <div className="py-6 border-b border-gray-800">
                            <div className="relative">
                              <input
                                type="search"
                                placeholder="Search service"
                                className="w-full rounded-full py-3 pl-12 pr-4 text-white placeholder:text-gray-400
                                         bg-gradient-to-br from-[#2c2c2e] via-[#2c2c2e] to-[#005670]/100
                                         backdrop-blur-md border border-gray-700 outline-none focus:ring-2 focus:ring-[#F59F0A] transition-all"
                              />
                              <Search
                                className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400"
                                size={20}
                              />
                            </div>
                          </div>

                          <nav className="py-6 pb-6">
                            <div className="space-y-1">
                              <div className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                Navigation
                              </div>
                              <Button
                                variant="ghost"
                                className="w-full justify-start text-white hover:bg-gray-800 hover:text-[#F59F0A] py-3 px-3"
                                asChild
                              >
                                <Link
                                  to="/why-choose-us"
                                  className="flex items-center "
                                  id="WhyChooseBid"
                                >
                                  <div className="w-2 h-2 bg-[#F59F0A] rounded-full mr-3"></div>
                                  Why choose us
                                </Link>
                              </Button>
                              <Button
                                variant="ghost"
                                className="w-full justify-start text-white hover:bg-gray-800 hover:text-[#F59F0A] py-3 px-3"
                                asChild
                              >
                                <Link
                                  to="/what-we-offer"
                                  className="flex items-center"
                                >
                                  <div className="w-2 h-2 bg-[#F59F0A] rounded-full mr-3"></div>
                                  What we offer
                                </Link>
                              </Button>
                              <Button
                                variant="ghost"
                                className="w-full justify-start text-white hover:bg-gray-800 hover:text-[#F59F0A] py-3 px-3"
                                asChild
                              >
                                <Link
                                  to="/the-process"
                                  className="flex items-center"
                                >
                                  <div className="w-2 h-2 bg-[#F59F0A] rounded-full mr-3"></div>
                                  The Process
                                </Link>
                              </Button>
                              <Button
                                variant="ghost"
                                className="w-full justify-start text-white hover:bg-gray-800 hover:text-[#F59F0A] py-3 px-3"
                                asChild
                              >
                                <Link to="/faqs" className="flex items-center">
                                  <div className="w-2 h-2 bg-[#F59F0A] rounded-full mr-3"></div>
                                  FAQs
                                </Link>
                              </Button>
                            </div>
                          </nav>
                        </div>
                      </div>
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
                <div className="hidden md:flex items-center space-x-1 sm:space-x-2 ">
                  <button className="text-white hover:text-[#F59F0A] p-1">
                    <Link to="/">
                      <SrchIcon />
                    </Link>
                  </button>

                  <button className="text-white hover:text-[#F59F0A] p-1">
                    <Link to="/login">
                      <PersonIcon />
                    </Link>
                  </button>

                  {/* Other buttons remain unchanged */}
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
