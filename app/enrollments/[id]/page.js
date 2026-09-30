"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";

export default function EnrollmentDetailsPage() {
  const params = useParams();
  const id = params.id;

  const [user, setUser] = useState(null);
  const [enrollment, setEnrollment] = useState(null);

  const [status, setStatus] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    // CURRENT USER
    fetch("/api/auth/me", {
      credentials: "include",
    })
      .then((response) => response.json())
     .then((data) => {
    setUser(data.user);
    })
      .catch((error) => {
        console.log(error);
      });

    // GET ENROLLMENT
    fetch(`/api/enrollments/${id}`, {
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        setEnrollment(data);
        setStatus(data.status);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [id]);

  async function handleStatusChange(event) {
    event.preventDefault();

    try {
      const response = await fetch(
        `/api/enrollments/${id}`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
          },

          credentials: "include",

          body: JSON.stringify({
            status: status,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message);
        return;
      }

      setEnrollment(data);

      setMessage(
        "Статусот е успешно променет."
      );
    } catch (error) {
      setMessage("Настана грешка.");
    }
  }

  async function handleDelete() {
    try {
      const response = await fetch(
        `/api/enrollments/${id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message);
        return;
      }

      window.location.href = "/enrollments";

    } catch (error) {
      setMessage("Настана грешка.");
    }
  }

  function getStatusName(value) {
    if (value === "pending") return "Во исчекување";
    if (value === "enrolled") return "Запишан";
    if (value === "rejected") return "Одбиен";
    if (value === "completed") return "Завршен";
    if (value === "cancelled") return "Откажан";

    return value;
  }

  if (!enrollment) {
    return (
      <p>Се вчитува запишувањето...</p>
    );
  }

  const canManage =
    user?.role === "mentor" ||
    user?.role === "admin";

  const isMyEnrollment =
    enrollment.user?._id === user?._id ||
    enrollment.user === user?._id;

  return (
    <main className="home-layout">

      <Sidebar user={user} />

      <section className="home-main">

        <Navbar user={user} />

        <div className="enrollment-details">

          <Link href="/enrollments">
            ← Назад
          </Link>

          <h1>
            {enrollment.course?.title}
          </h1>

          <section className="enrollment-info">

            <p>
              <strong>Корисник:</strong>{" "}
              {enrollment.user?.name}{" "}
              {enrollment.user?.surname}
            </p>

            <p>
              <strong>Курс:</strong>{" "}
              {enrollment.course?.title}
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

          </section>


          {/* MENTOR / ADMIN */}
          {canManage && (

            <form
              className="enrollment-status-form"
              onSubmit={handleStatusChange}
            >

              <label>
                Промени статус
              </label>

              <select
                value={status}
                onChange={(event) =>
                  setStatus(event.target.value)
                }
              >

                <option value="pending">
                  Во исчекување
                </option>

                <option value="enrolled">
                  Прифати / Запиши
                </option>

                <option value="rejected">
                  Одбиј
                </option>

                <option value="completed">
                  Завршен
                </option>

                <option value="cancelled">
                  Откажан
                </option>

              </select>

              <button type="submit">
                Зачувај статус
              </button>

            </form>

          )}


          {/* USER CAN CANCEL/DELETE OWN */}
          {isMyEnrollment && (

            <button onClick={handleDelete}>
              Откажи запишување
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