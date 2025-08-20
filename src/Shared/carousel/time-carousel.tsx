import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "../../lib/utlils";
interface TimeCarouselProps {
  // onCurrentTime: (time: string) => void
  selectedTime: string; // e.g., "11:00 AM"
  onRangeChange: (start: string, end: string) => void;
  onTimeScroll: (direction: "back" | "next") => void; // Function to trigger timeline scroll
  leftslide:()=>void;
  rightslide:()=>void;
}

const generateTimeSlots = () => {
  const slots = [];
  for (let h = 0; h < 24; h++) {
    for (let m = 0; m < 60; m += 30) {
      const date = new Date();
      date.setHours(h, m, 0, 0);
      slots.push(
        date.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        })
      );
    }
  }
  return slots;
};

const ALL_TIME_SLOTS = generateTimeSlots();

export default function TimeCarousel({ selectedTime,onRangeChange,leftslide,rightslide }: TimeCarouselProps) {
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  const itemsPerPage = 6; // Number of time slots to show at once (1 hour)
  const [currentTime, setCurrentTime] = React.useState(
    new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
  );

  // Find the index of the current hour (e.g., 3:00 PM)
  const getCurrentHourIndex = () => {
    const now = new Date();
    now.setMinutes(0, 0, 0);
    const hourString = now.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
    return ALL_TIME_SLOTS.indexOf(hourString);
  };

  // On initial load, show the current hour
  const [visibleStartIndex, setVisibleStartIndex] = React.useState(() => {
    const idx = getCurrentHourIndex();
    return idx !== -1 ? idx : 0;
  });

  const visibleTimeSlots = React.useMemo(() => {
    return ALL_TIME_SLOTS.slice(
      visibleStartIndex,
      visibleStartIndex + itemsPerPage,
      
    );
  }, [visibleStartIndex]);

 // Scroll left by 2 hours (4 slots), always align to the start of the hour
//  const scrollLeft = () => {
//   setVisibleStartIndex((prev) => {
//     const newIndex = Math.max(0, prev - itemsPerPage * 2);
//     updateRange(newIndex);
//     return newIndex;
//   });
//   onTimeScroll("back"); // Trigger timeline scroll
// };

// Scroll right by 2 hours (4 slots), always align to the start of the hour
// const scrollRight = () => {
//   setVisibleStartIndex((prev) => {
//     const maxIndex = ALL_TIME_SLOTS.length - itemsPerPage;
//     let newIndex = Math.min(maxIndex, prev + itemsPerPage * 2);
//     updateRange(newIndex);
//     newIndex = newIndex - (newIndex % itemsPerPage);
//     return newIndex;
//   });
//   onTimeScroll("next"); // Trigger timeline scroll
// };

  const updateRange = (startIndex: number) => {
    const start = ALL_TIME_SLOTS[startIndex];
    const end = ALL_TIME_SLOTS[startIndex + itemsPerPage - 1];
    if (start && end) {
      onRangeChange(start, end);
    }
  };
  React.useEffect(() => {
    updateRange(visibleStartIndex);
  }, []);
  // Update current time every 30 seconds (or as needed)
  React.useEffect(() => {
    const timeInterval = setInterval(() => {
      setCurrentTime(
        new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        })
      );
    }, 1000 * 30); // 30 seconds interval

    return () => {
      clearInterval(timeInterval);
    };
  }, []);

  React.useEffect(() => {
    // Scroll to the selected time when it changes
    const selectedIndex = ALL_TIME_SLOTS.indexOf(selectedTime);
    if (selectedIndex !== -1) {
      // Align to the start of the hour for the selected time
      const newStartIndex = selectedIndex - (selectedIndex % itemsPerPage);
      setVisibleStartIndex(newStartIndex);
    }
  }, [selectedTime]);

  return (
    <div className="flex items-end bg-[#444444] text-white p-[2px] rounded w-full relative top-0 left-0 right-0 bottom-0">
      <button onClick={leftslide} className="text-black py-4 bg-white rounded">
        <ChevronLeft className="h-5 w-5" />
      </button>
      <div ref={scrollContainerRef} className="flex flex-1 overflow-hidden">
        <div className="flex px-7 justify-between w-full">
          {visibleTimeSlots.map((timeSlot) => {
            const isSelected = timeSlot === selectedTime;
            const isLiveNow = timeSlot === currentTime;
            return (
              <div key={timeSlot} className="">
                
                <button
                  className={cn(
                    "flex flex-col p-2 rounded-md justify-start text-start min-w-[50px] -ml-0 h-auto",
                    isSelected && "bg-gray-700 font-bold"
                  )}
                  // onClick={() => onSelectTime(timeSlot)}
                >
                  <span className="text-sm">{timeSlot}</span>
                </button>
                {isLiveNow && (
                  <div className="flex flex-col justify-center items-center absolute top-0">
                    <div className={`bg-red-500 text-white`}>Now Live</div>
                    <div className="border-2 border-r-red-500 h-10" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      <button
        onClick={rightslide}
        className="text-black py-4 bg-white rounded"
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  );
}
