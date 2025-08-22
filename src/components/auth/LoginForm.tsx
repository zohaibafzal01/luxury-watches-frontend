import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff, Crown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import authApi from "@/api/auth";
import { useDispatch } from "react-redux";
import { login } from "@/redux/slices/userSlice";
import wrstopia from "../../../public/icon.svg";

export const LoginForm: React.FC = () => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { toast } = useToast();
  const dispatch = useDispatch();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const { email, password } = credentials;

    try {
      let response;

      try {
        response = await authApi.dealerLogin(email, password);
      } catch {
        try {
          response = await authApi.consumerLogin(email, password);
        } catch {
          throw new Error("Invalid email or password.");
        }
      }

      if (!response || !response.success) {
        throw new Error("Login failed. Please try again.");
      }

      const { data: userData, accessToken, refreshToken } = response;
      const accountType = userData?.accountType?.toLowerCase();
      const status = userData?.status?.toUpperCase();

      if (accountType === "admin") {
        toast({
          title: "Login Restricted",
          description: "Please use the admin portal to sign in.",
          variant: "destructive",
        });
        return;
      }

      if (status === "PENDING") {
        toast({
          title: "Account Pending",
          description: "Please wait for admin approval.",
        });
        return;
      }

      if (status === "INACTIVE") {
        toast({
          title: "Account Suspended",
          description: "Please contact support.",
        });
        return;
      }

      // Store tokens and user info
      localStorage.setItem("authToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem(
        "user",
        JSON.stringify({
          ...userData,
          role: userData?.accountType?.toLowerCase(),
          token: accessToken,
        })
      );

      dispatch(
        login({
          ...userData,
          role: userData?.accountType?.toLowerCase(),
          token: accessToken,
        })
      );

      toast({
        title: "Welcome back!",
        description: "Redirecting to your dashboard...",
      });

      setTimeout(() => {
        if (accountType === "dealer") {
          navigate("/dealer/dashboard");
        } else {
          navigate("/dashboard");
        }
      }, 1000);
    } catch (err: any) {
      const message = err?.message || "Login failed. Please try again.";
      setError(message);
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md luxury-card">
        <CardHeader className="text-center">
          <div className="w-[24px] h-[16px] flex items-center justify-center mx-auto mb-4">
            <img src={wrstopia} alt="" />
          </div>
          <CardTitle className="luxury-title text-2xl">Welcome Back</CardTitle>
          <CardDescription>
            Sign in to your Wrstopia account to continue your luxury watch
            journey
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={credentials.email}
                onChange={handleChange}
                className="luxury-input"
                placeholder="your@email.com"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={credentials.password}
                  onChange={handleChange}
                  className="luxury-input pr-10"
                  placeholder="Enter your password"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent hover:text-muted-foreground"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <Link
                to="/forgot-password"
                className="text-sm text-[#CC5500] hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              className="w-full bg-[#CC5500] text-white hover:bg-[#CC5500]/90"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>

            <div className="text-center">
              <span className="text-sm text-muted-foreground">
                Don&apos;t have an account?{" "}
                <Link
                  to="/register"
                  className="text-[#CC5500] hover:underline font-medium"
                >
                  Sign up
                </Link>
              </span>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
