import React from "react";
import { Twitter, Facebook, Linkedin, Instagram } from "lucide-react";

const Footer = () => {
  return (
    <div className="w-full p-10 bg-[#111827] flex flex-col items-center justify-center gap-10">
      <div className="grid grid-cols-4 place-items-center w-full">
        <div className="flex flex-col items-start justify-center">
          <img src="logo.png" alt="logo" />
          <p className="text-[#6B7280] text-lg text-justify mt-4 mb-8">
            The ultimate IELTS writing practice platform with real exam
            simulation and AI-powered feedback
          </p>
          <div className="flex items-center justify-center gap-4">
            <Twitter color="#6B7280" size={25} />
            <Facebook color="#6B7280" size={25} />
            <Linkedin color="#6B7280" size={25} />
            <Instagram color="#6B7280" size={25} />
          </div>
        </div>

        <div>
          <h3 className="text-white text-2xl font-bold mb-4">Products</h3>
          <ul className="text-[#6B7280] text-lg space-y-2">
            <li>Features</li>
            <li>Pricing</li>
            <li>API Documentation</li>
            <li>Changelog</li>
          </ul>
        </div>

        <div>
          <h3 className="text-white text-2xl font-bold mb-4">Resources</h3>
          <ul className="text-[#6B7280] text-lg space-y-2">
            <li>Blog</li>
            <li>IELTS Tips</li>
            <li>Sample Essays</li>
            <li>FAQ</li>
          </ul>
        </div>

        <div>
          <h3 className="text-white text-2xl font-bold mb-4">Company</h3>
          <ul className="text-[#6B7280] text-lg space-y-2">
            <li>About Us</li>
            <li>Contact</li>
            <li>Privacy Policy</li>
            <li>Terms of Service</li>
          </ul>
        </div>
      </div>
      <div className="w-full h-0.5 bg-[#6B7280] "></div>
      <div className="text-[#6B7280] font-bold">© 2024 IELTSly. All rights reserved.</div>
    </div>
  );
};

export default Footer;
