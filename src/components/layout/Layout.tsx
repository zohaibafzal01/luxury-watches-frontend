import React from "react";
import { Header } from "./Header";
import Footer from "./Footer";
import { User } from "lucide-react";
import { useSelector } from "react-redux";
import { selectUserInfo } from "@/redux/selectors/userSelectors";

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const isAuthenticated = !!User;
  const user = useSelector(selectUserInfo);
  return (
    <div
      className={`min-h-screen   ${
        isAuthenticated && user ? "bg-white" : "bg-[#4A4A4A]"
      }`}
    >
      <Header />
      <main className="flex-1">{children}</main>
    </div>
  );
};
