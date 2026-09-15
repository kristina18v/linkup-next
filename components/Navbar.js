"use client";

import Link from "next/link";
import Icon from "@/components/Icon";

export default function Navbar() {
  return (
    <header className="navbar">

      <div className="navbar-search">
        <Icon name="search" />
        <input
          type="text"
          placeholder="Пребарај објави"
        />
      </div>

      <Link
        href="/posts/create"
        className="create-post-icon"
        title="Креирај објава"
      >
        <Icon name="image" />
      </Link>

      <div className="navbar-actions">

        <Link
          href="/notifications"
          title="Известувања"
        >
          <Icon name="bell" />
        </Link>

        <Link
          href="/profile"
          title="Профил"
        >
          <Icon name="profile" />
        </Link>

      </div>

    </header>
  );
}