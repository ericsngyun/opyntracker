import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";

import { TRPCReactProvider } from "~/trpc/react";
import { TooltipProvider } from "~/components/ui/tooltip";
import NavBar from "~/components/NavBar";
import { Toaster } from "~/components/ui/toaster";

export const metadata = {
  title: "Create T3 App",
  description: "Generated by create-t3-app",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
  creator: "eric yun",
  keywords: ["defi", "cryptocurrency", "blockchain"]
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body>
      <Toaster />
      <TooltipProvider>
        <NavBar>
          <TRPCReactProvider>{children}</TRPCReactProvider>
        </NavBar>
      </TooltipProvider>
      </body>
    </html>
  );
}
