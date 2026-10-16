import { imageUrls } from "@/shared/constants/imageUrls";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { AuthHeader } from "./AuthHeader";
import { AuthFooter } from "./AuthFooter";
import { AuthLogo } from "./AuthLogo";
import { SocialLoginButtons } from "../SocialLoginButtons";
import ScrollableContent from "@/shared/ui/layout/ScrollableContent";
import { APP_PATHS } from "@/shared/constants/appPaths";

interface AuthPageShellProps {
  title: string;
  eyebrow: string;
  heading: string;
  description: string;
  switchText: string;
  switchLabel: string;
  switchTo: string;
  showMobileLogo?: boolean;
  children: ReactNode;
}

export const AuthPageShell = ({
  title,
  eyebrow,
  heading,
  description,
  switchText,
  switchLabel,
  switchTo,
  showMobileLogo = false,
  children,
}: AuthPageShellProps) => {
  return (
    <div className="relative h-screen w-full overflow-hidden bg-[#F7FAFF]">
      <div className="flex h-screen w-full flex-col lg:hidden">
        <AuthHeader title={title} />
        <ScrollableContent className="pt-0! pb-10!">
          <div className="flex-1 px-6">
            <div className="flex w-full flex-col items-center gap-4">
              {showMobileLogo && <AuthLogo />}
              <div className="flex w-full items-center justify-center">
                {children}
              </div>
              <div className="self-stretch text-center text-sm font-light">
                {switchText}{" "}
                <Link to={switchTo} className="font-bold text-[#137FEC]">
                  {switchLabel}
                </Link>
              </div>
              <SocialLoginButtons />
              <AuthFooter />
            </div>
          </div>
        </ScrollableContent>
      </div>

      <main className="hidden h-screen w-full lg:grid lg:grid-cols-[minmax(420px,0.88fr)_minmax(500px,1fr)]">
        <section className="relative overflow-hidden bg-slate-900">
          <img
            src={imageUrls.home.searchSlider[0]}
            alt="Tidala"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(5,20,44,0.8),rgba(8,56,112,0.72),rgba(7,24,50,0.48))]" />

          <div className="relative z-10 flex h-full w-full flex-col px-12 py-10 text-white xl:px-14">
            <Link to={APP_PATHS.ONBOARDING} className="flex items-center gap-3">
              <img
                src={imageUrls.public.faviconApp}
                alt="Tidala Logo"
                className="h-12 w-12"
              />
              <span className="text-2xl font-black tracking-widest">
                TIDALA
              </span>
            </Link>

            <div className="flex flex-1 items-center">
              <div className="max-w-[560px]">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-white/75">
                  {eyebrow}
                </p>
                <h2 className="mt-4 text-[40px] font-extrabold leading-[1.12] text-white xl:text-5xl">
                  {heading}
                </h2>
              </div>
            </div>
          </div>
        </section>

        <section className="flex h-screen items-center justify-center overflow-hidden px-10 py-8 xl:px-16">
          <div className="flex max-h-full w-full max-w-[500px] flex-col">
            <div className="overflow-y-auto rounded-lg border border-slate-200 bg-white px-8 py-7 shadow-[0_18px_60px_rgba(15,23,42,0.08)]">
              <div className="mb-6">
                <p className="text-sm font-semibold text-brand">{eyebrow}</p>
                <h1 className="mt-2 text-2xl font-bold leading-tight text-app-text sm:text-3xl">
                  {title}
                </h1>
                <p className="mt-2 text-sm leading-6 text-app-text-muted">
                  {description}
                </p>
              </div>

              {children}

              <div className="mt-5">
                <SocialLoginButtons />
              </div>

              <div className="mt-5 text-center text-sm font-light text-app-text">
                {switchText}{" "}
                <Link to={switchTo} className="font-bold text-brand">
                  {switchLabel}
                </Link>
              </div>
            </div>

            <div className="mt-5 px-2">
              <AuthFooter />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};
