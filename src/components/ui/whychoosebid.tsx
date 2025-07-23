import { useState } from "react";


  const features = [
    {
      image: "/assests/images/luxury.jpg",
      title: "Luxury Service Network",
      description: "Connect with certified dealers specializing in premium timepieces",
    },
    {
      image: "/assests/images/fast-turnaround.jpg",
      title: "Fast Turnaround",
      description: "Get competitive bids and quick service from verified professionals",
    },
    {
      image: "/assests/images/secure-trusted.jpg",
      title: "Secure & Trusted",
      description: "All dealers are vetted and insured for your peace of mind",
    },
    {
      image: "/assests/images/expert-network.jpg",
      title: "Expert Network",
      description: "Access a curated network of watch specialists and collectors",
    },
  ];


export default function WhyChooseBid() {
 

  return (
 <section className="py-12 sm:py-16 lg:py-20 px-4 bg-black text-white">
  <div className="container mx-auto max-w-[920px]">
    <div className="text-center mb-12 sm:mb-16">
      <h2 className="text-2xl sm:text-3xl md:text-[36px] lg:text-4xl font-guyot mb-4">
        Why Choose ChronoBid
      </h2>
      <p className="text-sm sm:text-base text-white/90 max-w-2xl mx-auto px-4">
        Experience the future of luxury watch services with our innovative platform
      </p>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 justify-items-center">
      {features.map((feature, index) => (
        <div
          key={index}
          className="relative w-full max-w-[421px] h-[300px] sm:h-[380px] md:h-[443px] rounded-xl overflow-hidden group shadow-lg"
          style={{
            backgroundImage: `url(${feature.image})`,
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 transition-all duration-300" />
          <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 right-4 sm:right-6 z-10">
            <h3 className="text-lg sm:text-xl md:text-[24px] font-guyot text-[#f59f0a] mb-1">
              {feature.title}
            </h3>
            <p className="text-sm sm:text-base text-white font-stevie leading-relaxed">
              {feature.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  </div>
</section>
  );
}
