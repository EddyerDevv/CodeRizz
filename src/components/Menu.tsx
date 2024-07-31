"use client";
import { useEffect, useRef, useState } from "react";
import { NavLinksProps } from "./Header";
import Link from "next/link";

interface MobileMenuProps {
  buttonMenuRef: React.RefObject<HTMLButtonElement>;
  activeMenu: boolean;
  setActiveMenu: React.Dispatch<React.SetStateAction<boolean>>;
  headerNav: NavLinksProps[];
}

export default function MobileMenu({
  buttonMenuRef,
  activeMenu,
  setActiveMenu,
  headerNav,
}: MobileMenuProps) {
  const [activeOutside, setActiveOutside] = useState(true);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const appHeaderMenu = menuRef.current;
    if (!(appHeaderMenu instanceof HTMLElement)) return;

    appHeaderMenu.style.transform = "scale(0)";
    appHeaderMenu.style.opacity = "0";

    setTimeout(() => {
      appHeaderMenu.style.transition =
        "transform 0.4s cubic-bezier(.32,.72,0,1), opacity 0.25s ease";
      appHeaderMenu.style.transform = "scale(1)";
      appHeaderMenu.style.opacity = "1";

      appHeaderMenu.addEventListener("transitionend", () => {
        setActiveOutside(false);
      });
    }, 10);

    return () => {
      appHeaderMenu.style.transform = "scale(0)";
      appHeaderMenu.style.opacity = "0";
    };
  }, [activeMenu, menuRef]);

  useEffect(() => {
    const menuButton = buttonMenuRef.current;
    const menu = menuRef.current;
    if (!(menuButton instanceof HTMLElement)) return;
    if (!(menu instanceof HTMLElement)) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (activeOutside) return;
      if (
        !menuButton.contains(event.target as Node) &&
        !menu.contains(event.target as Node)
      ) {
        menu.style.opacity = "0";

        menu.addEventListener("transitionend", () => {
          setActiveMenu(false);
        });
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [buttonMenuRef, menuRef, activeOutside]);

  return (
    <div
      className="flex flex-col justify-center items-center absolute top-[2.5rem] right-0 w-[14rem] bg-white z-[100] p-[0.5rem] gap-2 rounded-lg origin-top-right "
      ref={menuRef}
      id="app_header_menu_first"
    >
      <nav className="flex items-center h-full flex-col w-full">
        {headerNav.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            target={item.openInNewTab ? "_blank" : "_self"}
            rel={item.openInNewTab ? "noopener noreferrer" : ""}
            className="px-[0.9rem] w-full h-[2.215rem] hover:bg-neutral-200 overflow-hidden whitespace-nowrap text-ellipsis transition-colors duration-[0.2s] rounded-lg flex items-center justify-center"
          >
            <span className="text-black text-[0.975rem] font-semibold">
              {item.label}
            </span>
          </Link>
        ))}
      </nav>
      <hr className="h-[0.0625rem] w-[80%] bg-black/20 border-none" />
      <Link
        href={"/chat"}
        className="flex w-full items-center justify-center gap-2 text-black font-semibold h-[2.215rem] hover:bg-neutral-200 transition-colors duration-[0.2s] rounded-lg"
      >
        <span className="font-geistSans text-[0.975rem] pr-1">
          Chat with AI
        </span>
      </Link>
    </div>
  );
}
