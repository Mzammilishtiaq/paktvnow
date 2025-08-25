import React from "react";
import type { Program } from "../types/interface";
import { cn } from '../lib/utlils'
import { Play } from "lucide-react";
interface TimelineItemContentProps {
  program: Program;
  startTime: Date;
  endTime: Date;
}

export default function TimelineItemContent({
  program,
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
      className={cn("flex h-full w-[100vw] items-start overflow-hidden p-0 m-0 -mt-2",
        isHovered ? "bg-white animate-fade-right animate-delay-none" : ""
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {program.imageUrl && isHovered && (
        <div
          className={cn("flex-shrink-0 flex items-center justify-center relative top-0 left-0 right-0 bottom-0")}>
            <div className="p-2 border-2 border-gray-200 rounded-full absolute  m-2  flex flex-col items-center justify-center w-10 h-10">
              <Play className="text-gray-200" />
            </div>
          <img
            src={program.imageUrl || "/placeholder.svg"}
            alt={program.content || "Program image"}
            className="h-[70px] w-24 object-fill"
          />
        </div>
      )}
      <div className="flex flex-col justify-center border-l-4 border-gray-900 h-[70px] pl-2 gap-y-1">
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
