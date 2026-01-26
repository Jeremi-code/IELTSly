import React from "react";

const featureLists = [
  {
    title: "Real Exam Environment",
    description:
      "Practice in a distraction-free environment that mirrors the actual IELTS exam. No autocorrect, no spell-check—just like the real test",
    icon: "feature1.png",
  },
  {
    title: "AI-Powered Feedback",
    description:
      "Receive instant, detailed feedback on your essays powered by advanced AI technology trained on official IELTS standards.",
    icon: "feature2.png",
  },
  {
    title: "Personalized Study Plans",
    description:
      "Get customized study plans based on your performance to help you focus on areas that need improvement.",
    icon: "feature3.png",
  },
  {
    title: "Progress Tracking",
    description:
      "Monitor your improvement over time with comprehensive progress tracking and analytics.",
    icon: "feature4.png",
  },
  {
    title: "Extensive Question Bank",
    description:
      "Access a vast library of practice questions covering all IELTS writing task types and topics.",
    icon: "feature5.png",
  },
  {
    title: "24/7 Accessibility",
    description:
      "Practice anytime, anywhere with our online platform that’s available around the clock.",
    icon: "feature6.png",
  },
];

const Features = () => {
  return (
    <div className="w-full p-10 bg-[#F9FAFB] flex flex-col items-center justify-center gap-10">
      <div className="flex flex-col items-center justify-center gap-2">
        <div className="mb-4 p-2 min-w-32 bg-[#DBEAFE] text-center font-bold text-[#477DEF] rounded-2xl">
          Features
        </div>
        <h2 className="text-3xl font-bold text-[#1F2937]">
          Everything You Need to Ace IELTS Writing
        </h2>
        <p className="text-[#6B7280] text-xl text-justify mt-4 mb-8">
          Authentic exam simulation meets powerful AI feedback to help you
          achieve your target band score
        </p>
      </div>
      <div className="grid grid-cols-3 place-items-center gap-8">
        {featureLists.map((feature, index) => (
          <div className="p-4 w-100 h-72 bg-white flex flex-col items-start justify-evenly rounded-2xl">
            <img src={feature.icon} width={80} alt="" />
            <h2 className="text-2xl font-bold text-[#1F2937]">
              {feature.title}
            </h2>
            <p>{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Features;
