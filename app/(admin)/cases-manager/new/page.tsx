import CaseForm from "@components/cases/CaseForm";
import PageHeader from "@components/navigation/PageHeader";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { FC } from "react";

interface pageProps {}

const page: FC<pageProps> = async ({}) => {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  return (
    <div>
      <header className="flex justify-between items-center gap-2 border-b border-gray-100 pb-8 px-6">
        <PageHeader title="Create New Case" />
      </header>

      <CaseForm userEmail={user?.email} />
    </div>
  );
};

export default page;
