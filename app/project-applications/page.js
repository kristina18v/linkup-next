"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";

export default function ProjectApplicationsPage() {
  const [user, setUser] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // CURRENT USER
    fetch("/api/auth/me", {
      credentials: "include",
    })
      .then(async (response) => {
        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Грешка при вчитување на корисникот"
          );
        }

        return data;
      })
      .then((data) => {
        setUser(data);
      })
      .catch((error) => {
        console.log(error);
        setUser(null);
      });

    // PROJECT APPLICATIONS
    fetch("/api/project-applications", {
      credentials: "include",
    })
      .then(async (response) => {
        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Грешка при вчитување на апликациите"
          );
        }

        return data;
      })
      .then((data) => {
        setApplications(data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);

        // applications секогаш останува array
        setApplications([]);
        setLoading(false);
      });
  }, []);

  function getStatusName(status) {
    if (status === "pending") return "Во исчекување";
    if (status === "accepted") return "Прифатена";
    if (status === "rejected") return "Одбиена";

    return status;
  }

  return (
    <main className="home-layout">
      <Sidebar user={user} />

      <section className="home-main">
        <Navbar user={user} />

        <div className="applications-page">

          <div className="applications-heading">
            <h1>Проектни апликации</h1>

            <p>
              Преглед на апликациите за проектите.
            </p>
          </div>

          {loading && (
            <p>Се вчитуваат апликациите...</p>
          )}

          {!loading && applications.length === 0 && (
            <p>Нема проектни апликации.</p>
          )}

          <div className="applications-list">

            {applications.map((application) => (
              <article
                className="application-card"
                key={application._id}
              >

                <h2>
                  {application.projectRequest?.title}
                </h2>

                <p>
                  <strong>Апликант:</strong>{" "}
                  {application.applicant?.name}{" "}
                  {application.applicant?.surname}
                </p>

                <p>
                  <strong>Порака:</strong>{" "}
                  {application.message}
                </p>

                <p>
                  <strong>Статус:</strong>{" "}
                  {getStatusName(application.status)}
                </p>

                <Link
                  href={`/project-applications/${application._id}`}
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