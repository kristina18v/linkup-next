"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";

const tabs = [
  { id: "posts", label: "Објави" },
  { id: "saved", label: "Зачувани" },
  { id: "courses", label: "Курсеви" },
  { id: "projects", label: "Проекти" },
];

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [courses, setCourses] = useState([]);
  const [projects, setProjects] = useState([]);
  const [activeTab, setActiveTab] = useState("posts");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProfile() {
      try {
        const userResponse = await fetch("/api/auth/me", {
          credentials: "include",
        });

        const userData = await userResponse.json();

        if (!userResponse.ok) {
          throw new Error(userData.message || "Не сте најавени");
        }

        const currentUser = userData.user;
        setUser(currentUser);

        const [postsResponse, coursesResponse, projectsResponse] =
          await Promise.allSettled([
            fetch("/api/posts/my", { credentials: "include" }),
            fetch("/api/courses?limit=1000", { credentials: "include" }),
            fetch("/api/project-requests/my-requests", {
              credentials: "include",
            }),
          ]);

        if (postsResponse.status === "fulfilled") {
          const postsData = await postsResponse.value.json();
          setPosts(Array.isArray(postsData) ? postsData : []);
        }

        if (coursesResponse.status === "fulfilled") {
          const coursesData = await coursesResponse.value.json();
          const allCourses = Array.isArray(coursesData)
            ? coursesData
            : coursesData.courses || [];

          setCourses(
            allCourses.filter(
              (course) =>
                course.instructor?._id === currentUser._id
            )
          );
        }

        if (projectsResponse.status === "fulfilled") {
          const projectsData = await projectsResponse.value.json();
          setProjects(Array.isArray(projectsData) ? projectsData : []);
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, []);

  function getRoleName(role) {
    if (role === "member") return "Корисник";
    if (role === "mentor") return "Ментор";
    if (role === "organization") return "Организација";
    if (role === "admin") return "Администратор";

    return role;
  }

  const savedCount = user?.savedPosts?.length || 0;

  const tabCounts = useMemo(
    () => ({
      posts: posts.length,
      saved: savedCount,
      courses: courses.length,
      projects: projects.length,
    }),
    [courses.length, posts.length, projects.length, savedCount]
  );

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

        <div className="profile-container modern-profile-container">
          <section className="modern-profile-header">
            <div className="modern-profile-avatar-wrap">
              {user.profileImage ? (
                <img
                  src={`/uploads/${user.profileImage}`}
                  alt={`${user.name} ${user.surname}`}
                  className="modern-profile-avatar"
                />
              ) : (
                <div className="modern-profile-avatar modern-profile-avatar-placeholder">
                  {user.name?.charAt(0)}{user.surname?.charAt(0)}
                </div>
              )}
            </div>

            <div className="modern-profile-body">
              <div className="modern-profile-topline">
                <div>
                  <h1>{user.name} {user.surname}</h1>
                  <p className="profile-role">{getRoleName(user.role)}</p>
                </div>

                <Link href="/profile/edit" className="edit-profile-button">
                  Измени профил
                </Link>
              </div>

              <div className="modern-profile-stats" aria-label="Профил статистика">
                <div>
                  <strong>{posts.length}</strong>
                  <span>Објави</span>
                </div>

                <div>
                  <strong>{user.followers?.length || 0}</strong>
                  <span>Следбеници</span>
                </div>

                <div>
                  <strong>{user.following?.length || 0}</strong>
                  <span>Следи</span>
                </div>
              </div>

              {user.bio ? (
                <p className="modern-profile-bio">{user.bio}</p>
              ) : (
                <p className="modern-profile-bio empty-profile-data">
                  Немате додадено опис.
                </p>
              )}

              {user.location && (
                <p className="profile-location">📍 {user.location}</p>
              )}

              {(user.skills?.length > 0 || user.interests?.length > 0) && (
                <div className="profile-tags modern-profile-tags">
                  {[...(user.skills || []), ...(user.interests || [])]
                    .slice(0, 8)
                    .map((item, index) => (
                      <span className="profile-tag" key={`${item}-${index}`}>
                        {item}
                      </span>
                    ))}
                </div>
              )}
            </div>
          </section>

          <nav className="profile-tabs" aria-label="Профил секции">
            {tabs.map((tab) => (
              <button
                type="button"
                key={tab.id}
                className={activeTab === tab.id ? "active" : ""}
                onClick={() => setActiveTab(tab.id)}
              >
                <span>{tab.label}</span>
                <strong>{tabCounts[tab.id]}</strong>
              </button>
            ))}
          </nav>

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
                        <span>♥ {post.likes?.length || 0}</span>
                        <span>💬</span>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="profile-empty-state">
                  <h2>Нема објави</h2>
                  <p>Вашите објави ќе се прикажат тука.</p>
                </div>
              )
            )}

            {activeTab === "saved" && (
              <div className="profile-empty-state">
                <h2>Зачувани</h2>
                <p>
                  {savedCount > 0
                    ? `Имате ${savedCount} зачувани објави.`
                    : "Немате зачувани објави."}
                </p>
              </div>
            )}

            {activeTab === "courses" && (
              courses.length > 0 ? (
                <div className="profile-compact-list">
                  {courses.map((course) => (
                    <Link
                      href={`/courses/${course._id}`}
                      className="profile-compact-item"
                      key={course._id}
                    >
                      {course.coverImage && (
                        <img
                          src={`/uploads/${course.coverImage}`}
                          alt={course.title}
                        />
                      )}

                      <div>
                        <h2>{course.title}</h2>
                        <p>{course.category} · {course.level}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="profile-empty-state">
                  <h2>Нема курсеви</h2>
                  <p>Курсевите што ги креирате ќе се прикажат тука.</p>
                </div>
              )
            )}

            {activeTab === "projects" && (
              projects.length > 0 ? (
                <div className="profile-compact-list">
                  {projects.map((project) => (
                    <Link
                      href={`/project-requests/${project._id}`}
                      className="profile-compact-item"
                      key={project._id}
                    >
                      <div>
                        <h2>{project.title}</h2>
                        <p>{project.category} · {project.status}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="profile-empty-state">
                  <h2>Нема проекти</h2>
                  <p>Проектите што ги креирате ќе се прикажат тука.</p>
                </div>
              )
            )}
          </section>
        </div>
      </section>
    </main>
  );
}


