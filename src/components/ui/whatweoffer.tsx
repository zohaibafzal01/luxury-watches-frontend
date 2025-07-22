import { useState } from "react";

const services = [
    {
      id: 1,
      title: "General Watch Servicing",
      image: "/assests/images/GeneralWatch.jpg",
    },
    {
      id: 2,
      title: "Strap & Bracelet Replacement",
      image: "/assests/images/Strap&Bracelet.jpg",
    },
    {
      id: 3,
      title: "Polishing & Cosmetic Restoration",
      image: "/assests/images/Polishing&Cosmetic.jpg",
    },
    {
      id: 4,
      title: "Luxury Watch Overhauls",
      image: "/assests/images/LuxuryWatch.jpg",
    },
    {
      id: 5,
      title: "Water Resistance Testing",
      image: "/assests/images/WaterResistance.jpg",
    },
    {
      id: 6,
      title: "Battery Replacement & Minor Repairs",
      image: "/assests/images/BatteryReplacement.jpg",
    }
  ];

export default function WhatWeOffer() {
 

  return (
   <section className="py-16 px-4">
          <div className="container mx-auto">
            <div className="mb-12">
              <h2 className="text-4xl md:text-[36PX] font-guyot text-gray-900 mb-4">
                What We Offer
              </h2>
              <p className="text-[16px] font-stevie max-w-2xl">
                We connect you with verified experts to handle your timepieces with precision and care. Our platform offers:
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6 mb-12 sm:mb-16 lg:mb-20">
              {services.map((service) => (
                <div
                  key={service.id}
                  className="group relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 w-full"
                >
                  <div className="h-[300px] sm:h-[350px] md:h-[380px] lg:h-[400px] w-full overflow-hidden">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 lg:p-4 text-white">
                    <h3 className="text-base sm:text-lg lg:w-[184px] lg:text-xl font-guyot mb-2 group-hover:text-[#F59F0A] transition-colors leading-tight">
                      {service.title}
                    </h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
  );
}
