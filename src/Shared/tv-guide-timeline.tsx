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
// import { ArrowRightIcon, ArrowLeftIcon, Calendar1 } from "lucide-react";
import DateCarousel from "./carousel/date-carousel";
import TimeCarousel from "./carousel/time-carousel";
import { EditProgramForm } from "./EditProgramForm";
import { cn } from "../lib/utlils";
import TimelineItemContent from "./TimelineItem";
import { createRoot, type Root } from "react-dom/client";
import { NewProgramForm } from "./NewProgram";
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
  imageUrl?: string;
  description?: string;
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
      start: new Date(2025, 6, 14, 8, 0, 0),
      end: new Date(2025, 6, 14, 9, 0, 0),
      type: "range",
      imageUrl: "/placeholder.svg?height=40&width=60",
      description: "Daily morning news updates.",
    },
    {
      id: "2",
      group: "channel-a",
      content: "Talk Show",
      start: new Date(2025, 6, 14, 9, 30, 0),
      end: new Date(2025, 6, 14, 10, 30, 0),
      type: "range",
      imageUrl: "/placeholder.svg?height=40&width=60",
      description: "Interviews with celebrities and experts.",
    },
    {
      id: "3",
      group: "channel-b",
      content: "Documentary",
      start: new Date(2025, 6, 14, 10, 0, 0),
      end: new Date(2025, 6, 14, 11, 30, 0),
      type: "range",
      imageUrl: "/placeholder.svg?height=40&width=60",
      description: "Exploring the wonders of nature.",
    },
    {
      id: "4",
      group: "channel-c",
      content: "Kids Show",
      start: new Date(2025, 6, 14, 11, 0, 0),
      end: new Date(2025, 6, 14, 12, 0, 0),
      type: "range",
      imageUrl: "/placeholder.svg?height=40&width=60",
      description: "Fun and educational content for children.",
    },
    {
      id: "5",
      group: "channel-a",
      content: "Evening Movie",
      start: new Date(2025, 6, 14, 19, 0, 0),
      end: new Date(2025, 6, 14, 21, 0, 0),
      type: "range",
      imageUrl: "/placeholder.svg?height=40&width=60",
      description: "Blockbuster movie of the week.",
    },
  ])

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
  const [isNewProgramDialogOpen, setIsNewProgramDialogOpen] = useState(false);
  const itemRoots = useRef<Map<string | number, Root>>(new Map());
  // --- Navigation functions ---
  // const setTodayView = () => {
  //   if (timelineInstance.current) {
  //     const now = new Date();
  //     const startOfDay = new Date(
  //       now.getFullYear(),
  //       now.getMonth(),
  //       now.getDate(),
  //       0,
  //       0,
  //       0
  //     );
  //     const endOfDay = new Date(
  //       now.getFullYear(),
  //       now.getMonth(),
  //       now.getDate(),
  //       23,
  //       59,
  //       59
  //     );
  //     timelineInstance.current.setWindow(startOfDay, endOfDay);
  //   }
  // };

  // const setWeekView = () => {
  //   if (timelineInstance.current) {
  //     const now = new Date();
  //     const dayOfWeek = now.getDay(); // 0 for Sunday, 1 for Monday, etc.
  //     const startOfWeek = new Date(
  //       now.getFullYear(),
  //       now.getMonth(),
  //       now.getDate() - dayOfWeek,
  //       0,
  //       0,
  //       0
  //     );
  //     const endOfWeek = new Date(
  //       now.getFullYear(),
  //       now.getMonth(),
  //       now.getDate() - dayOfWeek + 6,
  //       23,
  //       59,
  //       59
  //     );
  //     timelineInstance.current.setWindow(startOfWeek, endOfWeek);
  //   }
  // };

  // const moveTimeline = (direction: "back" | "next") => {
  //   if (timelineInstance.current) {
  //     const window = timelineInstance.current.getWindow();
  //     const interval = window.end.getTime() - window.start.getTime();
  //     const offset = direction === "next" ? interval : -interval;

  //     const newStart = new Date(window.start.getTime() + offset);
  //     const newEnd = new Date(window.end.getTime() + offset);

  //     timelineInstance.current.setWindow(newStart, newEnd);
  //   }
  // };

  // --- Handle Edit Dialog ---
  // const handleEditClick = () => {
  //   if (selectedItem) {
  //     setIsEditDialogOpen(true);
  //   }
  // };

  const handleSaveEdit = (updatedProgram: Program) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === updatedProgram.id ? updatedProgram : item
      )
    );
    setSelectedItem(null); // Clear selection after saving
    setIsEditDialogOpen(false);
  };

  const handleSaveNewProgram = (newProgram: {
    content: string;
    start: Date;
    end: Date;
    group: string;
    imageUrl?: string;
    description?: string;
  }) => {
    const program: Program = {
      id: (Math.random() * 1e9).toFixed(0),
      ...newProgram,
      type: "range",
    };
    setItems((prevItems) => [...prevItems, program]);
  };

  // Helper to get a time string aligned to 30-minute intervals
  const getFormattedTimeSlot = useCallback((date: Date) => {
    const roundedDate = new Date(
      Math.round(date.valueOf() / (1000 * 60 * 30)) * (1000 * 60 * 30)
    );
    return roundedDate.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  }, []);

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
    setSelectedTime(getFormattedTimeSlot(now));

    if (timelineInstance.current) {
      const startOfHour = new Date(now);
      startOfHour.setMinutes(0, 0, 0);
      const endOfHour = new Date(now);
      endOfHour.setHours(now.getHours() + 1, 0, 0, 0); // Show 1 hour window around current time

      timelineInstance.current.setWindow(startOfHour, endOfHour);
      setTimelineWindow();
    }
  }, [getFormattedTimeSlot]);

  const handleTimeRangeChange = (start: string, end: string) => {
    const today = new Date(selectedDate); // assuming selectedDate has correct date

    const parseTime = (timeStr: string) => {
      const [time, ampm] = timeStr.split(" ");
      const [rawHours, tempMinutes] = time.split(":").map(Number);
      const minutes = tempMinutes;
      let hours = rawHours;
      if (ampm === "PM" && hours !== 12) hours += 12;
      if (ampm === "AM" && hours === 12) hours = 0;
      const date = new Date(today);
      date.setHours(hours, minutes, 0, 0);
      return date;
    };

    const startDate = parseTime(start);
    const endDate = parseTime(end);
    endDate.setMinutes(endDate.getMinutes() + 30); // ensure 30-minute interval

    // setTimelineStartTime(startDate)
    // setTimelineEndTime(endDate)
    setSelectedTime(getFormattedTimeSlot(startDate)); // Ensure selectedTime is aligned

    if (timelineInstance.current) {
      timelineInstance.current.setWindow(startDate, endDate, {
        animation: true,
        // duration: 300,
        // easingFunction: "easeOutQuad",
      });
    }
  };

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
        setTimelineWindow();
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
        moveable: true,
        // Disable zoom functionality by not setting zoomMax and zoomMin
        zoomMax: 1000 * 60 * 60 * 6, // Disable zooming to maximum
        zoomMin: 1000 * 60 * 30, // Disable zooming to minimum
        start: new Date(new Date().setHours(7, 0, 0, 0)),
        end: new Date(new Date().setHours(23, 0, 0, 0)),
        showMajorLabels: false,
        showMinorLabels: true,
        showCurrentTime: true,
        currentTime: {
          customMarkup: `
            <div class="vis-custom-current-time-marker">
              <div class="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-sm absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap">
                Now Live
              </div>
            </div>
          `,
        },
        timeAxis: { scale: "minute" as TimelineTimeAxisScaleType, step: 30 },
        timeStep: 30 * 60 * 1000, // 30 minutes
        snap: function (date: Date) {
          const ms = 1000 * 60 * 30; // 30 minutes in ms
          return new Date(Math.round(date.valueOf() / ms) * ms);
        },
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
          // const startTime =
          //   item.start instanceof Date && !isNaN(item.start.getTime())
          //     ? item.start.toLocaleTimeString([], {
          //         hour: "2-digit",
          //         minute: "2-digit",
          //       })
          //     : "Invalid Time";
          // const endTime =
          //   item.end instanceof Date && !isNaN(item.end.getTime())
          //     ? item.end.toLocaleTimeString([], {
          //         hour: "2-digit",
          //         minute: "2-digit",
          //       })
          //     : "Invalid Time";

          // const programItem = itemsRef.current.find(
          //   (p) => String(p.id) === String(item.id)
          // );
          // if (!programItem) return "";

          // const container = document.createElement("div");
          // container.className =
          //   "w-full h-full flex items-center justify-center"; // Basic styling for the container

          // // Create a React root and render the component
          // let root = itemRoots.current.get(item.id);
          // if (!root) {
          //   root = createRoot(container);
          //   itemRoots.current.set(item.id, root);
          // }
          // root.render(<TimelineItemContent program={item} />);

          // return container;

             return `
            // This method is correct and confirmed.
            <div class="p-1 text-sm font-medium overflow-hidden whitespace-nowrap text-ellipsis" id="timeline-item-${item.id}"></div>
            <script>
              (function() {
                // Wait for React to be available and the DOM to be ready
                if (window.React && window.ReactDOM && document.getElementById("timeline-item-${item.id}")) {
                  const container = document.getElementById("timeline-item-${item.id}");
                  // Remove any previous content
                  while (container.firstChild) container.removeChild(container.firstChild);
                  // Render the React component into the container
                  window.ReactDOM.createRoot
                    ? window.ReactDOM.createRoot(container).render(window.React.createElement(window.TimelineItemContent, { program: item }))
                    : window.ReactDOM.render(window.React.createElement(window.TimelineItemContent, { program: item }), container);
                }
              })();
            </script>
          `;

          // return `
          //   <div class="p-1 text-sm font-medium overflow-hidden whitespace-nowrap text-ellipsis">
          //     ${item.content}
          //     <div class="text-xs text-gray-500">${startTime} - ${endTime}</div>
          //   </div>
          // `;
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
          const newContent = setIsNewProgramDialogOpen(true);
          if (newContent !== null && item.group) {
            const newProgram: Program = {
              id: (Math.random() * 1e9).toFixed(0),
              content: "New Program",
              start: new Date(item.start),
              end: item.end
                ? new Date(item.end)
                : new Date(new Date(item.start).getTime() + 3600000),
              group: String(item.group),
              type: "range",
              imageUrl: "/placeholder.svg?height=40&width=60", // Default image
              description: "Enter a description for this new program.", // Default description
            };
            setItems((prevItems) => [...prevItems, newProgram]);

            // Immediately set the new program as selected and open the edit dialog
            setSelectedItem(newProgram);
            // setIsNewProgramDialogOpen(true);

            // Render the React component for the new item
            const container = document.createElement("div");
            container.className =
              "w-full h-full flex items-center justify-center";
            const root = createRoot(container);
            itemRoots.current.set(newProgram.id, root);
            root.render(<TimelineItemContent program={newProgram} />);

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

      if (timelineInstance.current) {
        timelineInstance.current.on("rangechange", (properties) => {
          const now = new Date();
          const Move_Limit = 1.5 * 60 * 60 * 1000;
          const leftLimit = now.getTime() - Move_Limit;
          const rightLimit = now.getTime() + Move_Limit;
          if (properties.start.getTime() < leftLimit) {
            properties.start = new Date(leftLimit);
            properties.end = new Date(leftLimit + Move_Limit);

            // Get the current window
            // const currentWindow = timelineInstance.current?.getWindow();
            // if (!currentWindow || !timelineInstance.current) return;

            // const panStep = 60 * 60 * 1000; // 1b hour in milliseconds
            // const newStart = new Date(currentWindow.start.getTime() + panStep * (properties.direction === "right" ? 1 : -1));
            // const newEnd = new Date(currentWindow.end.getTime() + panStep * (properties.direction === "right" ? 1 : -1));

            // // Set the new window
            // timelineInstance.current.setWindow(newStart, newEnd);
          }
          if (properties.end.getTime() > rightLimit) {
            properties.start = new Date(rightLimit);
            properties.end = new Date(rightLimit - Move_Limit);
          }
        });
      }
      // Initial sync with current time
      timelineInstance.current.setWindow(
        new Date(),
        new Date(new Date().getTime() + 60 * 60 * 1000)
      );

      // Ensure the current time is shown immediately after loading
      const currentTime = timelineInstance.current.getCurrentTime();
      setSelectedTime(
        new Date(currentTime).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        })
      );

      // Sync with the carousel
      timelineInstance.current.on("rangechange", () => {
        if (!timelineInstance.current) return;
        const currentTime = timelineInstance.current.getWindow().start;
        setSelectedTime(
          new Date(currentTime).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          })
        );
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
      if (timelineInstance.current) {
        setTimelineWindow();
      }
      return () => {
        if (timelineInstance.current) {
          timelineInstance.current.destroy();
          timelineInstance.current = null;
          setIsTimelineReady(false);
        }
      };
    }
  }, []); //items, groups

  // Function to set the timeline window
  const setTimelineWindow = () => {
    try {
      const now = new Date();
      // Set the window to show a 2.5 hour range centered around current time
      const startOfWindow = new Date(now);
      startOfWindow.setMinutes(now.getMinutes() - 95, 0, 0); // 1 hour 35 minutes before current time

      const endOfWindow = new Date(now);
      endOfWindow.setMinutes(now.getMinutes() + 95, 0, 0); // 1 hour 35 minutes after current time (total 3 hours 10 minutes)

      // Debugging: Check the window start and end times
      console.log("startOfWindow:", startOfWindow);
      console.log("endOfWindow:", endOfWindow);

      // Check if the dates are valid
      if (isNaN(startOfWindow.getTime()) || isNaN(endOfWindow.getTime())) {
        console.error("Invalid start or end time");
        return;
      }

      if (timelineInstance.current) {
        timelineInstance.current.setWindow(startOfWindow, endOfWindow);
      }
    } catch (error) {
      console.error("Error setting window:", error);
    }
  };

  // Set initial timeline window to show a 6-hour range centered around current time
  useEffect(() => {
    if (isTimelineReady) {
      setTimelineWindow(); // Set the window when the timeline is ready
    }
  }, [isTimelineReady]);
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

  // Function to handle item update in vis.js
  const handleUpdate = (item: TimelineItem) => {
    // Create a new item object with updated data
    const updatedItem = {
      id: item.id,
      group: String(item.group ?? ""),
      content: String(item.content ?? ""),
      start: new Date(item.start ?? new Date()),
      end: new Date(item.end ?? new Date()),
      type: "range" as const,
    };

    // Update the program data in the React state
    setItems((prevItems) =>
      prevItems.map(
        (program) => (program.id === updatedItem.id ? updatedItem : program) // Find the matching item and update it
      )
    );

    // Set the updated item as the selected item for the form
    setSelectedItem(updatedItem);
    setIsEditDialogOpen(true); // Open the dialog for editing
  };

  // UseEffect hook to listen to 'update' events from vis.js
  useEffect(() => {
    if (timelineInstance.current) {
      // Listen for the update event from vis.js
      timelineInstance.current.on("update", (properties) => {
        if (properties.items.length > 0) {
          const selectedId = properties.items[0]; // Get the id of the updated item
          const item = items.find((i) => i.id === selectedId); // Find the updated item in the state

          if (item) {
            handleUpdate(item); // Pass the updated item to handleUpdate function
          }
        }
      });
    }
  }, [items]); // Ensure the effect runs when items change

  const onTimeScroll = (direction: "back" | "next") => {
    if (timelineInstance.current) {
      const window = timelineInstance.current.getWindow();
      const interval = window.end.getTime() - window.start.getTime();
      const offset = direction === "next" ? interval : -interval;

      const newStart = new Date(window.start.getTime() + offset * 2); // Move by 2 hours
      const newEnd = new Date(window.end.getTime() + offset * 2); // Move by 2 hours

      timelineInstance.current.setWindow(newStart, newEnd); // Apply new window
    }
  };
  return (
    <div className="w-full h-[100vh] py-2  px-1 bg-gray-100">
      {/* <div className="flex justify-between items-center gap-2">
      <h1 className="text-2xl font-bold mb-4">TV Guide Admin Panel</h1>
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
      </div> */}
      <DateCarousel
        onSelectDate={handleSelectDate}
        selectedDate={selectedDate}
      />

      {/* Custom Time Carousel */}
      <div className="flex items-center bg-gray-800 text-white px-1 rounded-b-lg mb-4 time-carousel-container gap-1">
        <div className="bg-white p-2">
          <button
            onClick={handleGoLive}
            className={cn(
              "bg-gray-500 hover:bg-gray-500 text-white flex items-center justify-center gap-x-1 w-[80px]"

              // ? "bg-gray-500"
              // : "bg-red-500"
            )}
          >
            <div className={cn("h-2 w-2 rounded-full bg-white")} />
            <span className="text-sm font-medium">Go Live</span>
          </button>
        </div>
        <TimeCarousel
          selectedTime={selectedTime}
          onRangeChange={handleTimeRangeChange}
          onTimeScroll={onTimeScroll} // Pass onTimeScroll function
        />
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
       <ReusableDialog
          open={isNewProgramDialogOpen}
          onClose={() => setIsNewProgramDialogOpen}
          title="New Program"
        >
      <NewProgramForm
        program={selectedItem || {
          id: "",
          group: "",
          content: "",
          start: new Date(),
          end: new Date(),
          type: "range",
        }}
        onCancel={() => setIsNewProgramDialogOpen(false)}
        channels={groups}
        onSave={handleSaveNewProgram}
      />
      </ReusableDialog>
    </div>
  );
}
