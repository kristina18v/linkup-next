"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";

export default function EnrollmentsPage() {
  const [user, setUser] = useState(null);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // CURRENT USER
    fetch("/api/auth/me", {
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        setUser(data);
      })
      .catch((error) => {
        console.log(error);
      });

    // GET ENROLLMENTS
    fetch("/api/enrollments", {
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        setEnrollments(data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }, []);

  function getStatusName(status) {
    if (status === "pending") return "Во исчекување";
    if (status === "enrolled") return "Запишан";
    if (status === "rejected") return "Одбиен";
    if (status === "completed") return "Завршен";
    if (status === "cancelled") return "Откажан";

    return status;
  }

  return (
    <main className="home-layout">

      <Sidebar user={user} />

      <section className="home-main">

        <Navbar user={user} />

        <div className="enrollments-page">

          <div className="enrollments-heading">

            <h1>Запишувања на курсеви</h1>

            <p>
              Преглед на апликациите и запишувањата.
            </p>

          </div>

          {loading && (
            <p>Се вчитуваат запишувањата...</p>
          )}

          {!loading && enrollments.length === 0 && (
            <p>Нема запишувања.</p>
          )}

          <div className="enrollments-list">

            {enrollments.map((enrollment) => (

              <article
                className="enrollment-card"
                key={enrollment._id}
              >

                <h2>
                  {enrollment.course?.title}
                </h2>

                <p>
                  <strong>Корисник:</strong>{" "}
                  {enrollment.user?.name}{" "}
                  {enrollment.user?.surname}
                </p>

                {enrollment.motivation && (
                  <p>
                    <strong>Мотивација:</strong>{" "}
                    {enrollment.motivation}
                  </p>
                )}

                <p>
                  <strong>Статус:</strong>{" "}
                  {getStatusName(
                    enrollment.status
                  )}
                </p>

                <Link
                  href={`/enrollments/${enrollment._id}`}
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