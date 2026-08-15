import React from "react";

interface DashboardStatCardProps {
  title: string;
  value: string;
  details: string;
}

const DashboardStatCard: React.FC<DashboardStatCardProps> = (props) => {
  return (
    <div className="w-1/3 h-38 p-4 bg-[#F5F5F5] flex flex-col items-start justify-center border border-[#E5E5E5] rounded-2xl shadow">
      <h2 className="text-[#959595] text-xl font-bold">{props.title}</h2>
      <p className="text-3xl font-bold">{props.value}</p>
      <p className="text-[#959595]">{props.details}</p>
    </div>
  );
};

export default DashboardStatCard;
