# 🎵 Melody Music Player

A fully functional, responsive music player web app built with **HTML5, CSS3, and Vanilla JavaScript** — created as part of the **CodeAlpha Internship (Task 4)**.

![Status](https://img.shields.io/badge/status-complete-brightgreen)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)

---

## ✨ Features

- 🎧 **Play / Pause / Next / Previous** controls
- 📊 **Live progress bar** with click-to-seek
- 🔊 **Volume control** slider
- 📃 **Playlist** with cover art, title, artist, and duration
- 🔁 **Autoplay** toggle — automatically plays the next song when one ends
- 📱 **Fully responsive** — desktop, tablet, and mobile layouts
- ⚠️ **Graceful error handling** — shows a friendly message if a song can't be loaded, instead of breaking
- ♿ **Accessible** — semantic HTML, `aria-label`s, keyboard-navigable playlist

---

## 📁 Project Structure

```
music-player/
├── index.html          # Page structure & markup
├── style.css            # Styling, layout, and responsive design
├── script.js             # Player logic (play, pause, playlist, autoplay, etc.)
├── assets/
│   ├── audio/            # Song files (song1.mp3 … song5.mp3)
│   └── images/            # Logo / cover images (if stored locally)
└── README.md
```

---

## 🚀 How to Run

1. Download or clone this repository.
2. Open the project folder in **VS Code**.
3. Right-click `index.html` → **Open with Live Server**
   (or simply double-click `index.html` to open it directly in your browser).
4. No build steps, installs, or dependencies needed — it's pure HTML/CSS/JS.

---

## 🎶 Adding Your Own Songs

Open `script.js` and edit the `songs` array at the top:

```javascript
const songs = [
  {
    title: "Song Title",
    artist: "Artist Name",
    duration: "3:24",
    src: "assets/audio/song1.mp3",   // path to your MP3 file
    cover: "https://your-image-link.jpg" // or a local path like assets/images/cover1.jpg
  },
  // ...add up to 5 songs
];
```

- **Audio files** should be placed in `assets/audio/` and named to match the `src` path.
- **Cover images** can either be stored locally in `assets/images/` or linked directly from an image URL.

---

## 🛠️ Built With

- **HTML5** — semantic structure, `<audio>` element
- **CSS3** — dark glassmorphism theme, gradients, responsive grid/flexbox
- **Vanilla JavaScript** — DOM manipulation, event listeners, no frameworks or libraries

---

## 📌 Notes

- This project intentionally sticks to the required scope (audio controls, playlist, progress bar, volume, autoplay) without extra features like login, search, or dark/light mode toggle, per the assignment guidelines.
- If a song or cover image fails to load, the app displays a fallback message/icon instead of crashing.

---

## 👤 Author

Built as part of the **CodeAlpha Web Development Internship Task 3**.
