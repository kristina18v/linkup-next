"use client";

import { useEffect, useState } from "react";
import Icon from "@/components/Icon";

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState([]);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const months = [
    "Јануари",
    "Февруари",
    "Март",
    "Април",
    "Мај",
    "Јуни",
    "Јули",
    "Август",
    "Септември",
    "Октомври",
    "Ноември",
    "Декември",
  ];

  // GET EVENTS
  useEffect(() => {
    async function loadEvents() {
      try {
        const [
          coursesResponse,
          tutoringResponse,
          projectsResponse,
          internshipsResponse,
        ] = await Promise.all([
          fetch("/api/courses", {
            credentials: "include",
          }),

          fetch("/api/tutoring", {
            credentials: "include",
          }),

          fetch("/api/project-requests", {
            credentials: "include",
          }),

          fetch("/api/internships", {
            credentials: "include",
          }),
        ]);

        const courses = await coursesResponse.json();
        const tutoring = await tutoringResponse.json();
        const projects = await projectsResponse.json();
        const internships = await internshipsResponse.json();

        const allEvents = [];

        // COURSES
        if (Array.isArray(courses)) {
          courses.forEach((course) => {
            if (course.startDate) {
              allEvents.push({
                date: course.startDate,
                title: course.title,
                type: "Курс",
              });
            }
          });
        }

        // TUTORING
        if (Array.isArray(tutoring)) {
          tutoring.forEach((item) => {
            item.availableDates?.forEach((date) => {
              allEvents.push({
                date: date,
                title: item.title,
                type: "Час",
              });
            });
          });
        }

        // PROJECT DEADLINES
        if (Array.isArray(projects)) {
          projects.forEach((project) => {
            if (project.deadline) {
              allEvents.push({
                date: project.deadline,
                title: project.title,
                type: "Проект",
              });
            }
          });
        }

        // INTERNSHIP DEADLINES
        if (Array.isArray(internships)) {
          internships.forEach((internship) => {
            if (internship.deadline) {
              allEvents.push({
                date: internship.deadline,
                title: internship.title,
                type: "Пракса",
              });
            }
          });
        }

        setEvents(allEvents);

      } catch (error) {
        console.log(error);
      }
    }

    loadEvents();
  }, []);

  // БРОЈ НА ДЕНОВИ ВО МЕСЕЦОТ
  const daysInMonth = new Date(
    year,
    month + 1,
    0
  ).getDate();

  // ПРВ ДЕН ОД МЕСЕЦОТ
  let firstDay = new Date(
    year,
    month,
    1
  ).getDay();

  // Неделата да почнува од понеделник
  firstDay = firstDay === 0 ? 6 : firstDay - 1;

  // PREVIOUS MONTH
  function previousMonth() {
    setCurrentDate(
      new Date(year, month - 1, 1)
    );
  }

  // NEXT MONTH
  function nextMonth() {
    setCurrentDate(
      new Date(year, month + 1, 1)
    );
  }

  const days = [];

  // ПРАЗНИ ПОЛИЊА ПРЕД ПРВИОТ ДЕН
  for (let i = 0; i < firstDay; i++) {
    days.push(
      <div
        key={`empty-${i}`}
        className="calendar-day empty"
      />
    );
  }

  // ДЕНОВИ
  for (let day = 1; day <= daysInMonth; day++) {
    const today = new Date();

    // ДАЛИ Е ДЕНЕС
    const isToday =
      day === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear();

    // НАСТАНИ ЗА ОВОЈ ДЕН
    const dayEvents = events.filter((event) => {
      const eventDate = new Date(event.date);

      return (
        eventDate.getDate() === day &&
        eventDate.getMonth() === month &&
        eventDate.getFullYear() === year
      );
    });

    const hasEvent = dayEvents.length > 0;

    days.push(
      <div
        key={day}
        className={`calendar-day ${
          isToday ? "today" : ""
        } ${
          hasEvent ? "has-event" : ""
        }`}
        title={
          hasEvent
            ? dayEvents
                .map(
                  (event) =>
                    `${event.type}: ${event.title}`
                )
                .join("\n")
            : ""
        }
      >
        {day}

        {hasEvent && (
          <span className="event-dot"></span>
        )}
      </div>
    );
  }

  return (
    <aside className="calendar-card">

      {/* HEADER */}
      <div className="calendar-header">

        <button
          type="button"
          onClick={previousMonth}
        >
          ←
        </button>

        <div className="calendar-month">

          <Icon name="calendar" />

          <strong>
            {months[month]} {year}
          </strong>

        </div>

        <button
          type="button"
          onClick={nextMonth}
        >
          →
        </button>

      </div>

      {/* DAYS NAMES */}
      <div className="calendar-weekdays">

        <span>Пон</span>
        <span>Вто</span>
        <span>Сре</span>
        <span>Чет</span>
        <span>Пет</span>
        <span>Саб</span>
        <span>Нед</span>

      </div>

      {/* CALENDAR DAYS */}
      <div className="calendar-grid">
        {days}
      </div>

    </aside>
  );
}