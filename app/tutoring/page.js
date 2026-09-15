"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";

export default function TutoringPage() {
  const [user, setUser] = useState(null);
  const [tutoring, setTutoring] = useState([]);
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
            data.message || "Грешка при вчитување на корисникот"
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

    // GET ALL TUTORING
    fetch("/api/tutoring", {
      credentials: "include",
    })
      .then(async (response) => {
        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Грешка при вчитување на часовите"
          );
        }

        return data;
      })
      .then((data) => {
        setTutoring(
          Array.isArray(data) ? data : []
        );

        setLoading(false);
      })
      .catch((error) => {
        console.log(error);

        setTutoring([]);
        setLoading(false);
      });

  }, []);

  return (
    <main className="home-layout">

      <Sidebar user={user} />

      <section className="home-main">

        <Navbar user={user} />

        <div className="tutoring-page">

          {/* HEADING */}
          <div className="tutoring-heading">

            <div>
              <h1>Часови и менторство</h1>

              <p>
                Најдете ментор и приклучете се на час.
              </p>
            </div>

            {/* TUTORING BUTTONS - MENTOR / ADMIN */}
            {(user?.role === "mentor" ||
              user?.role === "admin") && (

              <div className="tutoring-actions">

                <Link
                  href="/tutoring/create"
                  className="create-tutoring-button"
                >
                  + Креирај час
                </Link>

                <Link
                  href="/tutoring/my"
                  className="my-tutoring-button"
                >
                  Мои часови
                </Link>

              </div>

            )}

          </div>

          {/* LOADING */}
          {loading && (
            <p>
              Се вчитуваат часовите...
            </p>
          )}

          {/* NO TUTORING */}
          {!loading && tutoring.length === 0 && (

            <div className="empty-tutoring">

              <p>
                Нема достапни часови.
              </p>

              {(user?.role === "mentor" ||
                user?.role === "admin") && (

                <Link
                  href="/tutoring/create"
                  className="create-tutoring-button"
                >
                  + Креирај го првиот час
                </Link>

              )}

            </div>

          )}

          {/* TUTORING LIST */}
          <div className="tutoring-list">

            {tutoring.map((item) => (

              <article
                className="tutoring-card"
                key={item._id}
              >

                {/* IMAGE */}
                {item.image && (
                  <img
                    src={`/uploads/${item.image}`}
                    alt={item.title}
                    className="tutoring-image"
                  />
                )}

                <h2>
                  {item.title}
                </h2>

                <p>
                  {item.description}
                </p>

                <p>
                  <strong>Предмет:</strong>{" "}
                  {item.subject}
                </p>

                <p>
                  <strong>Ментор:</strong>{" "}
                  {item.mentor?.name}{" "}
                  {item.mentor?.surname}
                </p>

                <p>
                  <strong>Цена:</strong>{" "}
                  {item.price} ден.
                </p>

                <p>
                  <strong>Формат:</strong>{" "}
                  {item.format}
                </p>

                {item.location && (
                  <p>
                    <strong>Локација:</strong>{" "}
                    {item.location}
                  </p>
                )}

                <p>
                  <strong>Учесници:</strong>{" "}
                  {item.participants?.length || 0}
                  /
                  {item.maxParticipants}
                </p>

                <Link
                  href={`/tutoring/${item._id}`}
                  className="tutoring-details-button"
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