"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";

export default function MyProjectRequestsPage() {
  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {

    // USER
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


    // MY PROJECT REQUESTS
    fetch("/api/project-requests/my-requests", {
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        setProjects(data);
      })
      .catch((error) => {
        console.log(error);
      });

  }, []);


  async function handleDelete(projectId) {
    try {
      const response = await fetch(
        `/api/project-requests/${projectId}`,
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

      setProjects(
        projects.filter(
          (project) =>
            project._id !== projectId
        )
      );

      setMessage(
        "Проектното барање е избришано."
      );

    } catch (error) {
      setMessage("Настана грешка.");
    }
  }


  return (
    <main className="home-layout">

      <Sidebar user={user} />

      <section className="home-main">

        <Navbar user={user} />

        <div className="my-projects-page">

          <div className="projects-heading">

            <h1>Мои проектни барања</h1>

            <Link href="/project-requests/create">
              Креирај ново
            </Link>

          </div>


          {message && <p>{message}</p>}


          {projects.length === 0 && (
            <p>
              Немате креирано проектни барања.
            </p>
          )}


          {projects.map((project) => (

            <article
              className="project-card"
              key={project._id}
            >

              <h2>{project.title}</h2>

              <p>{project.description}</p>

              <p>
                <strong>Категорија:</strong>{" "}
                {project.category}
              </p>

              <p>
                <strong>Статус:</strong>{" "}
                {project.status}
              </p>

              <div className="project-actions">

                <Link
                  href={`/project-requests/${project._id}`}
                >
                  Отвори
                </Link>

                <Link
                  href={`/project-requests/${project._id}?edit=true`}
                >
                  ✏️ Измени
                </Link>

                <button
                  onClick={() =>
                    handleDelete(project._id)
                  }
                >
                  🗑️ Избриши
                </button>

              </div>

            </article>

          ))}

        </div>

      </section>

    </main>
  );
}