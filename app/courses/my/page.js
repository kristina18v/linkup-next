"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";

export default function MyCoursesPage() {
  const [user, setUser] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        // GET CURRENT USER
        const userResponse = await fetch("/api/auth/me", {
          credentials: "include",
        });

        const userData = await userResponse.json();

        if (!userResponse.ok) {
          throw new Error(userData.message);
        }

        const currentUser = userData.user;

        setUser(currentUser);

        // GET ALL COURSES
        const coursesResponse = await fetch("/api/courses?limit=1000", {
          credentials: "include",
        });

        const coursesData = await coursesResponse.json();

        if (!coursesResponse.ok) {
          throw new Error(coursesData.message);
        }

        const allCourses = Array.isArray(coursesData)
          ? coursesData
          : coursesData.courses || [];

        // Само курсевите на најавениот корисник
        const myCourses = allCourses.filter(
          (course) =>
            course.instructor?._id === currentUser._id
        );

        setCourses(myCourses);

      } catch (error) {
        console.log(error);
        setCourses([]);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  return (
    <main className="home-layout">

      <Sidebar user={user} />

      <section className="home-main">

        <Navbar user={user} />

        <div className="courses-page">

          <div className="courses-heading">

            <div>
              <h1>Мои курсеви</h1>

              <p>
                Курсеви кои ги имате креирано.
              </p>
            </div>

            <Link
              href="/courses/create"
              className="create-course-button"
            >
              + Креирај курс
            </Link>

          </div>

          {loading && (
            <p>Се вчитуваат курсевите...</p>
          )}

          {!loading && courses.length === 0 && (
            <div className="empty-courses">

              <p>
                Немате креирано курсеви.
              </p>

              <Link
                href="/courses/create"
                className="create-course-button"
              >
                + Креирај курс
              </Link>

            </div>
          )}

          <div className="courses-list">

            {courses.map((course) => (

              <article
                className="course-card"
                key={course._id}
              >

                {course.coverImage && (
                  <img
                    src={`/uploads/${course.coverImage}`}
                    alt={course.title}
                    className="course-cover-image"
                  />
                )}

                <h2>{course.title}</h2>

                <p>{course.description}</p>

                <p>
                  <strong>Категорија:</strong>{" "}
                  {course.category}
                </p>

                <p>
                  <strong>Ниво:</strong>{" "}
                  {course.level}
                </p>

                <p>
                  <strong>Формат:</strong>{" "}
                  {course.format}
                </p>

                <p>
                  <strong>Цена:</strong>{" "}
                  {course.price} ден.
                </p>

                <div className="course-actions">

                  <Link
                    href={`/courses/${course._id}`}
                    className="course-details-button"
                  >
                    Повеќе детали
                  </Link>

                  <Link
                    href={`/courses/${course._id}/edit`}
                    className="edit-course-button"
                  >
                    Измени
                  </Link>

                </div>

              </article>

            ))}

          </div>

        </div>

      </section>

    </main>
  );
}