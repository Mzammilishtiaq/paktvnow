import React from "react";
import type { Program } from "../types/interface";

interface TimelineItemContentProps {
  program: Program;
  startTime: Date;
  endTime: Date;
}

export default function TimelineItemContent({
  program,a
  endTime,
  startTime,
}: TimelineItemContentProps) {
  const [isHovered, setIsHovered] = React.useState(false);
  const formattedStartTime = startTime.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  const formattedEndTime = endTime.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div
      className="flex h-full w-[100vw] items-start overflow-hidden p-0"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {program.imageUrl && isHovered && (
        <div
          className={`flex-shrink-0 transition-all duration-500 ease-in-out animate-pulse ${
            isHovered
              ? "opacity-100 scale-100 translate-x-0"
              : "opacity-0 scale-95 -translate-x-2"
          }`}
        >
          <img
            src={program.imageUrl || "/placeholder.svg"}
            alt={program.content || "Program image"}
            className="h-25 w-30 object-fill"
          />
        </div>
      )}
      <div className="flex flex-col justify-center border-l-4 border-gray-900 h-25 pl-2 gap-y-3">
        <div className="text-sm font-medium leading-tight text-gray-900 line-clamp-1">
          {program.content}
        </div>
        <div className="text-xs text-gray-500">
          {formattedStartTime} - {formattedEndTime}
        </div>
        {program.description && (
          <div className="text-xs text-gray-600 line-clamp-2">
            {program.description}
          </div>
        )}
      </div>
    </div>
  );
}
