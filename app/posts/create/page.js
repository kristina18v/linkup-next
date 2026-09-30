"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import Icon from "@/components/Icon";

export default function CreatePostPage() {
  const router = useRouter();

  const [content, setContent] = useState("");
  const [type, setType] = useState("general");
  const [tags, setTags] = useState("");
  const [images, setImages] = useState([]);

  const [message, setMessage] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();

    if (!content.trim()) {
      setMessage("Внесете содржина");
      return;
    }

    const formData = new FormData();

    formData.append("content", content);
    formData.append("type", type);
    formData.append("tags", tags);

    images.forEach((image) => {
      formData.append("images", image);
    });

    try {
      const response = await fetch("/api/posts", {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message);
        return;
      }

      router.push("/posts");

    } catch (error) {
      setMessage("Настана грешка");
    }
  }

  function removeImage(indexToRemove) {
    setImages(
      images.filter((image, index) => index !== indexToRemove)
    );
  }

  return (
    <main className="home-layout">

      <Sidebar />

      <section className="home-main">

        <Navbar />

        <div className="create-post-page">

          <div className="create-post-panel-heading">
            <h1>Креирај објава</h1>
          </div>

          <form
            className="create-post-form"
            onSubmit={handleSubmit}
          >

            <label className="create-post-field create-post-content-field">
              <span>Содржина</span>

              <textarea
                placeholder="Што сакате да споделите?"
                value={content}
                onChange={(event) =>
                  setContent(event.target.value)
                }
              />
            </label>

            <div className="create-post-field-grid">

              <label className="create-post-field">
                <span>Тип на објава</span>

                <select
                  value={type}
                  onChange={(event) =>
                    setType(event.target.value)
                  }
                >

                  <option value="general">
                    Општо
                  </option>

                  <option value="project-help">
                    Помош за проект
                  </option>

                  <option value="mentoring">
                    Менторство
                  </option>

                  <option value="course-promo">
                    Курс
                  </option>

                  <option value="internship">
                    Пракса
                  </option>

                  <option value="study-group">
                    Група за учење
                  </option>

                </select>
              </label>

              <label className="create-post-field">
                <span>Тагови</span>

                <input
                  type="text"
                  placeholder="react, javascript, mongodb"
                  value={tags}
                  onChange={(event) =>
                    setTags(event.target.value)
                  }
                />
              </label>

            </div>

            {/* IMAGE UPLOAD */}
            <label className="create-post-upload">

              <span className="create-post-upload-icon">
                <Icon name="image" />
              </span>

              <span className="create-post-upload-copy">
                <strong>Додај фотографии</strong>
                <small>JPG, PNG или WebP</small>
              </span>

              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                multiple
                onChange={(event) =>
                  setImages(
                    Array.from(event.target.files)
                  )
                }
              />

            </label>

            {/* IMAGE PREVIEW */}
            {images.length > 0 && (
              <div className="create-post-previews">

                {images.map((image, index) => (

                  <div
                    className="create-post-preview"
                    key={`${image.name}-${index}`}
                  >

                    <img
                      src={URL.createObjectURL(image)}
                      alt="Преглед"
                    />

                    <button
                      type="button"
                      className="create-post-preview-remove"
                      onClick={() => removeImage(index)}
                    >
                      ×
                    </button>

                  </div>

                ))}

              </div>
            )}

            <button
              type="submit"
              className="create-post-submit"
            >
              Објави
            </button>

          </form>

          {message && (
            <p className="form-message">
              {message}
            </p>
          )}

        </div>

      </section>

    </main>
  );
}