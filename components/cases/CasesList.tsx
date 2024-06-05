import { FC } from "react";
import CaseCard from "./CaseCard";

interface CasesListProps {
  cases: any;
}

const CasesList: FC<CasesListProps> = ({ cases }) => {
  return (
    <div className="px-6 py-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4  gap-4 w-full h-full">
      {cases === null && <div className="">Loading...</div>}
      {cases?.map((caseItem: any) => (
        <CaseCard caseItem={caseItem} />
      ))}
    </div>
  );
};

export default CasesList;
