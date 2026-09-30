"use client";

import { useState } from "react";
import Link from "next/link";
import Icon from "@/components/Icon";

export default function Navbar({ user }) {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);

  const currentUser = user?.user || user;

  const initials = `${currentUser?.name?.charAt(0) || ""}${
    currentUser?.surname?.charAt(0) || ""
  }`;

  async function handleSearch(event) {
    const value = event.target.value;

    setSearch(value);

    // Ако search полето е празно
    if (!value) {
      setUsers([]);
      return;
    }

    try {
      const response = await fetch(
        `/api/users/search?q=${encodeURIComponent(value)}`,
        {
          credentials: "include",
        }
      );

      const data = await response.json();

      if (response.ok) {
        setUsers(data);
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <header className="navbar top-command-bar">
      <div className="top-command-context">
        <span>LinkUp Next</span>
        <strong>{currentUser ? `${currentUser.name || ""} ${currentUser.surname || ""}`.trim() : "Заедница"}</strong>
      </div>

      <div className="navbar-search top-command-search">
        <Icon name="search" />

        <input
          type="text"
          placeholder="Пребарај луѓе, ментори и соработници"
          value={search}
          onChange={handleSearch}
        />

        {users.length > 0 && (
          <div className="search-results">
            {users.map((person) => (
              <Link
                key={person._id}
                href={`/profile/${person._id}`}
                className="search-user"
                onClick={() => {
                  setSearch("");
                  setUsers([]);
                }}
              >
                {person.profileImage ? (
                  <img
                    src={`/uploads/${person.profileImage}`}
                    alt={`${person.name} ${person.surname}`}
                    className="search-user-image"
                  />
                ) : (
                  <div className="search-user-placeholder">
                    {person.name?.charAt(0)}
                    {person.surname?.charAt(0)}
                  </div>
                )}

                <div className="search-user-info">
                  <p>{person.name} {person.surname}</p>
                  <span>{person.role}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <Link href="/posts/create" className="top-command-create" title="Креирај објава">
        <Icon name="plus" />
        <span>Објава</span>
      </Link>

      <div className="navbar-actions top-command-actions">
        <Link href="/notifications" title="Известувања" aria-label="Известувања">
          <Icon name="bell" />
        </Link>

        <Link href="/messages" title="Пораки" aria-label="Пораки">
          <Icon name="message" />
        </Link>

        <Link href="/profile" title="Профил" className="navbar-profile-link">
          {currentUser?.profileImage ? (
            <img
              src={`/uploads/${currentUser.profileImage}`}
              alt="Профил"
              className="navbar-profile-image"
            />
          ) : initials ? (
            <span className="navbar-profile-placeholder">{initials}</span>
          ) : (
            <Icon name="profile" />
          )}
        </Link>
      </div>
    </header>
  );
}
