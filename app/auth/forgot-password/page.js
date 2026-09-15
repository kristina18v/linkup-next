"use client";

import { useState } from "react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    setMessage("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      setMessage(data.message);

      if (response.ok) {
        setEmail("");
      }
    } catch (error) {
      console.log(error);
      setMessage("Настана грешка. Обидете се повторно.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <div className="auth-card">

        <h1>Заборавена лозинка</h1>

        <p>
          Внесете ја вашата емаил адреса и ќе ви испратиме
          линк за ресетирање на лозинката.
        </p>

        <form onSubmit={handleSubmit}>

          <div className="form-group">
            <label htmlFor="email">
              Емаил
            </label>

            <input
              id="email"
              type="email"
              placeholder="example@email.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Се испраќа..."
              : "Испрати линк за ресетирање"}
          </button>

        </form>

        {message && (
          <p className="auth-message">
            {message}
          </p>
        )}

        <Link href="/auth/login">
          Назад кон најава
        </Link>

      </div>
    </main>
  );
}