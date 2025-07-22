import { useState } from "react";

const faqs = [
  {
    question: "How do I know my watch is in safe hands?",
    answer: "We have expert watchmakers with decades of experience ensuring your watch is treated with the utmost care.",
  },
  {
    question: "Can I track my service status?",
    answer: "Yes, you can track your watch repair status in real-time through your account dashboard.",
  },
  {
    question: "What happens if I’m not satisfied with the service?",
    answer: "We offer a satisfaction guarantee and will work with you to resolve any issues promptly.",
  },
  {
    question: "Do I need to create an account to get started?",
    answer: "Creating an account helps track your orders, but you can also place requests as a guest.",
  },
  {
    question: "Is my information secure?",
    answer: "Absolutely, we use top-level security protocols to protect your personal information.",
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-20 px-4 relative overflow-hidden">
      <div className="absolute inset-0 " />
      <div className="container mx-auto text-center relative z-10">
          <div className="mt-12 text-left max-w-5xl mx-auto">
            <h2 className="text-[36px]  mb-6 text-center font-guyot">Frequently asked questions</h2>
            <div className="border-t border-gray-300 divide-y divide-gray-300 text-[24px]">
              {faqs.map((faq, index) => {
                const isOpen = openIndex === index;
                return (
                  <div key={index} className="py-4 flex flex-col">
                    <button
                      onClick={() => toggle(index)}
                      className="flex justify-between items-center w-full text-left font-guyot text-gray-900 focus:outline-none"
                    >
                      <span>{faq.question}</span>
                      <span className="ml-4 text-2xl font-bold select-none">
                        {isOpen ? "−" : "+"}
                      </span>
                    </button>

                    {isOpen && (
                      <p className="mt-3 text-gray-700 text-sm leading-relaxed">{faq.answer}</p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
      </div>
    </section>
  );
}
