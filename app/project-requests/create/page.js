"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";

export default function CreateProjectRequestPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [category, setCategory] = useState("web-development");

  const [projectType, setProjectType] = useState("personal");

  const [skills, setSkills] = useState("");
  const [budget, setBudget] = useState("");
  const [deadline, setDeadline] = useState("");

  const [message, setMessage] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      const response = await fetch("/api/project-requests",
        {
          method: "POST",

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
              .map((skill) => skill.trim())
              .filter((skill) => skill),

            budget: budget
              ? Number(budget)
              : undefined,

            deadline,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message);
        return;
      }

      router.push("/project-requests");

    } catch (error) {
      setMessage("Настана грешка.");
    }
  }

  return (
    <main className="home-layout">

      <Sidebar />

      <section className="home-main">

        <Navbar />

        <div className="create-project-page">

          <h1>Креирај проектно барање</h1>

          <form onSubmit={handleSubmit}>

            <input
              type="text"
              placeholder="Наслов"
              value={title}
              onChange={(event) =>
                setTitle(event.target.value)
              }
            />

            <textarea
              placeholder="Опишете го проектот..."
              value={description}
              onChange={(event) =>
                setDescription(event.target.value)
              }
            />

            {/* CATEGORY */}
            <select
              value={category}
              onChange={(event) =>
                setCategory(event.target.value)
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


            {/* PROJECT TYPE */}
            <select
              value={projectType}
              onChange={(event) =>
                setProjectType(event.target.value)
              }
            >
              <option value="graduation">
                Дипломски проект
              </option>

              <option value="seminar">
                Семинарска
              </option>

              <option value="personal">
                Личен проект
              </option>

              <option value="school">
                Училишен проект
              </option>

              <option value="other">
                Друго
              </option>
            </select>


            <input
              type="text"
              placeholder="Вештини: React, MongoDB, Next.js"
              value={skills}
              onChange={(event) =>
                setSkills(event.target.value)
              }
            />

            <input
              type="number"
              placeholder="Буџет"
              value={budget}
              onChange={(event) =>
                setBudget(event.target.value)
              }
            />

            <label>
              Краен рок
            </label>

            <input
              type="date"
              value={deadline}
              onChange={(event) =>
                setDeadline(event.target.value)
              }
            />

            <button type="submit">
              Креирај барање
            </button>

          </form>

          {message && <p>{message}</p>}

        </div>

      </section>

    </main>
  );
}