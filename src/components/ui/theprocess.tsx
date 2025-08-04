import { useState } from "react";

const steps = [
  {
    title: "Submit Your Request",
    description: "Fill out a short form, upload a photo of your watch, and describe the issue.",
  },
  {
    title: "Choose a Delivery Option",
    description: "Select from secure shipping, local drop-off, or pickup if available in your area.",
  },
  {
    title: "Get Matched with Verified Dealers",
    description: "Compare offers, reviews, lead times, and costs then choose the best fit.",
  },
  {
    title: "Service Begins",
    description: "Your watch is serviced by professionals, with real-time status updates and image documentation.",
  },
  {
    title: "Receive & Review",
    description: "Once the service is complete, your watch is returned safely. You confirm and leave a review.",
  },
];

export default function TheProcess() {


  return (
    <section className="bg-[#fef6ed] py-20 px-4">
      <div className="container mx-auto text-center">
        <h2 className="text-3xl md:text-[36px] font-semibold mb-4 font-guyot">The Process</h2>
        <p className="text-gray-600 max-w-2xl mx-auto mb-12 font-stevie">
          We’ve streamlined the entire watch service experience — no confusion, no surprises:
        </p>

        <div className="relative flex flex-col md:flex-row justify-between items-start gap-10 max-w-7xl mx-auto px-4 leading-[120%]">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`relative flex-1 px-4 text-left mb-12 md:mb-0 ${index % 2 === 1 ? "mt-16" : "mb-16"}`}
            >
              <h3 className="text-[20px] font-semibold mb-2 font-guyot">{step.title}</h3>
              <p className="text-gray-700 text-[16px] leading-relaxed font-stevie leading-[150%]">{step.description}</p>

             
              {index < steps.length - 1 && (
                <>

                  <div
                    className={`hidden md:block absolute w-[110px] h-[50px]
        ${index === 0 ? 'right-[-25px] top-[100%]' : ''}
        ${index === 1 ? 'right-[-25px] top-[-60px]' : ''}
        ${index === 2 ? 'right-[-25px] top-[100%]' : ''}
        ${index === 3 ? 'right-[-25px] top-[-60px]' : ''}
      `}
                  >
                    <svg viewBox="0 0 100 50" preserveAspectRatio="none" className="w-full h-full">
                      <path
                        d={
                          index === 1 || index === 3
                            ? 'M0,40 C25,10 75,10 100,20'
                            : 'M0,10 C25,40 75,40 100,20'
                        }
                        stroke="#f4a300"
                        strokeWidth="2"
                        strokeDasharray="4 4"
                        fill="none"
                        markerEnd="url(#arrowhead)"
                      />
                      <defs>
                        <marker
                          id="arrowhead"
                          markerWidth="6"
                          markerHeight="6"
                          refX="5"
                          refY="3"
                          orient="auto"
                        >
                          <path d="M0 0 L6 3 L0 6 Z" fill="#f4a300" />
                        </marker>
                      </defs>
                    </svg>
                  </div>

                </>
              )}

            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
