import React, { useState } from 'react'
interface Program {
  id: string | number
  group: string
  content: string
  start: Date
  end: Date
  type: "range"
  imageUrl?: string
  description?: string
}

interface TimelineItemContentProps {
  program: Program
}

export default function TimelineItemContent({ program }: TimelineItemContentProps) {
  const [isHovered, setIsHovered] = useState(false)
  
  const startTime =
    program.start instanceof Date && !isNaN(program.start.getTime())
      ? program.start.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      : "Invalid Time"
  const endTime =
    program.end instanceof Date && !isNaN(program.end.getTime())
      ? program.end.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      : "Invalid Time"

  return (
    <div 
      className="flex h-full w-[100vw] items-start overflow-hidden p-0"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {program.imageUrl && isHovered && (
        <div className={`flex-shrink-0 transition-all duration-500 ease-in-out animate-pulse ${
          isHovered 
            ? 'opacity-100 scale-100 translate-x-0' 
            : 'opacity-0 scale-95 -translate-x-2'
        }`}>
          <img
            src={program.imageUrl || "/placeholder.svg"}
            alt={program.content || "Program image"}
            className="h-25 w-30 object-fill"
          />
        </div>
      )}
      <div className="flex flex-col justify-center border-l-4 border-gray-900 h-25 pl-2 gap-y-3">
        <div className="text-sm font-medium leading-tight text-gray-900 line-clamp-1">{program.content}</div>
        <div className="text-xs text-gray-500">
          {startTime} - {endTime}
        </div>
        {program.description && <div className="text-xs text-gray-600 line-clamp-2">{program.description}</div>}
      </div>
    </div>
  )
}
