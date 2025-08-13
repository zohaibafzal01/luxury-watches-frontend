import React from "react";
import { Header } from "./Header";
import Footer from "./Footer";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUserInfo } from "@/redux/selectors/userSelectors";

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const user = useSelector(selectUserInfo);
  const isAuthenticated = !!user;

  return (
    <div
      className={`min-h-screen   ${
        location.pathname === "/"
          ? "bg-[#4A4A4A]"
          : isAuthenticated && user
          ? "bg-white"
          : "bg-[#4A4A4A]"
      }`}
    >
      <Header />
      <main className="flex-1">{children}</main>
    </div>
  );
};
