// src/components/features/profile/StatCard.tsx
import Link from "next/link";
import { Card } from "@/components/ui";

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  linkTo: string;
}
  
const StatCard: React.FC<StatCardProps> = ({
  icon,
  label,
  value,
  linkTo,
}) => (
  <Link href={linkTo}>
    <Card className="hover:shadow-md transition-shadow">
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {icon}
            <div>
              <p className="text-sm text-neutral-600">{label}</p>
              <p className="text-2xl font-bold">{value}</p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  </Link>
);

export default StatCard;