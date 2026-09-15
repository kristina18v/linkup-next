"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";

export default function ProjectRequestsPage() {
  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

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

    // GET ALL PROJECT REQUESTS
    fetch("/api/project-requests", {
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        setProjects(data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }, []);

  return (
    <main className="home-layout">
      <Sidebar user={user} />

      <section className="home-main">
        <Navbar user={user} />

        <div className="projects-page">

          <div className="projects-heading">
            <div>
              <h1>Проектни барања</h1>

              <p>
                Пронајдете проект или побарајте помош за вашиот проект.
              </p>
            </div>

            <div>
              <Link href="/project-requests/create">
                Креирај барање
              </Link>

              <Link href="/project-requests/my">
                Мои барања
              </Link>
            </div>
          </div>

          {loading && (
            <p>Се вчитуваат проектите...</p>
          )}

          {!loading && projects.length === 0 && (
            <p>Нема проектни барања.</p>
          )}

          <div className="projects-list">

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
                  <strong>Тип:</strong>{" "}
                  {project.projectType}
                </p>

                <p>
                  <strong>Корисник:</strong>{" "}
                  {project.owner?.name}{" "}
                  {project.owner?.surname}
                </p>

                {project.budget && (
                  <p>
                    <strong>Буџет:</strong>{" "}
                    {project.budget} ден.
                  </p>
                )}

                <p>
                  <strong>Рок:</strong>{" "}
                  {project.deadline
                    ? new Date(
                        project.deadline
                      ).toLocaleDateString()
                    : "Нема"}
                </p>

                <p>
                  <strong>Статус:</strong>{" "}
                  {project.status}
                </p>

                {project.skills?.length > 0 && (
                  <div className="project-skills">

                    {project.skills.map(
                      (skill, index) => (
                        <span key={index}>
                          {skill}
                        </span>
                      )
                    )}

                  </div>
                )}

                <Link
                  href={`/project-requests/${project._id}`}
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