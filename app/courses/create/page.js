"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";

export default function CreateCoursePage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("programming");
  const [level, setLevel] = useState("beginner");
  const [format, setFormat] = useState("online");

  const [location, setLocation] = useState("");
  const [price, setPrice] = useState("");
  const [duration, setDuration] = useState("");
  const [maxStudents, setMaxStudents] = useState("");

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [language, setLanguage] = useState("Македонски");
  const [certificateAvailable, setCertificateAvailable] =
    useState(false);

  const [coverImage, setCoverImage] = useState(null);
  const [images, setImages] = useState([]);

  const [message, setMessage] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();

    const formData = new FormData();

    formData.append("title", title);
    formData.append("description", description);
    formData.append("category", category);
    formData.append("level", level);
    formData.append("format", format);
    formData.append("location", location);
    formData.append("price", price);
    formData.append("duration", duration);
    formData.append("maxStudents", maxStudents);
    formData.append("startDate", startDate);
    formData.append("endDate", endDate);
    formData.append("language", language);

    formData.append(
      "certificateAvailable",
      certificateAvailable
    );

    if (coverImage) {
      formData.append("coverImage", coverImage);
    }

    images.forEach((image) => {
      formData.append("images", image);
    });

    try {
      const response = await fetch("/api/courses", {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message);
        return;
      }

      router.push("/courses");

    } catch (error) {
      setMessage("Настана грешка.");
    }
  }

  return (
    <main className="home-layout">

      <Sidebar />

      <section className="home-main">

        <Navbar />

        <div className="create-course-page">

          <h1>Креирај курс</h1>

          <form onSubmit={handleSubmit}>

            <input
              type="text"
              placeholder="Наслов на курсот"
              value={title}
              onChange={(event) =>
                setTitle(event.target.value)
              }
            />

            <textarea
              placeholder="Опис на курсот"
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
              <option value="programming">
                Програмирање
              </option>

              <option value="design">
                Дизајн
              </option>

              <option value="marketing">
                Маркетинг
              </option>

              <option value="languages">
                Јазици
              </option>

              <option value="mathematics">
                Математика
              </option>

              <option value="business">
                Бизнис
              </option>

              <option value="other">
                Друго
              </option>
            </select>

            {/* LEVEL */}
            <select
              value={level}
              onChange={(event) =>
                setLevel(event.target.value)
              }
            >
              <option value="beginner">
                Почетно
              </option>

              <option value="intermediate">
                Средно
              </option>

              <option value="advanced">
                Напредно
              </option>
            </select>

            {/* FORMAT */}
            <select
              value={format}
              onChange={(event) =>
                setFormat(event.target.value)
              }
            >
              <option value="online">
                Онлајн
              </option>

              <option value="physical">
                Во живо
              </option>
            </select>

            <input
              type="text"
              placeholder="Локација"
              value={location}
              onChange={(event) =>
                setLocation(event.target.value)
              }
            />

            <input
              type="number"
              placeholder="Цена"
              value={price}
              onChange={(event) =>
                setPrice(event.target.value)
              }
            />

            <input
              type="text"
              placeholder="Времетраење"
              value={duration}
              onChange={(event) =>
                setDuration(event.target.value)
              }
            />

            <input
              type="number"
              placeholder="Максимален број студенти"
              value={maxStudents}
              onChange={(event) =>
                setMaxStudents(event.target.value)
              }
            />

            <label>
              Почетен датум
            </label>

            <input
              type="date"
              value={startDate}
              onChange={(event) =>
                setStartDate(event.target.value)
              }
            />

            <label>
              Краен датум
            </label>

            <input
              type="date"
              value={endDate}
              onChange={(event) =>
                setEndDate(event.target.value)
              }
            />

            <input
              type="text"
              placeholder="Јазик"
              value={language}
              onChange={(event) =>
                setLanguage(event.target.value)
              }
            />

            <label>
              <input
                type="checkbox"
                checked={certificateAvailable}
                onChange={(event) =>
                  setCertificateAvailable(
                    event.target.checked
                  )
                }
              />

              Достапен сертификат
            </label>

            <label>
              Cover слика
            </label>

            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={(event) =>
                setCoverImage(
                  event.target.files[0]
                )
              }
            />

            <label>
              Дополнителни слики
            </label>

            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              onChange={(event) =>
                setImages(
                  Array.from(event.target.files)
                )
              }
            />

            <button type="submit">
              Креирај курс
            </button>

          </form>

          {message && (
            <p>{message}</p>
          )}

        </div>

      </section>

    </main>
  );
}