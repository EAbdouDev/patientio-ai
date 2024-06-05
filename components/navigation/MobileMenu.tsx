import { FC, ReactNode, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Link from "next/link";
import { AlignJustify } from "lucide-react";

interface MobileMenuProps {
  links: { name: string; href: string; icon: ReactNode; active: boolean }[];
}

const MobileMenu: FC<MobileMenuProps> = ({ links }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger>
        <AlignJustify />
      </SheetTrigger>
      <SheetContent side={"left"} className="pt-20">
        <div className=" xl:hidden flex flex-col justify-start items-start gap-6  ">
          {links.map((link) => (
            <Link
              onClick={() => setIsOpen(false)}
              href={link.href}
              key={link.name}
              prefetch={false}
              className={` font-medium flex justify-center items-center gap-2 py-2 px-4  rounded-lg text-base transition-all ease-in-out   ${
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
      </SheetContent>
    </Sheet>
  );
};

export default MobileMenu;
