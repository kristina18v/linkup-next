"use client";

import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";
import Icon from "@/components/Icon";

export default function Sidebar() {
  return (
    <aside className="sidebar">

      <Link href="/" className="sidebar-logo">
        <span><Icon name="linkup" /></span>
        LinkUp Next
      </Link>

      <nav className="sidebar-nav">

        <Link href="/">
          <Icon name="home" />
          Почетна
        </Link>

        <Link href="/courses">
          <Icon name="course" />
          Курсеви
        </Link>

        <Link href="/tutoring">
          <Icon name="calendar" />
          Спремање / часови
        </Link>

        <Link href="/project-requests">
          <Icon name="briefcase" />
          Проектни барања
        </Link>

        <Link href="/project-applications">
          <Icon name="application" />
          Проектни апликации
        </Link>

        <Link href="/internships">
          <Icon name="building" />
          Пракси
        </Link>

        <Link href="/messages">
          <Icon name="message" />
          Пораки
        </Link>

      </nav>

      <div className="sidebar-auth">

        <Link href="/auth/login">
          Логин
        </Link>

        <Link href="/auth/register">
          Регистер
        </Link>

        <LogoutButton />

      </div>

    </aside>
  );
}