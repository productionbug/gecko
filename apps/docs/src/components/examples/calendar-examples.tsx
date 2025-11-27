"use client";

import { Button, Calendar } from "@productionbug/gecko";
import type { CalendarRef } from "@productionbug/gecko";
import { useRef, useState } from "react";

export function BasicCalendarExample() {
  const [selectedDate, setSelectedDate] = useState<string | undefined>();

  return (
    <div className="space-y-4">
      <Calendar selectedDate={selectedDate} onSelectDate={setSelectedDate} />
      {selectedDate && <p className="text-sm text-gray-600">Selected: {selectedDate}</p>}
    </div>
  );
}

export function WithDefaultDateExample() {
  const [selectedDate, setSelectedDate] = useState<string | undefined>("2024-06-15");

  return (
    <div className="space-y-4">
      <Calendar selectedDate={selectedDate} onSelectDate={setSelectedDate} />
      <p className="text-sm text-gray-600">Selected: {selectedDate || "None"}</p>
    </div>
  );
}

export function ActiveDateExample() {
  const [selectedDate, setSelectedDate] = useState<string | undefined>();
  const activeDate = "2024-12-25"; // Highlight Christmas

  return (
    <div className="space-y-4">
      <Calendar
        selectedDate={selectedDate}
        activeDate={activeDate}
        onSelectDate={setSelectedDate}
      />
      <div className="text-sm text-gray-600">
        <p>Selected: {selectedDate || "None"}</p>
        <p>Active (highlighted): {activeDate}</p>
      </div>
    </div>
  );
}

export function ProgrammaticControlExample() {
  const [selectedDate, setSelectedDate] = useState<string | undefined>();
  const calendarRef = useRef<CalendarRef>(null);

  const jumpToDate = (month: number, year: number) => {
    calendarRef.current?.moveTo(month, year);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Button size="sm" variant="outlined" onClick={() => jumpToDate(1, 2025)}>
          January 2025
        </Button>
        <Button size="sm" variant="outlined" onClick={() => jumpToDate(7, 2024)}>
          July 2024
        </Button>
        <Button size="sm" variant="outlined" onClick={() => jumpToDate(12, 2023)}>
          December 2023
        </Button>
      </div>
      <Calendar
        selectedDate={selectedDate}
        onSelectDate={setSelectedDate}
        calendarRef={calendarRef}
      />
      {selectedDate && <p className="text-sm text-gray-600">Selected: {selectedDate}</p>}
    </div>
  );
}

export function WithFormIntegrationExample() {
  const [selectedDate, setSelectedDate] = useState<string | undefined>();
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    // In real app: submit form with selectedDate
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">Select Date</label>
        <Calendar selectedDate={selectedDate} onSelectDate={setSelectedDate} />
      </div>
      <Button type="submit" disabled={!selectedDate}>
        Submit
      </Button>
      {submitted && (
        <p className="text-sm text-green-600">Form submitted with date: {selectedDate}</p>
      )}
    </form>
  );
}
