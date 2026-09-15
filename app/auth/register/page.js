"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const roleOptions = [
  {
    value: "member",
    title: "Корисник",
    description:
      "Поврзи се, следи курсеви, аплицирај на пракси и проекти.",
  },
  {
    value: "mentor",
    title: "Ментор",
    description:
      "Споделувај знаење, креирај курсеви и држи часови.",
  },
  {
    value: "organization",
    title: "Организација",
    description:
      "Објавувај пракси, курсеви и можности.",
  },
];

export default function RegisterPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    email: "",
    password: "",
    age: "",
    role: "member",
  });

  const [message, setMessage] = useState("");

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const response = await fetch(
        "/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message);
        return;
      }

      router.replace("/auth/login");

    } catch {
      setMessage(
        "Настана грешка при регистрација"
      );
    }
  }

  return (
    <main className="auth-page auth-register-page">

      <section className="auth-form-panel auth-register-panel">

        <div className="auth-heading">
          <p>Придружи се на LinkUp Next</p>
          <h1>Регистрација</h1>
          <span>
            Креирај профил и започни да се
            поврзуваш, учиш и споделуваш.
          </span>
        </div>

        <form
          className="auth-form auth-register-form"
          onSubmit={handleSubmit}
        >

          <div className="auth-field-grid">

            <input
              type="text"
              name="name"
              placeholder="Име"
              value={formData.name}
              onChange={handleChange}
            />

            <input
              type="text"
              name="surname"
              placeholder="Презиме"
              value={formData.surname}
              onChange={handleChange}
            />

          </div>

          <input
            type="email"
            name="email"
            placeholder="Емаил"
            value={formData.email}
            onChange={handleChange}
          />

          <input
            type="password"
            name="password"
            placeholder="Лозинка"
            value={formData.password}
            onChange={handleChange}
          />

          <input
            type="number"
            name="age"
            placeholder="Возраст"
            value={formData.age}
            onChange={handleChange}
          />

          <fieldset className="rolePicker">

            <legend>
              Избери тип на профил
            </legend>

            <div className="rolePickerGrid">

              {roleOptions.map((option) => (

                <label
                  className="roleOption"
                  key={option.value}
                >

                  <input
                    type="radio"
                    name="role"
                    value={option.value}
                    checked={
                      formData.role === option.value
                    }
                    onChange={handleChange}
                  />

                  <span>
                    <strong>
                      {option.title}
                    </strong>

                    <small>
                      {option.description}
                    </small>
                  </span>

                </label>

              ))}

            </div>

          </fieldset>

          <button type="submit">
            Регистрирај се
          </button>

        </form>

        {message && (
          <p className="auth-message">
            {message}
          </p>
        )}

        <p className="auth-login-link">
          Веќе имаш профил?{" "}
          <a href="/auth/login">
            Најави се
          </a>
        </p>

      </section>

      <section
        className="auth-visual-panel"
        aria-hidden="true"
      >

        <div className="auth-illustration auth-register-illustration">
          <span className="auth-book" />
          <span className="auth-cap" />
          <span className="auth-line auth-line-one" />
          <span className="auth-line auth-line-two" />
        </div>

      </section>

    </main>
  );
}