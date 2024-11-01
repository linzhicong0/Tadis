import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import SideNav from "./components/sidenav";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./components/app-sidebar";
import WindowTitleBar from "./components/window-titlebar";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark rounded-t-lg">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex h-screen w-screen rounded-t-lg`}
      >
        <WindowTitleBar>
        <SidebarProvider>
          <AppSidebar />
          <main >
            <SidebarTrigger />
            {children}
          </main>
        </SidebarProvider>
        </WindowTitleBar>
      </body>
    </html>
  );
}
