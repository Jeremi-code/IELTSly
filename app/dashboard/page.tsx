import React from "react";
import DashboardNav from "../components/DashboardNav";
import DashboardStatCard from "../components/DashboardStatCard";
import { Award, BookOpen, CircleAlert } from "lucide-react";
import AttemptCard from "../components/AttemptCard";

const dashboardStat = [
  {
    title: "Total Essays",
    value: "3",
    details: "essays this month",
  },
  {
    title: "Average Band",
    value: "6.5",
    details: "+0.5 from last week",
  },
  {
    title: "Task 1 Average",
    value: "6.0",
    details: "1 essays",
  },
  {
    title: "Task 2 Average",
    value: "6.5",
    details: "2 essays",
  },
];

const page = () => {
  return (
    <div className="w-full h-screen grid grid-cols-[16%_84%] gap-0">
      <DashboardNav />

      <div className="p-10 min-h-screen overflow-y-scroll flex flex-col items-start gap-4">
        <h2 className="text-3xl font-bold">Welcome Back!</h2>
        <p className="text-xl">Continue your IELTS writing practice journey</p>

        <div className="w-full bg-[#FEF2F3] p-4 flex flex-col items-start gap-2 border border-[#F3797F] rounded-xl">
          <div className="flex gap-4">
            <CircleAlert color="#F3797F" />
            <p className="font-bold">Gemini API Key Not Configured</p>
          </div>

          <p>
            Add your Gemini API key to start getting instant essay evaluations
            at ~$0.10 per essay.
          </p>

          <button className="p-2 bg-transparent border border-[#F3797F] rounded-lg hover:bg-[#F3797F] hover:text-white cursor-pointer">
            Configure API Key
          </button>
        </div>

        <div className="w-full flex items-center justify-around gap-2">
          {dashboardStat.map((stat) => (
            <DashboardStatCard
              key={stat.title}
              title={stat.title}
              value={stat.value}
              details={stat.details}
            />
          ))}
        </div>

        <div className="w-full flex items-center justify-around gap-4">
          <div className="w-1/2 px-8 py-4 bg-[#F5F5F5] flex flex-col items-center justify-center gap-4 border border-[#204CC0] rounded-2xl">
            <div className="w-full">
              <div className="flex flex-col items-start gap-2">
                <div className="flex items-center gap-2">
                  <BookOpen color="#204CC0" />
                  <h2 className="text-xl font-bold">Start New Essay</h2>
                </div>

                <p className="text-[#959595]">
                  Practice Task 1 or Task 2 under real exam conditions
                </p>
              </div>
            </div>

            <button className="w-full m-auto p-3 bg-[#204CC0] hover:bg-[#365EC6] cursor-pointer rounded-xl text-white font-bold">
              Start Practice
            </button>
          </div>

          <div className="w-1/2 px-8 py-4 bg-[#F5F5F5] flex flex-col items-center justify-center gap-4 border border-[#377B00] rounded-2xl">
            <div className="w-full">
              <div className="flex flex-col items-start gap-2">
                <div className="flex items-center gap-2">
                  <Award color="#377B00" />
                  <h2 className="text-xl font-bold">View Error Patterns</h2>
                </div>

                <p className="text-[#959595]">
                  See your most common mistakes and track improvements
                </p>
              </div>
            </div>

            <button className="w-full m-auto p-3 bg-[#377B00] hover:bg-[#4A9C00] cursor-pointer rounded-xl text-white font-bold">
              View Analytics
            </button>
          </div>
        </div>

        <div className="w-full px-8 py-4 bg-[#F5F5F5] flex flex-col gap-4 border border-[#E5E5E5] rounded-2xl shadow">
          <h2 className="text-3xl font-bold">Recent Essays</h2>
          <p className="text-[#959595]">Your last 3 practice attempts</p>
          <AttemptCard />
          <AttemptCard />
          <AttemptCard />
        </div>

        <div className="w-full flex flex-col items-center justify-center gap-4">
          <p className="text-lg">
            Ready to start your IELTS writing practice journey?
          </p>
          <button className="w-1/4 m-auto p-3 bg-[#204CC0] hover:bg-[#365EC6] cursor-pointer rounded-xl text-white font-bold">
            Write Your First Essay
          </button>
        </div>
      </div>
    </div>
  );
};

export default page;
