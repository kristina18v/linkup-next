"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";

export default function EditProfilePage() {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [form, setForm] = useState({
    name: "",
    surname: "",
    bio: "",
    location: "",
    skills: "",
    interests: "",
  });
  const [profileImage, setProfileImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/auth/me", {
      credentials: "include",
    })
      .then(async (response) => {
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Не сте најавени");
        }

        return data;
      })
      .then((data) => {
        const currentUser = data.user;

        setUser(currentUser);
        setForm({
          name: currentUser.name || "",
          surname: currentUser.surname || "",
          bio: currentUser.bio || "",
          location: currentUser.location || "",
          skills: (currentUser.skills || []).join(", "),
          interests: (currentUser.interests || []).join(", "),
        });

        if (currentUser.profileImage) {
          setPreview(`/uploads/${currentUser.profileImage}`);
        }

        setLoading(false);
      })
      .catch((error) => {
        setMessage(error.message);
        setLoading(false);
      });
  }, []);



  function handleChange(event) {
    const { name, value } = event.target;

    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
  }

  function handleImageChange(event) {
    const file = event.target.files?.[0];

    if (!file) return;

    setProfileImage(file);
    setPreview(URL.createObjectURL(file));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      const formData = new FormData();

      formData.append("name", form.name);
      formData.append("surname", form.surname);
      formData.append("bio", form.bio);
      formData.append("location", form.location);
      formData.append("skills", form.skills);
      formData.append("interests", form.interests);

      if (profileImage) {
        formData.append("profileImage", profileImage);
      }

      const response = await fetch("/api/profile", {
        method: "PUT",
        credentials: "include",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Профилот не е зачуван.");
        setSaving(false);
        return;
      }

      router.push("/profile");
      router.refresh();
    } catch (error) {
      setMessage("Настана грешка при зачувување.");
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main className="profile-loading">
        <p>Се вчитува профилот...</p>
      </main>
    );
  }

  return (
    <main className="profile-layout">
      <Sidebar user={user} />

      <section className="profile-main">
        <Navbar user={user} />

        <div className="edit-profile-page">
          <div className="edit-profile-heading">
            <div>
              <h1>Измени профил</h1>
              <p>Ажурирај ги основните информации и профилната слика.</p>
            </div>
          </div>

          <form
            className="edit-profile-form"
            onSubmit={handleSubmit}
          >
            <div className="edit-profile-photo-row">
              <div className="edit-profile-preview">
                {preview ? (
                  <img
                    src={preview}
                    alt="Профил"
                  />
                ) : (
                  <span>
                    {form.name?.charAt(0)}{form.surname?.charAt(0)}
                  </span>
                )}
              </div>

              <div className="edit-profile-upload">
                <label htmlFor="profileImage">
                  Profile image
                </label>
                <input
                  id="profileImage"
                  name="profileImage"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleImageChange}
                />
                <p>JPG, PNG или WebP.</p>
              </div>
            </div>

            <div className="edit-profile-grid">
              <div>
                <label htmlFor="name">Име</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label htmlFor="surname">Презиме</label>
                <input
                  id="surname"
                  name="surname"
                  type="text"
                  value={form.surname}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="bio">Bio</label>
              <textarea
                id="bio"
                name="bio"
                value={form.bio}
                onChange={handleChange}
                maxLength={300}
              />
            </div>

            <div>
              <label htmlFor="location">Локација</label>
              <input
                id="location"
                name="location"
                type="text"
                value={form.location}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="skills">Вештини</label>
              <input
                id="skills"
                name="skills"
                type="text"
                value={form.skills}
                onChange={handleChange}
                placeholder="JavaScript, UI Design, Marketing"
              />
            </div>

            <div>
              <label htmlFor="interests">Интереси</label>
              <input
                id="interests"
                name="interests"
                type="text"
                value={form.interests}
                onChange={handleChange}
                placeholder="Startups, Education, Design"
              />
            </div>

            {message && (
              <p className="form-message">{message}</p>
            )}

            <div className="edit-profile-actions">
              <button type="submit" disabled={saving}>
                {saving ? "Се зачувува..." : "Зачувај промени"}
              </button>

              <Link href="/profile" className="edit-profile-cancel">
                Откажи
              </Link>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}

