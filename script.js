// Firebase Imports
import { auth, db } from "./firebase-config.js";
import {
  collection, addDoc, query, where,
  getDocs, deleteDoc, doc, updateDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

// DOM Elements
const audio = document.getElementById("audio");
const playBtn = document.getElementById("play");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
const progress = document.getElementById("progress");
const volume = document.getElementById("volume");
const uploadBtn = document.getElementById("upload-btn");
const uploadInput = document.getElementById("upload-songs");
const playlistEl = document.getElementById("playlist");
const titleEl = document.getElementById("title");
const artistEl = document.getElementById("artist");
const currentTimeDisplay = document.getElementById("current-time");
const createBtn = document.getElementById("create-playlist-btn");
const nameInput = document.getElementById("playlist-name");
const saveBtn = document.getElementById("save-playlist");
const playlistToggle = document.getElementById("playlist-toggle");
const playlistUl = document.getElementById("playlist");
const userEmailSpan = document.getElementById("user-email");

let songs = [];
let currentSong = 0;
let currentUser = null;
let currentPlaylistDocId = null;

// Load and Play Song
function loadSong(index) {
  const song = songs[index];
  if (!song) return;
  currentSong = index;
  audio.src = song.src;
  titleEl.textContent = song.title;
  artistEl.textContent = song.artist;
  audio.load();
  audio.play();
  playBtn.textContent = "⏸️";
  updatePlaylistUI();
}

// Update Playlist UI
function updatePlaylistUI() {
  playlistEl.innerHTML = "";

  if (songs.length > 0) {
    const current = songs[currentSong];
    const currentLi = document.createElement("li");
    currentLi.style.fontWeight = "bold";
    const currentTitle = document.createElement("span");
    currentTitle.textContent = `▶️ ${current.title}`;
    currentLi.appendChild(currentTitle);
    playlistEl.appendChild(currentLi);
  }

  songs.forEach((song, i) => {
    if (i === currentSong) return;
    const li = document.createElement("li");
    const titleSpan = document.createElement("span");
    titleSpan.textContent = song.title;
    titleSpan.style.cursor = "pointer";

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "🗑️";
    deleteBtn.style.marginLeft = "10px";
    deleteBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      if (confirm(`Delete "${song.title}" from playlist?`)) {
        songs.splice(i, 1);
        if (currentSong >= i) currentSong = Math.max(0, currentSong - 1);
        updatePlaylistUI();
      }
    });

    titleSpan.addEventListener("click", () => {
      loadSong(i);
    });

    li.appendChild(titleSpan);
    li.appendChild(deleteBtn);
    playlistEl.appendChild(li);
  });

  if (currentPlaylistDocId && songs.length > 0) {
    const controlsContainer = document.createElement("li");

    const showPlaylistBtn = document.createElement("button");
    showPlaylistBtn.textContent = "📂 Show This Playlist";
    showPlaylistBtn.style.marginRight = "10px";
    showPlaylistBtn.addEventListener("click", () => {
      displayOnlyThisPlaylist(songs, titleEl.textContent || "Current Playlist");
    });

    const backBtn = document.createElement("button");
    backBtn.textContent = "🔙 Back";
    backBtn.addEventListener("click", () => {
      loadUserPlaylists();
    });

    controlsContainer.appendChild(document.createElement("br"));
    controlsContainer.appendChild(showPlaylistBtn);
    controlsContainer.appendChild(backBtn);
    playlistEl.appendChild(controlsContainer);
  }
}

