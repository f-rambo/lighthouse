import React from "react";
import { ChildContainerProps } from "@/types/types";
import { Toaster } from "@/components/ui/toaster";

const Layout = ({ children }: ChildContainerProps) => {
  return (
    <React.Fragment>
      <div>{children}</div>
      <Toaster />
    </React.Fragment>
  );
};

export default Layout;
