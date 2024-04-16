import { Button } from "@/components/ui/button";
import {
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenu,
} from "@/components/ui/dropdown-menu";
import { User } from "@nextui-org/react";
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { BreadCrumb } from "@/types/types";
import React from "react";

export default function HeaderComponent(breadCrumbs: BreadCrumb[]) {
  let lastTwoBreadCrumbs: BreadCrumb[] = [];
  let otherBreadCrumbs: BreadCrumb[] = [];
  if (breadCrumbs) {
    if (breadCrumbs.length > 2) {
      lastTwoBreadCrumbs = breadCrumbs.slice(-2);
      otherBreadCrumbs = breadCrumbs.slice(0, -2);
    } else {
      lastTwoBreadCrumbs = breadCrumbs;
    }
  }

  const otherBreadCrumbsComponent = (breadCrumbs: BreadCrumb[]) => {
    if (breadCrumbs.length === 0) {
      return null;
    }
    return (
      <React.Fragment>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-1">
              <BreadcrumbEllipsis className="h-4 w-4" />
              <span className="sr-only">Toggle menu</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              {breadCrumbs.map((breadCrumb) => (
                <DropdownMenuItem
                  key={breadCrumb.title}
                  onClick={() => (window.location.href = breadCrumb.path)}
                >
                  {breadCrumb.title}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </BreadcrumbItem>
      </React.Fragment>
    );
  };

  return (
    <header className="flex h-14 lg:h-[60px] items-center gap-4 border-b bg-gray-100/40 px-6 dark:bg-gray-800/40">
      <div className="flex flex-1 items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
        <div className="mr-auto flex-1 sm:flex-initial">
          <div className="relative">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/home">Home</BreadcrumbLink>
                </BreadcrumbItem>
                {otherBreadCrumbsComponent(otherBreadCrumbs)}
                {lastTwoBreadCrumbs.map((breadCrumb) => (
                  <React.Fragment key={breadCrumb.title}>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem key={breadCrumb.title}>
                      <BreadcrumbLink href={breadCrumb.path}>
                        {breadCrumb.title}
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                  </React.Fragment>
                ))}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </div>
        <div className="ml-auto flex-1 sm:flex-initial">
          <div className="relative">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost">
                  <User
                    className="rounded-full"
                    name="Jane Doe"
                    description="Product Designer"
                    avatarProps={{
                      src: "https://github.com/shadcn.png",
                    }}
                  />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuItem>Support</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}
