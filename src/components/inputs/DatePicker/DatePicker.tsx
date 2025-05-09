import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { useState } from 'react'
import { isAfter, isWeekend, startOfToday } from 'date-fns'

export default function DatePickerField() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  const isValidDate = (date: Date) => {
    return !isWeekend(date) && isAfter(date, startOfToday()) || date.toDateString() === new Date().toDateString()
  }

  return (
    <div>
      <label className="block mb-1 text-gray-400">Execution Date</label>
      <DatePicker
        selected={selectedDate}
        onChange={(date: Date | null) => setSelectedDate(date)}
        filterDate={isValidDate}
        minDate={new Date()}
        placeholderText="Select a date"
        dateFormat="yyyy-MM-dd"
        className="w-full bg-[#1C1C1C] text-white border border-gray-700 rounded-md p-2"
      />
    </div>
  )
}
