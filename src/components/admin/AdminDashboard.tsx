import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { User } from "@/types/auth";
import { ServiceRequest } from "@/types/service";
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
  UserX,
  Mail,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import waitingListApi from "@/api/waitingList";
import adminApi from "@/api/admin";

export const AdminDashboard: React.FC = () => {
  type WaitlistItem = {
    id: string;
    email: string;
    createdAt: string;
    updatedAt: string;
  };
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  // Users pagination
  const [page, setPage] = useState(1);
  const [limit] = useState(5); // 5 users per page
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [usersLoading, setUsersLoading] = useState(false);

  const [waitlist, setWaitlist] = useState<WaitlistItem[]>([]);
  const [wlPage, setWlPage] = useState(1);
  const [wlLimit] = useState(10); // default 10 per page
  const [wlTotalPages, setWlTotalPages] = useState(1);
  const [wlTotal, setWlTotal] = useState(0);
  const [wlLoading, setWlLoading] = useState(false);

  // Fetch users from API
  const fetchUsers = async () => {
    try {
      setUsersLoading(true);
      const res = await adminApi.getAdminUsers(page, limit);

      if (res?.success && Array.isArray(res?.data)) {
        // Map API response to User type
        const mappedUsers: User[] = res.data.map((user: any) => ({
          id: user?.id,
          firstName: user?.firstName,
          lastName: user?.lastName,
          email: user?.email,
          role: user?.accountType, // API uses 'accountType' instead of 'role'
          isEmailVerified: user?.status === "active", // Assuming active status means verified
          createdAt: user?.createdAt,
          updatedAt: user?.updatedAt,
          phoneNo: user?.phoneNo,
          companyName: user?.companyName || "",
          lastLogin: user?.lastLogin,
          status: user?.status,
        }));

        setUsers(mappedUsers);
        setTotal(res?.pagination?.total ?? res.data.length);
        setTotalPages(
          res?.pagination?.totalPages ?? Math.ceil(res.data.length / limit)
        );
      } else {
        setUsers([]);
        setTotal(0);
        setTotalPages(1);
      }
    } catch (err) {
      console.error("Failed to fetch users:", err);
      toast({
        title: "Unable to load users",
        description: "Please try again.",
        variant: "destructive",
      });
      // Keep dummy data as fallback
      setUsers([]);
      setTotal(0);
      setTotalPages(1);
    } finally {
      setUsersLoading(false);
    }
  };

  const fetchWaitlist = async () => {
    try {
      setWlLoading(true);
      const res = await waitingListApi.getWaitingList(wlPage, wlLimit);

      if (res?.success && Array.isArray(res?.data)) {
        setWaitlist(
          res.data.map((x: any) => ({
            id: x?.id,
            email: x?.email,
            createdAt: x?.createdAt,
            updatedAt: x?.updatedAt,
          }))
        );
        setWlTotal(res?.pagination?.total ?? res.data.length);
        setWlTotalPages(res?.pagination?.totalPages ?? 1);
      } else {
        setWaitlist([]);
        setWlTotal(0);
        setWlTotalPages(1);
      }
    } catch (err) {
      console.error("Failed to fetch waitlist:", err);
      toast({
        title: "Unable to load waitlist",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setWlLoading(false);
    }
  };

  // load on mount + when wlPage changes
  useEffect(() => {
    fetchUsers();
    fetchWaitlist();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wlPage, page]);

  const filteredUsers =
    users?.filter((user) => {
      const matchesSearch = `${user?.firstName || ""} ${user?.lastName || ""} ${
        user?.email || ""
      }`
        .toLowerCase()
        .includes(searchTerm?.toLowerCase() || "");
      const matchesRole = roleFilter === "all" || user?.role === roleFilter;
      return matchesSearch && matchesRole;
    }) || [];

  // Paginate filtered users
  const paginatedUsers =
    filteredUsers?.slice((page - 1) * limit, page * limit) || [];
  const filteredTotalPages = Math.ceil((filteredUsers?.length || 0) / limit);

  const getRoleColor = (role: string) => {
    const colors = {
      admin: "bg-red-500/20 text-red-700",
      dealer: "bg-blue-500/20 text-blue-700",
      consumer: "bg-purple-500/20 text-purple-700",
    };
    return (
      colors[role as keyof typeof colors] || "bg-gray-500/20 text-gray-700"
    );
  };

  const getStatusColor = (status: string) => {
    const colors = {
      pending: "bg-yellow-500/20 text-yellow-700",
      active: "bg-green-500/20 text-green-700",
      suspended: "bg-red-500/20 text-red-700",
    };
    return (
      colors[status as keyof typeof colors] || "bg-gray-500/20 text-gray-700"
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 p-4">
      <div className="container mx-auto">
        <div className="mb-8">
          <h1 className="luxury-title text-3xl mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Manage users, monitor platform activity, and oversee system
            operations
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="luxury-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Users</p>
                  <p className="text-2xl font-bold text-[#CC5500]">
                    {users?.length || 0}
                  </p>
                </div>
                <Users className="w-8 h-8 text-[#CC5500]" />
              </div>
            </CardContent>
          </Card>

          <Card className="luxury-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Active Dealers
                  </p>
                  <p className="text-2xl font-bold text-blue-500">
                    {users?.filter((u) => u?.role === "dealer")?.length || 0}
                  </p>
                </div>
                <Shield className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="luxury-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Waiting List</p>
                  <p className="text-2xl font-bold text-purple-500">
                    {wlTotal || 0}
                  </p>
                </div>
                <Mail className="w-8 h-8 text-purple-500" />
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
          <TabsList className=" grid grid-cols-2 max-w-[30%]">
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="waitlist">Waiting List</TabsTrigger>
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
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
              <Button
                onClick={fetchUsers}
                disabled={usersLoading}
                className="luxury-button bg-[#CC5500] hover:bg-[#b84a00]/90"
              >
                {usersLoading ? "Loading..." : "Refresh"}
              </Button>
            </div>

            {/* Users List */}
            <div className="grid gap-4">
              {usersLoading ? (
                <div className="min-h-screen flex items-center justify-center">
                  <div className=" p-8 rounded-lg">
                    <div className="flex flex-col items-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-gray-300 border-t-primary mb-4"></div>
                    </div>
                  </div>
                </div>
              ) : (paginatedUsers?.length || 0) === 0 ? (
                <Card className="luxury-card">
                  <CardContent className="p-8 text-center">
                    <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">
                      No users found
                    </h3>
                    <p className="text-muted-foreground">
                      No users match your current search criteria.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                paginatedUsers?.map((user) => (
                  <Card key={user?.id} className="luxury-card">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            {user?.firstName || ""} {user?.lastName || ""}
                            <Badge className={getRoleColor(user?.role || "")}>
                              {user?.role || "unknown"}
                            </Badge>
                            {user?.status === "active" && (
                              <Badge className="bg-green-500/20 text-green-700">
                                Active
                              </Badge>
                            )}
                            {user?.status !== "active" && (
                              <Badge className="bg-yellow-500/20 text-yellow-700">
                                {user?.status || "Inactive"}
                              </Badge>
                            )}
                          </CardTitle>
                          <CardDescription>
                            {user?.email || ""} •{" "}
                            {user?.companyName && `${user.companyName} • `}
                            Joined{" "}
                            {user?.createdAt
                              ? new Date(user.createdAt).toLocaleDateString()
                              : "N/A"}
                            {user?.lastLogin && (
                              <span>
                                {" "}
                                • Last login:{" "}
                                {new Date(user.lastLogin).toLocaleDateString()}
                              </span>
                            )}
                          </CardDescription>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="hover:bg-[#CC5500]"
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            View
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="hover:bg-[#CC5500]"
                          >
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm">
                          <span>ID: {user?.id || "N/A"}</span>
                          {user?.phoneNo && <span>Phone: {user.phoneNo}</span>}
                        </div>
                        <div className="flex gap-2">
                          {user?.status !== "active" ? (
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-green-600 hover:bg-green-500 hover:text-white"
                            >
                              <UserCheck className="w-4 h-4 mr-2" />
                              Activate
                            </Button>
                          ) : (
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-600 hover:bg-red-500 hover:text-white"
                            >
                              <UserX className="w-4 h-4 mr-2" />
                              Suspend
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )) || []
              )}
            </div>

            {/* Users Pagination */}
            {(filteredUsers?.length || 0) > 0 && (
              <div className="flex justify-center items-center gap-4 mt-6">
                <Button
                  className=" hover:bg-[#CC5500]/90"
                  variant="outline"
                  size="sm"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  Previous
                </Button>
                <span className="text-sm text-muted-foreground">
                  Page {page} of {filteredTotalPages || 1}
                </span>
                <Button
                  className=" hover:bg-[#CC5500]/90"
                  variant="outline"
                  size="sm"
                  disabled={page >= (filteredTotalPages || 1)}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="waitlist" className="space-y-4">
            {/* Waitlist Header */}
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-lg font-semibold">Waiting List</h3>
                <p className="text-sm text-muted-foreground">
                  Manage users on the waiting list
                </p>
              </div>
              <Button
                onClick={fetchWaitlist}
                disabled={wlLoading}
                className="luxury-button bg-[#CC5500] hover:bg-[#b84a00]/90"
              >
                {wlLoading ? "Loading..." : "Refresh"}
              </Button>
            </div>

            {/* Waitlist Items */}
            <div className="grid gap-4">
              {wlLoading ? (
                <div className="min-h-screen flex items-center justify-center">
                  <div className=" p-8 rounded-lg">
                    <div className="flex flex-col items-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-gray-300 border-t-primary mb-4"></div>
                    </div>
                  </div>
                </div>
              ) : (waitlist?.length || 0) === 0 ? (
                <Card className="luxury-card">
                  <CardContent className="p-8 text-center">
                    <Mail className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">
                      No waiting list entries
                    </h3>
                    <p className="text-muted-foreground">
                      No users are currently on the waiting list.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                waitlist?.map((item) => (
                  <Card key={item?.id} className="luxury-card">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1 space-y-2">
                          <CardTitle className="flex items-center gap-2">
                            <Mail className="w-5 h-5" />
                            {item?.email || "N/A"}
                            <Badge className="bg-blue-500/20 text-blue-700">
                              Waiting
                            </Badge>
                          </CardTitle>
                          <CardDescription>
                            ID: {item?.id || "N/A"}
                          </CardDescription>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="hover:bg-green-500 hover:text-white"
                          >
                            <UserCheck className="w-4 h-4 mr-2" />
                            Invite
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="hover:bg-red-500 hover:text-white"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Remove
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-4">
                          <span className="text-muted-foreground">
                            <strong>Joined:</strong>{" "}
                            {item?.createdAt
                              ? new Date(item.createdAt).toLocaleDateString()
                              : "N/A"}
                          </span>
                          <span className="text-muted-foreground">
                            <strong>Updated:</strong>{" "}
                            {item?.updatedAt
                              ? new Date(item.updatedAt).toLocaleDateString()
                              : "N/A"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>
                            {item?.createdAt
                              ? new Date(item.createdAt).toLocaleTimeString()
                              : "N/A"}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )) || []
              )}
            </div>

            {/* Pagination */}
            {(waitlist?.length || 0) > 0 && (
              <div className="flex justify-center items-center gap-4 mt-6">
                <Button
                  className=" hover:bg-[#CC5500]/90"
                  variant="outline"
                  size="sm"
                  disabled={wlPage <= 1}
                  onClick={() => setWlPage((p) => Math.max(1, p - 1))}
                >
                  Previous
                </Button>
                <span className="text-sm text-muted-foreground">
                  Page {wlPage} of {wlTotalPages || 1}
                </span>
                <Button
                  className=" hover:bg-[#CC5500]/90"
                  variant="outline"
                  size="sm"
                  disabled={wlPage >= (wlTotalPages || 1)}
                  onClick={() => setWlPage((p) => p + 1)}
                >
                  Next
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="requests" className="space-y-4">
            <div className="grid gap-4">
              {serviceRequests?.map((request) => (
                <Card key={request?.id} className="luxury-card">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          {request?.watchBrand || ""}{" "}
                          {request?.watchModel || ""}
                          <Badge
                            className={getStatusColor(request?.status || "")}
                          >
                            {request?.status || "unknown"}
                          </Badge>
                        </CardTitle>
                        <CardDescription>
                          Reference: {request?.referenceId || "N/A"} • Consumer
                          ID: {request?.consumerId || "N/A"}
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
                      {request?.description || "No description available"}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm">
                        <span>
                          Created:{" "}
                          {request?.createdAt
                            ? new Date(request.createdAt).toLocaleDateString()
                            : "N/A"}
                        </span>
                        <span>
                          Delivery: {request?.deliveryPreference || "N/A"}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          Monitor
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600"
                        >
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
                <Button className="luxury-button">Save Settings</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
