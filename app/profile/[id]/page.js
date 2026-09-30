"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";

export default function UserProfilePage() {
  const params = useParams();
  const id = params.id;

  const [user, setUser] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [activeTab, setActiveTab] = useState("posts");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProfile() {
      try {
        // Најавениот корисник
        const meResponse = await fetch("/api/auth/me", {
          credentials: "include",
        });

        const meData = await meResponse.json();

        if (meResponse.ok) {
          setCurrentUser(meData.user);
        }

        // Корисникот на кој сме кликнале
        const userResponse = await fetch(`/api/users/${id}`, {
          credentials: "include",
        });

        const userData = await userResponse.json();

        if (!userResponse.ok) {
          throw new Error(
            userData.message || "Корисникот не е пронајден"
          );
        }

        setUser(userData.user);

        // Ги земаме сите објави
        const postsResponse = await fetch("/api/posts", {
          credentials: "include",
        });

        const postsData = await postsResponse.json();

        if (postsResponse.ok && Array.isArray(postsData)) {
          const userPosts = postsData.filter((post) => {
            return post.author?._id === id;
          });

          setPosts(userPosts);
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [id]);

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

      <Sidebar user={currentUser} />

      <section className="profile-main">

        <Navbar user={currentUser} />

        <div className="profile-container modern-profile-container">

          {/* PROFILE HEADER */}
          <section className="modern-profile-header">

            {/* PROFILE IMAGE */}
            <div className="modern-profile-avatar-wrap">

              {user.profileImage ? (
                <img
                  src={`/uploads/${user.profileImage}`}
                  alt={`${user.name} ${user.surname}`}
                  className="modern-profile-avatar"
                />
              ) : (
                <div className="modern-profile-avatar modern-profile-avatar-placeholder">
                  {user.name?.charAt(0)}
                  {user.surname?.charAt(0)}
                </div>
              )}

            </div>

            {/* PROFILE INFORMATION */}
            <div className="modern-profile-body">

              <div className="modern-profile-topline">

                <div>
                  <h1>
                    {user.name} {user.surname}
                  </h1>

                  <p className="profile-role">
                    {getRoleName(user.role)}
                  </p>
                </div>

              </div>

              {/* STATS */}
              <div
                className="modern-profile-stats"
                aria-label="Профил статистика"
              >

                <div>
                  <strong>{posts.length}</strong>
                  <span>Објави</span>
                </div>

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

              </div>

              {/* BIO */}
              {user.bio ? (
                <p className="modern-profile-bio">
                  {user.bio}
                </p>
              ) : (
                <p className="modern-profile-bio empty-profile-data">
                  Корисникот нема додадено опис.
                </p>
              )}

              {/* LOCATION */}
              {user.location && (
                <p className="profile-location">
                  📍 {user.location}
                </p>
              )}

              {/* SKILLS + INTERESTS */}
              {(user.skills?.length > 0 ||
                user.interests?.length > 0) && (

                <div className="profile-tags modern-profile-tags">

                  {[
                    ...(user.skills || []),
                    ...(user.interests || []),
                  ]
                    .slice(0, 8)
                    .map((item, index) => (

                      <span
                        className="profile-tag"
                        key={`${item}-${index}`}
                      >
                        {item}
                      </span>

                    ))}

                </div>
              )}

            </div>

          </section>

          {/* TABS */}
          <nav
            className="profile-tabs"
            aria-label="Профил секции"
          >

            <button
              type="button"
              className={
                activeTab === "posts" ? "active" : ""
              }
              onClick={() => setActiveTab("posts")}
            >
              <span>Објави</span>
              <strong>{posts.length}</strong>
            </button>

          </nav>

          {/* POSTS */}
          <section className="profile-tab-panel">

            {activeTab === "posts" && (
              posts.length > 0 ? (

                <div className="profile-post-grid">

                  {posts.map((post) => (

                    <Link
                      href={`/posts/${post._id}`}
                      className={
                        post.images?.length > 0
                          ? "profile-grid-post has-image"
                          : "profile-grid-post"
                      }
                      key={post._id}
                    >

                      {post.images?.length > 0 ? (

                        <img
                          src={`/uploads/${post.images[0]}`}
                          alt="Објава"
                        />

                      ) : (

                        <div className="profile-grid-text-post">
                          <p>{post.content}</p>
                        </div>

                      )}

                      <div className="profile-post-hover">
                        <span>
                          ♥ {post.likes?.length || 0}
                        </span>

                        <span>💬</span>
                      </div>

                    </Link>

                  ))}

                </div>

              ) : (

                <div className="profile-empty-state">
                  <h2>Нема објави</h2>

                  <p>
                    Корисникот сè уште нема објавено.
                  </p>
                </div>

              )
            )}

          </section>

        </div>

      </section>

    </main>
  );
}