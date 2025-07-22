import { useState } from "react";
const sectionimage = "/assests/images/watch.png"
const sectionimage2 = "/assests/images/watch2.png"

export default function BuildToLast() {
 

  return (
  <section className="py-30 lg:py-30 px-4 mt-16 lg:mt-24 bg-muted/20">
        <div className="container mx-auto text-center flex flex-col lg:flex-row lg:justify-between gap-8 lg:gap-0">
          <div className='w-full lg:w-[45%] text-left items-center lg:-ml-8'>
            <img
              src={sectionimage}
              alt="Icon"
              className="w-full max-w-[500px] h-auto lg:h-[560px] mx-auto lg:mx-0"
            />
            <h2 className="mt-4 text-sm md:text-base">This exploded view reveals the sophisticated construction of a modern timepiece, featuring a carbon fibre reinforced resin case and intricately assembled internal components. </h2>
          </div>
          <div className='w-full lg:w-[45%] text-left items-center lg:-mr-4'>
            <h1 className="text-2xl md:text-3xl lg:text-[36px] font-guyot mb-6 max-w-[400px] lg:-ml-72 mt-8 lg:mt-12">Built to Last &<br />Worth Servicing Right</h1>
            <div className="mt-8 lg:mt-12">
              <h2 className='max-w-[500px] mb-6 lg:mb-8 text-sm md:text-base'>Such engineering excellence requires expert handling. At this Platform, we specialize in connecting you with certified professionals who understand the complexity of fine watches ensuring every service is performed with the highest standards of care, accuracy, and respect for craftsmanship. </h2>
              <img
                src={sectionimage2}
                alt="Icon"
                className="w-full max-w-[746px] h-auto lg:h-[560px] mx-auto lg:mx-0"
              />
            </div>
          </div>
        </div>
      </section>
  );
}
