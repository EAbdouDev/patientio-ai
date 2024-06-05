"use client";
import { KindeUser } from "@kinde-oss/kinde-auth-nextjs/types";
import Link from "next/link";
import { FC, useEffect, useState } from "react";
import UserMenu from "./UserMenu";
import { usePathname } from "next/navigation";
import { Home, Shapes, Stethoscope } from "lucide-react";
import { Skeleton, Switch, cn } from "@nextui-org/react";
import { createClient } from "@lib/supabase/client";
import useMode from "@zuztand/Mode";
import MobileMenu from "./MobileMenu";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

interface NavProps {
  user: KindeUser | null;
}

const FormSchema = z.object({
  pin: z.string().min(6, {
    message: "Your PIN must be 6 characters.",
  }),
});

const Nav: FC<NavProps> = ({ user }) => {
  const { isInstuctor, setIsInstuctor, isLoading, setIsLoading } = useMode();
  const [isOpen, setIsOpen] = useState(false);
  const password = "123456";

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      pin: "",
    },
  });

  const supabase = createClient();

  const currentPath = usePathname();
  const links = [
    {
      name: "Home",
      href: "/dashboard",
      icon: <Home className="w-5 h-5" />,
      active: currentPath.includes("dashboard"),
      showToStudent: false,
    },
    {
      name: "Cases Manager",
      href: "/cases-manager",
      icon: <Stethoscope className="w-5 h-5" />,
      active: currentPath.includes("cases-manager"),
      showToStudent: false,
    },
    {
      name: "Tutorials",
      href: "/tutorials",
      icon: <Shapes className="w-5 h-5" />,
      active: currentPath.includes("tutorials"),
      showToStudent: false,
    },
  ];

  useEffect(() => {
    const getUserMode = async () => {
      if (user?.email) {
        const { data, error } = await supabase
          .from("patientio_users")
          .select("isInstuctor")
          .eq("email", user.email)
          .single();
        if (error) {
          console.error("Error fetching user mode:", error.message);
          setIsInstuctor(false);
        } else {
          setIsInstuctor(data?.isInstuctor ?? false);
        }
        setIsLoading(false);
      }
    };
    getUserMode();
  }, [user?.email]);

  const updateUserMode = async (value: boolean) => {
    if (isInstuctor === false) {
      setIsOpen(true);
      return;
    }

    const { error } = await supabase
      .from("patientio_users")
      .update({ isInstuctor: false })
      .eq("email", user?.email);
    if (error) {
      console.error("Error updating user mode:", error.message);
    }
    setIsInstuctor(false);
  };

  // if (loading) {
  //   return <div>Loading...</div>;
  // }

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    if (data.pin === password) {
      const { error } = await supabase
        .from("patientio_users")
        .update({ isInstuctor: true })
        .eq("email", user?.email);

      setIsInstuctor(true);
      setIsOpen(false);
      form.reset();

      if (error) {
        console.error("Error updating user mode:", error.message);
      }
    } else {
      throw new Error("Password is not correct");
    }
  };

  return (
    <>
      <div className="w-full ">
        {isInstuctor && (
          <div className="w-full p-2 flex justify-center items-center text-center bg-blue-600">
            <h3 className="font-semibold text-white text-sm lg:text-base">
              Instructor Mode is ON{" "}
            </h3>
          </div>
        )}
        <div className="flex justify-between items-center gap-x-2 w-full h-[60px] border-b border-gray-100 px-4 xl:px-8 pt-8 pb-10">
          <div className="branding flex justify-center items-center xl:gap-8 gap-4 select-none ">
            <div className=" flex xl:hidden">
              <MobileMenu links={links} />
            </div>
            <Link
              href={"/dashboard"}
              className="text-lg lg:text-xl font-bold hover:opacity-70 transition-all ease-soft-spring"
            >
              Patientio AI.
            </Link>
            {/* <span className="text-xs opacity-50 font-medium hidden xl:flex">
              Prototype version
            </span> */}

            <div className=" hidden xl:flex justify-center items-center gap-6  ">
              {links.map((link) => (
                <Link
                  href={link.href}
                  key={link.name}
                  prefetch={false}
                  className={`  flex justify-center items-center gap-2 py-2 px-4  rounded-lg text-sm font-semibold transition-all ease-in-out   ${
                    link.active
                      ? "text-blue-600 opacity-100 "
                      : "hover:bg-blue-100 hover:opacity-100 opacity-70 "
                  }`}
                >
                  {link.icon}
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex justify-end items-center gap-8">
            <div className="hidden xl:flex">
              {isLoading ? (
                <Skeleton className="w-40 h-8 rounded-lg" />
              ) : (
                <Switch
                  isSelected={isInstuctor}
                  onValueChange={updateUserMode}
                  classNames={{
                    base: cn(
                      "inline-flex flex-row-reverse w-full max-w-md bg-gray-100 hover:bg-content2 items-center",
                      "justify-between cursor-pointer rounded-lg gap-2 p-2 border-2 border-transparent",
                      "data-[selected=true]:border-primary"
                    ),
                    wrapper: "p-0 h-4 overflow-visible",
                    thumb: cn(
                      "w-6 h-6 border-2 shadow-lg",
                      "group-data-[hover=true]:border-primary",
                      //selected
                      "group-data-[selected=true]:ml-6",
                      // pressed
                      "group-data-[pressed=true]:w-7",
                      "group-data-[selected]:group-data-[pressed]:ml-4"
                    ),
                  }}
                >
                  <div className="flex flex-col gap-1">
                    <p className="text-sm">Instructor mode</p>
                  </div>
                </Switch>
              )}
            </div>

            <UserMenu user={user} />
          </div>
        </div>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Instructor PIN</DialogTitle>
          </DialogHeader>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-2/3 space-y-6"
            >
              <FormField
                control={form.control}
                name="pin"
                render={({ field }: any) => (
                  <FormItem>
                    <FormLabel>One-Time Password</FormLabel>
                    <FormControl>
                      <InputOTP maxLength={6} {...field}>
                        <InputOTPGroup>
                          <InputOTPSlot index={0} />
                          <InputOTPSlot index={1} />
                          <InputOTPSlot index={2} />
                          <InputOTPSlot index={3} />
                          <InputOTPSlot index={4} />
                          <InputOTPSlot index={5} />
                        </InputOTPGroup>
                      </InputOTP>
                    </FormControl>
                    <FormDescription>Please enter the PIN.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit">Submit</Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Nav;
