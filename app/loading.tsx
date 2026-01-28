import Logo from "@/app/components/Logo";

export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen w-full bg-white dark:bg-zinc-950">
      <div className="relative flex flex-col items-center">
        <Logo className="w-24 h-24 mb-8 animate-pulse" />
        <div className="h-1.5 w-32 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
            <div className="h-full bg-blue-600 animate-[loading_1.5s_ease-in-out_infinite] w-1/2 rounded-full"></div>
        </div>
      </div>
    </div>
  );
}
