"use client";

import { useEffect, useState } from "react";

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

  return (
    <main className="home-layout">

      <Sidebar user={user} />

      <section className="home-main">

        <Navbar user={user} />

        <div className="home-content">

          {/* FEED */}
          <section className="feed">

            {/* CREATE POST */}
            {user && (
              <a
                href="/posts/create"
                className="create-post-button"
              >
                <Icon name="plus" /> Креирај објава
              </a>
            )}

            {/* LOADING */}
            {loading && (
              <p>Се вчитува...</p>
            )}

            {/* NO POSTS */}
            {!loading && posts.length === 0 && (
              <p>Нема објави.</p>
            )}

            {/* POSTS */}
            <div className="posts">

              {posts.map((post) => (
                <article
                  className="post-card"
                  key={post._id}
                >

                  {/* AUTHOR */}
                  <div className="post-author">

                    <div className="post-author-info">

                      {/* PROFILE IMAGE */}
                      {post.author?.profileImage ? (
                        <img
                          className="post-avatar"
                          src={`/uploads/${post.author.profileImage}`}
                          alt="Профил"
                        />
                      ) : (
                        <div className="post-avatar-placeholder">
                          <Icon name="profile" />
                        </div>
                      )}

                      <div>
                        <strong>
                          {post.author?.name}{" "}
                          {post.author?.surname}
                        </strong>

                        <span>
                          {post.author?.role}
                        </span>
                      </div>

                    </div>

                    {/* FOLLOW */}
                    {user &&
                      post.author?._id &&
                      post.author._id !== user._id && (

                        <button
                          type="button"
                          className="follow-button"
                          onClick={() =>
                            handleFollow(
                              post.author._id
                            )
                          }
                        >
                          {following.includes(
                            post.author._id
                          )
                            ? "Следиш ✓"
                            : "+ Следи"}
                        </button>

                      )}

                  </div>

                  {/* POST TYPE */}
                  {post.type &&
                    post.type !== "general" && (
                      <span className="post-type">
                        {post.type}
                      </span>
                    )}

                  {/* POST CONTENT */}
                  <p className="post-content">
                    {post.content}
                  </p>

                  {/* TAGS */}
                  {post.tags?.length > 0 && (
                    <div className="post-tags">

                      {post.tags.map(
                        (tag, index) => (
                          <span key={index}>
                            #{tag}
                          </span>
                        )
                      )}

                    </div>
                  )}

                  {/* IMAGES */}
                  {post.images?.length > 0 && (
                    <div className="post-images">

                      {post.images.map((image) => (
                        <img
                          key={image}
                          src={`/uploads/${image}`}
                          alt="Објава"
                        />
                      ))}

                    </div>
                  )}

                  {/* POST STATS */}
            {/* POST STATS */}
           <div className="post-stats">
             <span>
              <Icon name="heart" /> {post.likes?.length || 0} допаѓања
             </span>
               </div>

                  {/* ACTIONS */}
                  <div className="post-actions">

                    {/* LIKE */}
                    <button
                      type="button"
                      onClick={() =>
                        handleLike(post._id)
                      }
                    >
                      <Icon name="heart" /> Like
                    </button>

                    {/* COMMENT */}
                    <button
                      type="button"
                      onClick={() =>
                        handleOpenComments(
                          post._id
                        )
                      }
                    >
                      <Icon name="comment" /> Коментар
                    </button>

                    {/* SHARE */}
                    <button
                      type="button"
                      onClick={() =>
                        handleShare(post._id)
                      }
                    >
                      <Icon name="share" /> Сподели
                    </button>

                    {/* SAVE */}
                    <button
                      type="button"
                      onClick={() =>
                        handleSave(post._id)
                      }
                    >
                      <Icon name="bookmark" /> {savedPosts.includes(post._id) ? "Зачувано" : "Зачувај"}
                    </button>

                  </div>

                  {/* COMMENTS */}
                  {openComments === post._id && (

                    <div className="comments-section">

                      <div className="comments-list">

                        {(comments[post._id] || [])
                          .length === 0 && (
                          <p>
                            Сè уште нема коментари.
                          </p>
                        )}

                        {(comments[post._id] || []).map(
                          (comment) => (

                            <div
                              className="comment"
                              key={comment._id}
                            >

                              <div className="comment-author">

                                {comment.author
                                  ?.profileImage ? (

                                  <img
                                    src={`/uploads/${comment.author.profileImage}`}
                                    alt="Профил"
                                  />

                                ) : (
                                  <div className="comment-avatar">
                                    <Icon name="profile" />
                                  </div>
                                )}

                                <strong>
                                  {comment.author?.name}{" "}
                                  {comment.author?.surname}
                                </strong>

                              </div>

                              <p>
                                {comment.content}
                              </p>

                            </div>

                          )
                        )}

                      </div>

                      {/* ADD COMMENT */}
                      {user && (

                        <div className="comment-form">

                          {user.profileImage ? (
                            <img
                              src={`/uploads/${user.profileImage}`}
                              alt="Профил"
                            />
                          ) : (
                            <div className="comment-avatar">
                              <Icon name="profile" />
                            </div>
                          )}

                          <input
                            type="text"
                            placeholder="Напиши коментар..."
                            value={commentText}
                            onChange={(event) =>
                              setCommentText(
                                event.target.value
                              )
                            }
                          />

                          <button
                            type="button"
                            onClick={() =>
                              handleComment(
                                post._id
                              )
                            }
                          >
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

          {/* RIGHT SIDE CALENDAR */}
          {user && (
            <Calendar user={user} />
          )}

        </div>

      </section>

    </main>
  );
}