"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";

export default function TutoringDetailsPage() {
  const params = useParams();

  const id = params.id;

  const [user, setUser] = useState(null);
  const [tutoring, setTutoring] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {

    // GET CURRENT USER
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


    // GET ONE TUTORING
    fetch(`/api/tutoring/${id}`, {
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        setTutoring(data);
      })
      .catch((error) => {
        console.log(error);
      });

  }, [id]);


  // JOIN / LEAVE
  async function handleJoin() {
    try {
      const response = await fetch(
        `/api/tutoring/${id}/join`,
        {
          method: "PUT",
          credentials: "include",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message);
        return;
      }

      setTutoring(data);

    } catch (error) {
      setMessage("Настана грешка.");
    }
  }


  if (!tutoring) {
    return <p>Се вчитува...</p>;
  }


  // Проверуваме дали сум приклучен
  const joined = tutoring.participants?.some(
    (participant) =>
      participant._id === user?._id ||
      participant === user?._id
  );


  return (
    <main className="home-layout">

      <Sidebar user={user} />

      <section className="home-main">

        <Navbar user={user} />

        <div className="tutoring-details">

          <Link href="/tutoring">
            ← Назад кон часови
          </Link>


          {tutoring.image && (
            <img
              src={`/uploads/${tutoring.image}`}
              alt={tutoring.title}
            />
          )}


          <h1>{tutoring.title}</h1>

          <p>{tutoring.description}</p>


          <div className="tutoring-info">

            <p>
              <strong>Предмет:</strong>{" "}
              {tutoring.subject}
            </p>

            <p>
              <strong>Ментор:</strong>{" "}
              {tutoring.mentor?.name}{" "}
              {tutoring.mentor?.surname}
            </p>

            <p>
              <strong>Цена:</strong>{" "}
              {tutoring.price} ден.
            </p>

            <p>
              <strong>Формат:</strong>{" "}
              {tutoring.format}
            </p>

            {tutoring.location && (
              <p>
                <strong>Локација:</strong>{" "}
                {tutoring.location}
              </p>
            )}

            <p>
              <strong>Статус:</strong>{" "}
              {tutoring.status}
            </p>

            <p>
              <strong>Учесници:</strong>{" "}
              {tutoring.participants?.length || 0}
              /
              {tutoring.maxParticipants}
            </p>

          </div>


          {/* AVAILABLE DATES */}
          <section>

            <h2>Достапни датуми</h2>

            {tutoring.availableDates?.length === 0 && (
              <p>Нема внесени датуми.</p>
            )}

            {tutoring.availableDates?.map(
              (date, index) => (
                <p key={index}>
                  📅{" "}
                  {new Date(date).toLocaleDateString()}
                </p>
              )
            )}

          </section>


          {/* JOIN / LEAVE */}
          {user &&
            tutoring.mentor?._id !== user._id && (
              <button onClick={handleJoin}>

                {joined
                  ? "Откажи учество"
                  : "Приклучи се"}

              </button>
            )}


          {message && (
            <p>{message}</p>
          )}

        </div>

      </section>

    </main>
  );
}