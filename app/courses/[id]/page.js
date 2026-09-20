"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import PaymentButton from "@/components/PaymentButton";

import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";

export default function CourseDetailsPage() {
  const params = useParams();

  const id = params.id;

  const [user, setUser] = useState(null);
  const [course, setCourse] = useState(null);

  const [motivation, setMotivation] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    // GET CURRENT USER
   fetch("/api/auth/me", {
  credentials: "include",
})
  .then((response) => response.json())
  .then((data) => {
    setUser(data.user);
  })
  .catch(console.log);

    // GET COURSE
    fetch(`/api/courses/${id}`, {
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        setCourse(data);
      })
      .catch((error) => {
        console.log(error);
      });

  }, [id]);


  // ENROLL
  async function handleEnroll(event) {
    event.preventDefault();

    try {
      const response = await fetch(
        "/api/enrollments",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          credentials: "include",

          body: JSON.stringify({
            course: id,
            motivation: motivation,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message);
        return;
      }

      setMessage(
        "Успешно аплициравте на курсот."
      );

      setMotivation("");

    } catch (error) {
      setMessage("Настана грешка.");
    }
  }


  if (!course) {
    return <p>Се вчитува курсот...</p>;
  }


  return (
  <main className="home-layout">

    <Sidebar user={user} />

    <section className="home-main">

      <Navbar user={user} />

      <div className="course-details">

        <Link href="/courses">
          ← Назад кон курсеви
        </Link>


        {/* COVER */}
        {course.coverImage && (
          <img
            src={`/uploads/${course.coverImage}`}
            alt={course.title}
          />
        )}


        {/* TITLE */}
        <h1>{course.title}</h1>

        <p>{course.description}</p>


        {/* COURSE INFO */}
        <section className="course-info">

          <p>
            <strong>Инструктор:</strong>{" "}
            {course.instructor?.name}{" "}
            {course.instructor?.surname}
          </p>

          <p>
            <strong>Категорија:</strong>{" "}
            {course.category}
          </p>

          <p>
            <strong>Ниво:</strong>{" "}
            {course.level}
          </p>

          <p>
            <strong>Формат:</strong>{" "}
            {course.format}
          </p>

          {course.location && (
            <p>
              <strong>Локација:</strong>{" "}
              {course.location}
            </p>
          )}

          <p>
            <strong>Цена:</strong>{" "}
            {course.price} ден.
          </p>

          <p>
            <strong>Времетраење:</strong>{" "}
            {course.duration}
          </p>

          <p>
            <strong>Јазик:</strong>{" "}
            {course.language}
          </p>

          <p>
            <strong>Максимум учесници:</strong>{" "}
            {course.maxStudents}
          </p>

          <p>
            <strong>Почеток:</strong>{" "}
            {course.startDate
              ? new Date(
                  course.startDate
                ).toLocaleDateString()
              : "Не е внесен"}
          </p>

          <p>
            <strong>Крај:</strong>{" "}
            {course.endDate
              ? new Date(
                  course.endDate
                ).toLocaleDateString()
              : "Не е внесен"}
          </p>

          <p>
            <strong>Сертификат:</strong>{" "}
            {course.certificateAvailable
              ? "Да"
              : "Не"}
          </p>

          <p>
            <strong>Статус:</strong>{" "}
            {course.status}
          </p>


          {/* STRIPE PAYMENT */}
          {user &&
            course.instructor?._id !== user._id && (
              <PaymentButton
                itemId={course._id}
                type="course"
              />
            )}

        </section>


        {/* OTHER IMAGES */}
        {course.images?.length > 0 && (
          <section className="course-images">

            {course.images.map((image) => (
              <img
                key={image}
                src={`/uploads/${image}`}
                alt={course.title}
              />
            ))}

          </section>
        )}


        {/* ENROLL */}
        {user &&
          course.instructor?._id !== user._id && (
            <section className="course-enroll">

              <h2>
                Аплицирај на курс
              </h2>

              <form onSubmit={handleEnroll}>

                <textarea
                  placeholder="Зошто сакате да се запишете на курсот?"
                  value={motivation}
                  onChange={(event) =>
                    setMotivation(
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