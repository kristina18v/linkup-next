"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import LogoutButton from "@/components/LogoutButton";
import Icon from "@/components/Icon";

const primaryLinks = [
  { href: "/", label: "Почетна", icon: "home" },
  { href: "/courses", label: "Курсеви", icon: "course" },
  { href: "/tutoring", label: "Ментори", icon: "calendar" },
  { href: "/project-requests", label: "Проекти", icon: "briefcase" },
  { href: "/project-applications", label: "Апликации", icon: "application" },
  { href: "/internships", label: "Пракси", icon: "building" },
];

export default function Sidebar() {
  const pathname = usePathname();

  function getLinkClass(href) {
    if (href === "/") {
      return pathname === href ? "active" : undefined;
    }

    return pathname?.startsWith(href) ? "active" : undefined;
  }

  return (
    <aside className="sidebar shell-rail" aria-label="Главна навигација">
      <Link href="/" className="sidebar-logo shell-rail-logo" title="LinkUp Next">
        <span><Icon name="linkup" /></span>
        <strong>LinkUp</strong>
      </Link>

      <nav className="sidebar-nav shell-rail-nav">
        {primaryLinks.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={getLinkClass(item.href)}
            title={item.label}
            aria-label={item.label}
          >
            <Icon name={item.icon} />
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="sidebar-auth shell-rail-auth">
        <Link href="/auth/login" title="Логин" aria-label="Логин">
          <Icon name="profile" />
          <span>Логин</span>
        </Link>

        <Link href="/auth/register" title="Регистер" aria-label="Регистер">
          <Icon name="plus" />
          <span>Регистер</span>
        </Link>

        <LogoutButton />
      </div>
    </aside>
  );
}
