"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";

export default function EditTutoringPage() {
  const { id } = useParams();
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    subject: "",
    price: "",
    format: "",
    location: "",
    maxParticipants: "",
  });

  useEffect(() => {
    async function loadData() {
      try {
        // CURRENT USER
        const userResponse = await fetch("/api/auth/me", {
          credentials: "include",
        });

        const userData = await userResponse.json();

        if (!userResponse.ok) {
          throw new Error(userData.message);
        }

        setUser(userData.user);

        // TUTORING
        const tutoringResponse = await fetch(
          `/api/tutoring/${id}`,
          {
            credentials: "include",
          }
        );

        const tutoringData = await tutoringResponse.json();

        if (!tutoringResponse.ok) {
          throw new Error(tutoringData.message);
        }

        // Само сопственик или admin
        if (
          tutoringData.mentor?._id !== userData.user._id &&
          userData.user.role !== "admin"
        ) {
          setMessage(
            "Немате дозвола да го измените овој час."
          );

          setLoading(false);
          return;
        }

        setFormData({
          title: tutoringData.title || "",
          description: tutoringData.description || "",
          subject: tutoringData.subject || "",
          price: tutoringData.price || "",
          format: tutoringData.format || "",
          location: tutoringData.location || "",
          maxParticipants:
            tutoringData.maxParticipants || "",
        });

        setLoading(false);

      } catch (error) {
        setMessage(error.message);
        setLoading(false);
      }
    }

    loadData();
  }, [id]);

  function handleChange(event) {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      const response = await fetch(
        `/api/tutoring/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message);
        return;
      }

      router.push("/tutoring/my");

    } catch (error) {
      setMessage(
        "Настана грешка при изменување на часот."
      );
    }
  }

  if (loading) {
    return <p>Се вчитува...</p>;
  }

  return (
    <main className="home-layout">

      <Sidebar user={user} />

      <section className="home-main">

        <Navbar user={user} />

        <div className="create-tutoring-page">

          <h1>Измени час</h1>

          {message && (
            <p className="form-message">
              {message}
            </p>
          )}

          <form
            onSubmit={handleSubmit}
            className="tutoring-form"
          >

            <input
              type="text"
              name="title"
              placeholder="Наслов"
              value={formData.title}
              onChange={handleChange}
              required
            />

            <textarea
              name="description"
              placeholder="Опис"
              value={formData.description}
              onChange={handleChange}
              required
            />

            <input
              type="text"
              name="subject"
              placeholder="Предмет"
              value={formData.subject}
              onChange={handleChange}
              required
            />

            <input
              type="number"
              name="price"
              placeholder="Цена"
              value={formData.price}
              onChange={handleChange}
              required
            />

            <select
              name="format"
              value={formData.format}
              onChange={handleChange}
              required
            >
              <option value="">Формат</option>
              <option value="online">Онлајн</option>
              <option value="physical">Во живо</option>
              <option value="hybrid">Хибридно</option>
            </select>

            <input
              type="text"
              name="location"
              placeholder="Локација"
              value={formData.location}
              onChange={handleChange}
            />

            <input
              type="number"
              name="maxParticipants"
              placeholder="Максимум учесници"
              value={formData.maxParticipants}
              onChange={handleChange}
              required
            />

            <button type="submit">
              Зачувај промени
            </button>

            <Link href="/tutoring/my">
              Откажи
            </Link>

          </form>

        </div>

      </section>

    </main>
  );
}