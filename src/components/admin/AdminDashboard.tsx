import React, { useState, useEffect, useRef } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
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
  Camera,
  X,
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

  const [page, setPage] = useState(1);
  const [limit] = useState(5); 
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [usersLoading, setUsersLoading] = useState(false);

  const [waitlist, setWaitlist] = useState<WaitlistItem[]>([]);
  const [wlPage, setWlPage] = useState(1);
  const [wlLimit] = useState(10); 
  const [wlTotalPages, setWlTotalPages] = useState(1);
  const [wlTotal, setWlTotal] = useState(0);
  const [wlLoading, setWlLoading] = useState(false);

  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editFormData, setEditFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    companyName: "",
    phoneNo: "",
    status: "active",
    address: "",
    bio: "",
    profilePicture: "",
  });

  const [showActivateConfirm, setShowActivateConfirm] = useState(false);
  const [showDeactivateConfirm, setShowDeactivateConfirm] = useState(false);
  const [userToAction, setUserToAction] = useState<User | null>(null);
  const [isProcessingAction, setIsProcessingAction] = useState(false);

  // Waiting list delete confirmation state
  const [showDeleteWaitlistConfirm, setShowDeleteWaitlistConfirm] =
    useState(false);
  const [waitlistItemToDelete, setWaitlistItemToDelete] =
    useState<WaitlistItem | null>(null);

  // Image handling state and ref
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(
    null
  );

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
          role: user?.accountType, 
          accountType: user?.accountType, 
          isEmailVerified: user?.status === "active", 
          createdAt: user?.createdAt,
          updatedAt: user?.updatedAt,
          phoneNo: user?.phoneNo,
          companyName: user?.companyName || "",
          lastLogin: user?.lastLogin,
          status: user?.status,
          address: user?.address,
          bio: user?.bio,
          profilePicture: user?.profilePicture,
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

  useEffect(() => {
    fetchUsers();
  }, [page]);

  useEffect(() => {
    fetchWaitlist();
  }, [wlPage]);

  const formatProfileImageUrl = (imageData?: string) => {
    if (!imageData) return undefined;

    if (imageData.startsWith("data:image/") || imageData.startsWith("http")) {
      return imageData;
    }

    return `data:image/jpeg;base64,${imageData}`;
  };

  const getInitials = (firstName?: string, lastName?: string) =>
    `${firstName?.[0] ?? ""}${lastName?.[0] ?? ""}`.toUpperCase();

  const handleCameraClick = () => {
    fileInputRef.current?.click();
  };

  const removeProfileImage = () => {
    setProfileImagePreview(null);
    setEditFormData((prev) => ({
      ...prev,
      profilePicture: "REMOVE", 
    }));

    toast({
      title: "Image Removed",
      description: "Click 'Save Changes' to remove profile picture.",
    });
  };

  const handleViewUser = (user: User) => {
    setSelectedUser(user);
    setIsUserModalOpen(true);
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setProfileImagePreview(null); 
    setEditFormData({
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      email: user.email || "",
      companyName: user.companyName || "",
      phoneNo: user.phoneNo || "",
      status: user.status || "active",
      address: user.address || "",
      bio: user.bio || "",
      profilePicture: user.profilePicture || "",
    });
    setIsEditModalOpen(true);
  };

  // Handle form input changes
  const handleEditFormChange = (field: string, value: string) => {
    setEditFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleProfilePictureChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
    if (!allowedTypes.includes(file.type.toLowerCase())) {
      toast({
        title: "Invalid File Format",
        description: "Please select only JPG or PNG image files.",
        variant: "destructive",
      });
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return;
    }

    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      toast({
        title: "File Too Large",
        description:
          "Image size should be less than 10MB. Please choose a smaller file.",
        variant: "destructive",
      });
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return;
    }

    setIsUploadingImage(true);

    try {
      // Convert to base64
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        // Remove the data:image/...;base64, prefix to get just the base64 string
        const base64String = result.split(",")[1];

        // Create preview URL for immediate display
        const previewUrl = URL.createObjectURL(file);
        setProfileImagePreview(previewUrl);

        // Update editFormData with base64 string
        setEditFormData((prev) => ({
          ...prev,
          profilePicture: base64String,
        }));

        toast({
          title: "Image Selected",
          description: "Click 'Save Changes' to update profile picture.",
        });
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Error processing image:", error);
      toast({
        title: "Error",
        description: "Failed to process image. Please try again.",
        variant: "destructive",
      });
      // Reset preview on error
      setProfileImagePreview(null);
    } finally {
      setIsUploadingImage(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  // Handle save edited user
  const handleSaveEditedUser = async () => {
    if (!editingUser) return;

    try {
      setIsProcessingAction(true);

      // Prepare the data for API call, handling the REMOVE case
      const updateData = {
        ...editFormData,
        profilePicture:
          editFormData.profilePicture === "REMOVE"
            ? ""
            : editFormData.profilePicture || undefined,
      };

      // Call the API to update the user
      await adminApi.updateUser(editingUser.id, updateData);

      toast({
        title: "User Updated",
        description: `${editFormData.firstName} ${editFormData.lastName} has been updated successfully.`,
      });

      // Refetch users to get updated data
      await fetchUsers();

      // Update selected user if details modal is open
      if (selectedUser?.id === editingUser.id) {
        setSelectedUser({
          ...selectedUser,
          ...editFormData,
          // Ensure we maintain the original structure
          role:
            editFormData.status === "active"
              ? selectedUser.role
              : selectedUser.role,
          accountType: selectedUser.accountType,
        });
      }

      // Close modal and clear state
      setIsEditModalOpen(false);
      setEditingUser(null);
      setProfileImagePreview(null); 
      setEditFormData({
        firstName: "",
        lastName: "",
        email: "",
        companyName: "",
        phoneNo: "",
        status: "active",
        address: "",
        bio: "",
        profilePicture: "",
      });
    } catch (error: any) {
      toast({
        title: "Update Failed",
        description:
          error?.message || "Failed to update user. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessingAction(false);
    }
  };

  // Show confirmation modals
  const showActivateConfirmation = (user: User) => {
    setUserToAction(user);
    setShowActivateConfirm(true);
  };

  const showDeactivateConfirmation = (user: User) => {
    setUserToAction(user);
    setShowDeactivateConfirm(true);
  };

  // Show waiting list delete confirmation
  const showDeleteWaitlistConfirmation = (item: WaitlistItem) => {
    setWaitlistItemToDelete(item);
    setShowDeleteWaitlistConfirm(true);
  };

  // Handle waiting list item deletion
  const handleDeleteWaitlistItem = async () => {
    if (!waitlistItemToDelete) return;

    try {
      setIsProcessingAction(true);
      await waitingListApi.deleteWaitingList(waitlistItemToDelete.id);
      toast({
        title: "Item Removed",
        description: `${waitlistItemToDelete.email} has been removed from the waiting list.`,
      });

      // Refetch waitlist to get updated data
      await fetchWaitlist();

      // Close modal only on success
      setShowDeleteWaitlistConfirm(false);
      setWaitlistItemToDelete(null);
    } catch (error: any) {
      toast({
        title: "Removal Failed",
        description:
          error?.message || "Failed to remove item. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessingAction(false);
    }
  };

  // Handle user activation (confirmed)
  const handleActivateUser = async () => {
    if (!userToAction) return;

    try {
      setIsProcessingAction(true);
      await adminApi.activateUser(userToAction.email);
      toast({
        title: "User Activated",
        description: `${userToAction.firstName} ${userToAction.lastName} has been activated successfully.`,
      });

      // Refetch users to get updated data
      await fetchUsers();

      // Update selected user if modal is open
      if (selectedUser?.id === userToAction.id) {
        setSelectedUser({ ...userToAction, status: "active" });
      }

      // Close modal only on success
      setShowActivateConfirm(false);
      setUserToAction(null);
    } catch (error: any) {
      toast({
        title: "Activation Failed",
        description:
          error?.message || "Failed to activate user. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessingAction(false);
    }
  };

  // Handle user deactivation (confirmed)
  const handleDeactivateUser = async () => {
    if (!userToAction) return;

    try {
      setIsProcessingAction(true);
      await adminApi.deactivateUser(userToAction.email);
      toast({
        title: "User Deactivated",
        description: `${userToAction.firstName} ${userToAction.lastName} has been deactivated successfully.`,
      });

      // Refetch users to get updated data
      await fetchUsers();

      // Update selected user if modal is open
      if (selectedUser?.id === userToAction.id) {
        setSelectedUser({ ...userToAction, status: "inactive" });
      }

      // Close modal only on success
      setShowDeactivateConfirm(false);
      setUserToAction(null);
    } catch (error: any) {
      toast({
        title: "Deactivation Failed",
        description:
          error?.message || "Failed to deactivate user. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessingAction(false);
    }
  };

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
                            onClick={() => handleViewUser(user)}
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            View
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="hover:bg-[#CC5500]"
                            onClick={() => handleEditUser(user)}
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
                              onClick={() => showActivateConfirmation(user)}
                            >
                              <UserCheck className="w-4 h-4 mr-2" />
                              Activate
                            </Button>
                          ) : (
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-600 hover:bg-red-500 hover:text-white"
                              onClick={() => showDeactivateConfirmation(user)}
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

            {/* Waitlist Items Table */}
            <div className="space-y-4">
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
                <Card className="luxury-card">
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-b border-gray-200">
                          <TableHead className="font-semibold text-gray-700 px-6 py-4">
                            <div className="flex items-center gap-2">
                              <Mail className="w-4 h-4" />
                              Email
                            </div>
                          </TableHead>
                          <TableHead className="font-semibold text-gray-700 px-6 py-4">
                            Join Date
                          </TableHead>
                          <TableHead className="font-semibold text-gray-700 px-6 py-4 text-right">
                            Actions
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {waitlist?.map((item, index) => (
                          <TableRow
                            key={item?.id}
                            className={`border-b border-gray-100 hover:bg-gray-50/50 transition-colors ${
                              index % 2 === 0 ? "bg-white" : "bg-gray-50/30"
                            }`}
                          >
                            <TableCell className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#CC5500] to-[#CC5500]/80 flex items-center justify-center text-white text-sm font-bold">
                                  {item?.email?.charAt(0)?.toUpperCase() || "U"}
                                </div>
                                <div>
                                  <p className="font-medium text-gray-900">
                                    {item?.email || "N/A"}
                                  </p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="px-6 py-4">
                              <div className="space-y-1">
                                <p className="text-sm font-medium text-gray-900">
                                  {item?.createdAt
                                    ? new Date(
                                        item.createdAt
                                      ).toLocaleDateString("en-US", {
                                        year: "numeric",
                                        month: "short",
                                        day: "numeric",
                                      })
                                    : "N/A"}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {item?.createdAt
                                    ? new Date(
                                        item.createdAt
                                      ).toLocaleTimeString("en-US", {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                      })
                                    : "N/A"}
                                </p>
                              </div>
                            </TableCell>
                            <TableCell className="px-6 py-4 text-right">
                              <div className="flex gap-2 justify-end">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="hover:bg-green-500 hover:text-white border-green-500 text-green-600"
                                >
                                  <UserCheck className="w-4 h-4 mr-2" />
                                  Invite
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="hover:bg-red-500 hover:text-white border-red-500 text-red-600"
                                  onClick={() =>
                                    showDeleteWaitlistConfirmation(item)
                                  }
                                >
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  Remove
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        )) || []}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
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

      {/* Edit User Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="luxury-title text-2xl">
              Edit User
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Update user information and account details
            </DialogDescription>
          </DialogHeader>
          {editingUser && (
            <div className="space-y-6">
              {/* Profile Picture - At Top */}
              <div className="space-y-4">
                <label className="text-sm font-medium text-gray-700">
                  Profile Picture
                </label>
                <div className="flex items-center space-x-4">
                  {/* Current Profile Picture Preview with Avatar */}
                  <div className="relative">
                    <Avatar className="h-20 w-20 border-4 border-primary/20">
                      <AvatarImage
                        src={
                          profileImagePreview ||
                          (editFormData.profilePicture === "REMOVE"
                            ? undefined
                            : formatProfileImageUrl(
                                editFormData.profilePicture
                              ))
                        }
                        alt={editFormData.firstName}
                      />
                      <AvatarFallback className="bg-primary/10 text-primary font-medium text-lg">
                        {getInitials(
                          editFormData.firstName,
                          editFormData.lastName
                        )}
                      </AvatarFallback>
                    </Avatar>

                    {/* Hidden file input */}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/jpg,image/png"
                      onChange={handleProfilePictureChange}
                      className="hidden"
                    />

                    {/* Camera/Upload button - only show if no image exists or image is marked for removal */}
                    {(!editFormData.profilePicture ||
                      editFormData.profilePicture === "REMOVE") &&
                      !profileImagePreview && (
                        <Button
                          variant="outline"
                          size="icon"
                          className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full"
                          onClick={handleCameraClick}
                          disabled={isUploadingImage}
                        >
                          {isUploadingImage ? (
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                          ) : (
                            <Camera className="h-4 w-4" />
                          )}
                        </Button>
                      )}

                    {/* Remove image button - only show if there's an image and it's not marked for removal */}
                    {((editFormData.profilePicture &&
                      editFormData.profilePicture !== "REMOVE") ||
                      profileImagePreview) && (
                      <Button
                        variant="outline"
                        size="icon"
                        className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-red-500 hover:bg-red-600 border-red-500"
                        onClick={removeProfileImage}
                        disabled={isUploadingImage}
                      >
                        <X className="h-3 w-3 text-white" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* First Name */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    First Name
                  </label>
                  <Input
                    value={editFormData.firstName}
                    onChange={(e) =>
                      handleEditFormChange("firstName", e.target.value)
                    }
                    placeholder="Enter first name"
                    className="luxury-input"
                  />
                </div>

                {/* Last Name */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Last Name
                  </label>
                  <Input
                    value={editFormData.lastName}
                    onChange={(e) =>
                      handleEditFormChange("lastName", e.target.value)
                    }
                    placeholder="Enter last name"
                    className="luxury-input"
                  />
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Email Address
                  </label>
                  <Input
                    type="email"
                    value={editFormData.email}
                    onChange={(e) =>
                      handleEditFormChange("email", e.target.value)
                    }
                    placeholder="Enter email address"
                    className="luxury-input"
                  />
                </div>

                {/* Phone Number */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Phone Number
                  </label>
                  <Input
                    value={editFormData.phoneNo}
                    onChange={(e) =>
                      handleEditFormChange("phoneNo", e.target.value)
                    }
                    placeholder="Enter phone number"
                    className="luxury-input"
                  />
                </div>

                {/* Company Name */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Company Name
                  </label>
                  <Input
                    value={editFormData.companyName}
                    onChange={(e) =>
                      handleEditFormChange("companyName", e.target.value)
                    }
                    placeholder="Enter company name"
                    className="luxury-input"
                  />
                </div>

                {/* Status */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Status
                  </label>
                  <Select
                    value={editFormData.status}
                    onValueChange={(value) =>
                      handleEditFormChange("status", value)
                    }
                  >
                    <SelectTrigger className="luxury-input">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="suspended">Suspended</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Address - Full Width */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Address
                </label>
                <Input
                  value={editFormData.address}
                  onChange={(e) =>
                    handleEditFormChange("address", e.target.value)
                  }
                  placeholder="Enter address"
                  className="luxury-input"
                />
              </div>

              {/* Bio - Full Width */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Bio</label>
                <Textarea
                  value={editFormData.bio}
                  onChange={(e) => handleEditFormChange("bio", e.target.value)}
                  placeholder="Enter bio"
                  className="luxury-input min-h-[100px]"
                  rows={4}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsEditModalOpen(false);
                    setEditingUser(null);
                    setProfileImagePreview(null); // Clear image preview
                  }}
                  disabled={isProcessingAction}
                  className="px-6 py-2 hover:bg-[#CC5500]"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveEditedUser}
                  disabled={isProcessingAction}
                  className="px-6 py-2 bg-[#CC5500] hover:bg-[#b84a00] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessingAction ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* User Details Modal */}
      <Dialog open={isUserModalOpen} onOpenChange={setIsUserModalOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="luxury-title text-2xl">
              User Profile
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Complete user information and account details
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-6">
              {/* Profile Header */}
              <div className="flex items-center space-x-4 p-6 bg-gradient-to-br from-[#CC5500]/5 via-[#CC5500]/10 to-[#CC5500]/5 rounded-xl border border-[#CC5500]/20">
                <div className="relative">
                  <Avatar className="h-24 w-24 ring-4 ring-white shadow-lg">
                    <AvatarImage
                      src={formatProfileImageUrl(selectedUser?.profilePicture)}
                      alt={selectedUser?.firstName}
                    />
                    <AvatarFallback className="bg-gradient-to-br from-[#CC5500] to-[#CC5500]/80 text-white text-2xl font-bold">
                      {getInitials(
                        selectedUser?.firstName,
                        selectedUser?.lastName
                      )}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-1 -right-1">
                    <Badge
                      variant={
                        selectedUser?.status === "active"
                          ? "default"
                          : "secondary"
                      }
                      className={`text-xs px-2 py-1 ${
                        selectedUser?.status === "active"
                          ? "bg-green-500 hover:bg-green-600"
                          : "bg-gray-500"
                      }`}
                    >
                      {selectedUser?.status?.toUpperCase() || "UNKNOWN"}
                    </Badge>
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900">
                    {selectedUser?.firstName || "N/A"}{" "}
                    {selectedUser?.lastName || "N/A"}
                  </h3>
                  <p className="text-gray-600 text-base font-medium">
                    {selectedUser?.email || "N/A"}
                  </p>
                  <p className="text-[#CC5500] text-base font-semibold capitalize mt-1">
                    {selectedUser?.role || selectedUser?.accountType || "N/A"}
                  </p>
                </div>
              </div>

              {/* Information Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Personal Information */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-lg text-gray-900 flex items-center border-b border-gray-200 pb-2">
                    <div className="w-3 h-3 bg-[#CC5500] rounded-full mr-3"></div>
                    Personal Details
                  </h4>
                  <div className="space-y-4">
                    <div>
                      <span className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                        User ID
                      </span>
                      <p className="text-base font-medium text-gray-900 mt-1 select-all">
                        {selectedUser?.id || "N/A"}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                        Name
                      </span>
                      <p className="text-base font-medium text-gray-900 mt-1">
                        {selectedUser?.firstName || "Not provided"}{" "}
                        {selectedUser?.lastName || ""}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                        Email Address
                      </span>
                      <p className="text-base font-medium text-gray-900 mt-1 break-all">
                        {selectedUser?.email || "Not provided"}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                        Phone Number
                      </span>
                      <p className="text-base font-medium text-gray-900 mt-1">
                        {selectedUser?.phoneNo || "Not provided"}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                        Address
                      </span>
                      <p className="text-base font-medium text-gray-900 mt-1">
                        {selectedUser?.address || "Not provided"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Account Information */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-lg text-gray-900 flex items-center border-b border-gray-200 pb-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                    Account Details
                  </h4>
                  <div className="space-y-4">
                    <div>
                      <span className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                        Account Type
                      </span>
                      <p className="text-base font-medium text-gray-900 mt-1 capitalize">
                        {selectedUser?.role ||
                          selectedUser?.accountType ||
                          "Not specified"}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                        Company Name
                      </span>
                      <p className="text-base font-medium text-gray-900 mt-1">
                        {selectedUser?.companyName || "Not provided"}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                        Bio
                      </span>
                      <p className="text-base font-medium text-gray-900 mt-1">
                        {selectedUser?.bio || "Not provided"}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                        Account Status
                      </span>
                      <div className="mt-1">
                        <Badge
                          variant={
                            selectedUser?.status === "active"
                              ? "default"
                              : "secondary"
                          }
                          className={`text-sm px-3 py-1 ${
                            selectedUser?.status === "active"
                              ? "bg-green-500 hover:bg-green-600"
                              : "bg-gray-500"
                          }`}
                        >
                          {selectedUser?.status?.toUpperCase() || "UNKNOWN"}
                        </Badge>
                      </div>
                    </div>
                    <div>
                      <span className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                        Last Updated
                      </span>
                      <p className="text-base font-medium text-gray-900 mt-1">
                        {selectedUser?.updatedAt
                          ? new Date(selectedUser.updatedAt).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )
                          : "Not available"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Close Button */}
              <div className="flex justify-end pt-4 border-t border-gray-200">
                <Button
                  variant="outline"
                  onClick={() => setIsUserModalOpen(false)}
                  className="px-6 py-2 hover:bg-[#CC5500]"
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Activate User Confirmation Modal */}
      <AlertDialog
        open={showActivateConfirm}
        onOpenChange={setShowActivateConfirm}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Activate User</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to activate {userToAction?.firstName}{" "}
              {userToAction?.lastName}? This will allow them to access their
              account and use the platform.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              className="hover:bg-[#CC5500]"
              disabled={isProcessingAction}
              onClick={() => {
                setShowActivateConfirm(false);
                setUserToAction(null);
              }}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleActivateUser}
              disabled={isProcessingAction}
              className="bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessingAction ? "Activating User..." : "Activate User"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Deactivate User Confirmation Modal */}
      <AlertDialog
        open={showDeactivateConfirm}
        onOpenChange={setShowDeactivateConfirm}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Suspend User</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to suspend {userToAction?.firstName}{" "}
              {userToAction?.lastName}? This will prevent them from accessing
              their account until reactivated.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              className="hover:bg-[#CC5500]"
              disabled={isProcessingAction}
              onClick={() => {
                setShowDeactivateConfirm(false);
                setUserToAction(null);
              }}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeactivateUser}
              disabled={isProcessingAction}
              className="bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessingAction ? "Suspending User..." : "Suspend User"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Waitlist Item Confirmation Modal */}
      <AlertDialog
        open={showDeleteWaitlistConfirm}
        onOpenChange={setShowDeleteWaitlistConfirm}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove from Waiting List</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove {waitlistItemToDelete?.email} from
              the waiting list? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              className="hover:bg-[#CC5500]"
              disabled={isProcessingAction}
              onClick={() => {
                setShowDeleteWaitlistConfirm(false);
                setWaitlistItemToDelete(null);
              }}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteWaitlistItem}
              disabled={isProcessingAction}
              className="bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessingAction ? "Removing..." : "Remove"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
