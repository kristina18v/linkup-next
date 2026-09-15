"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";

export default function PostsPage() {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Најавен корисник
    fetch("/api/auth/me", {
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        setUser(data);
      })
      .catch((error) => {
        console.log(error);
      });

    // Сите објави
    fetch("/api/posts", {
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        setPosts(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  // LIKE / UNLIKE
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
        setMessage(data.message);
        return;
      }

      setPosts(
        posts.map((post) =>
          post._id === postId ? data : post
        )
      );
    } catch (error) {
      console.log(error);
    }
  }

  // SAVE / UNSAVE
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
        setMessage(data.message);
        return;
      }

      setMessage(
        data.saved
          ? "Објавата е зачувана"
          : "Објавата е отстранета од зачувани"
      );
    } catch (error) {
      console.log(error);
    }
  }

  // SHARE
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
        setMessage(data.message);
        return;
      }

      setPosts([data, ...posts]);
      setMessage("Објавата е споделена");
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <main className="home-layout">
      <Sidebar user={user} />

      <section className="home-main">
        <Navbar user={user} />

        <div className="posts-page">

          <div className="posts-heading">
            <h1>Објави</h1>

            <Link href="/posts/create">
              Креирај објава
            </Link>

            <Link href="/posts/my">
              Мои објави
            </Link>
          </div>

          {message && <p>{message}</p>}

          <div className="posts">

            {posts.map((post) => (
              <article
                className="post-card"
                key={post._id}
              >

                <div className="post-author">

                  {post.author?.profileImage && (
                    <img
                      src={`/uploads/${post.author.profileImage}`}
                      alt="Profile"
                    />
                  )}

                  <div>
                    <strong>
                      {post.author?.name}{" "}
                      {post.author?.surname}
                    </strong>

                    <p>{post.author?.role}</p>
                  </div>

                </div>

                <p>{post.content}</p>

                {/* TAGS */}
                {post.tags?.length > 0 && (
                  <div className="post-tags">

                    {post.tags.map((tag, index) => (
                      <span key={index}>
                        #{tag}
                      </span>
                    ))}

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

                <div className="post-actions">

                  <button
                    onClick={() =>
                      handleLike(post._id)
                    }
                  >
                    ❤️ {post.likes?.length || 0}
                  </button>

                  <Link href={`/posts/${post._id}`}>
                    💬 Коментари
                  </Link>

                  <button
                    onClick={() =>
                      handleShare(post._id)
                    }
                  >
                    ↗ Сподели
                  </button>

                  <button
                    onClick={() =>
                      handleSave(post._id)
                    }
                  >
                    🔖 Зачувај
                  </button>

                </div>

              </article>
            ))}

          </div>

        </div>
      </section>
    </main>
  );
}