"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import Icon from "@/components/Icon";

export default function MessagesPage() {
  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    // GET CURRENT USER
    fetch("/api/auth/me", {
      credentials: "include",
    })
      .then(async (response) => {
        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
            "Грешка при вчитување на корисникот"
          );
        }

        return data;
      })
      //Кога ќе ги добиеме податоците (data), го земаме корисникот data.user и го зачувуваме во state преку setUser()
      .then((data) => {
        setUser(data.user);
      })
      .catch((error) => {
        console.log(error);
        setUser(null);
      });


    // GET ALL MESSAGES
    fetch("/api/messages", {
      credentials: "include",
    })
      .then(async (response) => {
        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
            "Грешка при вчитување на пораките"
          );
        }

        return data;
      })
      .then((data) => {
        setMessages(
          Array.isArray(data) ? data : []
        );

        setLoading(false);
      })
      .catch((error) => {
        console.log(error);

        setMessages([]);
        setLoading(false);
      });

  }, []);


  if (loading) {
    return (
      <p>Се вчитуваат пораките...</p>
    );
  }



  // FOLLOWERS + FOLLOWING


  const allPeople = [
    ...(user?.followers || []),
    ...(user?.following || []),
  ];


  // Ги тргаме дупликатите
  const people = allPeople.filter(
    (person, index, array) =>
      index ===
      array.findIndex(
        (item) => item._id === person._id
      )
  );


  // EXISTING CONVERSATIONS
  

  const conversations = [];

  messages.forEach((message) => {
    let otherUser;

    if (message.sender?._id === user?._id) {
      otherUser = message.receiver;
    } else {
      otherUser = message.sender;
    }

    if (!otherUser) {
      return;
    }

    const exists = conversations.find(
      (conversation) =>
        conversation.user._id ===
        otherUser._id
    );

    if (!exists) {
      conversations.push({
        user: otherUser,
        lastMessage: message,
      });
    }
  });


  return (
    <main className="home-layout">

      <Sidebar user={user} />

      <section className="home-main">

        <Navbar user={user} />

        <div className="messages-page messages-app-page">

          <div className="messages-shell">

            <aside className="messages-sidebar">

              <div className="messages-sidebar-header">
                <h1>Пораки</h1>

                <div className="message-search">
                  <Icon name="search" />
                  <input
                    type="text"
                    placeholder="Пребарај разговор"
                  />
                </div>
              </div>

              {people.length > 0 && (
                <section className="message-people-section">
                  <h2>Нов разговор</h2>

                  <div className="message-people-list">
                    {people.map((person) => (
                      <Link
                        href={`/messages/${person._id}`}
                        key={person._id}
                        className="message-person-card"
                        title={`${person.name} ${person.surname}`}
                      >
                        <div className="message-person-image">
                          {person.profileImage ? (
                            <img
                              src={`/uploads/${person.profileImage}`}
                              alt={`${person.name} ${person.surname}`}
                            />
                          ) : (
                            <span>
                              {person.name?.charAt(0)}{person.surname?.charAt(0)}
                            </span>
                          )}
                        </div>

                        <span className="message-person-name">
                          {person.name}
                        </span>
                      </Link>
                    ))}
                  </div>
                </section>
              )}

              <section className="conversations-section">
                {conversations.length === 0 && (
                  <div className="empty-messages compact-empty-messages">
                    <h3>Немате започнати разговори</h3>
                    <p>Изберете корисник за да започнете разговор.</p>
                  </div>
                )}

                <div className="conversations-list">
                  {conversations.map(
                    (conversation) => (
                      <Link
                        href={`/messages/${conversation.user._id}`}
                        key={conversation.user._id}
                        className="conversation-card"
                      >
                        <div className="conversation-image">
                          {conversation.user.profileImage ? (
                            <img
                              src={`/uploads/${conversation.user.profileImage}`}
                              alt="Profile"
                            />
                          ) : (
                            <span>
                              {conversation.user.name?.charAt(0)}{conversation.user.surname?.charAt(0)}
                            </span>
                          )}
                        </div>

                        <div className="conversation-info">
                          <div className="conversation-title-row">
                            <strong>
                              {conversation.user.name}{" "}
                              {conversation.user.surname}
                            </strong>

                            {conversation.lastMessage?.createdAt && (
                              <time>
                                {new Date(
                                  conversation.lastMessage.createdAt
                                ).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </time>
                            )}
                          </div>

                          <p>
                            {conversation.lastMessage?.content ||
                              "Започни разговор"}
                          </p>
                        </div>
                      </Link>
                    )
                  )}
                </div>
              </section>

            </aside>

            <section className="messages-chat-panel messages-empty-panel">
              <div className="messages-empty-state">
                <span>
                  <Icon name="message" />
                </span>

                <h2>Изберете разговор</h2>

                <p>
                  Изберете корисник за да започнете разговор.
                </p>
              </div>
            </section>

          </div>

        </div>

      </section>

    </main>
  );
}
