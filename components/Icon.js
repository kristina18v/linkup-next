"use client";

const icons = {
  application: (
    <path d="M7 3h7l5 5v13H7z M14 3v5h5 M10 13h6 M10 17h6" />
  ),
  bell: (
    <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9 M10 21h4" />
  ),
  bookmark: (
    <path d="M6 4h12v17l-6-4-6 4z" />
  ),
  briefcase: (
    <path d="M10 6V5a2 2 0 0 1 2-2h0a2 2 0 0 1 2 2v1 M3 8h18v11H3z M3 13h18" />
  ),
  building: (
    <path d="M4 21V5a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v16 M9 21v-4h3v4 M8 7h1 M12 7h1 M8 11h1 M12 11h1 M17 9h3v12" />
  ),
  calendar: (
    <path d="M7 3v4 M17 3v4 M4 9h16 M5 5h14a1 1 0 0 1 1 1v14H4V6a1 1 0 0 1 1-1z" />
  ),
  comment: (
    <path d="M21 12a8 8 0 0 1-8 8H6l-3 3v-7a8 8 0 1 1 18-4z" />
  ),
  course: (
    <path d="M4 5h12a4 4 0 0 1 4 4v11H8a4 4 0 0 0-4-4z M4 5v11 M8 9h8 M8 13h7" />
  ),
  edit: (
    <path d="M4 20h4l11-11a2.8 2.8 0 0 0-4-4L4 16z M13 6l5 5" />
  ),
  follow: (
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2 M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8 M19 8v6 M16 11h6" />
  ),
  heart: (
    <path d="M20.8 5.6a5.1 5.1 0 0 0-7.2 0L12 7.2l-1.6-1.6a5.1 5.1 0 1 0-7.2 7.2L12 21l8.8-8.2a5.1 5.1 0 0 0 0-7.2z" />
  ),
  home: (
    <path d="M3 11l9-8 9 8 M5 10v11h14V10 M9 21v-6h6v6" />
  ),
  image: (
    <path d="M5 4h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z M8.5 10a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z M21 16l-5-5L5 20" />
  ),
  linkup: (
    <path d="M7.5 12a4.5 4.5 0 0 1 4.5-4.5h2 M16.5 12a4.5 4.5 0 0 1-4.5 4.5h-2 M9 12h6 M6 4h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" />
  ),
  location: (
    <path d="M12 21s7-5.3 7-12a7 7 0 1 0-14 0c0 6.7 7 12 7 12z M12 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
  ),
  message: (
    <path d="M4 5h16v11H7l-3 3z M8 9h8 M8 12h5" />
  ),
  plus: (
    <path d="M12 5v14 M5 12h14" />
  ),
  profile: (
    <path d="M20 21a8 8 0 0 0-16 0 M12 13a5 5 0 1 0 0-10 5 5 0 0 0 0 10z" />
  ),
  review: (
    <path d="M12 3l2.7 5.5 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z" />
  ),
  search: (
    <path d="M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15z M16 16l5 5" />
  ),
  share: (
    <path d="M14 5h5v5 M13 11l6-6 M19 14v5H5V5h5" />
  ),
  trash: (
    <path d="M4 7h16 M10 11v6 M14 11v6 M6 7l1 14h10l1-14 M9 7V4h6v3" />
  ),
};

export default function Icon({ name, className = "", title }) {
  return (
    <svg
       width="20"
      height="20"
      aria-hidden={title ? undefined : true}
      className={`icon ${className}`.trim()}
      fill="none"
      focusable="false"
      role={title ? "img" : undefined}
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      {title && <title>{title}</title>}
      {icons[name] || icons.bell}
    </svg>
  );
}
