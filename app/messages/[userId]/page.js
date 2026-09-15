"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";

export default function ChatPage() {
  const params = useParams();

  const userId = params.userId;

  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([]);

  const [content, setContent] = useState("");
  const [message, setMessage] = useState("");

  const [loading, setLoading] = useState(true);

  useEffect(() => {

    // GET CURRENT USER
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


    // GET CONVERSATION
    fetch(`/api/messages/${userId}`, {
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        setMessages(data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });

  }, [userId]);


  // SEND MESSAGE
  async function handleSendMessage(event) {
    event.preventDefault();

    if (!content.trim()) {
      setMessage("Внесете порака.");
      return;
    }

    try {
      const response = await fetch("/api/messages", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        credentials: "include",

        body: JSON.stringify({
          receiver: userId,
          content: content,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message);
        return;
      }

      // Ја додаваме новата порака во разговорот
      setMessages([
        ...messages,
        data,
      ]);

      // Го празниме input полето
      setContent("");

      setMessage("");

    } catch (error) {
      setMessage("Настана грешка при испраќање.");
    }
  }


  // Другиот корисник во разговорот
  let otherUser = null;

  if (messages.length > 0 && user) {

    const firstMessage = messages[0];

    if (firstMessage.sender?._id === user._id) {
      otherUser = firstMessage.receiver;
    } else {
      otherUser = firstMessage.sender;
    }

  }


  return (
    <main className="home-layout">

      <Sidebar user={user} />

      <section className="home-main">

        <Navbar user={user} />

        <div className="chat-page">


          {/* CHAT HEADER */}
          <div className="chat-header">

            <Link href="/messages">
              ← Назад
            </Link>

            {otherUser && (

              <div className="chat-user">

                {otherUser.profileImage ? (
                  <img
                    src={`/uploads/${otherUser.profileImage}`}
                    alt="Profile"
                  />
                ) : (
                  <span>👤</span>
                )}

                <div>

                  <strong>
                    {otherUser.name}{" "}
                    {otherUser.surname}
                  </strong>

                  <p>
                    {otherUser.role}
                  </p>

                </div>

              </div>

            )}

          </div>


          {/* MESSAGES */}
          <div className="chat-messages">

            {loading && (
              <p>Се вчитува разговорот...</p>
            )}

            {!loading &&
              messages.length === 0 && (
                <p>
                  Нема пораки. Започнете разговор.
                </p>
              )}


            {messages.map((chatMessage) => {

              const isMyMessage =
                chatMessage.sender?._id === user?._id;

              return (

                <div
                  key={chatMessage._id}
                  className={
                    isMyMessage
                      ? "message-row my-message"
                      : "message-row other-message"
                  }
                >

                  <div className="message-bubble">

                    <p>
                      {chatMessage.content}
                    </p>

                    <small>
                      {new Date(
                        chatMessage.createdAt
                      ).toLocaleString()}
                    </small>

                  </div>

                </div>

              );

            })}

          </div>


          {/* SEND MESSAGE */}
          <form
            className="message-form"
            onSubmit={handleSendMessage}
          >

            <input
              type="text"
              placeholder="Напиши порака..."
              value={content}
              onChange={(event) =>
                setContent(event.target.value)
              }
            />

            <button type="submit">
              Испрати
            </button>

          </form>


          {message && (
            <p>{message}</p>
          )}

        </div>

      </section>

    </main>
  );
}