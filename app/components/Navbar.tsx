import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./ThemeToggle";

const Navbar = () => {
  return (
    <div className="p-6 w-full flex items-center justify-evenly">
      <img src="logo.png" alt="logo" />

      <div className="w-2/6 flex items-center justify-center gap-4">
        {["Features", "How It Works", "Pricing", "FAQ"].map((item) => (
          <Button
            key={item}
            variant="ghost"
            className="text-zinc-600 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors"
          >
            {item}
          </Button>
        ))}
      </div>

      <div className="flex items-center justify-center gap-4">
        <ThemeToggle />
        <Button
          variant="ghost"
          className="text-[#4B5563] dark:text-zinc-400 font-bold hover:text-[#2563EB] dark:hover:text-blue-400 transition-colors"
        >
          Sign In
        </Button>
        <Button variant="blue" className="rounded-xl px-6 font-bold">
          Get Started
        </Button>
      </div>
    </div>
  );
};


export default Navbar;

