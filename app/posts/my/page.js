"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";

export default function MyPostsPage() {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {

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


    fetch("/api/posts/my", {
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


  async function handleDelete(postId) {
    try {
      const response = await fetch(
        `/api/posts/${postId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message);
        return;
      }

      setPosts(
        posts.filter(
          (post) => post._id !== postId
        )
      );

      setMessage("Објавата е избришана");

    } catch (error) {
      setMessage("Настана грешка");
    }
  }


  return (
    <main className="home-layout">

      <Sidebar user={user} />

      <section className="home-main">

        <Navbar user={user} />

        <div className="my-posts-page">

          <div className="posts-heading">

            <h1>Мои објави</h1>

            <Link href="/posts/create">
              Креирај објава
            </Link>

          </div>

          {message && <p>{message}</p>}

          {posts.length === 0 && (
            <p>
              Немате креирано објави.
            </p>
          )}

          {posts.map((post) => (

            <article
              className="post-card"
              key={post._id}
            >

              <p>{post.content}</p>

              {post.tags?.length > 0 && (
                <div className="post-tags">

                  {post.tags.map((tag, index) => (
                    <span key={index}>
                      #{tag}
                    </span>
                  ))}

                </div>
              )}

              {post.images?.map((image) => (
                <img
                  key={image}
                  src={`/uploads/${image}`}
                  alt="Објава"
                />
              ))}

              <div className="post-actions">

                <Link href={`/posts/${post._id}`}>
                  Отвори
                </Link>

                <Link href={`/posts/${post._id}?edit=true`}>
                  ✏️ Измени
                </Link>

                <button
                  onClick={() =>
                    handleDelete(post._id)
                  }
                >
                  🗑️ Избриши
                </button>

              </div>

            </article>

          ))}

        </div>

      </section>

    </main>
  );
}