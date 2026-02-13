import DashboardNav from "@/app/components/DashboardNav";
import { Check } from "lucide-react";
import React from "react";

const page = () => {
  return (
    <div className="w-full h-screen grid grid-cols-[16%_84%] gap-0">
      <DashboardNav />
      <div className="p-10 min-h-screen overflow-y-scroll flex flex-col items-start gap-4">
        <h2 className="text-3xl font-bold">Practice Essay</h2>
        <p className="text-xl">
          Choose a task type to begin your 60-minute exam
        </p>

        <div className="w-full flex items-center justify-between gap-4">
          <div className="w-1/2 p-8 flex flex-col items-start justify-center gap-4 border rounded-2xl bg-[#F5F5F5] border-[#204CC0]">
            <h2 className="text-2xl font-bold">Task 1</h2>
            <p className="text-lg text-[#555555]">Graph/Chart Description</p>

            <p className="text-md font-bold">You will:</p>
            <ul className="text-md text-[#555555] flex flex-col items-start justify-center gap-2">
              <li className="flex items-center justify-center gap-1">
                <Check size={20} />
                Describe Charts, Graphs or Diagrams
              </li>
              <li className="flex items-center justify-center gap-1">
                <Check size={20} />
                Minimum 150 words
              </li>
              <li className="flex items-center justify-center gap-1">
                <Check size={20} />
                20 minutes recommended
              </li>
            </ul>

            <button className="w-full m-auto p-3 bg-[#204CC0] hover:bg-[#365EC6] cursor-pointer rounded-xl text-white font-bold">
              Start Task 1
            </button>
          </div>

          <div className="w-1/2 p-8 flex flex-col items-start justify-center gap-4 border rounded-2xl bg-[#F5F5F5] border-[#204CC0]">
            <h2 className="text-2xl font-bold">Task 2</h2>
            <p className="text-lg text-[#2040C0]">Essasy (Recommended)</p>

            <p className="text-md font-bold">You will:</p>
            <ul className="text-md text-[#555555] flex flex-col items-start justify-center gap-2">
              <li className="flex items-center justify-center gap-1">
                <Check size={20} />
                Write an essay
              </li>
              <li className="flex items-center justify-center gap-1">
                <Check size={20} />
                Minimum 250 words
              </li>
              <li className="flex items-center justify-center gap-1">
                <Check size={20} />
                40 minutes recommended
              </li>
            </ul>

            <button className="w-full m-auto p-3 bg-[#204CC0] hover:bg-[#365EC6] cursor-pointer rounded-xl text-white font-bold">
              Start Task 2
            </button>
          </div>
        </div>

        <div className="w-full p-8 bg-[#F5F5F5] text-[#555555] flex items-center justify-center gap-2 border rounded-xl shadow">
          <b>Note:</b> During exam mode, spellcheck, autocorrect, paste, and
          browser extensions are disabled. This matches real IELTS exam
          conditions.
        </div>
      </div>
    </div>
  );
};

export default page;
