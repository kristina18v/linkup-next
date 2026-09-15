"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/auth/me", {
      credentials: "include",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Не сте најавени");
        }

        return response.json();
      })
      .then((data) => {
        setUser(data.user);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, []);

  function getRoleName(role) {
    if (role === "member") return "Корисник";
    if (role === "mentor") return "Ментор";
    if (role === "organization") return "Организација";
    if (role === "admin") return "Администратор";

    return role;
  }

  if (loading) {
    return (
      <main className="profile-loading">
        <p>Се вчитува профилот...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="profile-loading">
        <p>{error}</p>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="profile-loading">
        <p>Корисникот не е пронајден.</p>
      </main>
    );
  }

  return (
    <main className="profile-layout">

      <Sidebar user={user} />

      <section className="profile-main">

        <Navbar user={user} />

        <div className="profile-container">

          {/* COVER IMAGE */}
          <div className="profile-cover">

            {user.coverImage ? (
              <img
                src={`/uploads/${user.coverImage}`}
                alt="Cover"
                className="cover-image"
              />
            ) : (
              <div className="cover-placeholder">
                Cover Image
              </div>
            )}

          </div>


          {/* PROFILE HEADER */}
          <section className="profile-header">

            {/* PROFILE IMAGE */}
            <div className="profile-image-wrapper">

              {user.profileImage ? (
                <img
                  src={`/uploads/${user.profileImage}`}
                  alt={`${user.name} ${user.surname}`}
                  className="profile-image"
                />
              ) : (
                <div className="profile-image-placeholder">
                  👤
                </div>
              )}

            </div>


            {/* NAME + ROLE */}
            <div className="profile-main-info">

              <h1>
                {user.name} {user.surname}
              </h1>

              <p className="profile-role">
                {getRoleName(user.role)}
              </p>

              {user.location && (
                <p className="profile-location">
                  📍 {user.location}
                </p>
              )}

            </div>


            <button className="edit-profile-button">
              Измени профил
            </button>

          </section>


          {/* FOLLOWERS / FOLLOWING NUMBERS */}
          <section className="profile-stats">

            <div>
              <strong>
                {user.followers?.length || 0}
              </strong>

              <span>Следбеници</span>
            </div>

            <div>
              <strong>
                {user.following?.length || 0}
              </strong>

              <span>Следи</span>
            </div>

          </section>


          {/* FOLLOWING USERS */}
          <section className="profile-section">

            <h2>Луѓе што ги следам</h2>

            {!user.following ||
            user.following.length === 0 ? (

              <p className="empty-profile-data">
                Не следите никого.
              </p>

            ) : (

              <div className="profile-users-list">

                {user.following.map((person) => (

                  <div
                    className="profile-user-card"
                    key={person._id}
                  >

                    <div className="profile-user-info">

                      {person.profileImage ? (
                        <img
                          src={`/uploads/${person.profileImage}`}
                          alt={`${person.name} ${person.surname}`}
                          className="profile-user-image"
                        />
                      ) : (
                        <div className="profile-user-placeholder">
                          👤
                        </div>
                      )}

                      <div>
                        <strong>
                          {person.name} {person.surname}
                        </strong>

                        <span>
                          {getRoleName(person.role)}
                        </span>
                      </div>

                    </div>

                    <Link
                      href={`/messages/${person._id}`}
                      className="profile-message-button"
                    >
                      💬 Порака
                    </Link>

                  </div>

                ))}

              </div>

            )}

          </section>


          {/* FOLLOWERS USERS */}
          <section className="profile-section">

            <h2>Следбеници</h2>

            {!user.followers ||
            user.followers.length === 0 ? (

              <p className="empty-profile-data">
                Немате следбеници.
              </p>

            ) : (

              <div className="profile-users-list">

                {user.followers.map((person) => (

                  <div
                    className="profile-user-card"
                    key={person._id}
                  >

                    <div className="profile-user-info">

                      {person.profileImage ? (
                        <img
                          src={`/uploads/${person.profileImage}`}
                          alt={`${person.name} ${person.surname}`}
                          className="profile-user-image"
                        />
                      ) : (
                        <div className="profile-user-placeholder">
                          👤
                        </div>
                      )}

                      <div>
                        <strong>
                          {person.name} {person.surname}
                        </strong>

                        <span>
                          {getRoleName(person.role)}
                        </span>
                      </div>

                    </div>

                    <Link
                      href={`/messages/${person._id}`}
                      className="profile-message-button"
                    >
                      💬 Порака
                    </Link>

                  </div>

                ))}

              </div>

            )}

          </section>


          {/* BIO */}
          <section className="profile-section">

            <h2>За мене</h2>

            {user.bio ? (
              <p>{user.bio}</p>
            ) : (
              <p className="empty-profile-data">
                Немате додадено опис.
              </p>
            )}

          </section>


          {/* LOCATION */}
          <section className="profile-section">

            <h2>Локација</h2>

            {user.location ? (
              <p>📍 {user.location}</p>
            ) : (
              <p className="empty-profile-data">
                Немате додадено локација.
              </p>
            )}

          </section>


          {/* SKILLS */}
          <section className="profile-section">

            <h2>Вештини</h2>

            {user.skills?.length > 0 ? (

              <div className="profile-tags">

                {user.skills.map((skill, index) => (
                  <span
                    className="profile-tag"
                    key={index}
                  >
                    {skill}
                  </span>
                ))}

              </div>

            ) : (

              <p className="empty-profile-data">
                Немате додадено вештини.
              </p>

            )}

          </section>


          {/* INTERESTS */}
          <section className="profile-section">

            <h2>Интереси</h2>

            {user.interests?.length > 0 ? (

              <div className="profile-tags">

                {user.interests.map((interest, index) => (
                  <span
                    className="profile-tag"
                    key={index}
                  >
                    {interest}
                  </span>
                ))}

              </div>

            ) : (

              <p className="empty-profile-data">
                Немате додадено интереси.
              </p>

            )}

          </section>

        </div>

      </section>

    </main>
  );
}