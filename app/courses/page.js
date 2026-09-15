"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";

export default function CoursesPage() {
  const [user, setUser] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // GET CURRENT USER
    fetch("/api/auth/me", {
      credentials: "include",
    })
      .then(async (response) => {
        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Грешка при вчитување на корисникот"
          );
        }

        return data;
      })
      .then((data) => {
        setUser(data.user);
      })
      .catch((error) => {
        console.log(error);
        setUser(null);
      });

    // GET COURSES
    fetch("/api/courses", {
      credentials: "include",
    })
      .then(async (response) => {
        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Грешка при вчитување на курсевите"
          );
        }

        return data;
      })
      .then((data) => {
        setCourses(
          Array.isArray(data) ? data : []
        );

        setLoading(false);
      })
      .catch((error) => {
        console.log(error);

        setCourses([]);
        setLoading(false);
      });
  }, []);

  return (
    <main className="home-layout">

      <Sidebar user={user} />

      <section className="home-main">

        <Navbar user={user} />

        <div className="courses-page">

          {/* HEADING */}
          <div className="courses-heading">

            <div>
              <h1>Курсеви</h1>

              <p>
                Пронајдете курс и развивајте ги
                вашите вештини.
              </p>
            </div>

            {/* COURSE BUTTONS - MENTOR / ADMIN */}
            {(user?.role === "mentor" ||
              user?.role === "admin") && (

              <div className="course-actions">

                <Link
                  href="/courses/create"
                  className="create-course-button"
                >
                  + Креирај курс
                </Link>

                <Link
                  href="/courses/my"
                  className="my-courses-button"
                >
                  Мои курсеви
                </Link>

              </div>

            )}

          </div>


          {/* LOADING */}
          {loading && (
            <p>
              Се вчитуваат курсевите...
            </p>
          )}


          {/* NO COURSES */}
          {!loading &&
            courses.length === 0 && (

              <div className="empty-courses">

                <p>
                  Нема достапни курсеви.
                </p>

                {(user?.role === "mentor" ||
                  user?.role === "admin") && (

                  <Link
                    href="/courses/create"
                    className="create-course-button"
                  >
                    + Креирај го првиот курс
                  </Link>

                )}

              </div>

            )}


          {/* COURSES */}
          <div className="courses-list">

            {courses.map((course) => (

              <article
                className="course-card"
                key={course._id}
              >

                {/* COVER IMAGE */}
                {course.coverImage && (
                  <img
                    src={`/uploads/${course.coverImage}`}
                    alt={course.title}
                    className="course-cover-image"
                  />
                )}


                {/* TITLE */}
                <h2>
                  {course.title}
                </h2>


                {/* DESCRIPTION */}
                <p>
                  {course.description}
                </p>


                {/* INSTRUCTOR */}
                <p>
                  <strong>
                    Инструктор:
                  </strong>{" "}

                  {course.instructor?.name}{" "}
                  {course.instructor?.surname}
                </p>


                {/* CATEGORY */}
                <p>
                  <strong>
                    Категорија:
                  </strong>{" "}

                  {course.category}
                </p>


                {/* LEVEL */}
                <p>
                  <strong>
                    Ниво:
                  </strong>{" "}

                  {course.level}
                </p>


                {/* FORMAT */}
                <p>
                  <strong>
                    Формат:
                  </strong>{" "}

                  {course.format}
                </p>


                {/* PRICE */}
                <p>
                  <strong>
                    Цена:
                  </strong>{" "}

                  {course.price} ден.
                </p>


                {/* DETAILS */}
                <Link
                  href={`/courses/${course._id}`}
                  className="course-details-button"
                >
                  Повеќе детали
                </Link>

              </article>

            ))}

          </div>

        </div>

      </section>

    </main>
  );
}