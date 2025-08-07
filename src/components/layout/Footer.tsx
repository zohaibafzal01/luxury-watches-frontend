import { FooterSmsicon, InstaIcon, LinkedInIcon, TwitterIcon } from "@/svg";
import wrstopia from "../../../public/wrstopia.svg";

export default function Footer() {
  return (
    <footer className="bg-[#4A4A4A] text-white py-10 px-4 relative">
      {/* Top Section */}
      <div className="container mx-auto text-center flex flex-col items-center gap-6">
        {/* Brand Name */}
        <div className="mb-6">
          <img src={wrstopia} alt="" width={150} height={100} />
        </div>

        {/* Navigation Links */}
        <div className="flex flex-wrap justify-center items-center gap-6 text-sm md:text-base">

          <a href="#" className="hover:text-[#CC5500] transition font-stevie">
            Why Choose Us
          </a>
          <a href="#" className="hover:text-[#CC5500] transition font-stevie">
            What we offer
          </a>
          <a href="#" className="hover:text-[#CC5500] transition font-stevie">
            The Process
          </a>
          <a href="#" className="hover:text-[#CC5500] transition font-stevie">
            Faq’s
          </a>
          <a href="#" className="hover:text-[#CC5500] transition font-stevie">
            Contact Us
          </a>
        </div>

        {/* Social Icons */}
        <div className="flex gap-5 text-xl mt-2">
          <a href="#" className="hover:text-[#CC5500] transition ">
            <TwitterIcon />
          </a>
          <a href="#" className="hover:text-[#CC5500] transition">
            <InstaIcon />
          </a>
          <a href="#" className="hover:text-[#CC5500] transition">
            <LinkedInIcon />
          </a>
        </div>
        <div className="fixed bottom-16 right-16 cursor-pointer z-50">
          <FooterSmsicon />
        </div>
        {/* Divider */}
        <div className="w-full max-w-4xl border-t border-gray-700 mt-6" />

        {/* Copyright */}
        <p className="text-[14px] text-gray-400 mt-4">
          © 2025 Louisiana Love Home for Children. All rights reserved.
        </p>
      </div>

      {/* Floating Chat Button */}
    </footer>
  );
}
