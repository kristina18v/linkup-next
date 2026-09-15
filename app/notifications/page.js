"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";

export default function NotificationsPage() {
  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    // GET CURRENT USER
    fetch("/api/auth/me", {
      credentials: "include",
    })
      .then(async (response) => {
        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Грешка при вчитување на корисникот"
          );
        }

        return data;
      })
      .then((data) => {
        setUser(data);
      })
      .catch((error) => {
        console.log(error);
        setUser(null);
      });

    // GET NOTIFICATIONS
    fetch("/api/notifications", {
      credentials: "include",
    })
      .then(async (response) => {
        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Грешка при вчитување на известувањата"
          );
        }

        return data;
      })
      .then((data) => {
        setNotifications(data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);

        // notifications секогаш останува array
        setNotifications([]);
        setLoading(false);
      });
  }, []);

  // READ / UNREAD
  async function handleRead(notification) {
    try {
      const response = await fetch(
        `/api/notifications/${notification._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            isRead: !notification.isRead,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message);
        return;
      }

      setNotifications(
        notifications.map((item) =>
          item._id === notification._id
            ? data
            : item
        )
      );
    } catch (error) {
      console.log(error);
    }
  }

  // DELETE NOTIFICATION
  async function handleDelete(notificationId) {
    try {
      const response = await fetch(
        `/api/notifications/${notificationId}`,
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

      setNotifications(
        notifications.filter(
          (item) => item._id !== notificationId
        )
      );

      setMessage("Известувањето е избришано.");
    } catch (error) {
      console.log(error);
    }
  }

  // ICON DEPENDING ON TYPE
  function getNotificationIcon(type) {
    if (type === "like") return "❤️";
    if (type === "comment") return "💬";
    if (type === "follow") return "👤";
    if (type === "share") return "↗️";
    if (type === "message") return "✉️";
    if (type === "course") return "📚";
    if (type === "project") return "💼";
    if (type === "internship") return "🏢";
    if (type === "application") return "📄";
    if (type === "review") return "⭐";

    return "🔔";
  }

  return (
    <main className="home-layout">

      <Sidebar user={user} />

      <section className="home-main">

        <Navbar user={user} />

        <div className="notifications-page">

          <div className="notifications-heading">
            <div>
              <h1>Известувања</h1>
              <p>
                Следете ги вашите најнови активности.
              </p>
            </div>
          </div>

          {message && (
            <p className="notification-message">
              {message}
            </p>
          )}

          {loading && (
            <p>Се вчитуваат известувањата...</p>
          )}

          {!loading &&
            notifications.length === 0 && (
              <div className="empty-notifications">
                <span>🔔</span>
                <h3>Немате известувања</h3>
                <p>
                  Новите известувања ќе се
                  прикажат тука.
                </p>
              </div>
            )}

          <div className="notifications-list">

            {notifications.map((notification) => (

              <div
                key={notification._id}
                className={
                  notification.isRead
                    ? "notification-card"
                    : "notification-card unread"
                }
              >

                {/* ICON */}
                <div className="notification-icon">
                  {getNotificationIcon(
                    notification.type
                  )}
                </div>

                {/* SENDER IMAGE */}
                <div className="notification-user-image">

                  {notification.sender?.profileImage ? (
                    <img
                      src={`/uploads/${notification.sender.profileImage}`}
                      alt="Profile"
                    />
                  ) : (
                    <span>👤</span>
                  )}

                </div>

                {/* CONTENT */}
                <div className="notification-content">

                  <p>
                    {notification.message}
                  </p>

                  {notification.sender && (
                    <small>
                      {notification.sender.name}{" "}
                      {notification.sender.surname}
                    </small>
                  )}

                  <div className="notification-actions">

                    {/* OPEN */}
                    {notification.link && (
                      <Link
                        href={notification.link}
                        onClick={() => {
                          if (!notification.isRead) {
                            handleRead(notification);
                          }
                        }}
                      >
                        Отвори
                      </Link>
                    )}

                    {/* READ / UNREAD */}
                    <button
                      onClick={() =>
                        handleRead(notification)
                      }
                    >
                      {notification.isRead
                        ? "Означи како непрочитано"
                        : "Означи како прочитано"}
                    </button>

                    {/* DELETE */}
                    <button
                      onClick={() =>
                        handleDelete(
                          notification._id
                        )
                      }
                    >
                      Избриши
                    </button>

                  </div>

                </div>

                {/* UNREAD DOT */}
                {!notification.isRead && (
                  <span className="unread-dot">
                    ●
                  </span>
                )}

              </div>

            ))}

          </div>

        </div>

      </section>

    </main>
  );
}