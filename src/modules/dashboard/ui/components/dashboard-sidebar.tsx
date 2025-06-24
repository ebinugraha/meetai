"use client";

import {
  BotIcon,
  Calendar,
  Home,
  Inbox,
  Search,
  Settings,
  StarIcon,
  VideoIcon,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { DashboardUserButton } from "./dashboard-user-button";

export const firstSection = [
  {
    icon: VideoIcon,
    label: "Meetings",
    href: "/meetings",
  },
  {
    icon: BotIcon,
    label: "Agents",
    href: "/agent",
  },
];

export const secondSection = [
  { icon: StarIcon, label: "Upgrade", href: "/upgrade" },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  //   const pathname = "/meetings";

  return (
    <Sidebar>
      <SidebarHeader className="text-sidebar-accent-foreground">
        <Link href="/" className="flex items-center gap-2 px-2 pt-2">
          <Image src={"/logo.svg"} alt={"meetai"} height={36} width={36} />
          <p className="text-2xl font-semibold">Meet.Ai</p>
        </Link>
      </SidebarHeader>
      <div className="px-4 py-2">
        <SidebarSeparator className="opacity-10 text-[#5D6B68]" />
      </div>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {firstSection.map((data) => (
                <SidebarMenuItem key={data.href}>
                  <SidebarMenuButton
                    className={cn(
                      "h-10 hover:bg-gradient-to-r from-[#a938c7] to-[#a938c7]/10",
                      pathname === data.href &&
                        "bg-gradient-to-r from-[#a938c7] to-[#a938c7]/10 text-white"
                    )}
                    asChild
                  >
                    <Link href={data.href}>
                      <data.icon className="size-5" />
                      <span className="text-sm font-medium tracking-tight">
                        {data.label}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <div className="px-4 py-2">
          <SidebarSeparator className="opacity-10 text-[#5D6B68]" />
        </div>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {secondSection.map((data) => (
                <SidebarMenuItem key={data.href}>
                  <SidebarMenuButton
                    className={cn(
                      "h-10 hover:bg-gradient-to-r from-[#a938c7] to-[#a938c7]/10",
                      pathname === data.href &&
                        "bg-gradient-to-r from-[#a938c7] to-[#a938c7]/10 text-white"
                    )}
                    asChild
                  >
                    <Link href={data.href}>
                      <data.icon className="size-5" />
                      <span className="text-sm font-medium tracking-tight">
                        {data.label}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="text-white">
        <DashboardUserButton />
      </SidebarFooter>
    </Sidebar>
  );
}
