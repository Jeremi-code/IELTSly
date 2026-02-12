import React from "react";
import DashboardNav from "../components/DashboardNav";

const page = () => {
  return (
    <div className="w-full h-screen overflow-y-scroll flex items-center justify-center relative">
      <DashboardNav />
      <div>This is the dashboard</div>
    </div>
  );
};

export default page;