// Format Time
function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${minutes < 10 ? "0" : ""}${minutes}:${secs < 10 ? "0" : ""}${secs}`;
}

// Upload Local Songs
uploadBtn.addEventListener("click", () => uploadInput.click());

uploadInput.addEventListener("change", () => {
  const files = Array.from(uploadInput.files);
  files.forEach(file => {
    const url = URL.createObjectURL(file);
    songs.push({
      title: file.name.replace(/\.[^/.]+$/, ""),
      artist: "Local File",
      src: url
    });
  });
  updatePlaylistUI();
  if (songs.length > 0) {
    currentSong = songs.length - files.length;
    loadSong(currentSong);
  }
});

// Playback Controls
playBtn.addEventListener("click", () => {
  if (!audio.src) return;
  if (audio.paused) {
    audio.play();
    playBtn.textContent = "⏸️";
  } else {
    audio.pause();
    playBtn.textContent = "▶️";
  }
});

nextBtn.addEventListener("click", () => {
  currentSong = (currentSong + 1) % songs.length;
  loadSong(currentSong);
});

prevBtn.addEventListener("click", () => {
  currentSong = (currentSong - 1 + songs.length) % songs.length;
  loadSong(currentSong);
});

volume.addEventListener("input", () => {
  audio.volume = volume.value;
});

progress.addEventListener("input", () => {
  audio.currentTime = (progress.value / 100) * audio.duration;
});

audio.addEventListener("timeupdate", () => {
  progress.value = (audio.currentTime / audio.duration) * 100 || 0;
  currentTimeDisplay.textContent = formatTime(audio.currentTime);
});

audio.addEventListener("ended", () => {
  playBtn.textContent = "▶️";
});

// Audio Visualizer
const canvas = document.getElementById('circular-audio-visualizer');
const ctx = canvas.getContext('2d');
const audioCtx = new AudioContext();
const analyser = audioCtx.createAnalyser();
const source = audioCtx.createMediaElementSource(audio);
source.connect(analyser);
analyser.connect(audioCtx.destination);
analyser.fftSize = 64;
const bufferLength = analyser.frequencyBinCount;
const dataArray = new Uint8Array(bufferLength);

function drawCircularBars() {
  requestAnimationFrame(drawCircularBars);
  analyser.getByteFrequencyData(dataArray);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const radius = 40;
  for (let i = 0; i < bufferLength; i++) {
    const barHeight = dataArray[i] / 2;
    const angle = (i / bufferLength) * 2 * Math.PI;
    const x1 = centerX + radius * Math.cos(angle);
    const y1 = centerY + radius * Math.sin(angle);
    const x2 = centerX + (radius + barHeight) * Math.cos(angle);
    const y2 = centerY + (radius + barHeight) * Math.sin(angle);
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = '#ffd86f';
    ctx.lineWidth = 2;
    ctx.stroke();
  }
}

audio.addEventListener('play', () => {
  if (audioCtx.state === 'suspended') audioCtx.resume();
  drawCircularBars();
});

// ... continued in next message 👉
// Create Playlist
createBtn.addEventListener("click", () => {
  nameInput.style.display = "block";
  saveBtn.style.display = "inline-block";
});

saveBtn.addEventListener("click", async () => {
  const name = nameInput.value.trim();
  if (!name || !currentUser) {
    alert("Please enter a playlist name and make sure you're logged in.");
    return;
  }
  try {
    await addDoc(collection(db, "playlists"), {
      name,
      userId: currentUser.uid,
      songs: []
    });
    alert("Playlist created!");
    nameInput.value = "";
    nameInput.style.display = "none";
    saveBtn.style.display = "none";
    loadUserPlaylists();
  } catch (error) {
    console.error("Error saving playlist:", error);
    alert("Error saving playlist.");
  }
});

// Load Playlists
async function loadUserPlaylists() {
  if (!currentUser) return;
  try {
    const q = query(collection(db, "playlists"), where("userId", "==", currentUser.uid));
    const querySnapshot = await getDocs(q);
    playlistUl.innerHTML = "";

    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      const docId = docSnap.id;

      const li = document.createElement("li");
      const nameSpan = document.createElement("span");
      nameSpan.textContent = data.name;
      nameSpan.style.cursor = "pointer";

      const loadBtn = document.createElement("button");
      loadBtn.textContent = "▶️ Load";
      loadBtn.style.marginLeft = "10px";
      loadBtn.addEventListener("click", () => {
        songs = data.songs || [];
        currentPlaylistDocId = docId;
        currentSong = 0;
        loadSong(currentSong);
        updatePlaylistUI();
      });

      const addBtn = document.createElement("button");
      addBtn.textContent = "➕ Add Song";
      addBtn.style.marginLeft = "10px";
      addBtn.addEventListener("click", async () => {
        if (!audio.src) return alert("No song is playing.");
        const song = songs[currentSong];
        data.songs.push(song);
        await updateDoc(doc(db, "playlists", docId), { songs: data.songs });
        alert(`"${song.title}" added to "${data.name}"`);
      });

      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "🗑️";
      deleteBtn.style.marginLeft = "10px";
      deleteBtn.addEventListener("click", async () => {
        if (confirm(`Delete playlist "${data.name}"?`)) {
          await deleteDoc(doc(db, "playlists", docId));
          loadUserPlaylists();
        }
      });


       const backBtn = document.createElement("button");
      backBtn.textContent = "🔙 Back";
      backBtn.style.marginLeft = "10px";
      backBtn.addEventListener("click", () => {
        loadUserPlaylists();
      });

      li.appendChild(nameSpan);
      li.appendChild(loadBtn);
      li.appendChild(addBtn);
      li.appendChild(deleteBtn);

      playlistUl.appendChild(li);
    });
  } catch (error) {
    console.error("Error loading playlists:", error);
  }
}

// Show only one playlist
function displayOnlyThisPlaylist(playlistSongs, playlistName) {
  songs = playlistSongs;
  currentSong = 0;
  updatePlaylistUI();
  loadSong(currentSong);

  playlistUl.innerHTML = "";

  const titleLi = document.createElement("li");
  titleLi.textContent = `🎵 Viewing: ${playlistName}`;
  titleLi.style.fontWeight = "bold";

  const backBtn = document.createElement("button");
  backBtn.textContent = "🔙 Back to All Playlists";
  backBtn.style.marginTop = "10px";
  backBtn.addEventListener("click", () => {
    loadUserPlaylists();
  });

  playlistUl.appendChild(titleLi);
  playlistUl.appendChild(document.createElement("br"));
  playlistUl.appendChild(backBtn);
}

// Auth + UI Toggle
onAuthStateChanged(auth, (user) => {
  if (user) {
    currentUser = user;
    userEmailSpan.textContent = user.email;
    userEmailSpan.style.display = "inline";
    document.getElementById("login-btn").style.display = "none";
    document.getElementById("signup-btn").style.display = "none";
    document.getElementById("logout").style.display = "inline";
    loadUserPlaylists();
  } else {
    currentUser = null;
    playlistUl.innerHTML = "<li>Please log in to view your playlists.</li>";
  }
});

playlistToggle.addEventListener("click", () => {
  playlistEl.classList.toggle("collapsed");
  const icon = playlistToggle.querySelector("i");
  icon.classList.toggle("fa-chevron-down");
  icon.classList.toggle("fa-chevron-up");
});
