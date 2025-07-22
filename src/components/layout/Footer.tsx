import { FooterSmsicon, InstaIcon, LinkedInIcon, TwitterIcon } from "@/svg";

export default function Footer() {
    return (
        <footer className="bg-black text-white py-10 px-4 relative">
            {/* Top Section */}
            <div className="container mx-auto text-center flex flex-col items-center gap-6">
                {/* Brand Name */}
                <h2 className="text-[36px] font-guyot">ChronoBid</h2>

                {/* Navigation Links */}
                <div className="flex flex-wrap justify-center items-center gap-6 text-sm md:text-base">
                    <span className=" hover:text-[#F59F0A] transition cursor-pointer text-[20px] font-guyot">Quick Links</span>
                    <a href="#" className="hover:text-[#F59F0A] transition font-stevie">Why Choose Us</a>
                    <a href="#" className="hover:text-[#F59F0A] transition font-stevie">What we offer</a>
                    <a href="#" className="hover:text-[#F59F0A] transition font-stevie">The Process</a>
                    <a href="#" className="hover:text-[#F59F0A] transition font-stevie">Faq’s</a>
                    <a href="#" className="hover:text-[#F59F0A] transition font-stevie">Contact Us</a>
                </div>

                {/* Social Icons */}
                <div className="flex gap-5 text-xl mt-2">
                    <a href="#" className="hover:text-yellow-500 transition "><TwitterIcon /></a>
                    <a href="#" className="hover:text-yellow-500 transition"><InstaIcon /></a>
                    <a href="#" className="hover:text-yellow-500 transition"><LinkedInIcon /></a>
                </div>
                <div className="flex justify-end ml-auto cursor-pointer">
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
