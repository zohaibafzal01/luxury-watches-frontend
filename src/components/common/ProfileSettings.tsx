import React, { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Building, Camera, Save, Eye, EyeOff, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { selectUserInfo } from "@/redux/selectors/userSelectors";
import userApi from "@/api/user";
import { useDispatch } from "react-redux";
import { login } from "@/redux/slices/userSlice";
import authApi from "@/api/auth";

export const ProfileSettings: React.FC = () => {
  const { toast } = useToast();
  const user = useSelector(selectUserInfo);
  const dispatch = useDispatch();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(
    null
  );

  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phone: user?.phoneNo || "",
    company: user?.companyName || "",
    bio: user?.bio || "",
    address: user?.address || "",
    profilePicture: "", // Store base64 string here
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Cleanup effect for profile image preview
  useEffect(() => {
    return () => {
      if (profileImagePreview && profileImagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(profileImagePreview);
      }
    };
  }, [profileImagePreview]);

  // Image handling functions
  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        if (typeof reader.result === "string") {
          // Remove the data:image/...;base64, prefix to get just the base64 string
          const base64String = reader.result.split(",")[1];
          resolve(base64String);
        } else {
          reject(new Error("Failed to convert file to base64"));
        }
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type - only allow JPG and PNG
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
    if (!allowedTypes.includes(file.type.toLowerCase())) {
      toast({
        title: "Invalid File Format",
        description: "Please select only JPG or PNG image files.",
        variant: "destructive",
      });
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return;
    }

    // Validate file size (10MB limit)
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
      const base64String = await convertToBase64(file);

      // Create preview URL for immediate display
      const previewUrl = URL.createObjectURL(file);
      setProfileImagePreview(previewUrl);

      // Update profileData with base64 string (will be sent with profile update)
      setProfileData((prev) => ({
        ...prev,
        profilePicture: base64String,
      }));

      toast({
        title: "Image Selected",
        description: "Click 'Save Changes' to update your profile picture.",
      });
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

  const handleCameraClick = () => {
    fileInputRef.current?.click();
  };

  const removeProfileImage = () => {
    setProfileImagePreview(null);
    setProfileData((prev) => ({
      ...prev,
      profilePicture: "REMOVE", // Special marker to indicate removal
    }));

    toast({
      title: "Image Removed",
      description: "Click 'Save Changes' to remove your profile picture.",
    });
  };

  // Helper function to format profile image URL
  const formatProfileImageUrl = (imageData?: string) => {
    if (!imageData) return undefined;

    // If it's already a data URL, return as is
    if (imageData.startsWith("data:image/") || imageData.startsWith("http")) {
      return imageData;
    }

    // If it's just a base64 string, convert to data URL
    return `data:image/jpeg;base64,${imageData}`;
  };

  const getInitials = (firstName?: string, lastName?: string) =>
    `${firstName?.[0] ?? ""}${lastName?.[0] ?? ""}`.toUpperCase();

  const getRoleColor = (role: string) => {
    const colors = {
      admin: "text-white",
      dealer: "text-white",
      wholesaler: "text-green-400",
      consumer: "text-white",
    };
    return colors[role as keyof typeof colors] || "text-gray-400";
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await userApi.userUpdate(
        user?.id,
        profileData?.firstName,
        profileData?.lastName,
        profileData?.email,
        profileData?.phone,
        user?.status,
        profileData?.company,
        profileData?.bio,
        profileData?.address,
        profileData?.profilePicture === "REMOVE"
          ? ""
          : profileData?.profilePicture || undefined // Send empty string to remove
      );

      console.log("API Response:", response); // Debug log

      // Store the raw profilePicture from server response
      let profileImageData = user?.profilePicture; // Keep existing by default

      if (profileData?.profilePicture === "REMOVE") {
        // User wants to remove the profile picture
        profileImageData = undefined;
      } else if (response?.data?.profilePicture) {
        // Store the raw base64 string from server
        profileImageData = response.data.profilePicture;
      } else if (
        profileData?.profilePicture &&
        profileData.profilePicture !== ""
      ) {
        // Store the raw base64 string from local data
        profileImageData = profileData.profilePicture;
      }

      console.log("Stored profile image data:", profileImageData); // Debug log

      const updatedUser = {
        ...user,
        firstName: profileData?.firstName,
        lastName: profileData?.lastName,
        email: profileData?.email,
        phoneNo: profileData?.phone,
        companyName: profileData?.company,
        bio: profileData?.bio,
        address: profileData?.address,
        profilePicture: profileImageData, // Store raw base64 string
      };

      dispatch(login(updatedUser));
      localStorage.setItem("user", JSON.stringify(updatedUser));

      // Don't clear preview immediately, let it persist to show the update worked
      // Clear it after a short delay
      setTimeout(() => {
        setProfileImagePreview(null);
        setProfileData((prev) => ({
          ...prev,
          profilePicture: "",
        }));
      }, 1000);

      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });
    } catch (error) {
      console.error("Profile update error:", error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordData?.currentPassword?.length === 0) {
      toast({
        title: "Error",
        description: "Current password cannot be empty.",
        variant: "destructive",
      });
      return;
    }

    if (passwordData?.newPassword !== passwordData?.confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords do not match.",
        variant: "destructive",
      });
      return;
    }

    if (passwordData?.newPassword?.length < 8) {
      toast({
        title: "Error",
        description: "Password must be at least 8 characters long.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      await authApi.changePassword(
        passwordData?.currentPassword,
        passwordData?.newPassword
      );

      toast({
        title: "Password Changed",
        description: "Your password has been successfully updated.",
      });

      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error: any) {
      const errorMsg =
        error?.response?.data?.errorMessage?.[0] ||
        error?.response?.data?.message ||
        "Failed to change password. Please try again.";

      toast({
        title: "Error",
        description: errorMsg,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Please log in to access profile settings.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 p-4">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-8">
          <h1 className="luxury-title text-3xl mb-2">Profile Settings</h1>
          <p className="text-muted-foreground">
            Manage your account settings and preferences
          </p>
        </div>

        <Card className="luxury-card mb-8">
          <CardContent className="p-6">
            <div className="flex items-center gap-6">
              <div className="relative">
                <Avatar className="h-24 w-24 border-4 border-primary/20">
                  <AvatarImage
                    src={
                      profileImagePreview ||
                      (profileData.profilePicture === "REMOVE"
                        ? undefined
                        : formatProfileImageUrl(user?.profilePicture))
                    }
                    alt={user?.firstName}
                  />
                  <AvatarFallback className="bg-primary/10 text-primary font-medium text-lg">
                    {getInitials(user.firstName, user.lastName)}
                  </AvatarFallback>
                </Avatar>

                {/* Hidden file input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/jpg,image/png"
                  onChange={handleImageUpload}
                  className="hidden"
                />

                {/* Camera/Upload button - only show if no image exists or image is marked for removal */}
                {(!user?.profilePicture ||
                  profileData.profilePicture === "REMOVE") &&
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
                {((user?.profilePicture &&
                  profileData.profilePicture !== "REMOVE") ||
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
              <div className="flex-1">
                <h2 className="text-2xl font-bold">
                  {user.firstName} {user.lastName}
                </h2>
                <p className="text-muted-foreground">{user.email}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge
                    className={`capitalize bg-[#CC5500] hover:bg-[#CC5500] ${getRoleColor(
                      user.role
                    )}`}
                  >
                    {user.role}
                  </Badge>
                  {user.companyName && (
                    <Badge variant="outline">
                      <Building className="w-3 h-3 mr-1" />
                      {user.companyName}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card className="luxury-card">
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  Update your personal information and contact details
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleProfileUpdate} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        value={profileData.firstName}
                        onChange={(e) =>
                          setProfileData((p) => ({
                            ...p,
                            firstName: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        value={profileData.lastName}
                        onChange={(e) =>
                          setProfileData((p) => ({
                            ...p,
                            lastName: e.target.value,
                          }))
                        }
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      readOnly={true}
                      value={profileData.email}
                      onChange={(e) =>
                        setProfileData((p) => ({ ...p, email: e.target.value }))
                      }
                      className="cursor-not-allowed bg-gray-300/20"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        value={profileData.phone}
                        onChange={(e) =>
                          setProfileData((p) => ({
                            ...p,
                            phone: e.target.value,
                          }))
                        }
                      />
                    </div>
                    {user.role === "dealer" && (
                      <div className="space-y-2">
                        <Label htmlFor="company">Company Name</Label>
                        <Input
                          id="company"
                          value={profileData.company}
                          onChange={(e) =>
                            setProfileData((p) => ({
                              ...p,
                              company: e.target.value,
                            }))
                          }
                        />
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Textarea
                      id="address"
                      rows={3}
                      value={profileData.address}
                      onChange={(e) =>
                        setProfileData((p) => ({
                          ...p,
                          address: e.target.value,
                        }))
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      rows={4}
                      value={profileData.bio}
                      onChange={(e) =>
                        setProfileData((p) => ({ ...p, bio: e.target.value }))
                      }
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="bg-[#CC5500] text-white hover:bg-[#CC5500]/90"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {isLoading ? "Saving..." : "Save Changes"}
                    {(profileImagePreview || profileData.profilePicture) && (
                      <span className="ml-2 h-2 w-2 bg-green-500 rounded-full animate-pulse"></span>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security">
            <Card className="luxury-card">
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>
                  Manage your password and security preferences
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePasswordChange} className="space-y-6">
                  {[
                    {
                      label: "Current Password",
                      field: "currentPassword",
                      visible: showCurrentPassword,
                      setVisible: setShowCurrentPassword,
                    },
                    {
                      label: "New Password",
                      field: "newPassword",
                      visible: showNewPassword,
                      setVisible: setShowNewPassword,
                    },
                    {
                      label: "Confirm New Password",
                      field: "confirmPassword",
                      visible: showConfirmPassword,
                      setVisible: setShowConfirmPassword,
                    },
                  ].map(({ label, field, visible, setVisible }) => (
                    <div className="space-y-2" key={field}>
                      <Label htmlFor={field}>{label}</Label>
                      <div className="relative">
                        <Input
                          id={field}
                          type={visible ? "text" : "password"}
                          value={
                            passwordData[field as keyof typeof passwordData]
                          }
                          onChange={(e) =>
                            setPasswordData((p) => ({
                              ...p,
                              [field]: e.target.value,
                            }))
                          }
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 hover:bg-[#CC5500]/90"
                          onClick={() => setVisible(!visible)}
                        >
                          {visible ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  ))}

                  <p className="text-sm text-muted-foreground">
                    Password must be at least 8 characters and include one
                    uppercase letter, one number, and one special character.
                  </p>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="bg-[#CC5500] text-white hover:bg-[#CC5500]/90 luxury-button"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {isLoading ? "Changing..." : "Change Password"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
