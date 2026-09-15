"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";

export default function CreateTutoringPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [subject, setSubject] = useState("");
  const [price, setPrice] = useState("");
  const [format, setFormat] = useState("online");
  const [location, setLocation] = useState("");

  // DATES
  const [date, setDate] = useState("");
  const [availableDates, setAvailableDates] = useState([]);

  const [maxParticipants, setMaxParticipants] = useState("");
  const [image, setImage] = useState(null);

  const [message, setMessage] = useState("");


  // ADD DATE
  function handleAddDate() {
    if (!date) {
      return;
    }

    // Да не може истиот датум два пати
    if (availableDates.includes(date)) {
      setMessage("Овој датум е веќе додаден.");
      return;
    }

    setAvailableDates([
      ...availableDates,
      date,
    ]);

    setDate("");
    setMessage("");
  }


  // REMOVE DATE
  function handleRemoveDate(dateToRemove) {
    setAvailableDates(
      availableDates.filter(
        (item) => item !== dateToRemove
      )
    );
  }


  // CREATE TUTORING
  async function handleSubmit(event) {
    event.preventDefault();

    if (availableDates.length === 0) {
      setMessage(
        "Додадете најмалку еден достапен датум."
      );
      return;
    }

    const formData = new FormData();

    formData.append("title", title);
    formData.append("description", description);
    formData.append("subject", subject);
    formData.append("price", price);
    formData.append("format", format);
    formData.append("location", location);

    // Array го претвораме во JSON string
    formData.append(
      "availableDates",
      JSON.stringify(availableDates)
    );

    formData.append(
      "maxParticipants",
      maxParticipants
    );

    if (image) {
      formData.append("image", image);
    }

    try {
      const response = await fetch(
        "/api/tutoring",
        {
          method: "POST",
          credentials: "include",
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(
          data.message ||
          "Настана грешка при креирање."
        );
        return;
      }

      router.push("/tutoring");

    } catch (error) {
      console.log(error);

      setMessage("Настана грешка.");
    }
  }


  return (
    <main className="home-layout">

      <Sidebar />

      <section className="home-main">

        <Navbar />

        <div className="create-tutoring-page">

          <h1>Креирај час</h1>

          <form onSubmit={handleSubmit}>

            {/* TITLE */}
            <input
              type="text"
              placeholder="Наслов"
              value={title}
              onChange={(event) =>
                setTitle(event.target.value)
              }
              required
            />


            {/* DESCRIPTION */}
            <textarea
              placeholder="Опис"
              value={description}
              onChange={(event) =>
                setDescription(event.target.value)
              }
              required
            />


            {/* SUBJECT */}
            <input
              type="text"
              placeholder="Предмет"
              value={subject}
              onChange={(event) =>
                setSubject(event.target.value)
              }
              required
            />


            {/* PRICE */}
            <input
              type="number"
              placeholder="Цена"
              value={price}
              onChange={(event) =>
                setPrice(event.target.value)
              }
              required
            />


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

              <option value="hybrid">
                Хибридно
              </option>
            </select>


            {/* LOCATION */}
            <input
              type="text"
              placeholder="Локација"
              value={location}
              onChange={(event) =>
                setLocation(event.target.value)
              }
            />


            {/* AVAILABLE DATE */}
            <div className="tutoring-date-field">

              <input
                type="date"
                value={date}
                onChange={(event) =>
                  setDate(event.target.value)
                }
              />

              <button
                type="button"
                onClick={handleAddDate}
              >
                + Додај датум
              </button>

            </div>


            {/* ADDED DATES */}
            {availableDates.length > 0 && (

              <div className="tutoring-dates">

                <p>
                  <strong>
                    Достапни датуми:
                  </strong>
                </p>

                {availableDates.map(
                  (availableDate) => (

                    <div
                      key={availableDate}
                      className="tutoring-date"
                    >

                      <span>
                        {availableDate}
                      </span>

                      <button
                        type="button"
                        onClick={() =>
                          handleRemoveDate(
                            availableDate
                          )
                        }
                      >
                        ✕
                      </button>

                    </div>

                  )
                )}

              </div>

            )}


            {/* MAX PARTICIPANTS */}
            <input
              type="number"
              placeholder="Максимален број учесници"
              value={maxParticipants}
              onChange={(event) =>
                setMaxParticipants(
                  event.target.value
                )
              }
              required
            />


            {/* IMAGE */}
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={(event) =>
                setImage(
                  event.target.files[0]
                )
              }
            />


            {/* SUBMIT */}
            <button type="submit">
              Креирај
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