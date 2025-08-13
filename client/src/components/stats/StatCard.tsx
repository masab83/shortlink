import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon: LucideIcon;
  color: "emerald" | "gold" | "blue" | "purple" | "crimson";
}

const colorMap = {
  emerald: {
    icon: "text-royal-emerald",
    border: "border-royal-emerald border-opacity-30",
    badge: "text-royal-emerald bg-royal-emerald bg-opacity-20",
    value: "text-royal-emerald",
  },
  gold: {
    icon: "text-royal-gold",
    border: "border-royal-gold border-opacity-30",
    badge: "text-royal-gold bg-royal-gold bg-opacity-20",
    value: "text-royal-gold",
  },
  blue: {
    icon: "text-royal-blue",
    border: "border-royal-blue border-opacity-30",
    badge: "text-royal-blue bg-royal-blue bg-opacity-20",
    value: "text-royal-blue",
  },
  purple: {
    icon: "text-royal-purple",
    border: "border-royal-purple border-opacity-30",
    badge: "text-royal-purple bg-royal-purple bg-opacity-20",
    value: "text-royal-purple",
  },
  crimson: {
    icon: "text-royal-crimson",
    border: "border-royal-crimson border-opacity-30",
    badge: "text-royal-crimson bg-royal-crimson bg-opacity-20",
    value: "text-royal-crimson",
  },
};

export default function StatCard({ title, value, change, changeType, icon: Icon, color }: StatCardProps) {
  const colors = colorMap[color];

  return (
    <div className={`glass-morphism rounded-xl p-6 border ${colors.border}`}>
      <div className="flex items-center justify-between mb-4">
        <Icon className={`w-8 h-8 ${colors.icon}`} />
        {change && (
          <span className={`text-xs px-2 py-1 rounded-full ${colors.badge}`}>
            {changeType === "positive" ? "+" : changeType === "negative" ? "-" : ""}{change}
          </span>
        )}
      </div>
      <div className={`text-2xl font-bold mb-1 ${colors.value}`}>{value}</div>
      <div className="text-sm text-gray-400">{title}</div>
    </div>
  );
}
