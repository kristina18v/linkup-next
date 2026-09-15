"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";

export default function ProjectApplicationDetailsPage() {
  const params = useParams();
  const id = params.id;

  const [user, setUser] = useState(null);
  const [application, setApplication] = useState(null);
  const [message, setMessage] = useState("");

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

    // GET APPLICATION
    fetch(`/api/project-applications/${id}`, {
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        setApplication(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [id]);

  async function handleStatus(status) {
    try {
      const response = await fetch(
        `/api/project-applications/${id}`,
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

      setApplication(data);

      setMessage(
        status === "accepted"
          ? "Апликацијата е прифатена."
          : "Апликацијата е одбиена."
      );
    } catch (error) {
      setMessage("Настана грешка.");
    }
  }

  function getStatusName(status) {
    if (status === "pending") return "Во исчекување";
    if (status === "accepted") return "Прифатена";
    if (status === "rejected") return "Одбиена";

    return status;
  }

  if (!application) {
    return <p>Се вчитува апликацијата...</p>;
  }

  const projectOwner =
    application.projectRequest?.owner?._id ||
    application.projectRequest?.owner;

  const canManage =
    projectOwner === user?._id ||
    user?.role === "admin";

  return (
    <main className="home-layout">

      <Sidebar user={user} />

      <section className="home-main">

        <Navbar user={user} />

        <div className="application-details">

          <Link href="/project-applications">
            ← Назад
          </Link>

          <h1>
            {application.projectRequest?.title}
          </h1>

          <section className="application-info">

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

          </section>

          {canManage &&
            application.status === "pending" && (

              <div className="application-actions">

                <button
                  onClick={() =>
                    handleStatus("accepted")
                  }
                >
                  Прифати
                </button>

                <button
                  onClick={() =>
                    handleStatus("rejected")
                  }
                >
                  Одбиј
                </button>

              </div>

            )}

          {message && <p>{message}</p>}

        </div>

      </section>

    </main>
  );
}