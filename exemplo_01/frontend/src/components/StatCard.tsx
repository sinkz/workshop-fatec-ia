import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: number | string;
  color?: "teal" | "green" | "orange" | "red" | "blue";
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

const colorClasses = {
  teal: {
    bg: "bg-primary-50",
    icon: "text-primary-600",
    text: "text-primary-700",
  },
  green: {
    bg: "bg-green-50",
    icon: "text-success",
    text: "text-green-700",
  },
  orange: {
    bg: "bg-orange-50",
    icon: "text-orange-600",
    text: "text-orange-700",
  },
  red: {
    bg: "bg-red-50",
    icon: "text-danger",
    text: "text-red-700",
  },
  blue: {
    bg: "bg-blue-50",
    icon: "text-blue-600",
    text: "text-blue-700",
  },
};

export function StatCard({
  icon: Icon,
  label,
  value,
  color = "teal",
  trend,
}: StatCardProps) {
  const classes = colorClasses[color];

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{label}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          {trend && (
            <div className="flex items-center mt-2 text-sm">
              {trend.isPositive ? (
                <TrendingUp className="w-4 h-4 text-success mr-1" />
              ) : (
                <TrendingDown className="w-4 h-4 text-danger mr-1" />
              )}
              <span
                className={trend.isPositive ? "text-success" : "text-danger"}
              >
                {trend.value}%
              </span>
            </div>
          )}
        </div>
        <div className={`p-4 rounded-xl ${classes.bg}`}>
          <Icon className={`w-8 h-8 ${classes.icon}`} />
        </div>
      </div>
    </div>
  );
}
