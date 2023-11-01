import "./globals.css";
import type { Metadata } from "next";
import Head from "next/head";
import { Inter } from "next/font/google";
import Provider from "./components/Provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Life@RTU",
  description: "An RTU Online Feedback Website",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <Head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Poppins"
        />
      </Head>
      <body className={inter.className}>
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
