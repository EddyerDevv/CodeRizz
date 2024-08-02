"use client";
import { EllipsisVerticalIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import MobileMenu from "./Menu";
import Select from "./feat/Select";

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
  const t = useTranslations("LandingPage");

  const locale = useLocale();

  useEffect(() => {
    function handleResize() {
      if (activeMenu && window.innerWidth >= 990) {
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

  const router = useRouter();

  const handleLanguageChange = (newLanguage: string) => {
    router.push(`/${newLanguage}`, {
      scroll: false,
    });
  };

  const selectOptions = [
    {
      label: t("langs.en"),
      value: "en",
      active: locale === "en",
    },
    {
      label: t("langs.es"),
      value: "es",
      active: locale === "es",
    },
  ];
  const defaultValue = locale === "en" ? t("langs.en") : t("langs.es");

  return (
    <header className="fixed w-full h-[4rem] flex items-center justify-around backdrop-blur gap-2 px-4 max-[990px]:justify-between z-[100]">
      <figure className="flex items-center justify-center flex-grow max-[990px]:flex-grow-0 max-[990px]:basis-auto basis-0">
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
      <nav className="flex items-center justify-center gap-3 max-[990px]:hidden flex-grow max-[990px]:basis-auto basis-0">
        <Link
          href={"https://github.com/EddyerDevv/CodeRizz#-maintainers"}
          target="_blank"
          referrerPolicy="no-referrer"
          className="rounded-full text-white hover:text-gray-300 transition-colors duration-300"
        >
          <span className="font-semibold text-[1.05rem] font-geistSans leading-[0]">
            {t("pages.leads")}
          </span>
        </Link>
        <Link
          href={"https://github.com/EddyerDevv/CodeRizz#-changelogs"}
          target="_blank"
          referrerPolicy="no-referrer"
          className="rounded-full text-white hover:text-gray-300 transition-colors duration-300"
        >
          <span className="font-semibold text-[1.05rem] font-geistSans leading-[0]">
            {t("pages.changelogs")}
          </span>
        </Link>
      </nav>
      <div className="flex items-center justify-center gap-2 relative flex-grow marker: max-[990px]:flex-grow-0 basis-0 max-[990px]:basis-auto">
        <Select
          actualValue={defaultValue}
          options={selectOptions}
          direction="top"
          onChange={({ value }) => {
            handleLanguageChange(value);
          }}
        />
        <Link
          href={`${locale}/chat`}
          className="px-4 py-1 rounded-full text-black bg-white max-[990px]:hidden block"
        >
          <span className="font-semibold text-[1.05rem] font-geistSans leading-[0]">
            {t("actions.chat")}
          </span>
        </Link>
        <button
          ref={buttonMenuRef}
          onClick={handleMenuClick}
          className={`transition-colors duration-[0.2s] ease-out gap-2 justify-center items-center bg-white/10 hover:bg-white/20 rounded-full relative p-[0.35rem] text-white max-[990px]:flex hidden`}
        >
          <EllipsisVerticalIcon className="size-[1.5rem] pointer-events-none" />
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
