"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";

export default function EditCoursePage() {
  const { id } = useParams();
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    level: "",
    format: "",
    location: "",
    price: "",
    duration: "",
    maxStudents: "",
    startDate: "",
    endDate: "",
    language: "",
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

        // COURSE
        const courseResponse = await fetch(`/api/courses/${id}`, {
          credentials: "include",
        });

        const course = await courseResponse.json();

        if (!courseResponse.ok) {
          throw new Error(course.message);
        }

        // Проверка дали курсот е негов
        if (
          course.instructor?._id !== userData.user._id &&
          userData.user.role !== "admin"
        ) {
          setMessage("Немате дозвола да го измените овој курс.");
          setLoading(false);
          return;
        }

        setFormData({
          title: course.title || "",
          description: course.description || "",
          category: course.category || "",
          level: course.level || "",
          format: course.format || "",
          location: course.location || "",
          price: course.price || "",
          duration: course.duration || "",
          maxStudents: course.maxStudents || "",
          startDate: course.startDate
            ? course.startDate.slice(0, 10)
            : "",
          endDate: course.endDate
            ? course.endDate.slice(0, 10)
            : "",
          language: course.language || "Македонски",
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
      const response = await fetch(`/api/courses/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message);
        return;
      }

      router.push("/courses/my");

    } catch (error) {
      setMessage("Настана грешка при изменување на курсот.");
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

        <div className="create-course-page">

          <h1>Измени курс</h1>

          {message && (
            <p className="form-message">
              {message}
            </p>
          )}

          <form
            onSubmit={handleSubmit}
            className="course-form"
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

            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="">Категорија</option>
              <option value="programming">Програмирање</option>
              <option value="design">Дизајн</option>
              <option value="marketing">Маркетинг</option>
              <option value="languages">Јазици</option>
              <option value="mathematics">Математика</option>
              <option value="business">Бизнис</option>
              <option value="other">Друго</option>
            </select>

            <select
              name="level"
              value={formData.level}
              onChange={handleChange}
              required
            >
              <option value="">Ниво</option>
              <option value="beginner">Почетно</option>
              <option value="intermediate">Средно</option>
              <option value="advanced">Напредно</option>
            </select>

            <select
              name="format"
              value={formData.format}
              onChange={handleChange}
              required
            >
              <option value="">Формат</option>
              <option value="online">Онлајн</option>
              <option value="physical">Во живо</option>
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
              name="price"
              placeholder="Цена"
              value={formData.price}
              onChange={handleChange}
              required
            />

            <input
              type="text"
              name="duration"
              placeholder="Времетраење"
              value={formData.duration}
              onChange={handleChange}
              required
            />

            <input
              type="number"
              name="maxStudents"
              placeholder="Максимум студенти"
              value={formData.maxStudents}
              onChange={handleChange}
            />

            <label>Почетен датум</label>

            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
            />

            <label>Краен датум</label>

            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
            />

            <input
              type="text"
              name="language"
              placeholder="Јазик"
              value={formData.language}
              onChange={handleChange}
            />

            <button type="submit">
              Зачувај промени
            </button>

            <Link href="/courses/my">
              Откажи
            </Link>

          </form>

        </div>

      </section>

    </main>
  );
}