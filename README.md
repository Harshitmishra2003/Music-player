Web Music Player

Music Player is a sleek, browser-based music player that lets you upload, manage, and play your favorite audio files. With Firebase authentication and Firestore integration, you can create playlists, save your songs, and access them securely from any device.

Features

Music Upload & Playback – Add local audio files and play them directly in the browser.

User Authentication – Sign up, log in, and log out using Firebase Authentication.

Playlist Management – Create, load, and delete playlists stored in Firestore.

Interactive Audio Visualizer – Enjoy a circular visualizer synced with your music.

Responsive UI – Clean, modern interface built with HTML, CSS, and JavaScript.

Help & About Pages – Quick access to guidance and project info.

Tech Stack

Frontend: HTML, CSS, JavaScript (Vanilla)

Firebase: Authentication & Firestore Database

Libraries:

Font Awesome (icons)

Google Fonts (Inter)

Project Structure
.
├── index.html          # Main music player interface  
├── login.html          # Login page  
├── signup.html         # Signup page  
├── about.html          # About modal content  
├── help.html           # Help modal content  
├── style.css           # Styling for all pages  
├── script.js           # Music player logic & playlist handling  
├── login.js            # Login form handling  
├── auth.js             # Firebase auth state management  
├── firebase-config.js  # Firebase configuration and initialization  

Setup Instructions

Clone or download the repository:

git clone <your-repo-url>
cd <your-repo-folder>


Configure Firebase:

Create a project on Firebase Console

Enable Authentication (Email/Password) and Firestore Database

Replace the Firebase config in firebase-config.js with your own credentials.

Run the project:

Open index.html directly in a browser OR

Use a local server for better experience:

npx live-server


Sign up and start creating playlists!

Usage

Upload Songs: Click "Choose Songs" to select audio files from your device.

Play/Pause & Skip: Use playback controls to listen to your music.

Create Playlists: Enter a playlist name and save it (requires login).

Load & Delete Playlists: Quickly manage your saved music collections.

Help & About: Access via the menu button in the top-left corner.

Contact

For any questions, reach out via email: hm455416@gmail.com
