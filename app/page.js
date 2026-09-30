"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import Calendar from "@/components/Calendar";
import Icon from "@/components/Icon";

export default function HomePage() {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // COMMENTS
  const [openComments, setOpenComments] = useState(null);
  const [comments, setComments] = useState({});
  const [commentText, setCommentText] = useState("");

  // SAVED POSTS
  const [savedPosts, setSavedPosts] = useState([]);

  // FOLLOW
  const [following, setFollowing] = useState([]);

  useEffect(() => {
    // GET CURRENT USER
    fetch("/api/auth/me", {
      credentials: "include",
    })
      .then(async (response) => {
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message);
        }

        return data;
      })
      .then((data) => {
        // /api/auth/me -> { user: currentUser }
        const currentUser = data.user;

        setUser(currentUser);

        // SAVED POSTS
        setSavedPosts(
          Array.isArray(currentUser?.savedPosts)
            ? currentUser.savedPosts.map((item) =>
                typeof item === "string" ? item : item._id
              )
            : []
        );

        // FOLLOWING
        setFollowing(
          Array.isArray(currentUser?.following)
            ? currentUser.following.map((item) =>
                typeof item === "string" ? item : item._id
              )
            : []
        );
      })
      .catch((error) => {
        console.log(error);
        setUser(null);
      });

    // GET POSTS
    fetch("/api/posts", {
      credentials: "include",
    })
      .then(async (response) => {
        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Грешка при вчитување на објавите"
          );
        }

        return data;
      })
      .then((data) => {
        setPosts(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setPosts([]);
        setLoading(false);
      });
  }, []);

  // =========================
  // LIKE
  // =========================

  async function handleLike(postId) {
    try {
      const response = await fetch(
        `/api/posts/${postId}/likes`,
        {
          method: "PUT",
          credentials: "include",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        console.log(data.message);
        return;
      }

      setPosts((currentPosts) =>
        currentPosts.map((post) =>
          post._id === postId ? data : post
        )
      );
    } catch (error) {
      console.log(error);
    }
  }

  // =========================
  // OPEN COMMENTS
  // =========================

  async function handleOpenComments(postId) {
    // Ако се веќе отворени -> затвори
    if (openComments === postId) {
      setOpenComments(null);
      return;
    }

    setOpenComments(postId);

    try {
      const response = await fetch(
        `/api/comments?postId=${postId}`,
        {
          credentials: "include",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        console.log(data.message);
        return;
      }

      setComments((currentComments) => ({
        ...currentComments,
        [postId]: Array.isArray(data) ? data : [],
      }));
    } catch (error) {
      console.log(error);
    }
  }

  // =========================
  // ADD COMMENT
  // =========================

  async function handleComment(postId) {
    if (!commentText.trim()) {
      return;
    }

    try {
      const response = await fetch("/api/comments", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        credentials: "include",

        body: JSON.stringify({
          post: postId,
          content: commentText,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.log(data.message);
        return;
      }

      setComments((currentComments) => ({
        ...currentComments,

        [postId]: [
          ...(currentComments[postId] || []),
          data,
        ],
      }));

      setCommentText("");
    } catch (error) {
      console.log(error);
    }
  }

  // =========================
  // SHARE
  // =========================

  async function handleShare(postId) {
    try {
      const response = await fetch(
        `/api/posts/${postId}/share`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        console.log(data.message);
        return;
      }

      // Новата shared објава оди најгоре
      setPosts((currentPosts) => [
        data,
        ...currentPosts,
      ]);
    } catch (error) {
      console.log(error);
    }
  }

  // =========================
  // SAVE
  // =========================

  async function handleSave(postId) {
    try {
      const response = await fetch(
        `/api/posts/${postId}/save`,
        {
          method: "PUT",
          credentials: "include",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        console.log(data.message);
        return;
      }

      if (data.saved) {
        setSavedPosts((current) => [
          ...current,
          postId,
        ]);
      } else {
        setSavedPosts((current) =>
          current.filter((id) => id !== postId)
        );
      }
    } catch (error) {
      console.log(error);
    }
  }

  // =========================
  // FOLLOW
  // =========================

  async function handleFollow(userId) {
    try {
      const response = await fetch(
        `/api/users/${userId}/follow`,
        {
          method: "PUT",
          credentials: "include",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        console.log(data.message);
        return;
      }

      if (data.following) {
        setFollowing((current) => [
          ...current,
          userId,
        ]);
      } else {
        setFollowing((current) =>
          current.filter((id) => id !== userId)
        );
      }
    } catch (error) {
      console.log(error);
    }
  }

  function getInitials(person) {
    return `${person?.name?.charAt(0) || ""}${person?.surname?.charAt(0) || ""}`;
  }

  function formatPostDate(date) {
    if (!date) {
      return "Сега";
    }

    return new Date(date).toLocaleDateString("mk-MK", {
      day: "numeric",
      month: "short",
    });
  }

  return (
    <main className="home-layout app-shell-v2">
      <Sidebar user={user} />

      <section className="home-main social-main-v2">
        <Navbar user={user} />

        <div className="home-content social-home-grid">
          <section className="feed social-feed-v2">

            <div className="home-feed-intro">
              <div>
                <span>Feed</span>
                <strong>{posts.length} активни разговори</strong>
              </div>

              <nav className="home-topic-strip" aria-label="Брзи секции">
                <Link href="/courses"><Icon name="course" /> Курсеви</Link>
                <Link href="/tutoring"><Icon name="calendar" /> Ментори</Link>
                <Link href="/project-requests"><Icon name="briefcase" /> Проекти</Link>
                <Link href="/messages"><Icon name="message" /> Пораки</Link>
              </nav>
            </div>
            {user && (
              <section className="post-composer-v2">
                <div className="composer-avatar-v2">
                  {user.profileImage ? (
                    <img
                      src={`/uploads/${user.profileImage}`}
                      alt="Профил"
                    />
                  ) : (
                    <span>{getInitials(user) || "LN"}</span>
                  )}
                </div>

                <Link href="/posts/create" className="composer-input-v2">
                  Започни разговор, прашање или идеја...
                </Link>

                <div className="composer-actions-v2">
                  <Link href="/posts/create" title="Креирај објава">
                    <Icon name="plus" />
                    Објава
                  </Link>

                  <Link href="/posts/create" title="Додај слика">
                    <Icon name="image" />
                    Слика
                  </Link>
                </div>
              </section>
            )}

            {loading && (
              <div className="feed-state-v2">
                <span></span>
                <p>Се вчитува feed-от...</p>
              </div>
            )}

            {!loading && posts.length === 0 && (
              <div className="feed-state-v2 empty-feed-v2">
                <span><Icon name="comment" /></span>
                <h2>Нема објави</h2>
                <p>Креирај ја првата дискусија во LinkUp Next.</p>
              </div>
            )}

            <div className="posts social-post-stack-v2">
              {posts.map((post) => (
                <article className="post-card social-post-card-v2" key={post._id}>
                  <header className="post-author social-post-header-v2">
                    <div className="post-author-info social-author-v2">
                      {post.author?.profileImage ? (
                        <img
                          className="post-avatar"
                          src={`/uploads/${post.author.profileImage}`}
                          alt="Профил"
                        />
                      ) : (
                        <div className="post-avatar-placeholder">
                          {getInitials(post.author) || <Icon name="profile" />}
                        </div>
                      )}

                      <div className="social-author-copy-v2">
                        <strong>
                          {post.author?.name} {post.author?.surname}
                        </strong>

                        <span>
                          {post.author?.role || "LinkUp член"} · {formatPostDate(post.createdAt)}
                        </span>
                      </div>
                    </div>

                    <div className="post-header-actions-v2">
                      {user &&
                        post.author?._id &&
                        post.author._id !== user._id && (
                          <button
                            type="button"
                            className="follow-button"
                            onClick={() => handleFollow(post.author._id)}
                          >
                            {following.includes(post.author._id)
                              ? "Следиш"
                              : "Следи"}
                          </button>
                        )}

                      <button type="button" className="post-menu-v2" aria-label="Повеќе опции">
                        •••
                      </button>
                    </div>
                  </header>

                  <div className="post-body-v2">
                    {post.type && post.type !== "general" && (
                      <span className="post-type">{post.type}</span>
                    )}

                    <p className="post-content">{post.content}</p>

                    {post.tags?.length > 0 && (
                      <div className="post-tags">
                        {post.tags.map((tag, index) => (
                          <span key={index}>#{tag}</span>
                        ))}
                      </div>
                    )}
                  </div>

                  {post.images?.length > 0 && (
                    <div className="post-images social-post-gallery-v2">
                      {post.images.map((image) => (
                        <img
                          key={image}
                          src={`/uploads/${image}`}
                          alt="Објава"
                        />
                      ))}
                    </div>
                  )}

                  <div className="post-stats social-post-stats-v2">
                    <span>
                      <Icon name="heart" /> {post.likes?.length || 0} допаѓања
                    </span>

                    <span>
                      {(comments[post._id] || []).length} коментари
                    </span>
                  </div>

                  <div className="post-actions social-toolbar-v2">
                    <button type="button" onClick={() => handleLike(post._id)}>
                      <Icon name="heart" /> Like
                    </button>

                    <button type="button" onClick={() => handleOpenComments(post._id)}>
                      <Icon name="comment" /> Коментар
                    </button>

                    <button type="button" onClick={() => handleShare(post._id)}>
                      <Icon name="share" /> Сподели
                    </button>

                    <button type="button" onClick={() => handleSave(post._id)}>
                      <Icon name="bookmark" /> {savedPosts.includes(post._id) ? "Зачувано" : "Зачувај"}
                    </button>
                  </div>

                  {openComments === post._id && (
                    <div className="comments-section social-comments-v2">
                      <div className="comments-list">
                        {(comments[post._id] || []).length === 0 && (
                          <p>Сè уште нема коментари.</p>
                        )}

                        {(comments[post._id] || []).map((comment) => (
                          <div className="comment" key={comment._id}>
                            <div className="comment-author">
                              {comment.author?.profileImage ? (
                                <img
                                  src={`/uploads/${comment.author.profileImage}`}
                                  alt="Профил"
                                />
                              ) : (
                                <div className="comment-avatar">
                                  {getInitials(comment.author) || <Icon name="profile" />}
                                </div>
                              )}

                              <strong>
                                {comment.author?.name} {comment.author?.surname}
                              </strong>
                            </div>

                            <p>{comment.content}</p>
                          </div>
                        ))}
                      </div>

                      {user && (
                        <div className="comment-form">
                          {user.profileImage ? (
                            <img src={`/uploads/${user.profileImage}`} alt="Профил" />
                          ) : (
                            <div className="comment-avatar">
                              {getInitials(user) || <Icon name="profile" />}
                            </div>
                          )}

                          <input
                            type="text"
                            placeholder="Напиши коментар..."
                            value={commentText}
                            onChange={(event) => setCommentText(event.target.value)}
                          />

                          <button type="button" onClick={() => handleComment(post._id)}>
                            Испрати
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </article>
              ))}
            </div>
          </section>

          {user && (
            <aside className="home-right-column social-right-rail-v2">
              <section className="rail-profile-card-v2">
                <div className="rail-profile-avatar-v2">
                  {user.profileImage ? (
                    <img src={`/uploads/${user.profileImage}`} alt="Профил" />
                  ) : (
                    <span>{getInitials(user) || "LN"}</span>
                  )}
                </div>

                <div>
                  <strong>{user.name} {user.surname}</strong>
                  <p>{user.role}</p>
                </div>

                <Link href="/profile">Профил</Link>
              </section>

              <Calendar user={user} />

              <section className="rail-card-v2 learning-pulse-v2">
                <span><Icon name="course" /></span>
                <div>
                  <h2>Learning pulse</h2>
                  <p>Пронајди курс, приклучи се на проект или започни разговор со ментор.</p>
                </div>
              </section>

              <section className="rail-card-v2 rail-links-v2">
                <Link href="/courses">
                  <Icon name="course" /> Курсеви
                </Link>

                <Link href="/project-requests">
                  <Icon name="briefcase" /> Проекти
                </Link>

                <Link href="/messages">
                  <Icon name="message" /> Пораки
                </Link>
              </section>
            </aside>
          )}
        </div>
      </section>
    </main>
  );
}
