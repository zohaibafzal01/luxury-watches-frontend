import React, { useState } from "react";

const services = [
  {
    id: 1,
    title: "General Watch Servicing",
    image: "/assests/images/GeneralWatch2.jpg",
    description: "Full diagnostics, movement cleaning, lubrication, and recalibration.",
  },
  {
    id: 2,
    title: "Strap & Bracelet Replacement",
    image: "/assests/images/Strap&Bracelet2.jpg",
    description: "OEM or custom-fit strap installation and resizing.",
  },
  {
    id: 3,
    title: "Polishing & Cosmetic Restoration",
    image: "/assests/images/Polishing&Cosmetic2.jpg",
    description: "Scratch removal, case polishing, and aesthetic touch-ups.",
  },
  {
    id: 4,
    title: "Luxury Watch Overhauls",
    image: "/assests/images/LuxuryWatch2.jpg",
    description: "Complete teardown, ultrasonic cleaning, part replacement, and reassembly.",
  },
  {
    id: 5,
    title: "Water Resistance Testing",
    image: "/assests/images/WaterResistance2.jpg",
    description: "Pressure tests to ensure your watch remains protected from moisture and dust.",
  },
  {
    id: 6,
    title: "Battery Replacement & Minor Repairs",
    image: "/assests/images/BatteryReplacement2.jpg",
    description: "Fast turnarounds on simple service needs.",
  },
];

export default function WhatWeOffer() {
  const [hoveredId, setHoveredId] = useState(null);

  return (
    <section className="py-16 px-4 w-full container mx-auto">
      <div className="w-full max-w-full">
        <div className="mb-12 justify-center">
          <h2 className="text-4xl md:text-[36px] font-guyot mb-4 leading-[120%]">
            What We Offer
          </h2>
          <p className="text-[16px] max-w-xl text-gray-600 font-stevie leading-[150%]">
            We connect you with verified experts to handle your timepieces with precision and care. Our platform offers:
          </p>
        </div>

        {/* Mobile & Tablet View (Grid) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 lg:hidden">
          {services.map((service) => {
            const isHovered = hoveredId === service.id;
            return (
              <div
                key={service.id}
                className="relative rounded-2xl bg-white shadow-lg cursor-pointer overflow-hidden transition-all duration-300 ease-out hover:shadow-2xl hover:-translate-y-2"
                style={{ height: '280px' }}
                onMouseEnter={() => setHoveredId(service.id)}
                onMouseLeave={() => setHoveredId(null)}
                onClick={() => setHoveredId(isHovered ? null : service.id)} 
              >
                <div className="relative w-full h-full rounded-2xl overflow-hidden">
                  <img
                    src={service.image}
                    alt={service.title}
                    className={`w-full h-full object-cover transition-transform duration-300 ${isHovered ? 'scale-105' : 'scale-100'}`}
                    draggable={false}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = `data:image/svg+xml;base64,${btoa(`
                        <svg width="300" height="280" xmlns="http://www.w3.org/2000/svg">
                          <rect width="100%" height="100%" fill="#f3f4f6"/>
                          <text x="50%" y="50%" font-family="Arial" font-size="14" fill="#9ca3af" text-anchor="middle" dy=".3em">
                            ${service.title}
                          </text>
                        </svg>
                      `)}`;
                    }}
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t transition-opacity duration-300 rounded-2xl ${isHovered
                    ? 'from-black/80 via-black/40 to-transparent'
                    : 'from-black/70 via-black/30 to-transparent'
                    }`} />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                  <h3 className="text-base sm:text-lg font-bold mb-2 font-guyot">
                    {service.title}
                  </h3>
                  <p className={`text-xs sm:text-sm leading-relaxed transition-all duration-300 ease-in-out ${isHovered
                    ? "max-h-20 opacity-100 translate-y-0"
                    : "max-h-0 opacity-0 translate-y-4 overflow-hidden"
                    }`}>
                    {service.description}
                  </p>
                </div>
                {isHovered && (
                  <div className="absolute top-3 right-3 w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                )}
              </div>
            );
          })}
        </div>
        <div className="hidden lg:flex gap-4 px-4 pb-4 justify-center">
          {services.map((service) => {
            const isHovered = hoveredId === service.id;

            return (
              <div
                key={service.id}
                className={`flex-shrink-0 relative rounded-2xl bg-white shadow-lg cursor-pointer overflow-hidden transition-all duration-300 ease-out ${isHovered ? "z-20 shadow-2xl" : "z-10"}`}
                style={{
                  width: isHovered ? 340 : 220,
                  height: 400,
                  transform: isHovered ? 'translateY(-8px)' : 'translateY(0)',
                }}
                onMouseEnter={() => setHoveredId(service.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                <div className="relative w-full h-full rounded-2xl overflow-hidden">
                  <img
                    src={service.image}
                    alt={service.title}
                    className={`w-full h-full object-cover transition-transform duration-300 ${isHovered ? 'scale-105' : 'scale-100'}`}
                    draggable={false}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = `data:image/svg+xml;base64,${btoa(`
                        <svg width="300" height="400" xmlns="http://www.w3.org/2000/svg">
                          <rect width="100%" height="100%" fill="#f3f4f6"/>
                          <text x="50%" y="50%" font-family="Arial" font-size="14" fill="#9ca3af" text-anchor="middle" dy=".3em">
                            ${service.title}
                          </text>
                        </svg>
                      `)}`;
                    }}
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t transition-opacity duration-300 rounded-2xl ${isHovered
                    ? 'from-black/80 via-black/40 to-transparent'
                    : 'from-black/70 via-black/30 to-transparent'
                    }`} />
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className={`font-bold mb-2 transition-all duration-300 font-guyot ${isHovered
                    ? 'text-lg sm:text-xl lg:text-2xl'
                    : 'text-base sm:text-lg lg:text-xl'
                    }`}>
                    {service.title}
                  </h3>
                  <p
                    className={`text-sm leading-relaxed transition-all duration-300 ease-in-out ${isHovered
                      ? "max-h-32 opacity-100 translate-y-0"
                      : "max-h-0 opacity-0 translate-y-4 overflow-hidden"
                      }`}
                  >
                    {service.description}
                  </p>
                </div>
                {isHovered && (
                  <div className="absolute top-4 right-4 w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
