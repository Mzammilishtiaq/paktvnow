import { useState, useEffect } from "react";
import { cn } from "../lib/utlils";

interface NewProgramFormProps {
    program: Program;
    channels: Channel[];
    onSave: (updatedProgram: Program) => void;
    onCancel: () => void;
  }
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

export function NewProgramForm({ program, channels, onSave,onCancel }: NewProgramFormProps) {
  const [formData, setFormData] = useState({
    content: "New Program",
    start:
    program.start instanceof Date && !isNaN(program.start.getTime())
      ? program.start.toISOString().slice(0, 16)
      : "",
  end:
    program.end instanceof Date && !isNaN(program.end.getTime())
      ? program.end.toISOString().slice(0, 16)
      : "",
    group: program.group,
    imageUrl: "",
    description: "",
  })
  // const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [imageUrlPreview, setImageUrlPreview] = useState<string | null>(null)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    // Update form data if initial props change (e.g., if dialog is reused)
    setFormData({
      content: "New Program",
      start:
        program.start instanceof Date && !isNaN(program.start.getTime())
          ? program.start.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "Invalid Time",
      end:
        program.end instanceof Date && !isNaN(program.end.getTime())
          ? program.end.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })
        : "Invalid Time",
      group: program.group,
      imageUrl: "",
      description: "",
    })
    // setSelectedFile(null)
    setImageUrlPreview(null)
    setErrors({})
  }, [])  //initialStart, initialEnd, initialGroup

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // setSelectedFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImageUrlPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    } else {
      // setSelectedFile(null)
      setImageUrlPreview(null)
    }
  }

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}

    if (!formData.content.trim()) {
      newErrors.content = "Program title is required"
    }

    const startDate = new Date(formData.start)
    const endDate = new Date(formData.end)

    if (!formData.start || isNaN(startDate.getTime())) {
      newErrors.start = "Valid start time is required"
    }

    if (!formData.end || isNaN(endDate.getTime())) {
      newErrors.end = "Valid end time is required"
    }

    if (startDate && endDate && startDate >= endDate) {
      newErrors.end = "End time must be after start time"
    }

    if (!formData.group) {
      newErrors.group = "Channel selection is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      const startDate = new Date(formData.start)
      const endDate = new Date(formData.end)

      const newProgramData = {
        content: formData.content.trim(),
        start: startDate,
        end: endDate,
        group: formData.group,
        imageUrl: imageUrlPreview || formData.imageUrl.trim() || undefined, // Use file preview, then URL input, then undefined
        description: formData.description.trim() || undefined,
      }

      onSave(newProgramData as unknown as Program)
    } catch (error) {
      console.error("Error creating program:", error)
      alert("An error occurred while creating the program. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-white p-6 rounded-lg">
      <form onSubmit={handleSubmit} className="grid gap-6">
        {/* Program Title */}
        <div className="grid grid-cols-4 items-start gap-4">
          <label htmlFor="content" className="text-right text-sm font-medium text-gray-700 pt-2">
            Title
          </label>
          <div className="col-span-3">
            <input
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              className={cn(
                "w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
                errors.content ? "border-red-500" : "border-gray-300",
              )}
              placeholder="Enter program title"
              required
            />
            {errors.content && <p className="mt-1 text-sm text-red-600">{errors.content}</p>}
          </div>
        </div>

        {/* Start Time */}
        {/* <div className="grid grid-cols-4 items-start gap-4">
          <label htmlFor="start" className="text-right text-sm font-medium text-gray-700 pt-2">
            Start Time
          </label>
          <div className="col-span-3">
            <input
              id="start"
              name="start"
              type="datetime-local"
              value={formData.start}
              onChange={handleChange}
              className={cn(
                "w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
                errors.start ? "border-red-500" : "border-gray-300",
              )}
              required
            />
            {errors.start && <p className="mt-1 text-sm text-red-600">{errors.start}</p>}
          </div>
        </div> */}

        {/* End Time */}
        {/* <div className="grid grid-cols-4 items-start gap-4">
          <label htmlFor="end" className="text-right text-sm font-medium text-gray-700 pt-2">
            End Time
          </label>
          <div className="col-span-3">
            <input
              id="end"
              name="end"
              type="datetime-local"
              value={formData.end}
              onChange={handleChange}
              className={cn(
                "w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
                errors.end ? "border-red-500" : "border-gray-300",
              )}
              required
            />
            {errors.end && <p className="mt-1 text-sm text-red-600">{errors.end}</p>}
          </div>
        </div> */}

        {/* Channel Selection */}
        <div className="grid grid-cols-4 items-start gap-4">
          <label htmlFor="group" className="text-right text-sm font-medium text-gray-700 pt-2">
            Channel
          </label>
          <div className="col-span-3">
            <select
              id="group"
              name="group"
              value={formData.group}
              onChange={handleChange}
              className={cn(
                "w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
                errors.group ? "border-red-500" : "border-gray-300",
              )}
              required
            >
              <option value="">Select a channel</option>
              {channels.map((channel) => (
                <option key={channel.id} value={channel.id}>
                  {channel.content}
                </option>
              ))}
            </select>
            {errors.group && <p className="mt-1 text-sm text-red-600">{errors.group}</p>}
          </div>
        </div>

        {/* Image File Input */}
        <div className="grid grid-cols-4 items-start gap-4">
          <label htmlFor="imageFile" className="text-right text-sm font-medium text-gray-700 pt-2">
            Upload Image
          </label>
          <div className="col-span-3">
            <input
              id="imageFile"
              name="imageFile"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            {imageUrlPreview && (
              <div className="mt-2">
                <img
                  src={imageUrlPreview || "/placeholder.svg"}
                  alt="Image Preview"
                  className="h-20 w-20 object-cover rounded-md"
                />
              </div>
            )}
            <p className="mt-1 text-xs text-gray-500">Or provide a URL below.</p>
          </div>
        </div>

        {/* Image URL Input */}
        {/* <div className="grid grid-cols-4 items-start gap-4">
          <label htmlFor="imageUrl" className="text-right text-sm font-medium text-gray-700 pt-2">
            Image URL
          </label>
          <div className="col-span-3">
            <input
              id="imageUrl"
              name="imageUrl"
              type="url"
              value={formData.imageUrl}
              onChange={handleChange}
              className={cn(
                "w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
                errors.imageUrl ? "border-red-500" : "border-gray-300",
              )}
              placeholder="e.g., /placeholder.svg?height=40&width=60&query=movie"
              disabled={!!selectedFile} // Disable if a file is selected
            />
            {errors.imageUrl && <p className="mt-1 text-sm text-red-600">{errors.imageUrl}</p>}
          </div>
        </div> */}

        {/* Description */}
        <div className="grid grid-cols-4 items-start gap-4">
          <label htmlFor="description" className="text-right text-sm font-medium text-gray-700 pt-2">
            Description
          </label>
          <div className="col-span-3">
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className={cn(
                "w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
                errors.description ? "border-red-500" : "border-gray-300",
              )}
              placeholder="Enter program description"
            />
            {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className={cn(
              "px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500",
              isSubmitting && "opacity-50 cursor-not-allowed",
            )}
          >
            {isSubmitting ? "Adding..." : "Add Program"}
          </button>
        </div>
      </form>
    </div>
  )
}
