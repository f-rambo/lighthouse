"use client";
import React, { useState, useEffect } from "react";
import { ChildContainerProps } from "../types/types";
import Link from "next/link";
import HeaderComponent from "./header";
import { ShoppingCartIcon, PackageIcon } from "@/components/icon";
import { HomeIcon, BackpackIcon, TableIcon } from "@radix-ui/react-icons";

let menu = [
  {
    title: "Dashboard",
    icon: HomeIcon,
    path: "/project",
  },
  {
    title: "Projects",
    icon: TableIcon,
    path: "/project/list",
  },
  {
    title: "Services",
    icon: PackageIcon,
    path: "/project/service",
  },
  {
    title: "Apps",
    icon: ShoppingCartIcon,
    path: "/project/app",
  },
];

const Layout = ({ children }: ChildContainerProps) => {
  const [activePath, setActivePath] = useState("");
  useEffect(() => {
    setActivePath(window.location.pathname);
  }, []);
  return (
    <React.Fragment>
      <div className="grid min-h-screen w-full overflow-hidden lg:grid-cols-[280px_1fr]">
        <div className="hidden border-r bg-gray-100/40 lg:block dark:bg-gray-800/40">
          <div className="flex flex-col gap-2">
            <div className="flex h-[60px] items-center px-6">
              <Link className="flex items-center gap-2 font-semibold" href="/">
                <BackpackIcon className="h-6 w-6" />
                <span className="">Acme Inc</span>
              </Link>
            </div>
            <div className="flex-1">
              <nav className="grid items-start px-4 text-sm font-medium">
                {menu.map((item, index) => {
                  const isActive = item.path === activePath;
                  const className = isActive
                    ? "flex items-center gap-3 rounded-lg bg-gray-100 px-3 py-2 text-gray-900  transition-all hover:text-gray-900 dark:bg-gray-800 dark:text-gray-50 dark:hover:text-gray-50"
                    : "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50";

                  return (
                    <Link
                      href={item.path}
                      key={index}
                      className={className}
                      onClick={() => setActivePath(item.path)}
                    >
                      <item.icon className="h-4 w-4" />
                      {item.title}
                    </Link>
                  );
                })}
              </nav>
            </div>
          </div>
        </div>
        <div className="flex flex-col">
          {HeaderComponent()}
          <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
            {children}
          </main>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Layout;
