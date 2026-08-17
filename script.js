/* =========================================================
   SONG DATA
   Place your MP3 files inside /assets/audio and update the
   paths below to match your files.
========================================================= */
const songs = [
  {
    title: "Dream It Possible",
    artist: "Delacey",
    duration: "3:24",
    src: "assets/audio/song1.mp3",
    cover: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTNSShxzgNDr5FKIZfhEKsuzEbFV1dTsDcbwg6IFXs4FA&s=10"
  },
  {
    title: "Someone You Loved",
    artist: "Lewis Capaldi",
    duration: "3:02",
    src: "assets/audio/song2.mp3",
    cover: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTRwv5NCs8che_ZAN8h40Ly4RUAupQphuI2pDpil-ipjQ&s"
  },
  {
    title: "Bad Liar",
    artist: "Imagine Dragons",
    duration: "3:20",
    src: "assets/audio/song3.mp3",
    cover: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&h=500&fit=crop"
  },
  {
    title: "Believer",
    artist: "Imagine Dragons",
    duration: "3:24",
    src: "assets/audio/song4.mp3",
    cover: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR36883JkDrw3qI-XT47-rY0n-0POQWveWMqpLIwpAIbg&s=10"
  },
  {
    title: "On My Way",
    artist: "Alan Walker",
    duration: "3:13",
    src: "assets/audio/song5.mp3",
    cover: "https://i1.sndcdn.com/artworks-000525815001-4e79a3-t500x500.jpg"
  }
];

/* =========================================================
   STATE + DOM REFERENCES
========================================================= */
let currentIndex = 0;
let isPlaying = false;
let autoplayEnabled = true;

const audio = document.getElementById("audio");

const coverArt = document.getElementById("coverArt");
const coverGlow = document.getElementById("coverGlow");
const coverFallback = document.getElementById("coverFallback");

const trackTitle = document.getElementById("trackTitle");
const trackArtist = document.getElementById("trackArtist");
const statusMessage = document.getElementById("statusMessage");

const progressBar = document.getElementById("progressBar");
const currentTimeEl = document.getElementById("currentTime");
const durationTimeEl = document.getElementById("durationTime");

const playBtn = document.getElementById("playBtn");
const playIcon = document.getElementById("playIcon");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

const volumeSlider = document.getElementById("volumeSlider");
const volumeValue = document.getElementById("volumeValue");

const playlistEl = document.getElementById("playlist");
const songCountEl = document.getElementById("songCount");
const autoplayToggle = document.getElementById("autoplayToggle");

const ICON_PLAY = '<path d="M8 5v14l11-7z"/>';
const ICON_PAUSE = '<path d="M7 5h4v14H7zM13 5h4v14h-4z"/>';

/* =========================================================
   HELPERS
========================================================= */
function formatTime(seconds) {
  if (!isFinite(seconds) || isNaN(seconds)) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
}

function showStatus(message) {
  statusMessage.textContent = message;
}

function clearStatus() {
  statusMessage.textContent = "";
}

/* =========================================================
   PLAYLIST RENDERING
========================================================= */
function buildPlaylist() {
  playlistEl.innerHTML = "";

  songs.forEach((song, index) => {
    const li = document.createElement("li");
    li.className = "playlist-item";
    li.setAttribute("role", "option");
    li.setAttribute("tabindex", "0");
    li.setAttribute("aria-selected", index === currentIndex ? "true" : "false");
    li.dataset.index = index;

    li.innerHTML = `
      <img class="item-thumb" src="${song.cover}" alt="" data-fallback-thumb />
      <div class="item-thumb-fallback" style="display:none">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 18V5l12-2v13" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
          <circle cx="6" cy="18" r="3" stroke="currentColor" stroke-width="1.6"/>
          <circle cx="18" cy="16" r="3" stroke="currentColor" stroke-width="1.6"/>
        </svg>
      </div>
      <div class="item-meta">
        <div class="item-title">${song.title}</div>
        <div class="item-artist">${song.artist}</div>
      </div>
      <span class="now-playing-eq" aria-hidden="true"><span></span><span></span><span></span></span>
      <span class="item-duration">${song.duration}</span>
    `;

    const thumb = li.querySelector(".item-thumb");
    const thumbFallback = li.querySelector(".item-thumb-fallback");
    thumb.addEventListener("error", () => {
      thumb.style.display = "none";
      thumbFallback.style.display = "flex";
    });

    li.addEventListener("click", () => selectSong(index));
    li.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        selectSong(index);
      }
    });

    playlistEl.appendChild(li);
  });

  songCountEl.textContent = `${songs.length} songs`;
  updatePlaylistHighlight();
}

