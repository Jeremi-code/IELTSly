import React from "react";
import NavButton from "./NavButton";
import SignInButton from "./SignInButton";
import BlueButton from "./BlueButton";

const Navbar = () => {
  return (
    <div className="p-6 w-full flex items-center justify-evenly">
      <img src="logo.png" alt="logo" />

      <div className="w-2/6 flex items-center justify-center gap-4">
        <NavButton buttonName="Features" />
        <NavButton buttonName="How It Works" />
        <NavButton buttonName="Pricing" />
        <NavButton buttonName="FAQ" />
      </div>

      <div className="flex items-center justify-center gap-4">
        <SignInButton />
        <BlueButton buttonName="Get Started" />
      </div>
    </div>
  );
};

export default Navbar;
