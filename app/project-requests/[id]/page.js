"use client";

import { useEffect, useState } from "react";
import {
  useParams,
  useSearchParams,
} from "next/navigation";

import Link from "next/link";

import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";

export default function ProjectDetailsPage() {
  const params = useParams();
  const searchParams = useSearchParams();

  const id = params.id;

  const editMode =
    searchParams.get("edit") === "true";

  const [user, setUser] = useState(null);
  const [project, setProject] = useState(null);

  // APPLICATION
  const [applicationMessage, setApplicationMessage] =
    useState("");

  // EDIT
  const [title, setTitle] = useState("");
  const [description, setDescription] =
    useState("");

  const [category, setCategory] = useState("");
  const [projectType, setProjectType] =
    useState("");

  const [skills, setSkills] = useState("");
  const [budget, setBudget] = useState("");
  const [deadline, setDeadline] = useState("");
  const [status, setStatus] = useState("");

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


    // GET PROJECT
    fetch(`/api/project-requests/${id}`, {
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {

        setProject(data);

        setTitle(data.title || "");
        setDescription(
          data.description || ""
        );

        setCategory(
          data.category || ""
        );

        setProjectType(
          data.projectType || ""
        );

        setSkills(
          data.skills?.join(", ") || ""
        );

        setBudget(
          data.budget || ""
        );

        setDeadline(
          data.deadline
            ? data.deadline.split("T")[0]
            : ""
        );

        setStatus(
          data.status || "open"
        );

      })
      .catch((error) => {
        console.log(error);
      });

  }, [id]);


  // APPLY
  async function handleApply(event) {
    event.preventDefault();

    if (!applicationMessage.trim()) {
      setMessage(
        "Внесете порака за апликацијата."
      );
      return;
    }

    try {
      const response = await fetch(
        "/api/project-applications",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          credentials: "include",

          body: JSON.stringify({
            projectRequest: id,
            message: applicationMessage,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message);
        return;
      }

      setApplicationMessage("");

      setMessage(
        "Успешно аплициравте на проектот."
      );

    } catch (error) {
      setMessage("Настана грешка.");
    }
  }


  // EDIT
  async function handleEdit(event) {
    event.preventDefault();

    try {
      const response = await fetch(
        `/api/project-requests/${id}`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
          },

          credentials: "include",

          body: JSON.stringify({
            title,
            description,
            category,
            projectType,

            skills: skills
              .split(",")
              .map((skill) =>
                skill.trim()
              )
              .filter((skill) => skill),

            budget: budget
              ? Number(budget)
              : undefined,

            deadline,
            status,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message);
        return;
      }

      setProject(data);

      setMessage(
        "Проектното барање е изменето."
      );

    } catch (error) {
      setMessage("Настана грешка.");
    }
  }


  if (!project) {
    return (
      <p>
        Се вчитува проектот...
      </p>
    );
  }


  const isOwner =
    project.owner?._id === user?._id ||
    project.owner === user?._id;


  return (
    <main className="home-layout">

      <Sidebar user={user} />

      <section className="home-main">

        <Navbar user={user} />

        <div className="project-details-page">

          <Link href="/project-requests">
            ← Назад кон проектите
          </Link>


          {/* EDIT FORM */}
          {editMode && isOwner && (

            <section className="edit-project">

              <h2>
                Измени проектно барање
              </h2>

              <form onSubmit={handleEdit}>

                <input
                  type="text"
                  value={title}
                  onChange={(event) =>
                    setTitle(
                      event.target.value
                    )
                  }
                />

                <textarea
                  value={description}
                  onChange={(event) =>
                    setDescription(
                      event.target.value
                    )
                  }
                />

                <select
                  value={category}
                  onChange={(event) =>
                    setCategory(
                      event.target.value
                    )
                  }
                >
                  <option value="web-development">
                    Web Development
                  </option>

                  <option value="mobile-development">
                    Mobile Development
                  </option>

                  <option value="design">
                    Дизајн
                  </option>

                  <option value="databases">
                    Бази на податоци
                  </option>

                  <option value="data-analysis">
                    Анализа на податоци
                  </option>

                  <option value="other">
                    Друго
                  </option>
                </select>


                <select
                  value={projectType}
                  onChange={(event) =>
                    setProjectType(
                      event.target.value
                    )
                  }
                >
                  <option value="graduation">
                    Дипломски
                  </option>

                  <option value="seminar">
                    Семинарска
                  </option>

                  <option value="personal">
                    Личен
                  </option>

                  <option value="school">
                    Училишен
                  </option>

                  <option value="other">
                    Друго
                  </option>
                </select>


                <input
                  type="text"
                  value={skills}
                  onChange={(event) =>
                    setSkills(
                      event.target.value
                    )
                  }
                  placeholder="React, MongoDB..."
                />


                <input
                  type="number"
                  value={budget}
                  onChange={(event) =>
                    setBudget(
                      event.target.value
                    )
                  }
                  placeholder="Буџет"
                />


                <input
                  type="date"
                  value={deadline}
                  onChange={(event) =>
                    setDeadline(
                      event.target.value
                    )
                  }
                />


                <select
                  value={status}
                  onChange={(event) =>
                    setStatus(
                      event.target.value
                    )
                  }
                >
                  <option value="open">
                    Отворен
                  </option>

                  <option value="in_progress">
                    Во изработка
                  </option>

                  <option value="completed">
                    Завршен
                  </option>

                  <option value="cancelled">
                    Откажан
                  </option>
                </select>


                <button type="submit">
                  Зачувај промени
                </button>

              </form>

            </section>

          )}


          {/* PROJECT DETAILS */}
          <article className="project-details">

            <h1>
              {project.title}
            </h1>

            <p>
              {project.description}
            </p>

            <p>
              <strong>Објавено од:</strong>{" "}
              {project.owner?.name}{" "}
              {project.owner?.surname}
            </p>

            <p>
              <strong>Категорија:</strong>{" "}
              {project.category}
            </p>

            <p>
              <strong>Тип:</strong>{" "}
              {project.projectType}
            </p>

            {project.budget && (
              <p>
                <strong>Буџет:</strong>{" "}
                {project.budget} ден.
              </p>
            )}

            <p>
              <strong>Краен рок:</strong>{" "}

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

                <strong>
                  Потребни вештини:
                </strong>

                {project.skills.map(
                  (skill, index) => (
                    <span key={index}>
                      {skill}
                    </span>
                  )
                )}

              </div>
            )}

          </article>


          {/* APPLY */}
          {user &&
            !isOwner &&
            project.status === "open" && (

              <section className="project-apply">

                <h2>
                  Аплицирај на проектот
                </h2>

                <form onSubmit={handleApply}>

                  <textarea
                    placeholder="Напишете порака до сопственикот на проектот..."
                    value={
                      applicationMessage
                    }
                    onChange={(event) =>
                      setApplicationMessage(
                        event.target.value
                      )
                    }
                  />

                  <button type="submit">
                    Аплицирај
                  </button>

                </form>

              </section>

            )}


          {message && (
            <p>{message}</p>
          )}

        </div>

      </section>

    </main>
  );
}