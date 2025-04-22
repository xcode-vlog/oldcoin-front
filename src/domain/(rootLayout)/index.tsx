"use client";

import { TopHeader } from "@/components/custom/Header";
import { PropsWithChildren } from "react";

function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="ko">
      <body className="flex flex-col items-center w-full min-h-screen">
        <TopHeader />
        {/* <GnbHeader /> */}

        <section className="relative flex grow w-full justify-center max-w-[var(--max-width-container)]">
          <div className="absolute top-0 right-0 bottom-0 left-0 px-5">
            {children}
          </div>
        </section>
      </body>
    </html>
  );
}

export { RootLayout };
