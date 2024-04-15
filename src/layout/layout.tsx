"use client";
import React, { useState, useEffect } from "react";
import { ChildContainerProps } from "@/types/types";
import Link from "next/link";
import HeaderComponent from "./header";
import { homeMenu, projectMenu, clusterMenu, serviceMenu } from "./menu";
import { HomeIcon } from "@radix-ui/react-icons";

const Layout = ({ children }: ChildContainerProps) => {
  const [activePath, setActivePath] = useState("");
  useEffect(() => {
    setActivePath(window.location.pathname);
  }, []);
  const ids = activePath.match(/\d+/g);
  let clusterid = "";
  let projectid = "";
  let serviceid = "";
  const numberArray = ids?.map(Number) ?? [];
  for (let i = 0; i < numberArray.length; i++) {
    if (i === 0) {
      clusterid = ids?.[i] ?? "";
    }
    if (i === 1) {
      projectid = ids?.[i] ?? "";
    }
    if (i === 2) {
      serviceid = ids?.[i] ?? "";
    }
  }
  let menu = homeMenu;
  if (numberArray.length === 1) {
    for (let i = 0; i < clusterMenu.length; i++) {
      clusterMenu[i].path = clusterMenu[i].path.replace("clusterid", clusterid);
      if (clusterMenu[i].path === activePath) {
        menu = clusterMenu;
      }
    }
  } else if (numberArray.length === 2) {
    for (let i = 0; i < projectMenu.length; i++) {
      projectMenu[i].path = projectMenu[i].path.replace("clusterid", clusterid);
      projectMenu[i].path = projectMenu[i].path.replace("projectid", projectid);
      if (projectMenu[i].path === activePath) {
        menu = projectMenu;
      }
    }
  } else if (numberArray.length === 3) {
    for (let i = 0; i < serviceMenu.length; i++) {
      serviceMenu[i].path = serviceMenu[i].path.replace("clusterid", clusterid);
      serviceMenu[i].path = serviceMenu[i].path.replace("projectid", projectid);
      serviceMenu[i].path = serviceMenu[i].path.replace("serviceid", serviceid);
      if (serviceMenu[i].path === activePath) {
        menu = serviceMenu;
      }
    }
  }

  return (
    <React.Fragment>
      <div className="grid min-h-screen w-full overflow-hidden lg:grid-cols-[280px_1fr]">
        <div className="hidden border-r bg-gray-100/40 lg:block dark:bg-gray-800/40">
          <div className="flex flex-col gap-2">
            <div className="flex h-[60px] items-center px-6">
              <Link className="flex items-center gap-2 font-semibold" href="/">
                <HomeIcon className="h-6 w-6" />
                <span className="">Home</span>
              </Link>
            </div>
            <div className="flex-1">
              <nav className="grid items-start px-4 text-sm font-medium">
                {menu.map((item, index) => {
                  const itemPath = item.path;
                  const isActive = itemPath === activePath;
                  const className = isActive
                    ? "flex items-center gap-3 rounded-lg bg-gray-100 px-3 py-2 text-gray-900  transition-all hover:text-gray-900 dark:bg-gray-800 dark:text-gray-50 dark:hover:text-gray-50"
                    : "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50";

                  return (
                    <Link
                      href={itemPath}
                      key={index}
                      className={className}
                      onClick={() => setActivePath(itemPath)}
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
