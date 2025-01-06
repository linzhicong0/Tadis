'use client';
import localFont from "next/font/local";
import "./globals.css";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./components/app-sidebar";
import WindowTitleBar from "./components/window-titlebar";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider} from "./components/theme-provider";
import { useEffect } from "react";
import { useTheme } from "next-themes";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setTheme('dark');
    console.log("theme changed to: ", theme);
  }, [setTheme]);

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased select-none`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem={true}
          disableTransitionOnChange
        >
          <SidebarProvider>
            <WindowTitleBar />
            <AppSidebar />
            <main className="mt-8 w-full">
              {children}
            </main>
            <Toaster position="bottom-center" />
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
