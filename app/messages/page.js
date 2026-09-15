"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";

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


  // =========================
  // FOLLOWERS + FOLLOWING
  // =========================

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


  // =========================
  // EXISTING CONVERSATIONS
  // =========================

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

        <div className="messages-page">

          <div className="messages-heading">

            <h1>Пораки</h1>

            <p>
              Изберете корисник и започнете разговор.
            </p>

          </div>


          {/* ===================== */}
          {/* PEOPLE */}
          {/* ===================== */}

          <section className="message-people-section">

            <h2>Луѓе</h2>

            <p>
              Корисници што ги следите или ве следат.
            </p>


            {people.length === 0 && (

              <div className="empty-messages">

                <h3>
                  Нема корисници
                </h3>

                <p>
                  Кога ќе следите некого или некој
                  ќе ве следи, ќе се прикаже тука.
                </p>

              </div>

            )}


            <div className="message-people-list">

              {people.map((person) => (

                <Link
                  href={`/messages/${person._id}`}
                  key={person._id}
                  className="message-person-card"
                >

                  {/* IMAGE */}
                  <div className="message-person-image">

                    {person.profileImage ? (

                      <img
                        src={`/uploads/${person.profileImage}`}
                        alt={`${person.name} ${person.surname}`}
                      />

                    ) : (

                      <span>
                        👤
                      </span>

                    )}

                  </div>


                  {/* USER */}
                  <div className="message-person-info">

                    <strong>
                      {person.name}{" "}
                      {person.surname}
                    </strong>

                    <span>
                      {person.role}
                    </span>

                  </div>


                  <span className="message-start-button">
                    Порака →
                  </span>

                </Link>

              ))}

            </div>

          </section>


          {/* ===================== */}
          {/* CONVERSATIONS */}
          {/* ===================== */}

          <section className="conversations-section">

            <h2>
              Разговори
            </h2>


            {conversations.length === 0 && (

              <div className="empty-messages">

                <h3>
                  Немате започнати разговори
                </h3>

                <p>
                  Изберете корисник од листата
                  погоре за да започнете разговор.
                </p>

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

                    {/* PROFILE IMAGE */}
                    <div className="conversation-image">

                      {conversation.user
                        .profileImage ? (

                        <img
                          src={`/uploads/${conversation.user.profileImage}`}
                          alt="Profile"
                        />

                      ) : (

                        <span>
                          👤
                        </span>

                      )}

                    </div>


                    {/* USER + LAST MESSAGE */}
                    <div className="conversation-info">

                      <strong>
                        {conversation.user.name}{" "}
                        {conversation.user.surname}
                      </strong>

                      <p>
                        {
                          conversation
                            .lastMessage
                            .content
                        }
                      </p>

                    </div>

                  </Link>

                )
              )}

            </div>

          </section>

        </div>

      </section>

    </main>
  );
}