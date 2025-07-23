import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { PremiumLogo, FullyInsuredLogo, CertifiedDealersLogo, MailLogo } from '@/svg';

import {
  Crown,
  Clock,
  Shield,
  Users,
  CheckCircle,
  ArrowRight,
  Star,
} from 'lucide-react';
import FAQSection from '@/components/ui/faq';
import TheProcess from '@/components/ui/theprocess';
import WhatWeOffer from '@/components/ui/whatweoffer';
import WhyChooseBid from '@/components/ui/whychoosebid';
import BuildToLast from '@/components/ui/buildtolast';
import Footer from '@/components/layout/Footer';




const bgimage = "/assests/images/bgimage.png";
const smallimage = "/assests/images/herosectionwatch.png";
const Index: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [email, setEmail] = useState('');

  const handleJoinWaitlist = () => {
    console.log('Email:', email);
  };

  const brands = [
    'Rolex', 'Patek Philippe', 'Audemars Piguet', 'Omega', 'Cartier',
    'Breitling', 'TAG Heuer', 'IWC', 'Jaeger-LeCoultre', 'Vacheron Constantin'
  ];

  return (

    <div className="min-h-screen">

      <section className="relative min-h-[100vh] sm:h-[90vh] bg-black text-white overflow-hidden pt-16 sm:pt-20">
        <div className="absolute inset-0">
          <img
            src={bgimage}
            alt="Luxury Watch"
            className="w-full h-full object-cover object-center"
          />
        </div>

        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-0 py-6 sm:py-12 flex flex-col justify-center min-h-[calc(100vh-4rem)] sm:min-h-[calc(90vh-5rem)] max-w-[95%] sm:max-w-[85%] lg:max-w-[70%]">

          <div className="self-start mt-4 sm:mt-8 lg:-mt-24">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[48px] font-guyot  lg:leading-[120%] mb-6 sm:mb-8 lg:mb-12">
              Time deserves Care; Be among <br className="hidden sm:block" />
              the first to experience the future <br className="hidden md:block" />
              of <span className="whitespace-nowrap">service.</span>
            </h1>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center text-base sm:text-lg md:text-xl text-gray-200 max-w-full sm:max-w-2xl mb-6 sm:mb-8 sm:px-0 md:px-12">
            <img
              src={smallimage}
              alt="Icon"
              className="w-[45px] h-[45px] sm:w-[50px] sm:h-[50px] md:w-[55px] md:h-[55px] mb-3 sm:mb-0 sm:mr-6 flex-shrink-0"
            />
            <p className="text-sm sm:text-base md:text-[18px] leading-[120%] font-light">
              We're building a modern platform to service and protect your favorite timepieces —
              with clear pricing, expert hands, and no surprises.
            </p>
          </div>

          <div className="flex w-full max-w-full sm:max-w-[661px] bg-white rounded-full overflow-hidden mb-6 sm:mb-8 mt-2 items-center h-[52px] sm:h-[52px] md:h-[56px]">
            <div className="text-black px-3 sm:px-4 flex-shrink-0">
              <MailLogo />
            </div>
            <Input
              type="email"
              placeholder="Enter your email to get early access"
              className="flex-1 border-0 focus:ring-0 focus-visible:ring-0 text-black bg-transparent placeholder:text-black h-full px-2 sm:px-0 text-sm sm:text-base placeholder:text-xs sm:placeholder:text-sm md:placeholder:text-base min-w-0"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button
              className="bg-[#f59f0a] text-white px-3 sm:px-6 md:px-8 h-full rounded-tr-[120px] rounded-br-[120px] rounded-bl-[999px] rounded-tl-none hover:bg-[#e09000] transition text-xs sm:text-base whitespace-nowrap flex-shrink-0"
              onClick={handleJoinWaitlist}
            >
              <span className="hidden sm:inline">Join the Waitlist</span>
              <span className="sm:hidden">Join</span>
            </Button>
          </div>

          <div className="flex flex-wrap gap-3 sm:gap-4 md:gap-6 text-xs sm:text-sm md:text-[14px] text-white/80 mb-8 sm:mb-0">
            <div className="flex items-center gap-1 sm:gap-2">
              <CertifiedDealersLogo />
              <span className="whitespace-nowrap">Certified Dealers</span>
            </div>
            <div className="flex items-center gap-1 sm:gap-2">
              <FullyInsuredLogo />
              <span className="whitespace-nowrap">Fully Insured</span>
            </div>
            <div className="flex items-center gap-1 sm:gap-2">
              <PremiumLogo />
              <span className="whitespace-nowrap">Premium Service</span>
            </div>
          </div>
        </div>
      </section>

      {/* Supported Brands */}
      <BuildToLast />
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