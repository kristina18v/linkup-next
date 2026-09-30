"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";

const COURSES_LIMIT = 6;

export default function CoursesPage() {
  const [user, setUser] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

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
  }, []);

  useEffect(() => {
    // GET COURSES
    fetch(`/api/courses?page=${page}&limit=${COURSES_LIMIT}`, {
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
          Array.isArray(data) ? data : data.courses || []
        );

        setTotalPages(
          Math.max(1, data.totalPages || 1)
        );
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);

        setCourses([]);
        setTotalPages(1);
        setLoading(false);
      });
  }, [page]);

  function goToPage(nextPage) {
    const targetPage = Math.min(
      Math.max(1, nextPage),
      totalPages
    );

    if (targetPage !== page) {
      setLoading(true);
      setPage(targetPage);
    }
  }

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


          <section className="learning-market-toolbar-v2" aria-label="Course discovery tools">
            <div className="market-search-v2">
              <span>Пребарај</span>
              <input type="text" placeholder="Дизајн, програмирање, маркетинг..." readOnly />
            </div>

            <div className="market-filter-row-v2">
              <span>Сите категории</span>
              <span>Сите нивоа</span>
              <span>Online / во живо</span>
            </div>
          </section>

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
          {!loading && courses.length > 0 && (
            <>
              <div className="courses-list courses-grid">

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

                    <div className="course-card-body">

                      {/* TITLE */}
                      <h2>
                        {course.title}
                      </h2>

                      {/* INSTRUCTOR */}
                      <p className="course-instructor">
                        {course.instructor?.name}{" "}
                        {course.instructor?.surname}
                      </p>

                      <div className="course-meta-grid">

                        {/* CATEGORY */}
                        <span>
                          {course.category}
                        </span>

                        {/* LEVEL */}
                        <span>
                          {course.level}
                        </span>

                        {/* FORMAT */}
                        <span>
                          {course.format}
                        </span>

                      </div>

                      {/* PRICE */}
                      <p className="course-price">
                        {course.price} ден.
                      </p>

                      {/* DETAILS */}
                      <Link
                        href={`/courses/${course._id}`}
                        className="course-details-button"
                      >
                        Повеќе детали
                      </Link>

                    </div>

                  </article>

                ))}

              </div>

              <div className="courses-pagination">
                <button
                  type="button"
                  onClick={() => goToPage(page - 1)}
                  disabled={page === 1}
                >
                  Previous
                </button>

                {Array.from(
                  { length: totalPages },
                  (_, index) => index + 1
                ).map((pageNumber) => (
                  <button
                    type="button"
                    key={pageNumber}
                    className={
                      pageNumber === page ? "active" : ""
                    }
                    onClick={() => goToPage(pageNumber)}
                  >
                    {pageNumber}
                  </button>
                ))}

                <button
                  type="button"
                  onClick={() => goToPage(page + 1)}
                  disabled={page === totalPages}
                >
                  Next
                </button>
              </div>
            </>
          )}

        </div>

      </section>

    </main>
  );
}