import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
    <header className="fixed w-full h-[4rem] flex items-center justify-around backdrop-blur gap-2 px-4 max-md:justify-between z-[100]">
      <figure className="flex items-center justify-center">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logo.png"
            alt="Code Rizz"
            width={100}
            height={100}
            className="size-[2.1rem] -rotate-[15deg] mt-[0.0625rem]"
          />
          <span className="font-bold font-geistSans text-[1.2rem] text-white">
            Code Rizz
          </span>
        </Link>
      </figure>
      <nav className="flex items-center gap-3">
        <Link
          href={"https://github.com/EddyerDevv/CodeRizz#maintainers"}
          target="_blank"
          referrerPolicy="no-referrer"
          className="rounded-full text-white hover:text-gray-300 transition-colors duration-300"
        >
          <span className="font-semibold text-[1.05rem] font-geistSans leading-[0]">
            Maintainers
          </span>
        </Link>
        <Link
          href={"https://github.com/EddyerDevv/CodeRizz#changelogs"}
          target="_blank"
          referrerPolicy="no-referrer"
          className="rounded-full text-white hover:text-gray-300 transition-colors duration-300"
        >
          <span className="font-semibold text-[1.05rem] font-geistSans leading-[0]">
            ChangeLogs
          </span>
        </Link>
      </nav>
      <div className="flex items-center gap-2">
        <Link
          href={"/chat"}
          className="px-4 py-1 rounded-full text-black bg-white"
        >
          <span className="font-semibold text-[1.05rem] font-geistSans leading-[0]">
            Chat with AI
          </span>
        </Link>
      </div>
    </header>
  );
}
