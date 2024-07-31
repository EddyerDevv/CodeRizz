import { RotateCcwIcon } from "lucide-react";
import Link from "next/link";
import React from "react";

export default function Header() {
  return (
    <header className="bg-transparent h-[3.5rem] flex items-center justify-between px-2 py-1 gap-2 w-full">
      <Link
        href={"/"}
        className="flex items-center justify-start text-[1.125rem] font-semibold text-neutral-400 px-2 py-1 rounded-lg hover:bg-white/5 z-30 backdrop-blur-xl transition-colors duration-300 ease-out hover:text-neutral-100 "
      >
        Code Rizz
      </Link>
      <button
        className="flex items-center justify-center rounded-lg size-[2.5rem] transition-colors duration-300 ease-out hover:bg-white/5 z-30 backdrop-blur-xl text-neutral-400 hover:text-neutral-100"
        title="Reset Chat"
        aria-label="Reset Chat"
      >
        <RotateCcwIcon
          className="size-[1.425rem] pointer-events-none"
          absoluteStrokeWidth
          strokeWidth={2.5}
        />
      </button>
    </header>
  );
}
