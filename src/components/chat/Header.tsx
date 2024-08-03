import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useChatHook } from "@/providers/chat.provider";
import Link from "next/link";
import Select from "../feat/Select";

export default function Header() {
  const {
    state: { isSidebar },
  } = useChatHook();
  const tLanding = useTranslations("LandingPage");
  const locale = useLocale();
  const router = useRouter();

  const handleLanguageChange = (newLanguage: string) => {
    router.push(`/${newLanguage}/chat`, {
      scroll: false,
    });
  };

  const selectOptions = [
    {
      label: tLanding("langs.en"),
      value: "en",
      active: locale === "en",
    },
    {
      label: tLanding("langs.es"),
      value: "es",
      active: locale === "es",
    },
  ];

  const defaultValue =
    locale === "en" ? tLanding("langs.en") : tLanding("langs.es");

  return (
    <header className="bg-transparent h-[3.5rem] flex items-center justify-between px-2 py-1 gap-2 w-full">
      <Link
        href={"/"}
        className={`flex items-center justify-start text-[1.125rem] font-semibold text-neutral-400 px-2 py-[0.325rem] rounded-lg hover:bg-white/5 z-30 backdrop-blur-xl transition-[color,background-color,transform] duration-300 ease-out hover:text-neutral-100  ${
          isSidebar ? "translate-x-[0rem]" : "translate-x-[5.25rem]"
        }`}
      >
        Code Rizz
      </Link>
      <div className="flex gap-1">
        <Select
          actualValue={defaultValue}
          options={selectOptions}
          className="bg-white/5 !hover:bg-white/10 !rounded-lg mr-[0.1rem]"
          direction="top"
          onChange={({ value }) => {
            handleLanguageChange(value);
          }}
        />
      </div>
    </header>
  );
}
