import React from "react";

interface SmallCardProps {
  data: {
    title: string;
    number: number;
    iconBg: string;
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>; // Correct type for icons
  };
}

export default function SmallCard({ data }: SmallCardProps) {
  const { title, number, iconBg, icon: Icon } = data;
  return (
    <div className="rounded-lg shadow-lg bg-slate-700 p-4">
      <div className="flex space-x-4">
        <div className={`w-12 h-12 ${iconBg} rounded-full items-center flex justify-center`}>
          <Icon className="text-white" /> {/* Dynamically render the passed icon */}
        </div>
        <div>
          <p>{title}</p>
          <h3 className="text-2xl font-bold">{number}</h3>
        </div>
      </div>
    </div>
  );
}
