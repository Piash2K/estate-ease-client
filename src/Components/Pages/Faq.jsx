import React from 'react';
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "How do I pay my rent online?",
    answer: "You can pay your rent through our online portal using a credit/debit card or bank transfer. Simply log in to your account and navigate to the payments section."
  },
  {
    question: "What should I do in case of a maintenance issue?",
    answer: "For urgent maintenance issues, please contact our emergency support team. For general requests, submit a maintenance ticket through the website."
  },
  {
    question: "Can I book amenities online?",
    answer: "Yes, you can book common area facilities such as the gym, clubhouse, or meeting rooms through our online booking system."
  },
  {
    question: "What is the process for moving in or out?",
    answer: "Residents must notify management at least two weeks in advance and schedule an inspection. All move-ins and move-outs should follow the community guidelines."
  }
];

const Faq = () => {
  return (
    <section className="w-9/12 mx-auto py-12">
      <h2 className="text-4xl font-bold text-center mb-10 ">Frequently Asked Questions</h2>
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div key={index} className="collapse collapse-arrow bg-base-200 border border-gray-300 dark:border-gray-700 rounded-xl shadow-lg">
            <input type="radio" name="faq-accordion" defaultChecked={index === 0} />
            <div className="collapse-title text-xl font-medium px-6 py-4 cursor-pointer ">
              {faq.question}
            </div>
            <div className="collapse-content px-6 pb-4">
              <p>{faq.answer}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Faq;