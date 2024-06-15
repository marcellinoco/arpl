"use client";

import { FC, useState } from "react";
import { usePathname } from "next/navigation";

import { logout } from "@/app/auth/action";
import useAuthStore from "@/store/useAuthStore";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  ChevronLeftIcon,
  FolderIcon,
  InboxIcon,
  LogOutIcon,
} from "lucide-react";

const shownPages = ["/dashboard", "/wiki"];

const Sidebar: FC = () => {
  const { user, clear } = useAuthStore();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const pathname = usePathname();
  if (!shownPages.some((path) => pathname.startsWith(path))) return;

  return (
    <div
      className={cn(
        "overflow-hidden h-screen transition-all duration-300 flex flex-col",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      <div
        className={cn(
          "h-[52px] flex items-center px-5",
          isCollapsed ? "justify-center" : "justify-between"
        )}
      >
        {!isCollapsed && <h1 className="text-lg font-bold">AutoRepl.ai</h1>}
        <Button
          className="shrink-0"
          variant="outline"
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          <ChevronLeftIcon
            className={cn("transition", isCollapsed && "rotate-180")}
          />
        </Button>
      </div>

      <div className="shrink-0 bg-border h-[1px] w-full"></div>
      <div className="grow flex flex-col py-4">
        <div
          className={cn(
            "flex flex-col justify-center pt-4 px-[20px]",
            isCollapsed && "hidden"
          )}
        >
          <div className="grid gap-1">
            <h1 className="md:text-xl font-bold truncate">{user?.name}</h1>
            <h2 className="text-xs md:text-sm font-normal truncate">
              {user?.email}
            </h2>
          </div>
        </div>

        <nav
          className={cn(
            "flex-grow flex flex-col gap-1",
            isCollapsed ? "items-center px-2" : "p-4"
          )}
        >
          <Link className="shrink-0 w-full" href="/dashboard">
            <Button
              className={cn(
                "gap-x-2 w-full",
                isCollapsed ? "justify-center" : "justify-start"
              )}
              variant="ghost"
            >
              <InboxIcon className="h-4 w-4" />
              {!isCollapsed && "Inbox"}
            </Button>
          </Link>

          <Link className="w-full" href="/wiki">
            <Button
              className={cn(
                "gap-x-2 w-full",
                isCollapsed ? "justify-center" : "justify-start"
              )}
              variant="ghost"
            >
              <FolderIcon className="h-4 w-4" />
              {!isCollapsed && "Wiki"}
            </Button>
          </Link>

          <Button
            className={cn(
              "gap-x-2 w-full mt-auto",
              isCollapsed ? "justify-center" : "justify-start"
            )}
            variant="ghost"
            onClick={() => {
              clear();
              logout();
            }}
          >
            <LogOutIcon className="h-4 w-4" />
            {!isCollapsed && "Logout"}
          </Button>
        </nav>
      </div>
    </div>
  );
};

Sidebar.displayName = "Sidebar";
export default Sidebar;
