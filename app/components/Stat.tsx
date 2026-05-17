"use client";

import React from "react";

const statData = [
  { value: "10000+", label: "Essays Evaluated" },
  { value: "95%", label: "Accuracy Rate" },
  { value: "2500+", label: "Active Users" },
  { value: "24/7", label: "Practice Available" },
];

const Stat = () => {
  return (
    <div className="w-full py-10 grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1">
      {statData.map((stat, index) => (
        <div className="text-center" key={index}>
          <h3 className=";g:text-5xl md:text-4xl text-3xl  font-bold text-[#2563eb]">{stat.value}</h3>
          <p className="text-[#6B7280] text-lg font-bold">{stat.label}</p>
        </div>
      ))}
    </div>
  );
};

export default Stat;
