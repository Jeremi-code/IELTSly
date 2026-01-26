import React from "react";
import BlueButton from "./BlueButton";

const Hero = () => {
  return (
    <div>
      <div className="w-1/2 flex flex-col items-center justify-center">
        <h2 className="text-4xl font-bold text-[#1F2937]">Master IELTS Writing with Real Exam Simulation</h2>
        <p className="text-[#6B7280] text-xl text-justify mt-4 mb-8">
          Practice IELTS writing in an authentic exam environment. No
          autocorrect, no distractions—just you and the test. Get instant AI
          feedback based on official IELTS standards.
        </p>

        <BlueButton buttonName="Start Practice" />
      </div>
      <div></div>
    </div>
  );
};

export default Hero;
