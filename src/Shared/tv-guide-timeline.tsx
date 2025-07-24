import { useRef, useEffect, useState, useCallback } from "react";
import { Timeline, type TimelineItem } from "vis-timeline/standalone";
import type { TimelineTimeAxisScaleType } from "vis-timeline";
import { DataSet } from "vis-data/peer";
import "vis-timeline/styles/vis-timeline-graph2d.min.css";
import ReusableDialog from "../components/ui/dialog";
import GeoNews from "../assets/abc.png";
import Bolews from "../assets/eqanuc.png";
import CapitalNews from "../assets/fox-news-channel.png";
import ExpressNews from "../assets/jwoich.png";
import PtvNews from "../assets/slzwda.png";
import SamaanNews from "../assets/urfpng.png";
import AryNews from "../assets/usa-network.png";
import { ArrowRightIcon, ArrowLeftIcon, Calendar1 } from "lucide-react";
import DateCarousel from "./carousel/date-carousel";
import TimeCarousel from "./carousel/time-carousel";
interface Channel {
  id: string;
  content: string;
  logo?: string;
}

interface Program {
  id: string | number; // Change the type here to allow both string and number
  group: string;
  content: string;
  start: Date;
  end: Date;
  type: "range";
}

export default function TvGuideTimeline() {
  const timelineRef = useRef<HTMLDivElement>(null);
  const timelineInstance = useRef<Timeline | null>(null);
  const itemsDataSet = useRef<DataSet<Program> | null>(null);
  const groupsDataSet = useRef<DataSet<Channel> | null>(null);
  // State for selected date and time from carousels
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(
    new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
  );
  const [items, setItems] = useState<Program[]>([
    {
      id: "1",
      group: "channel-a",
      content: "Morning News",
      start: new Date(2025, 7, 24, 11, 0, 0),
      end: new Date(2025, 7, 24, 12, 0, 0),
      type: "range",
    },
    {
      id: "2",
      group: "channel-a",
      content: "Talk Show",
      start: new Date(2025, 7, 24, 11, 30, 0),
      end: new Date(2025, 7, 24, 12, 30, 0),
      type: "range",
    },
    {
      id: "3",
      group: "channel-b",
      content: "Documentary",
      start: new Date(2025, 7, 24, 11, 0, 0),
      end: new Date(2025, 7, 24, 12, 30, 0),
      type: "range",
    },
    {
      id: "4",
      group: "channel-c",
      content: "Kids Show",
      start: new Date(2025, 7, 24, 11, 0, 0),
      end: new Date(2025, 7, 24, 12, 0, 0),
      type: "range",
    },
    {
      id: "5",
      group: "channel-a",
      content: "Evening Movie",
      start: new Date(2025, 7, 24, 11, 0, 0),
      end: new Date(2025, 7, 24, 2, 0, 0),
      type: "range",
    },
  ]);

  // Add a ref to always have the latest items
  const itemsRef = useRef(items);
  useEffect(() => {
    itemsRef.current = items;
  }, [items]);

  const [groups] = useState<Channel[]>([
    { id: "channel-a", content: "ARY News", logo: AryNews },
    { id: "channel-b", content: "Geo News", logo: GeoNews },
    { id: "channel-d", content: "Samaa TV", logo: SamaanNews },
    { id: "channel-e", content: "Express News", logo: ExpressNews },
    { id: "channel-f", content: "PTV News", logo: PtvNews },
    { id: "channel-g", content: "Bol News", logo: Bolews },
    { id: "channel-h", content: "Capital TV", logo: CapitalNews },
  ]);

  const [isTimelineReady, setIsTimelineReady] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Program | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // --- Navigation functions ---
  const setTodayView = () => {
    if (timelineInstance.current) {
      const now = new Date();
      const startOfDay = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        0,
        0,
        0
      );
      const endOfDay = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        23,
        59,
        59
      );
      timelineInstance.current.setWindow(startOfDay, endOfDay);
    }
  };

  const setWeekView = () => {
    if (timelineInstance.current) {
      const now = new Date();
      const dayOfWeek = now.getDay(); // 0 for Sunday, 1 for Monday, etc.
      const startOfWeek = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() - dayOfWeek,
        0,
        0,
        0
      );
      const endOfWeek = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() - dayOfWeek + 6,
        23,
        59,
        59
      );
      timelineInstance.current.setWindow(startOfWeek, endOfWeek);
    }
  };

  const moveTimeline = (direction: "back" | "next") => {
    if (timelineInstance.current) {
      const window = timelineInstance.current.getWindow();
      const interval = window.end.getTime() - window.start.getTime();
      const offset = direction === "next" ? interval : -interval;

      const newStart = new Date(window.start.getTime() + offset);
      const newEnd = new Date(window.end.getTime() + offset);

      timelineInstance.current.setWindow(newStart, newEnd);
    }
  };

  // --- Handle Edit Dialog ---
  const handleEditClick = () => {
    if (selectedItem) {
      setIsEditDialogOpen(true);
    }
  };

  const handleSaveEdit = (updatedProgram: Program) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === updatedProgram.id ? updatedProgram : item
      )
    );
    setSelectedItem(null); // Clear selection after saving
    setIsEditDialogOpen(false);
  };

  // --- Carousel Handlers ---
  const handleSelectDate = useCallback((date: Date) => {
    setSelectedDate(date);
    if (timelineInstance.current) {
      const currentWindow = timelineInstance.current.getWindow();
      const newStart = new Date(date);
      newStart.setHours(
        currentWindow.start.getHours(),
        currentWindow.start.getMinutes(),
        0,
        0
      );
      const newEnd = new Date(date);
      newEnd.setHours(
        currentWindow.end.getHours(),
        currentWindow.end.getMinutes(),
        0,
        0
      );
      timelineInstance.current.setWindow(newStart, newEnd);
    }
  }, []);

  // const handleSelectTime = useCallback(
  //   (timeString: string) => {
  //     setSelectedTime(timeString)
  //     if (timelineInstance.current) {
  //       const [time, ampm] = timeString.split(" ")
  //       // eslint-disable-next-line prefer-const
  //       let [hours, minutes] = time.split(":").map(Number)

  //       if (ampm === "PM" && hours !== 12) {
  //         hours += 12
  //       } else if (ampm === "AM" && hours === 12) {
  //         hours = 0
  //       }

  //       const currentWindow = timelineInstance.current.getWindow()
  //       const currentStart = currentWindow.start
  //       const currentEnd = currentWindow.end

  //       const newStart = new Date(selectedDate)
  //       newStart.setHours(hours, minutes, 0, 0)

  //       // Calculate new end based on the original window duration
  //       const duration = currentEnd.getTime() - currentStart.getTime()
  //       const newEnd = new Date(newStart.getTime() + duration)

  //       timelineInstance.current.setWindow(newStart, newEnd)
  //     }
  //   },
  //   [selectedDate],
  // )

  const handleGoLive = useCallback(() => {
    const now = new Date();
    setSelectedDate(now);
    setSelectedTime(
      now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true })
    );

    if (timelineInstance.current) {
      const startOfHour = new Date(now);
      startOfHour.setMinutes(0, 0, 0);
      const endOfHour = new Date(now);
      endOfHour.setHours(now.getHours() + 1, 0, 0, 0); // Show 1 hour window around current time

      timelineInstance.current.setWindow(startOfHour, endOfHour);
    }
  }, []);

  // load vis.js current time run
  useEffect(() => {
    const handleWindowLoad = () => {
      const now = new Date();
      if (timelineInstance.current) {
        const startOfHour = new Date(now);
        startOfHour.setMinutes(0, 0, 0);
        const endOfHour = new Date(now);
        endOfHour.setHours(now.getHours() + 1, 0, 0, 0); // Show 1 hour window around current time

        timelineInstance.current.setWindow(startOfHour, endOfHour);
      }
    };

    if (document.readyState === "complete") {
      handleWindowLoad();
    } else {
      window.addEventListener("load", handleWindowLoad);
      return () => {
        window.removeEventListener("load", handleWindowLoad);
      };
    }
  }, []);
  // --- Main Effect for Timeline Initialization (runs ONLY ONCE) ---
  useEffect(() => {
    if (timelineRef.current && !timelineInstance.current) {
      itemsDataSet.current = new DataSet<Program>(items);
      groupsDataSet.current = new DataSet<Channel>(groups);

      const options = {
        innerWidth: "10px",
        innerHeight: "10px",
        editable: {
          add: true,
          updateTime: true,
          updateGroup: true,
          remove: true,
        },
        orientation: "top",
        stack: false,
        zoomable: false,
        moveable:true,
        // Disable zoom functionality by not setting zoomMax and zoomMin
        zoomMax: 1000*60*60, // Disable zooming to maximum
        zoomMin: 1000*60*30, // Disable zooming to minimum
        start: new Date(new Date().setHours(7, 0, 0, 0)),
        end: new Date(new Date().setHours(23, 0, 0, 0)),
        showMajorLabels: false,
        showMinorLabels: true,
        showCurrentTime: true,
        timeStep: 5 * 60 * 1000, // 30 minutes interval (30 * 60 * 1000 ms)
        snap: function (date: Date) {
          const ms = 1000 * 60 * 5; // 30 minutes in ms
          return new Date(Math.round(date.valueOf() / ms) * ms);
        },
        timeAxis: { scale: 'minute'as TimelineTimeAxisScaleType, step: 5 },
        margin: {
          item: 10,
          axis: 5,
        },
        format: {
          minorLabels: {
            // minute: "",
            // hour: "",
            // day: "",
          },
          majorLabels: {
            // month: "",
          },
          style: {
            border: "none", // Remove border box
          },
        },
        // UPDATED: Display start and end times on the program bar
        template: (item: Program) => {
          if (!item) return "";
          const startTime =
            item.start instanceof Date && !isNaN(item.start.getTime())
              ? item.start.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "Invalid Time";
          const endTime =
            item.end instanceof Date && !isNaN(item.end.getTime())
              ? item.end.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "Invalid Time";
          return `
            <div class="p-1 text-sm font-medium overflow-hidden whitespace-nowrap text-ellipsis">
              ${item.content}
              <div class="text-xs text-gray-500">${startTime} - ${endTime}</div>
            </div>
          `;
        },

        groupTemplate: (group: Channel) => {
          if (!group) return "";
          console.log(group); // Debugging purpose

          return `
            <div class="flex items-center gap-2 p-2">
              ${
                group.logo
                  ? `<img src="${group.logo}" alt="${group.content} logo" width="120px" />`
                  : `<span class="text-sm font-medium">${group.content}</span>`
              }
            </div>
          `;
        },

        onAdd: (
          item: TimelineItem,
          callback: (item: TimelineItem | null) => void
        ) => {
          const newContent = prompt("New program name:", "New Program");
          if (newContent !== null && item.group) {
            const newProgram: Program = {
              id: (Math.random() * 1e9).toFixed(0),
              content: newContent,
              start: new Date(item.start),
              end: item.end
                ? new Date(item.end)
                : new Date(new Date(item.start).getTime() + 3600000),
              group: String(item.group),
              type: "range",
            };
            setItems((prevItems) => [...prevItems, newProgram]);
            callback(newProgram);
          } else {
            callback(null);
          }
        },
        onUpdate: (
          item: TimelineItem,
          callback: (item: TimelineItem | null) => void
        ) => {
          if (!item.group || !item.end) {
            callback(null); // Do not update if group or end is missing
            return;
          }
          setItems((prevItems) =>
            prevItems.map((i) =>
              i.id === item.id
                ? {
                    ...i,
                    content: String(item.content),
                    start: new Date(item.start),
                    end: new Date(item.end!),
                    group: String(item.group),
                  }
                : i
            )
          );
          callback(item);
        },
        onRemove: (
          item: TimelineItem,
          callback: (item: TimelineItem | null) => void
        ) => {
          if (confirm("Are you sure you want to remove this program?")) {
            setItems((prevItems) => prevItems.filter((i) => i.id !== item.id));
            callback(item);
          } else {
            callback(null);
          }
        },
      };

      timelineInstance.current = new Timeline(
        timelineRef.current,
        itemsDataSet.current,
        groupsDataSet.current,
        options
      );
 // Initial sync with current time
 timelineInstance.current.setWindow(new Date(), new Date(new Date().getTime() + 60 * 60 * 1000));

  // Ensure the current time is shown immediately after loading
  const currentTime = timelineInstance.current.getCurrentTime();
  setSelectedTime(new Date(currentTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true }));

  
    // Sync with the carousel
    timelineInstance.current.on("rangechange", () => {
      if (!timelineInstance.current) return;
      const currentTime = timelineInstance.current.getWindow().start;
      setSelectedTime(new Date(currentTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true }));
    });

    
      // Add event listener for item selection
      timelineInstance.current.on("select", (properties) => {
        if (properties.items.length > 0) {
          const selectedId = properties.items[0];
          const item = itemsRef.current.find((i) => i.id === selectedId);
          setSelectedItem(item || null);
        } else {
          setSelectedItem(null);
        }
      });
      timelineInstance.current.on("doubleClick", (properties) => {
        if (properties.item) {
          const selectedId = properties.item;
          const item = itemsRef.current.find((i) => i.id === selectedId);
          if (item) {
            setSelectedItem(item);
            setIsEditDialogOpen(true);
          }
        }
      });
      setIsTimelineReady(true);

      return () => {
        if (timelineInstance.current) {
          timelineInstance.current.destroy();
          timelineInstance.current = null;
          setIsTimelineReady(false);
        }
      };
    }
    
  }, []); //items, groups

  // --- Effects for synchronizing React state with vis.js DataSets ---
  useEffect(() => {
    if (itemsDataSet.current) {
      itemsDataSet.current.clear();
      itemsDataSet.current.add(items);
    }
  }, [items]);

  useEffect(() => {
    if (groupsDataSet.current) {
      groupsDataSet.current.clear();
      groupsDataSet.current.add(groups);
    }
  }, [groups]);

  return (
    <div className="w-full h-[100vh] p-4 bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">TV Guide Admin Panel</h1>
      <div className="flex justify-between items-center gap-2">
        <div className="flex items-center space-x-3">
          <button onClick={setTodayView} disabled={!isTimelineReady}>
            Today
          </button>
          <button onClick={setWeekView} disabled={!isTimelineReady}>
            Week
          </button>

          <button
            onClick={handleEditClick}
            disabled={!isTimelineReady || !selectedItem}
          >
            Edit Selected Program
          </button>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => moveTimeline("back")}
            disabled={!isTimelineReady}
          >
            <ArrowLeftIcon />
          </button>
          <Calendar1 />
          <button
            onClick={() => moveTimeline("next")}
            disabled={!isTimelineReady}
          >
            <ArrowRightIcon />
          </button>
        </div>
      </div>
      <DateCarousel
        onSelectDate={handleSelectDate}
        selectedDate={selectedDate}
      />

      {/* Custom Time Carousel */}
      <div className="flex items-center bg-gray-800 text-white px-1 rounded-b-lg mb-4 time-carousel-container gap-1">
       <div className="bg-white p-2">
       <button
          onClick={handleGoLive}
          className="bg-gray-600 hover:bg-gray-500 text-white flex items-center justify-center gap-x-1 w-[80px]"
        >
          <div className="h-3 w-3 rounded-full bg-red-500" /> <span className="text-sm font-bold">Go Live</span>
        </button>
       </div>
        <TimeCarousel selectedTime={selectedTime} />
      </div>
      <div ref={timelineRef} className="h-screen -mt-3" />
      {selectedItem && (
        <ReusableDialog
          open={isEditDialogOpen}
          onClose={() => setIsEditDialogOpen}
          title="Edit Program"
        >
          <EditProgramForm
            program={selectedItem}
            channels={groups}
            onSave={handleSaveEdit}
          />
        </ReusableDialog>
      )}
    </div>
  );
}

