import type { Metadata } from "next";
import { Nav } from "@/components/nav";
import "./globals.css";

export const metadata: Metadata = {
  title: "English Coach",
  description: "Application personnelle pour progresser de B2 vers C1.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 p-4 md:flex-row md:p-8">
          <aside className="md:w-56 md:shrink-0">
            <p className="mb-4 px-3 text-lg font-bold">English Coach</p>
            <Nav />
          </aside>
          <main className="flex-1">{children}</main>
        </div>
      </body>
    </html>
  );
}
