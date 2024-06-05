import Link from "next/link";
import { FC } from "react";

interface CaseCardProps {
  caseItem: any;
}

const CaseCard: FC<CaseCardProps> = ({ caseItem }) => {
  const getFirstPartOfUUID = (uuid: string): string => {
    return uuid.split("-")[0];
  };
  console.log(caseItem);

  return (
    <div key={caseItem.id} className=" border-2 rounded-lg p-4 space-y-4 ">
      <div className="space-y-2">
        <p className="text-xs opacity-50">#{getFirstPartOfUUID(caseItem.id)}</p>
        <Link href={`/office/${caseItem.id}`} className="text-xl font-semibold">
          {caseItem.title}
        </Link>
      </div>
    </div>
  );
};

export default CaseCard;
