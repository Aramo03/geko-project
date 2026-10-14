import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { BookOpen, Search, Home } from "lucide-react";
import { NOT_FOUND_CONFIG, NOT_FOUND_LINKS } from "./notFound.js";
import "./notFound.css";





export default function NotFound() {
  const { t } = useTranslation();

  return (
    <main className="flex min-h-[540px] w-full items-center justify-center bg-canvas px-5 py-16 font-sans sm:min-h-[600px]">
      <div className="mx-auto flex w-full max-w-[650px] flex-col items-center text-center">
        <div className="relative mb-4">
          <span className="absolute left-[-22px] top-1/2 h-[5px] w-[5px] rounded-full bg-accent sm:left-[-32px]" />

          <h1 className="text-[100px] font-extrabold leading-none tracking-[-5px] text-brand sm:text-[130px] sm:tracking-[-7px] md:text-[150px]">
              {NOT_FOUND_CONFIG.errorCode}
          </h1>
          <span className="absolute right-[-22px] top-1/2 h-[5px] w-[5px] rounded-full bg-accent sm:right-[-32px]" />
        </div>

        <div className="relative mb-6 flex h-[80px] w-[130px] items-center justify-center">
          <div className="absolute left-[20px] top-[5px] h-[70px] w-[70px] rounded-full bg-mint" />

          <BookOpen
            size={75}
            strokeWidth={1.3}
            className="relative z-10 mt-4 text-brand"
          />

          <div className="absolute right-[2px] top-[17px] z-20">
            <Search
              size={43}
              strokeWidth={2}
              className="text-accent-bright"
            />
          </div>

          <span className="absolute right-[-7px] top-[3px] text-[20px] font-light text-accent-bright">
            +
          </span>

          <span className="absolute left-[5px] top-[33px] h-[4px] w-[4px] rounded-full bg-accent-bright" />
        </div>

        <h2 className="mb-3 text-[25px] font-bold tracking-tight text-brand sm:text-[30px]">
          {t("notFound.title")}
        </h2>

        <p className="mb-7 max-w-[420px] text-[13px] leading-[1.8] text-copy-muted sm:text-[14px]">
          {t("notFound.description")}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            to={NOT_FOUND_LINKS.home}
            className="flex min-h-[41px] items-center justify-center gap-2 rounded-[5px] bg-brand px-5 text-[12px] font-semibold text-white transition-colors duration-200 hover:bg-brand-hover"
          >
            <Home size={15} strokeWidth={2} />
            {t("notFound.backHome")}
          </Link>

          <Link
            to={NOT_FOUND_LINKS.courses}
            className="flex min-h-[41px] items-center justify-center rounded-[5px] border border-brand bg-transparent px-5 text-[12px] font-semibold text-brand transition-colors duration-200 hover:bg-mint"
          >
            {t("notFound.exploreCourses")}
          </Link>
        </div>
      </div>
    </main>
  );
}
