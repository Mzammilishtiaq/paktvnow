import { useEffect, useState } from "react";
import type {Program,Channel} from '../types/interface'
// Separate component for the edit form within the dialog
interface EditProgramFormProps {
    program: Program;
    channels: Channel[];
    onSave: (updatedProgram: Program) => void;
  }
  // interface Channel {
  //   id: string;
  //   content: string;
  //   logo?: string;
  // }
  // interface Program {
  //   id: string | number; // Change the type here to allow both string and number
  //   group: string;
  //   content: string;
  //   start: Date;
  //   end: Date;
  //   type: "range";
  // }
  
  export function EditProgramForm({ program, channels, onSave }: EditProgramFormProps) {
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
    useEffect(() => {
      if (program) {
        setFormData({
          content: program.content,
          start: program.start.toISOString().slice(0, 16),  // Format for datetime-local input
          end: program.end.toISOString().slice(0, 16),
          group: program.group,
        });
      }
    }, [program]);  // Whenever the program changes, update the form data
    
  
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
            value={formData.start||'0,0,0,0,0'}
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
            value={formData.end||'0,0,0,0,0'}
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