import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "../../lib/utlils"

interface DateCarouselProps {
  onSelectDate: (date: Date) => void
  selectedDate: Date
}

const getDatesForWeek = (startDate: Date) => {
  const dates = []
  for (let i = 0; i < 7; i++) {
    const date = new Date(startDate)
    date.setDate(startDate.getDate() + i)
    dates.push(date)
  }
  return dates
}

const formatDateForDisplay = (date: Date) => {
  const dayOfWeek = date.toLocaleDateString("en-US", { weekday: "short" })
  const dayOfMonth = date.getDate()
  const month = date.toLocaleDateString("en-US", { month: "short" })
  return { dayOfWeek, dayOfMonth, month }
}

export default function DateCarousel({ onSelectDate, selectedDate }: DateCarouselProps) {
  const [currentWeekStart, setCurrentWeekStart] = React.useState(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return today
  })

  const datesInWeek = React.useMemo(() => getDatesForWeek(currentWeekStart), [currentWeekStart])

  const goToPreviousWeek = () => {
    setCurrentWeekStart((prev) => {
      const newDate = new Date(prev)
      newDate.setDate(prev.getDate() - 7)
      return newDate
    })
  }

  const goToNextWeek = () => {
    setCurrentWeekStart((prev) => {
      const newDate = new Date(prev)
      newDate.setDate(prev.getDate() + 7)
      return newDate
    })
  }

  React.useEffect(() => {
    // Ensure the selectedDate is within the current week displayed by the carousel
    const selectedDay = new Date(selectedDate)
    selectedDay.setHours(0, 0, 0, 0)

    const weekStart = new Date(currentWeekStart)
    weekStart.setHours(0, 0, 0, 0)

    const weekEnd = new Date(currentWeekStart)
    weekEnd.setDate(currentWeekStart.getDate() + 6)
    weekEnd.setHours(23, 59, 59, 999)

    if (selectedDay.getTime() < weekStart.getTime() || selectedDay.getTime() > weekEnd.getTime()) {
      setCurrentWeekStart(selectedDay)
    }
  }, [selectedDate])

  return (
    <div className="flex items-center justify-between bg-gray-800 text-white p-2 rounded-t-lg">
      <button onClick={goToPreviousWeek} className="text-white hover:bg-gray-700">
        <ChevronLeft className="h-5 w-5" />
      </button>
      <div className="flex flex-1 justify-around">
        {datesInWeek.map((date) => {
          const { dayOfWeek, dayOfMonth, month } = formatDateForDisplay(date)
          const isSelected = date.toDateString() === selectedDate.toDateString()
          const isToday = date.toDateString() === new Date().toDateString()

          return (
            <button
              key={date.toISOString()}
              
              className={cn(
                "flex flex-col p-2 rounded-md text-center min-w-[80px] h-auto",
                "hover:bg-gray-700",
                isSelected && "bg-gray-700 font-bold",
                isToday && "bg-white text-gray-800 font-bold hover:bg-gray-100",
              )}
              onClick={() => onSelectDate(date)}
            >
              <span className="text-xs uppercase">{dayOfWeek}</span>
              <span className="text-sm">
                {dayOfMonth}, {month}
              </span>
            </button>
          )
        })}
      </div>
      <button onClick={goToNextWeek} className="text-white hover:bg-gray-700">
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  )
}
