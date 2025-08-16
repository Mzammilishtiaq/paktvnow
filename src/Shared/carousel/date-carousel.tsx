import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "../../lib/utlils"

interface DateCarouselProps {
  onSelectDate: (date: Date) => void
  selectedDate: Date
}

const getDatesForSixDayCarousel = (centerDate: Date) => {
  // centerDate is today
  const dates = []
  for (let i = -2; i <= 3; i++) {
    const date = new Date(centerDate)
    date.setDate(centerDate.getDate() + i)
    dates.push(date)
  }
  return dates
}

const formatDateForDisplay = (date: Date) => {
  const dayOfWeek = date.toLocaleDateString("en-US", { weekday: "long" })
  const dayOfMonth = date.getDate()
  const month = date.toLocaleDateString("en-US", { month: "short" })
  return { dayOfWeek, dayOfMonth, month }
}

export default function DateCarousel({ onSelectDate, selectedDate }: DateCarouselProps) {
  const [centerDate, setCenterDate] = React.useState(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return today
  })

  const datesInCarousel = React.useMemo(() => getDatesForSixDayCarousel(centerDate), [centerDate])

  const goToPrevious = () => {
    setCenterDate((prev) => {
      const newDate = new Date(prev)
      newDate.setDate(prev.getDate() - 1)
      return newDate
    })
  }

  const goToNext = () => {
    setCenterDate((prev) => {
      const newDate = new Date(prev)
      newDate.setDate(prev.getDate() + 1)
      return newDate
    })
  }

  React.useEffect(() => {
    // Ensure the selectedDate is within the current carousel
    const selectedDay = new Date(selectedDate)
    selectedDay.setHours(0, 0, 0, 0)
    const start = new Date(centerDate)
    start.setDate(centerDate.getDate() - 2)
    start.setHours(0, 0, 0, 0)
    const end = new Date(centerDate)
    end.setDate(centerDate.getDate() + 3)
    end.setHours(23, 59, 59, 999)
    if (selectedDay.getTime() < start.getTime() || selectedDay.getTime() > end.getTime()) {
      setCenterDate(selectedDay)
    }
  }, [selectedDate])

  return (
    <div className="flex items-center bg-gray-800 text-white  flex-1 px-1">
      <button onClick={goToPrevious} className="text-black rounded py-4 px-1 bg-white">
        <ChevronLeft className="h-5 w-5" />
      </button>
      <div className="flex flex-1 justify-around">
        {datesInCarousel.map((date) => {
          const { dayOfWeek, dayOfMonth, month } = formatDateForDisplay(date)
          const isSelected = date.toDateString() === selectedDate.toDateString()
          const today = new Date()
          today.setHours(0, 0, 0, 0)
          let label = dayOfWeek
          if (date.toDateString() === today.toDateString()) label = "Today"
          else if (date.toDateString() === new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1).toDateString()) label = "Yesterday"
          else if (date.toDateString() === new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1).toDateString()) label = "Tomorrow"

          return (
            <button
              key={date.toISOString()}
              className={cn(
                "flex flex-col px-6 py-2 text-center w-full h-auto mx-1",
                isSelected && " bg-white text-gray-800 font-bold",
              )}
              onClick={() => onSelectDate(date)}
            >
              <span className="text-xl capitalize">{label}</span>
              <span className="text-sm">
                {dayOfMonth}, {month}
              </span>
            </button>
          )
        })}
      </div>
      <button onClick={goToNext} className="text-black rounded py-4 px-1 bg-white">
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  )
}