// Separate component for the edit form within the dialog
interface EditProgramFormProps {
  program: Program;
  channels: Channel[];
  onSave: (updatedProgram: Program) => void;
}

function EditProgramForm({ program, channels, onSave }: EditProgramFormProps) {
  const [formData, setFormData] = useState({
    content: program.content,
    start:
      program.start instanceof Date && !isNaN(program.start.getTime())
        ? program.start.toISOString().slice(0, 16)
        : "",
    end:
      program.end instanceof Date && !isNaN(program.end.getTime())
        ? program.end.toISOString().slice(0, 16)
        : "",
    group: program.group,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Ensure start and end times are valid
    const startDate = new Date(formData.start);
    const endDate = new Date(formData.end);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      alert("Please provide valid start and end times.");
      return;
    }

    const updatedProgram: Program = {
      ...program,
      content: formData.content,
      start: startDate,
      end: endDate,
      group: formData.group,
    };

    onSave(updatedProgram);
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 py-4 bg-white">
      <div className="grid grid-cols-4 items-center gap-4">
        <label htmlFor="content" className="text-right">
          Title
        </label>
        <input
          id="content"
          name="content"
          value={formData.content}
          onChange={handleChange}
          className="col-span-3"
          required
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <label htmlFor="start" className="text-right">
          Start Time
        </label>
        <input
          id="start"
          name="start"
          type="datetime-local"
          value={formData.start}
          onChange={handleChange}
          className="col-span-3"
          required
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <label htmlFor="end" className="text-right">
          End Time
        </label>
        <input
          id="end"
          name="end"
          type="datetime-local"
          value={formData.end}
          onChange={handleChange}
          className="col-span-3"
          required
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <label htmlFor="group" className="text-right">
          Channel
        </label>
        <select
          id="group"
          name="group"
          value={formData.group}
          onChange={handleChange}
          className="col-span-3 border rounded-md p-2"
          required
        >
          {channels.map((channel) => (
            <option key={channel.id} value={channel.id}>
              {channel.content}
            </option>
          ))}
        </select>
      </div>
      <button type="submit">Save changes</button>
    </form>
  );
}
