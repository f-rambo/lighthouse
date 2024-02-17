import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import Layout from "../../layout/project-layout";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Ocean",
  description: "serverless web apps made easy",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <Layout>{children}</Layout>;
}
