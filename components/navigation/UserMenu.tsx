"use client";
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs";
import { KindeUser } from "@kinde-oss/kinde-auth-nextjs/types";
import { Popover, PopoverContent, PopoverTrigger } from "@nextui-org/popover";
import { Avatar, Button, Skeleton, User } from "@nextui-org/react";
import { LogOut, SquareUser } from "lucide-react";
import Link from "next/link";
import { FC } from "react";

interface UserMenuProps {
  user: KindeUser | null;
}

const UserMenu: FC<UserMenuProps> = ({ user }) => {
  if (!user) {
    return <Skeleton className="flex rounded-full w-12 h-12 " />;
  }
  return (
    <Popover placement="bottom-end" size="lg" offset={10} showArrow>
      <PopoverTrigger>
        <button className=" outline-none ring-0 border-none">
          <div className="">
            {/* <User
              classNames={{
                description: "text-xs opacity-50",
                name: "text-sm font-semibold  capitalize",
              }}
              name={user.given_name && user.given_name}
              description={user.email}
              avatarProps={{
                src: `${user.picture}`,
              }}
              // className="capitalize"
            /> */}
            <Avatar
              size="md"
              src={user?.picture ? user.picture : ""}
              name={user?.given_name ?? "null"}
            />
          </div>
        </button>
      </PopoverTrigger>
      <PopoverContent className=" min-w-[250px] max-w-[250px] min-h-[200px] !rounded-md border flex justify-start items-start bg-background">
        <div className="px-1 py-2 flex flex-col justify-start items-start gap-2 w-full">
          <Link
            href={"/dashboard/profile"}
            className="flex justify-start items-center gap-2 hover:bg-slate-100 p-2 rounded-lg w-full transition-all ease-soft-spring"
          >
            <SquareUser className="w-5 h-5" /> My Profile
          </Link>
          <LogoutLink className="flex justify-start items-center gap-2 hover:bg-slate-100 p-2 rounded-lg w-full transition-all ease-soft-spring">
            <LogOut className="w-5 h-5" /> Log out
          </LogoutLink>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default UserMenu;
