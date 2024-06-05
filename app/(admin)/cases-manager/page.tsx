"use client";
import CasesList from "@components/cases/CasesList";
import PageHeader from "@components/navigation/PageHeader";
import { createClient } from "@lib/supabase/client";
import { Input, Skeleton } from "@nextui-org/react";
import useMode from "@zuztand/Mode";
import { Plus, Search } from "lucide-react";
import Link from "next/link";
import { FC, useEffect, useState } from "react";

interface pageProps {}

const page: FC<pageProps> = ({}) => {
  const { isInstuctor, setIsInstuctor, isLoading, setIsLoading } = useMode();
  const [cases, setCases] = useState<any>(null);
  const supabase = createClient();

  useEffect(() => {
    const getAllCases = async () => {
      const { data, error } = await supabase
        .from("patientio_cases")
        .select("*");

      if (error) {
        throw error.message;
      }

      setCases(data);
    };

    getAllCases();
  }, []);

  return (
    <div className="">
      <header className="flex justify-between items-center gap-2 border-b border-gray-100 pb-6 px-6">
        <PageHeader title="Cases Manager" />
        <div className="flex justify-end items-center gap-4 xl:w-[60%]">
          <Input
            className="hidden xl:flex bg-background border-2 rounded-lg w-[70%]"
            placeholder="Search in cases..."
            startContent={<Search className="w-5 h-5 opacity-50" />}
          />
          {isLoading && (
            <div className="xl:w-[30%] px-3 py-2 animate-pulse bg-gray-100 h-10 rounded-lg" />
          )}
          {isInstuctor && !isLoading && (
            <Link
              href={"/cases-manager/new"}
              className="hover:opacity-90 xl:w-[30%] px-3 py-2 text-sm xl:text-base xl:px-6 xl:py-2 bg-blue-500 text-white rounded-lg font-medium flex justify-center items-center gap-2"
            >
              <Plus className="w-4 h-4 xl:w-6 xl:h-6" /> New Case
            </Link>
          )}
        </div>
      </header>

      <div className="mt-4">
        <CasesList cases={cases} />
      </div>
    </div>
  );
};

export default page;
