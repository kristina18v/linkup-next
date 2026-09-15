"use client";

import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) {
        console.log("Грешка при одјавување");
        return;
      }

      router.replace("/auth/login");
      router.refresh();

    } catch (error) {
      console.log(error);
    }
  }

  return (
    <button onClick={handleLogout}>
      Одјави се
    </button>
  );
}