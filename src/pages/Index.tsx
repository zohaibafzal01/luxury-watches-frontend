import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { selectUserInfo } from "@/redux/selectors/userSelectors";
import {
  PremiumLogo,
  FullyInsuredLogo,
  CertifiedDealersLogo,
  MailLogo,
} from "@/svg";

import {
  Mail,
  Crown,
  Clock,
  Shield,
  Users,
  CheckCircle,
  ArrowRight,
  Star,
} from "lucide-react";
import FAQSection from "@/components/ui/faq";
import TheProcess from "@/components/ui/theprocess";
import WhatWeOffer from "@/components/ui/whatweoffer";
import WhyChooseBid from "@/components/ui/whychoosebid";
import BuildToLast from "@/components/ui/buildtolast";
import Footer from "@/components/layout/Footer";

// Helper function to check authentication from localStorage
const checkAuthFromStorage = () => {
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
  const user = localStorage.getItem("user");
  return {
    isAuthenticated,
    user: user ? JSON.parse(user) : null,
  };
};

const bgimage = "/assests/images/bgimage.png";
const smallimage = "/assests/images/herosectionwatch.png";

const Index: React.FC = () => {
  const userInfo = useSelector(selectUserInfo);
  const [email, setEmail] = useState("");

  // Fallback to localStorage if Redux state is not available
  const authState = checkAuthFromStorage();
  const user = userInfo || authState.user;
  const isAuthenticated = Boolean(userInfo) || authState.isAuthenticated;

  const handleJoinWaitlist = () => {
    console.log("Email:", email);
  };

  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const target = document.querySelector(location.hash);
      if (target) {
        setTimeout(() => {
          target.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    }
  }, [location]);

  const brands = [
    "Rolex",
    "Patek Philippe",
    "Audemars Piguet",
    "Omega",
    "Cartier",
    "Breitling",
    "TAG Heuer",
    "IWC",
    "Jaeger-LeCoultre",
    "Vacheron Constantin",
  ];

  return (
    <div className="min-h-screen ">
      <section className="relative min-h-[90vh] bg-[#4A4A4A] text-white overflow-hidden pt-16 sm:pt-20">
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12 flex flex-col justify-center min-h-[calc(100vh-4rem)] sm:min-h-[calc(90vh-5rem)] max-w-5xl">
          {/* Main content */}
          <div className="text-center mb-12">
            {/* Main headline with enhanced typography */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              <span className="block  ">
                Reliable Service,
              </span>
              <span className="block text-[#CC5500] transform hover:scale-105 transition-transform duration-300">
                Perfectly Matched
              </span>
            </h1>

            {/* Enhanced description */}
            <div className="max-w-6xl mx-auto ">
              <p className="text-lg sm:text-xl md:text-2xl text-gray-300 font-light leading-relaxed">
                We're building a{" "}
                <span className="text-[#CC5500] font-semibold">
                  modern platform
                </span>{" "}
                to service and protect your favorite timepieces with
                <span className="text-white font-medium">
                  {" "}
                  clear pricing, expert hands, and no surprises.
                </span>
              </p>
            </div>
          </div>

          {/* Enhanced email signup */}
          <div className="max-w-md mx-auto mb-8">
            <div className="relative group">
              {/* Glowing border effect */}
              <div className="absolute -inset-1 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-300"></div>

              {/* Input container */}
              <div className="relative flex bg-white/95 backdrop-blur-sm rounded-full overflow-hidden shadow-2xl">
                <div className="flex items-center pl-6 pr-4">
                  <Mail className="w-5 h-5 text-gray-600" />
                </div>

                <input
                  type="email"
                  placeholder="you@example.com"
                  className="flex-1 py-4 px-2 bg-transparent text-gray-900 placeholder:text-gray-500 focus:outline-none text-base"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />

                <button
                  onClick={handleJoinWaitlist}
                  className="bg-[#CC5500] text-white px-8 py-4 rounded-full font-semibold hover:bg-[#CC5500] transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Join Waitlist
                </button>
              </div>
            </div>
          </div>

          {/* Enhanced CTA text with features */}
          <div className="text-center">
            <div className="inline-flex items-center gap-2  backdrop-blur-sm rounded-full px-6 py-3 mb-6">
              <span className="text-sm font-medium text-gray-200">
                <p className="text-sm sm:text-base md:text-[15px] leading-[120%] font-light">
                  Join the Waitlist & Get Our Free Guide: “Top 5 Signs Your
                  Watch Needs a Service”
                </p>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Supported Brands */}
      {/* <BuildToLast /> */}
      {/* Features Section */}

      <section id="why-choose-us">
        <WhyChooseBid />
      </section>

      <section id="what-we-offer">
        <WhatWeOffer />
      </section>

      <section id="the-process">
        <TheProcess />
      </section>

      <section id="faqs">
        <FAQSection />
      </section>
      <Footer />
      {/* CTA Section Design 1 */}
    </div>
  );
};

export default Index;
