"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import Icon from "@/components/Icon";

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


  const currentUser = user?.user || user;

  // Другиот корисник во разговорот
  let otherUser = null;

  if (messages.length > 0 && currentUser) {

    const firstMessage = messages[0];

    if (firstMessage.sender?._id === currentUser._id) {
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

        <div className="chat-page messages-app-page">

          <div className="messages-shell has-active-chat">

            <aside className="messages-sidebar chat-context-sidebar">
              <div className="messages-sidebar-header">
                <h1>Пораки</h1>

                <Link href="/messages" className="messages-back-link">
                  ← Назад кон разговори
                </Link>
              </div>

              {otherUser && (
                <Link
                  href={`/messages/${otherUser._id}`}
                  className="conversation-card active"
                >
                  <div className="conversation-image">
                    {otherUser.profileImage ? (
                      <img
                        src={`/uploads/${otherUser.profileImage}`}
                        alt="Profile"
                      />
                    ) : (
                      <span>
                        {otherUser.name?.charAt(0)}{otherUser.surname?.charAt(0)}
                      </span>
                    )}
                  </div>

                  <div className="conversation-info">
                    <strong>
                      {otherUser.name} {otherUser.surname}
                    </strong>
                    <p>Активен разговор</p>
                  </div>
                </Link>
              )}
            </aside>

            <section className="messages-chat-panel">
              <div className="chat-header">
                <Link href="/messages" className="chat-mobile-back">
                  ←
                </Link>

                {otherUser ? (
                  <div className="chat-user">
                    {otherUser.profileImage ? (
                      <img
                        src={`/uploads/${otherUser.profileImage}`}
                        alt="Profile"
                      />
                    ) : (
                      <span>
                        {otherUser.name?.charAt(0)}{otherUser.surname?.charAt(0)}
                      </span>
                    )}

                    <div>
                      <strong>
                        {otherUser.name}{" "}
                        {otherUser.surname}
                      </strong>

                      <p>{otherUser.role}</p>
                    </div>
                  </div>
                ) : (
                  <div className="chat-user">
                    <span>
                      <Icon name="message" />
                    </span>

                    <div>
                      <strong>Нов разговор</strong>
                      <p>Испратете порака</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="chat-messages">
                {loading && (
                  <p>Се вчитува разговорот...</p>
                )}

                {!loading &&
                  messages.length === 0 && (
                    <div className="messages-empty-state compact-chat-empty">
                      <span>
                        <Icon name="message" />
                      </span>
                      <h2>Нема пораки</h2>
                      <p>Започнете разговор.</p>
                    </div>
                  )}

                {messages.map((chatMessage) => {

                  const isMyMessage =
                    chatMessage.sender?._id === currentUser?._id;

                  const sender = chatMessage.sender;

                  return (
                    <div
                      key={chatMessage._id}
                      className={
                        isMyMessage
                          ? "message-row my-message"
                          : "message-row other-message"
                      }
                    >
                      {!isMyMessage && (
                        <div className="message-row-avatar">
                          {sender?.profileImage ? (
                            <img
                              src={`/uploads/${sender.profileImage}`}
                              alt="Profile"
                            />
                          ) : (
                            <span>
                              {sender?.name?.charAt(0)}{sender?.surname?.charAt(0)}
                            </span>
                          )}
                        </div>
                      )}

                      <div className="message-bubble">
                        <p>{chatMessage.content}</p>

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
                <p className="form-message">{message}</p>
              )}
            </section>

          </div>

        </div>

      </section>

    </main>
  );
}
