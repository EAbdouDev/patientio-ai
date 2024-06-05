import PageHeader from "@components/navigation/PageHeader";
import { FC } from "react";

interface pageProps {}

const page: FC<pageProps> = ({}) => {
  return (
    <div className="">
      <PageHeader title="Dashboard" />
    </div>
  );
};

export default page;
