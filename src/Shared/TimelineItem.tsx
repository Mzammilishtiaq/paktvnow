import React from 'react'
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
    <div className="flex h-full w-full items-center gap-2 overflow-hidden p-1">
      {program.imageUrl && (
        <div className="flex-shrink-0">
          <img
            src={program.imageUrl || "/placeholder.svg"}
            alt={program.content || "Program image"}
            width={40}
            height={40}
            className="h-10 w-10 rounded object-cover"
          />
        </div>
      )}
      <div className="flex min-w-0 flex-col justify-center">
        <div className="text-sm font-medium leading-tight text-gray-900 line-clamp-1">{program.content}</div>
        <div className="text-xs text-gray-500">
          {startTime} - {endTime}
        </div>
        {program.description && <div className="text-xs text-gray-600 line-clamp-2">{program.description}</div>}
      </div>
    </div>
  )
}
