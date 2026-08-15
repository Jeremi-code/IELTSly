import { MoveRight } from "lucide-react";
import React from "react";

const AttemptCard = () => {
  return (
    <div className="p-4 w-full flex items-center justify-between border border-[#E5E5E5] rounded-2xl">
      <div>
        <div className="flex items-center justify-start gap-4">
          <div className="px-2 py-1 bg-[#DFE4F0] text-[#204CC0] rounded-xl">
            Task 1
          </div>
          <div className="text-[#959595]">2026-01-27</div>
        </div>

        <p className="hover:text-[#204CC0] cursor-pointer">
          some people believe that technology has made our lives better.
        </p>
      </div>

      <div className="flex items-center justify-center gap-4">
        <div className="flex flex-col items-end justify-center gap-1">
          <h2 className="font-bold">6.5</h2>
          <p className="text-[#959595]">Band score</p>
        </div>
        <div className="p-2 flex items-center justify-center hover:bg-[#204CC0] hover:text-white rounded-lg">
          <MoveRight />
        </div>
      </div>
    </div>
  );
};

export default AttemptCard;
