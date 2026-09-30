"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

export default function ResetPasswordPage() {
  const params = useParams();
  const router = useRouter();

  const token = params.token;

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    setMessage("");

    if (!password || !confirmPassword) {
      setMessage("Внесете ги двете лозинки");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Лозинките не се совпаѓаат");
      return;
    }

    try {
      const response = await fetch(
        `/api/auth/reset-password/${token}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            password,
            confirmPassword,
          }),
        }
      );

      const data = await response.json();

      setMessage(data.message);

      if (response.ok) {
        setSuccess(true);
        setPassword("");
        setConfirmPassword("");
      }
    } catch (error) {
      setMessage("Настана грешка. Обидете се повторно.");
    }
  }

  return (
    <main className="auth-page">
      <div className="auth-card">

        <h1>Промена на лозинка</h1>

        {!success ? (
          <>
            <p>
              Внесете ја вашата нова лозинка.
            </p>

            <form onSubmit={handleSubmit}>

              <label htmlFor="password">
                Нова лозинка
              </label>

              <input
                id="password"
                type="password"
                placeholder="Внесете нова лозинка"
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
              />

              <label htmlFor="confirmPassword">
                Потврди лозинка
              </label>

              <input
                id="confirmPassword"
                type="password"
                placeholder="Повторете ја лозинката"
                value={confirmPassword}
                onChange={(event) =>
                  setConfirmPassword(event.target.value)
                }
              />

              <button type="submit">
                Промени лозинка
              </button>

            </form>
          </>
        ) : (
          <Link href="/auth/login">
            Најави се со новата лозинка
          </Link>
        )}

        {message && (
          <p className="auth-message">
            {message}
          </p>
        )}

      </div>
    </main>
  );
}