"use client";
import { ShoppingCartIcon, UsersIcon, PackageIcon } from "@/components/icon";
import {
  LaptopIcon,
  GlobeIcon,
  RowsIcon,
  TableIcon,
  TargetIcon,
  Crosshair2Icon,
  RocketIcon,
  DashboardIcon,
} from "@radix-ui/react-icons";

export const homeMenu = [
  {
    title: "Dashboard",
    icon: DashboardIcon,
    path: "/home",
  },
  {
    title: "Cluster",
    icon: LaptopIcon,
    path: "/home/cluster",
  },
  {
    title: "App Store",
    icon: ShoppingCartIcon,
    path: "/home/app",
  },
  {
    title: "App Repositorie",
    icon: GlobeIcon,
    path: "/home/apprepo",
  },
  {
    title: "Users",
    icon: UsersIcon,
    path: "/home/user",
  },
  {
    title: "Roles",
    icon: RowsIcon,
    path: "/home/role",
  },
];

const clusterMenuPrefix = "/home/cluster/clusterid";

export const clusterMenu = [
  {
    title: "Dashboard",
    icon: DashboardIcon,
    path: clusterMenuPrefix,
  },
  {
    title: "Project",
    icon: TableIcon,
    path: clusterMenuPrefix + "/project",
  },
  {
    title: "Application",
    icon: RocketIcon,
    path: clusterMenuPrefix + "/app",
  },
];

const projectMenuPrefix = "/home/cluster/clusterid/project/projectid";

export const projectMenu = [
  {
    title: "Dashboard",
    icon: DashboardIcon,
    path: projectMenuPrefix,
  },
  {
    title: "Service",
    icon: PackageIcon,
    path: projectMenuPrefix + "/service",
  },
  {
    title: "Application",
    icon: RocketIcon,
    path: projectMenuPrefix + "/app",
  },
];

const serviceMenuPrefix =
  "/home/cluster/clusterid/project/projectid/service/serviceid";

export const serviceMenu = [
  {
    title: "Dashboard",
    icon: DashboardIcon,
    path: serviceMenuPrefix,
  },
  {
    title: "CIntegration",
    icon: Crosshair2Icon,
    path: serviceMenuPrefix + "/ci",
  },
  {
    title: "CDelivery",
    icon: TargetIcon,
    path: serviceMenuPrefix + "/cd",
  },
];

export const breadCrumbCluster = [
  {
    title: "Cluster",
    path: clusterMenuPrefix,
  },
];

export const breadCrumbProject = [
  {
    title: "Cluster",
    path: clusterMenuPrefix,
  },
  {
    title: "Project",
    path: projectMenuPrefix,
  },
];

export const breadCrumbService = [
  {
    title: "Cluster",
    path: clusterMenuPrefix,
  },
  {
    title: "Project",
    path: projectMenuPrefix,
  },
  {
    title: "Service",
    path: serviceMenuPrefix,
  },
];
