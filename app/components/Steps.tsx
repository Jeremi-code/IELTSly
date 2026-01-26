import React from "react";

const featureLists = [
  {
    title: "Add Your API Key",
    description:
      "Simply enter your Gemini API key in your account settings. It's secure, private, and gives you unlimited access.",
    icon: "step1.png",
  },
  {
    title: "Choose a Question",
    description:
      "Select from our extensive bank of authentic IELTS questions. Filter by task type, topic, or difficulty level. ",
    icon: "step2.png",
  },
  {
    title: "Write & Get Feedback",
    description:
      "Write your essay in our distraction-free editor and receive instant, detailed AI feedback with band scores.",
    icon: "step3.png",
  },
];

const Steps = () => {
  return (
    <div className="p-8 w-full">
      <div className="flex flex-col items-center justify-center gap-2">
        <div className="mb-4 p-2 min-w-32 bg-[#DBEAFE] text-center font-bold text-[#477DEF] rounded-2xl">
          How It Works
        </div>
        <h2 className="text-3xl font-bold text-[#1F2937]">
          Start Practicing in 3 Simple Steps
        </h2>
        <p className="text-[#6B7280] text-xl text-justify mt-4 mb-8">
          Get started with IELTSly in minutes and begin your journey to a higher
          band score
        </p>
      </div>

      <div className="grid grid-cols-3 place-items-center gap-8">
        {featureLists.map((feature, index) => (
          <div key={index} className="p-4 w-100 h-72 bg-white dark:bg-zinc-900 flex flex-col items-center justify-evenly rounded-2xl border dark:border-zinc-800 transition-colors">
            <img src={feature.icon} width={80} alt="" />
            <h2 className="text-2xl font-bold text-[#1F2937] dark:text-zinc-100">
              {feature.title}
            </h2>
            <p className="text-center text-[#6B7280] dark:text-zinc-400">{feature.description}</p>
          </div>
        ))}

      </div>
    </div>
  );
};

export default Steps;
