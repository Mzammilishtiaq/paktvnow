import { useRef, useEffect, useState } from "react";
import { Timeline, type TimelineItem } from "vis-timeline/standalone";
import { DataSet } from "vis-data/peer";
import "vis-timeline/styles/vis-timeline-graph2d.min.css";
import ReusableDialog from "../components/ui/dialog";
import GeoNews from "../assets/geonews.jpeg";
import Bolews from "../assets/BolNews.jpeg";
import CapitalNews from "../assets/CapitalTV.jpeg";
import ExpressNews from "../assets/ExpressNews.jpeg";
import PtvNews from "../assets/PTVNews.jpeg";
import SamaanNews from "../assets/Samaanews.jpeg";
import AryNews from "../assets/arynew.jpeg";
import DunyaNews from "../assets/dunyanews.jpeg";
import {ArrowRightIcon,ArrowLeftIcon,Calendar1} from 'lucide-react'
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

  const [items, setItems] = useState<Program[]>([
    {
      id: "1",
      group: "channel-a",
      content: "Morning News",
      start: new Date(2025, 6, 14, 8, 0, 0),
      end: new Date(2025, 6, 14, 9, 0, 0),
      type: "range",
    },
    {
      id: "2",
      group: "channel-a",
      content: "Talk Show",
      start: new Date(2025, 6, 14, 9, 30, 0),
      end: new Date(2025, 6, 14, 10, 30, 0),
      type: "range",
    },
    {
      id: "3",
      group: "channel-b",
      content: "Documentary",
      start: new Date(2025, 6, 14, 10, 0, 0),
      end: new Date(2025, 6, 14, 11, 30, 0),
      type: "range",
    },
    {
      id: "4",
      group: "channel-c",
      content: "Kids Show",
      start: new Date(2025, 6, 14, 11, 0, 0),
      end: new Date(2025, 6, 14, 12, 0, 0),
      type: "range",
    },
    {
      id: "5",
      group: "channel-a",
      content: "Evening Movie",
      start: new Date(2025, 6, 14, 19, 0, 0),
      end: new Date(2025, 6, 14, 21, 0, 0),
      type: "range",
    },
  ]);

  const [groups] = useState<Channel[]>([
    { id: "channel-a", content: "ARY News", logo: AryNews },
    { id: "channel-b", content: "Geo News", logo: GeoNews },
    { id: "channel-c", content: "Dunya News", logo: DunyaNews },
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

  // --- Main Effect for Timeline Initialization (runs ONLY ONCE) ---
  useEffect(() => {
    if (timelineRef.current && !timelineInstance.current) {
      itemsDataSet.current = new DataSet<Program>(items);
      groupsDataSet.current = new DataSet<Channel>(groups);

      const options = {
        editable: {
          add: true,
          updateTime: true,
          updateGroup: true,
          remove: true,
        },
        orientation: "top",
        stack: false,
        zoomMax: 1000 * 60 * 60 * 24 * 30,
        zoomMin: 1000 * 60 * 5,
        start: new Date(new Date().setHours(7, 0, 0, 0)),
        end: new Date(new Date().setHours(23, 0, 0, 0)),
        showCurrentTime: true,
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
          }
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
                  ? `<img src="${group.logo}" alt="${group.content} logo" style="width: 32px; height: 32px; border-radius: 50%; border: 2px solid #ccc; box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.1);" />`
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

      // Add event listener for item selection
      timelineInstance.current.on("select", (properties) => {
        if (properties.items.length > 0) {
          const selectedId = properties.items[0];
          const item = items.find((i) => i.id === selectedId);
          setSelectedItem(item || null);
        } else {
          setSelectedItem(null);
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
  }, [items, groups]); // Dependencies: items and groups for initial DataSet population

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
    <div className="w-full h-[calc(100vh-64px)] p-4">
      <h1 className="text-2xl font-bold mb-4">TV Guide Admin Panel</h1>
      <div className="flex justify-between items-center gap-2 mb-4">
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
           <ArrowLeftIcon/>
          </button>
           <Calendar1/>
          <button
            onClick={() => moveTimeline("next")}
            disabled={!isTimelineReady}
          >
            <ArrowRightIcon/>
          </button>
        </div>
      </div>
      <div ref={timelineRef} className="h-screen" />
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