function updatePlaylistHighlight() {
  const items = playlistEl.querySelectorAll(".playlist-item");
  items.forEach((item, index) => {
    const active = index === currentIndex;
    item.classList.toggle("active", active);
    item.classList.toggle("paused", active && !isPlaying);
    item.setAttribute("aria-selected", active ? "true" : "false");
  });
}

/* =========================================================
   LOAD / PLAY / PAUSE
========================================================= */
function loadSong(index, autoplayAfterLoad = false) {
  currentIndex = index;
  const song = songs[currentIndex];

  audio.src = song.src;
  audio.currentTime = 0;

  trackTitle.textContent = song.title;
  trackArtist.textContent = song.artist;

  coverArt.src = song.cover;
  coverArt.style.display = "block";
  coverFallback.classList.remove("show");

  progressBar.value = 0;
  progressBar.style.setProperty("--fill", "0%");
  currentTimeEl.textContent = "0:00";
  durationTimeEl.textContent = song.duration || "0:00";

  clearStatus();
  updatePlaylistHighlight();

  if (autoplayAfterLoad) {
    playSong();
  } else {
    setPlayingState(false);
  }
}

function playSong() {
  const playPromise = audio.play();
  if (playPromise !== undefined) {
    playPromise
      .then(() => setPlayingState(true))
      .catch(() => {
        // Autoplay might be blocked by the browser until the user interacts.
        setPlayingState(false);
      });
  } else {
    setPlayingState(true);
  }
}

function pauseSong() {
  audio.pause();
  setPlayingState(false);
}

function setPlayingState(playing) {
  isPlaying = playing;
  playIcon.innerHTML = playing ? ICON_PAUSE : ICON_PLAY;
  playBtn.setAttribute("aria-label", playing ? "Pause" : "Play");
  coverGlow.classList.toggle("playing", playing);
  updatePlaylistHighlight();
}

function togglePlay() {
  if (isPlaying) {
    pauseSong();
  } else {
    playSong();
  }
}

function selectSong(index) {
  const wasPlaying = isPlaying;
  loadSong(index, wasPlaying || true); // selecting a song always starts playback
}

function nextSong() {
  const wasPlaying = isPlaying;
  const newIndex = (currentIndex + 1) % songs.length;
  loadSong(newIndex, wasPlaying);
}

function previousSong() {
  const wasPlaying = isPlaying;
  const newIndex = (currentIndex - 1 + songs.length) % songs.length;
  loadSong(newIndex, wasPlaying);
}

/* =========================================================
   PROGRESS BAR
========================================================= */
function updateProgress() {
  if (!audio.duration) return;
  const percent = (audio.currentTime / audio.duration) * 100;
  progressBar.value = percent;
  progressBar.style.setProperty("--fill", `${percent}%`);
  currentTimeEl.textContent = formatTime(audio.currentTime);
}

function setProgress() {
  if (!audio.duration) return;
  const seekTime = (progressBar.value / 100) * audio.duration;
  audio.currentTime = seekTime;
}

function handleLoadedMetadata() {
  durationTimeEl.textContent = formatTime(audio.duration);
}

/* =========================================================
   VOLUME
========================================================= */
function setVolume() {
  const value = Number(volumeSlider.value);
  audio.volume = value / 100;
  volumeValue.textContent = `${value}%`;
  volumeSlider.style.setProperty("--fill", `${value}%`);
}

/* =========================================================
   AUTOPLAY TOGGLE
========================================================= */
function toggleAutoplay() {
  autoplayEnabled = !autoplayEnabled;
  autoplayToggle.setAttribute("aria-checked", autoplayEnabled ? "true" : "false");
}

/* =========================================================
   ERROR HANDLING
========================================================= */
function handleAudioError() {
  setPlayingState(false);
  showStatus(`"${songs[currentIndex].title}" couldn't be loaded. Add the file to the /assets/audio folder to play it.`);
}

function handleCoverError() {
  coverArt.style.display = "none";
  coverFallback.classList.add("show");
}

/* =========================================================
   EVENT LISTENERS
========================================================= */
playBtn.addEventListener("click", togglePlay);
nextBtn.addEventListener("click", nextSong);
prevBtn.addEventListener("click", previousSong);

audio.addEventListener("timeupdate", updateProgress);
audio.addEventListener("loadedmetadata", handleLoadedMetadata);
audio.addEventListener("error", handleAudioError);
audio.addEventListener("ended", () => {
  if (autoplayEnabled) {
    nextSong();
  } else {
    setPlayingState(false);
    progressBar.value = 0;
    progressBar.style.setProperty("--fill", "0%");
  }
});

progressBar.addEventListener("input", setProgress);

volumeSlider.addEventListener("input", setVolume);

coverArt.addEventListener("error", handleCoverError);

autoplayToggle.addEventListener("click", toggleAutoplay);

/* =========================================================
   INIT
========================================================= */
function init() {
  buildPlaylist();
  loadSong(0, false);
  setVolume();
}

init();