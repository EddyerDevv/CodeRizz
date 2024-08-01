"use client";

import { Fragment } from "react";
import {
  ArrowRightIcon,
  HistoryIcon,
  MessageSquareIcon,
  RabbitIcon,
} from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import Header from "@/components/Header";
import TypeWriter from "@/components/animation/TypeWriter";
import Link from "next/link";
import Image from "next/image";
import Spotlight from "@/components/SpotLight";

const props = {
  className: "text-white size-[2rem]",
  absoluteStrokeWidth: true,
  strokeWidth: 1.75,
};

export default function Page() {
  const t = useTranslations("LandingPage");
  const itemKeys = ["fast", "realTime", "history"] as const;
  const locale = useLocale();

  const internationalizedFeatures = itemKeys.map((key) => ({
    title: t(`features.items.${key}.title`),
    description: t(`features.items.${key}.description`),
  }));

  const icons = [
    <RabbitIcon {...props} />,
    <MessageSquareIcon {...props} />,
    <HistoryIcon {...props} />,
  ];

  const keyFeatures = internationalizedFeatures.map((feature, index) => {
    return {
      icon: icons[index],
      title: feature.title,
      description: feature.description,
    };
  });

  const DESCRIPTIONS = t("header.descriptions").split("-");

  return (
    <Fragment>
      <Header />
      <main className="flex w-full h-dvh flex-col items-center justify-center relative z-[10] gap-2 px-2s">
        <div className="size-full z-[20] absolute pointer-events-none overflow-hidden">
          <Spotlight
            className="-top-[25rem] -left-[30rem] absolute opacity-60 max-md:-left-[15rem] max-md:-top-[20rem]"
            fill="white"
          />
        </div>
        <div className="size-full z-[20] absolute pointer-events-none overflow-hidden max-md:hidden">
          <Image
            alt="HeartFire Fluent Emoji"
            src={"/HeartFire.png"}
            width={256}
            height={256}
            className="pointer-events-none size-[10rem] left-[10%] top-[24%] -rotate-[15deg] absolute animation-up-down max-[860px]:top-[18%] max-[860px]:right-[5%] max-[860px]:size-[8rem] max-md:size-[6rem] animate-delay-0 aspect-square"
          />
          <Image
            alt="Monkey Fluent Emoji"
            src={"/Monkey.png"}
            width={256}
            height={256}
            className="pointer-events-none size-[8rem] left-[28%] bottom-[8%] rotate-[15deg] absolute animation-up-down-2 max-[860px]:bottom-[8%] max-[860px]:left-[20%] max-[860px]:size-[8rem] max-md:size-[6rem] aspect-square"
          />
          <Image
            alt="HotFace Fluent Emoji"
            src={"/HotFace.png"}
            width={256}
            height={256}
            className="pointer-events-none size-[10rem] right-[9%] top-[20%] rotate-[15deg] absolute animation-up-down-2 max-[860px]:top-[13%] max-[860px]:right-[5%] max-[860px]:size-[8rem] max-md:size-[6rem] aspect-square"
          />
          <Image
            alt="FaceHearts Fluent Emoji"
            src={"/FaceHearts.png"}
            width={256}
            height={256}
            className="pointer-events-none size-[8rem] right-[20%] bottom-[15%] rotate-[15deg] absolute animation-up-down max-[860px]:bottom-[15%] max-[860px]:right-[20%] max-[860px]:size-[8rem] max-md:size-[6rem]aspect-square"
          />
        </div>
        <Link
          href={`/${locale}/chat`}
          className="flex items-center justify-center gap-2 text-neutral-100 rounded-full px-4 font-medium h-[1.875rem] animate-fade-in-up bg-white/5 border border-white/10 transition-colors duration-300 ease-out hover:border-white/20 hover:bg-white/10 z-30 backdrop-blur-xl"
        >
          <span className="font-geistSans text-[1.08825rem] leading-[0]">
            {t("header.linkButton")}
          </span>
          <ArrowRightIcon
            className="size-[1.3rem] text-white"
            absoluteStrokeWidth
            strokeWidth={1.5}
          />
        </Link>
        <header className="flex flex-col items-center justify-center max-w-[47rem] w-full max-md:max-w-[40rem] mt-4 animate-fade-in-up animate-delay-250 z-30">
          <h1 className="text-[3.9rem] font-semibold font-geistSans text-center leading-[3.75rem] max-md:text-[3rem] max-md:leading-[2.85rem] ">
            {t("header.title")}
            <span className="font-bold">
              <TypeWriter
                text={DESCRIPTIONS}
                speed={40}
                className="bg-gradient-to-r from-red-500 to-pink-500 text-transparent bg-clip-text"
              />
            </span>
          </h1>
        </header>
        <div className="flex flex-col w-full items-center justify-center gap-5 mt-4 z-30">
          <p className="text-[1.425rem] leading-[1.5rem] font-normal text-center max-w-[38rem] text-neutral-400 max-md:text-[1.2rem] max-md:leading-[1.375rem] max-md:max-w-[30rem] animate-fade-in-up animate-delay-500">
            {t("header.description")}
          </p>
          <button className="flex items-center justify-center gap-2 rounded-full px-5 py-1 text-black bg-white ease-out max-md:px-4 max-md:py-1 animate-fade-in-up animate-delay-900">
            <span className="text-[1.325rem] font-semibold font-geistSans max-md:text-[1.15rem]">
              {t("actions.startNowButton")}
            </span>
          </button>
        </div>
      </main>
      {/* Preview */}
      <div className="flex w-full flex-col items-center justify-center pb-4 relative top-[-12%]">
        <section className="aspect-video border border-white/15 w-[85%] rounded-lg bg-white/5 p-4 max-md:w-[100%] max-md:rounded-none  max-md:p-2">
          <div className="size-full rounded-lg bg-white/5 flex flex-col items-center justify-center max-md:rounded-none ">
            <span className="text-white font-bold text-[1.5rem] max-md:text-[1.25rem]">
              {t("preview.title")}
            </span>
            <p className="text-white/70 font-semibold text-[1rem] ">
              {t("preview.description", { date: "6/7/2024" })}
            </p>
          </div>
        </section>
      </div>
      <section className="flex w-full flex-col items-center justify-center px-8 gap-8 py-24">
        {" "}
        <div className="size-full z-[20] absolute pointer-events-none overflow-hidden">
          <div className="text-[64rem] absolute blur-3xl -rotate-[90deg] -top-[32rem] opacity-15 max-md:text-[40rem] max-md:-top-[4rem] max-md:opacity-30 ">
            /
          </div>
        </div>
        <header className="flex flex-col w-full items-center justify-center ">
          <h1 className="text-[2.25rem] font-bold">{t("features.title")}</h1>
          <p className="text-[1.25rem] font-normal text-neutral-400 max-md:text-[1.125rem] max-w-[35rem] text-center leading-[1.325rem]">
            {t("features.description")}
          </p>
        </header>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {keyFeatures.map((feature) => (
            <article
              key={feature.title}
              className="flex flex-col items-start justify-start gap-1 rounded-xl border border-white/20 bg-white/10 p-4 w-full hover:border-white/25 hover:bg-white/15 transition-colors duration-300 ease-out pointer-events-auto cursor-default"
            >
              <header className="flex flex-col gap-1">
                {feature.icon}
                <h2 className="text-[1.325rem] font-semibold">
                  {feature.title}
                </h2>
              </header>

              <p className="text-[1rem] font-normal text-neutral-300 leading-[1.1rem] max-w-[22rem]">
                {feature.description}
              </p>
            </article>
          ))}
        </div>
      </section>
      <hr className="w-full border-none h-[1rem]" />
      <section className="flex w-full flex-col items-center justify-center px-8 gap-8">
        <article className="py-6 px-8 rounded-3xl w-full max-w-[60rem] min-h-[22rem] items-center justify-center flex background-blue-purple-diagonal-dark max-[880px]:flex-col-reverse max-[880px]:items-start gap-4">
          <div className="flex flex-col min-w-md max-w-[35.7rem] flex-1 items-start gap-2">
            <h1 className="text-[2.9rem] font-semibold leading-none max-md:text-[2rem]">
              {t("card.title")}
            </h1>
            <p className="leading-[1.6rem] text-white/60 text-[1.25rem] max-md:text-[1.1rem] max-md:leading-[1.2rem]">
              {t("card.description")}
            </p>
            <div className="h-5"></div>
            <Link
              href={`/${locale}/chat`}
              className="rounded-[4rem] gap-2 transition-all duration-300 cursor-pointer select-none shadow-black hover:brightness-110 hover:shadow-[0_10px_50px_rgba(0,0,0,0.3)] inline-flex justify-center items-center bg-white px-4 py-1"
            >
              <span className="font-geistSans text-[1.375rem] font-semibold bg-gradient-to-r from-red-500 to-pink-500 text-transparent bg-clip-text">
                {t("actions.startNowButton")}
              </span>
            </Link>
          </div>
          <div className="z-10 shrink-0 flex items-center justify-center  my-auto mr-8">
            <Image
              src={"/logo.png"}
              alt="Code Rizz Logo"
              width={512}
              height={512}
              className="pointer-events-none size-[15rem] rotate-12 max-md:size-[10rem]"
            />
          </div>
        </article>
      </section>
      <hr className="w-full border-none h-[8rem]" />
      <footer className="mx-8 mt-auto flex flex-col items-center pb-[2.77rem]">
        <div className="flex flex-col mx-8 w-full max-w-[60rem] gap-8">
          <div className="flex flex-row items-end justify-between gap-x-2 sm:flex-row sm:items-center">
            <div className="flex flex-col items-start gap-x-[2rem] gap-y-[2rem] md:flex-row md:items-center">
              <div className="flex flex-row items-center gap-[0.4rem] text-[0.9rem] font-semibold">
                <figure className="flex items-center">
                  <Image
                    src={"/logo.png"}
                    alt="Code Rizz Logo"
                    width={100}
                    height={100}
                    className="pointer-events-none size-[1.8rem] -rotate-[15deg]"
                  />
                  <figcaption className="sr-only">Code Rizz</figcaption>
                </figure>
                <span className="font-semibold font-geistSans text-[1rem] text-white">
                  Code Rizz
                </span>
              </div>
              <nav
                aria-label="Footer Navigation"
                className="flex flex-col gap-[1.2rem] sm:flex-row"
              >
                <Link
                  href={
                    "https://github.com/EddyerDevv/CodeRizz#%EF%B8%8F-maintainers"
                  }
                  target="_blank"
                  referrerPolicy="no-referrer"
                  className="rounded-full text-white hover:text-gray-300 transition-colors duration-300"
                >
                  <span className="font-medium text-[1rem] font-geistSans leading-[0]">
                    {t("pages.leads")}
                  </span>
                </Link>
                <Link
                  href={"https://github.com/EddyerDevv/CodeRizz#-changelogs"}
                  target="_blank"
                  referrerPolicy="no-referrer"
                  className="rounded-full text-white hover:text-gray-300 transition-colors duration-300"
                >
                  <span className="font-medium text-[1rem] font-geistSans leading-[0]">
                    {t("pages.changelogs")}
                  </span>
                </Link>
              </nav>
            </div>
            <div className="flex flex-row flex-wrap items-center justify-end gap-[0.5rem]">
              <Link
                href={"#"}
                className="text-white size-[1.725rem] hover:text-gray-300 transition-colors duration-300 mb-[1px]"
                aria-label="GitHub"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  x="0px"
                  y="0px"
                  fill="currentColor"
                  viewBox="0 0 30 30"
                >
                  <path d="M15,3C8.373,3,3,8.373,3,15c0,5.623,3.872,10.328,9.092,11.63C12.036,26.468,12,26.28,12,26.047v-2.051 c-0.487,0-1.303,0-1.508,0c-0.821,0-1.551-0.353-1.905-1.009c-0.393-0.729-0.461-1.844-1.435-2.526 c-0.289-0.227-0.069-0.486,0.264-0.451c0.615,0.174,1.125,0.596,1.605,1.222c0.478,0.627,0.703,0.769,1.596,0.769 c0.433,0,1.081-0.025,1.691-0.121c0.328-0.833,0.895-1.6,1.588-1.962c-3.996-0.411-5.903-2.399-5.903-5.098 c0-1.162,0.495-2.286,1.336-3.233C9.053,10.647,8.706,8.73,9.435,8c1.798,0,2.885,1.166,3.146,1.481C13.477,9.174,14.461,9,15.495,9 c1.036,0,2.024,0.174,2.922,0.483C18.675,9.17,19.763,8,21.565,8c0.732,0.731,0.381,2.656,0.102,3.594 c0.836,0.945,1.328,2.066,1.328,3.226c0,2.697-1.904,4.684-5.894,5.097C18.199,20.49,19,22.1,19,23.313v2.734 c0,0.104-0.023,0.179-0.035,0.268C23.641,24.676,27,20.236,27,15C27,8.373,21.627,3,15,3z"></path>
                </svg>
              </Link>
              <Link
                href={`${locale}/chat`}
                className="px-4 py-1 rounded-full text-black bg-white"
              >
                <span className="font-semibold text-[1.05rem] font-geistSans leading-[0]">
                  {t("actions.chat")}
                </span>
              </Link>
            </div>
          </div>
          <hr
            className="h-[1px] w-full border-none"
            style={{
              background:
                "linear-gradient(90deg, rgba(255, 255, 255, 0.00) 0%, rgba(255, 255, 255, 0.50) 50%, rgba(255, 255, 255, 0.00) 100%)",
            }}
          />
          <div className="flex flex-row flex-wrap justify-between gap-x-8 gap-y-4 text-[0.7rem] text-white/50">
            <p>Copyright © 2024 Kuda LLC. Powered by Vercel.</p>
          </div>
        </div>
      </footer>
    </Fragment>
  );
}
