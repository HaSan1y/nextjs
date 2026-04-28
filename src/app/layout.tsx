import ClientLayout from "./clientLayout";
import { Suspense } from "react";
import { getUser } from "../auth/server";

import "../styles/globals.css";

type LayoutProps = {
  children: React.ReactNode;
};

export default async function RootLayout({ children }: LayoutProps) {
  const initialSession = await getUser();

  return (
    <html lang="en" suppressHydrationWarning>
      <body className="flex flex-col min-h-screen w-full bg-slate-50 dark:bg-slate-900 animate-gradient bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 dark:from-slate-900 dark:via-purple-900 dark:to-slate-900 text-slate-900 dark:text-slate-200">
        <Suspense fallback={<div>Loading...</div>}>
          <ClientLayout initialSession={initialSession}>{children}</ClientLayout>
        </Suspense>
      </body>
    </html>
  );
}
