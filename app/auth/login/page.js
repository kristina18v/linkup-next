"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");

  function handleChange(event) {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
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

      // После успешна најава оди на почетна
      router.replace("/");

    } catch (error) {
      setMessage("Настана грешка при најавување");
    }
  }

  return (
    <main className="auth-page">

      <section className="auth-form-panel">

        <div className="auth-heading">
          <p>Добредојдовте назад</p>

          <h1>Најава</h1>

          <span>
            Најавете се на вашиот LinkUp профил.
          </span>
        </div>

        <form
          className="auth-form"
          onSubmit={handleSubmit}
        >

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

          <div className="forgot-password">
            <a href="/auth/forgot-password">
              Ја заборавивте лозинката?
            </a>
          </div>

          <button type="submit">
            Најави се
          </button>

        </form>

        {message && (
          <p className="auth-message">
            {message}
          </p>
        )}

        <p className="auth-login-link">
          Немате профил?{" "}
          <a href="/auth/register">
            Регистрирај се
          </a>
        </p>

      </section>

      <section
        className="auth-visual-panel"
        aria-hidden="true"
      >

        <div className="auth-illustration">
          <span className="auth-book" />
          <span className="auth-cap" />
          <span className="auth-line auth-line-one" />
          <span className="auth-line auth-line-two" />
        </div>

      </section>

    </main>
  );
}