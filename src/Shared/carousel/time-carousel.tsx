import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "../../lib/utlils"

interface TimeCarouselProps {
//   onLiveTime: (time: string) => void
  selectedTime: string // e.g., "11:00 AM"
}

const generateTimeSlots = () => {
  const slots = []
  for (let h = 0; h < 24; h++) {
    for (let m = 0; m < 60; m += 30) {
      const date = new Date()
      date.setHours(h, m, 0, 0)
      slots.push(date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true }))
    }
  }
  return slots
}

const ALL_TIME_SLOTS = generateTimeSlots()

export default function TimeCarousel({ selectedTime }: TimeCarouselProps) {
  const scrollContainerRef = React.useRef<HTMLDivElement>(null)
  const [visibleStartIndex, setVisibleStartIndex] = React.useState(0)
  const itemsPerPage = 5 // Number of time slots to show at once

  const visibleTimeSlots = React.useMemo(() => {
    return ALL_TIME_SLOTS.slice(visibleStartIndex, visibleStartIndex + itemsPerPage)
  }, [visibleStartIndex])

  const scrollLeft = () => {
    setVisibleStartIndex((prev) => Math.max(0, prev - 1))
  }

  const scrollRight = () => {
    setVisibleStartIndex((prev) => Math.min(ALL_TIME_SLOTS.length - itemsPerPage, prev + 1))
  }

  React.useEffect(() => {
    // Scroll to the selected time when it changes
    const selectedIndex = ALL_TIME_SLOTS.indexOf(selectedTime)
    if (selectedIndex !== -1) {
      const newStartIndex = Math.max(0, selectedIndex - Math.floor(itemsPerPage / 2))
      setVisibleStartIndex(newStartIndex)
    }
  }, [selectedTime])

  return (
    <div className="flex items-center bg-gray-500 text-white p-[2px] rounded w-full relative top-0 left-0 right-0 bottom-0">
        <div className="flex flex-col justify-center items-center absolute">
            <div className="bg-red-500 text-white p-2">Now Live</div>
            <div className="border-2 border-r-red-500 h-10"/>
        </div>
      <button onClick={scrollLeft} className="text-black py-4 bg-white rounded">
        <ChevronLeft className="h-5 w-5" />
      </button>
      <div ref={scrollContainerRef} className="flex flex-1 overflow-hidden">
        <div className="flex w-full justify-around">
          {visibleTimeSlots.map((timeSlot) => {
            const isSelected = timeSlot === selectedTime
            return (
              <button
                key={timeSlot}
            
                className={cn(
                  "flex flex-col p-2 rounded-md text-center min-w-[80px] h-auto",
                  isSelected && "bg-gray-700 font-bold",
                )}
                // onClick={() => onSelectTime(timeSlot)}
              >
                <span className="text-sm">{timeSlot}</span>
              </button>
            )
          })}
        </div>
      </div>
      <button onClick={scrollRight} className="text-black py-4 bg-white rounded">
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  )
}
