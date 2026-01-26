import BlueButton from "./BlueButton";
import IELTSWritingInterface from "./IELTSWritingInterface";

const Hero = () => {
  return (
    <div className="flex flex-col lg:flex-row items-center justify-center bg-linear-to-br from-[#E4EEFF] via-[#FFFFFF] to-[#E4EEFF] dark:from-zinc-900 dark:via-zinc-950 dark:to-zinc-900 h-[calc(100vh-80px)] lg:h-[calc(100vh-80px)] overflow-hidden px-10 lg:px-20">
      <div className="w-full lg:w-5/12 flex flex-col items-center lg:items-start justify-center mb-6 lg:mb-0 text-center lg:text-left">
        <h2 className="text-3xl lg:text-5xl font-bold text-[#1F2937] dark:text-zinc-100 leading-tight">
          Master IELTS Writing with Real Exam Simulation
        </h2>
        <p className="text-[#6B7280] dark:text-zinc-400 text-lg lg:text-xl mt-4 mb-8 max-w-lg">
          Practice IELTS writing in an authentic exam environment. No
          autocorrect, no distractions—just you and the test. Get instant AI
          feedback based on official IELTS standards.
        </p>

        <BlueButton buttonName="Start Practice" />
      </div>
      <div className="w-full lg:w-7/12 flex justify-center lg:justify-end items-center px-4 scale-90 lg:scale-100">
        <IELTSWritingInterface />
      </div>
    </div>
  );
};

export default Hero;
