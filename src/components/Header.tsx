"use client";
import { EllipsisVerticalIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import MobileMenu from "./Menu";

export interface NavLinksProps {
  label: string;
  href: string;
  openInNewTab?: boolean;
}

export const navLinks: NavLinksProps[] = [
  {
    label: "ChangeLogs",
    href: "https://github.com/EddyerDevv/CodeRizz#-changelogs",
    openInNewTab: true,
  },
  {
    label: "Maintainers",
    href: "https://github.com/EddyerDevv/CodeRizz#%EF%B8%8F-maintainers",
    openInNewTab: true,
  },
];

export default function Header() {
  const [activeMenu, setActiveMenu] = useState(false);
  const buttonMenuRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    function handleResize() {
      if (activeMenu && window.innerWidth >= 768) {
        setActiveMenu(false);
      }
    }

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [activeMenu]);

  useEffect(() => {
    const html = document.querySelector("html");
    if (!(html instanceof HTMLElement)) return;
    if (activeMenu) html.style.overflow = "hidden";
    else html.removeAttribute("style");

    return () => html.removeAttribute("style");
  }, [activeMenu]);

  const handleMenuClick = () => {
    const appMenu = document.querySelector("#app_header_menu_first");

    if (!(appMenu instanceof HTMLElement)) {
      setActiveMenu(true);
    } else {
      appMenu.style.opacity = "0";

      appMenu.addEventListener("transitionend", () => {
        setActiveMenu(false);
      });
    }
  };

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
      <nav className="flex items-center gap-3 max-md:hidden">
        <Link
          href={"https://github.com/EddyerDevv/CodeRizz#-maintainers"}
          target="_blank"
          referrerPolicy="no-referrer"
          className="rounded-full text-white hover:text-gray-300 transition-colors duration-300"
        >
          <span className="font-semibold text-[1.05rem] font-geistSans leading-[0]">
            Maintainers
          </span>
        </Link>
        <Link
          href={"https://github.com/EddyerDevv/CodeRizz#-changelogs"}
          target="_blank"
          referrerPolicy="no-referrer"
          className="rounded-full text-white hover:text-gray-300 transition-colors duration-300"
        >
          <span className="font-semibold text-[1.05rem] font-geistSans leading-[0]">
            ChangeLogs
          </span>
        </Link>
      </nav>
      <div className="flex items-center gap-2 max-md:hidden">
        <Link
          href={"/chat"}
          className="px-4 py-1 rounded-full text-black bg-white"
        >
          <span className="font-semibold text-[1.05rem] font-geistSans leading-[0]">
            Chat with AI
          </span>
        </Link>
      </div>
      <div className="flex flex-col justify-center items-center relative md:hidden">
        <button
          ref={buttonMenuRef}
          onClick={handleMenuClick}
          className={`transition-colors duration-[0.2s] ease-out flex gap-2 justify-center items-center bg-white/10 hover:bg-white/20 rounded-full relative p-[0.35rem] text-white`}
        >
          <EllipsisVerticalIcon className="size-[1.65re pointer-events-none" />
        </button>
        {activeMenu && (
          <MobileMenu
            activeMenu={activeMenu}
            setActiveMenu={setActiveMenu}
            buttonMenuRef={buttonMenuRef}
            headerNav={navLinks}
          />
        )}
      </div>
    </header>
  );
}
