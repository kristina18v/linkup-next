"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";

export default function MyTutoringPage() {
  const [user, setUser] = useState(null);
  const [tutoring, setTutoring] = useState([]);
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

        // GET ALL TUTORING
        const tutoringResponse = await fetch("/api/tutoring", {
          credentials: "include",
        });

        const tutoringData = await tutoringResponse.json();

        if (!tutoringResponse.ok) {
          throw new Error(tutoringData.message);
        }

        // ЗЕМИ ГИ САМО МОИТЕ ЧАСОВИ
        const myTutoring = tutoringData.filter(
          (item) =>
            item.mentor?._id === currentUser._id
        );

        setTutoring(myTutoring);

      } catch (error) {
        console.log(error);
        setTutoring([]);
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

        <div className="tutoring-page">

          {/* HEADING */}
          <div className="tutoring-heading">

            <div>
              <h1>Мои часови</h1>

              <p>
                Часови кои ги имате креирано.
              </p>
            </div>

            <Link
              href="/tutoring/create"
              className="create-tutoring-button"
            >
              + Креирај час
            </Link>

          </div>

          {/* LOADING */}
          {loading && (
            <p>
              Се вчитуваат часовите...
            </p>
          )}

          {/* EMPTY */}
          {!loading && tutoring.length === 0 && (

            <div className="empty-tutoring">

              <p>
                Немате креирано часови.
              </p>

              <Link
                href="/tutoring/create"
                className="create-tutoring-button"
              >
                + Креирај час
              </Link>

            </div>

          )}

          {/* MY TUTORING */}
          <div className="tutoring-list">

            {tutoring.map((item) => (

              <article
                className="tutoring-card"
                key={item._id}
              >

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

                <div className="tutoring-actions">

                  <Link
                    href={`/tutoring/${item._id}`}
                    className="tutoring-details-button"
                  >
                    Повеќе детали
                  </Link>

                  <Link
                    href={`/tutoring/${item._id}/edit`}
                    className="edit-tutoring-button"
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