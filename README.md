Focus & Object Detection in Video Interviews
📄 Project Overview

This project is a video proctoring system designed for online interviews. It detects whether a candidate is focused during the interview and flags unauthorized items like phones, books, or extra devices in real-time.

Key Features:

Real-time face and focus detection

No face >10 seconds → logs “Focus Lost”

Looking away >5 seconds → logs “Focus Warning”

Multiple faces detected → logs “Focus Warning”

Real-time object detection

Detects phone, book, laptop, tablet → logs “Suspicious Item”

Records candidate video during session

Logs all events with timestamps in MongoDB

Generates proctoring reports including integrity score

Simple frontend for candidate and interviewer

🎯 Tech Stack

Frontend: React.js, TensorFlow.js, Coco-SSD, MediaPipe FaceMesh

Backend: Node.js, Express.js, MongoDB (Atlas)

Deployment: Frontend → Vercel, Backend → Render

Others: Axios for API calls, MediaRecorder for video recording

📦 Features

Candidate Page

Start/end interview session

Real-time focus & object detection

Video recording and upload

Interviewer Dashboard

View last sessions

Candidate name, start/end time

Proctoring Reports

Candidate name, duration, focus lost count

Suspicious events count

Integrity score

Link to recorded video

⚙️ Setup Instructions
Backend
cd backend
npm install
cp .env.example .env
# Edit .env and add your MongoDB URI and PORT
npm start

Frontend
cd frontend
npm install
# Edit .env if using local backend or deployed backend
npm start

🚀 Deployment

Frontend: https://video-proctoringapp.vercel.app/

Backend: https://video-proctoringapp.onrender.com

Make sure REACT_APP_API_URL in frontend .env points to your deployed backend URL.

🎥 Demo Video

<img width="1865" height="866" alt="image" src="https://github.com/user-attachments/assets/4f4a1dd1-c0c2-4baf-b0e5-f31887d5fa94" />

=======================================

📄 Sample Proctoring Report

Candidate Name

Interview Duration

Focus Lost Count

Suspicious Events

Integrity Score

Video link

📌 Bonus Features (Optional)

Eye closure / drowsiness detection

Real-time alerts to interviewer

Audio detection

PDF/CSV export of reports


📁 Project Folder Structure
focus-object-detection/
│
├── backend/
│   ├── models/
│   │   ├── Session.js          # Session schema & events
│   │   └── Report.js           # Proctoring report schema
│   │
│   ├── routes/
│   │   ├── sessions.js         # Start session & log events
│   │   └── reports.js          # Submit & fetch reports
│   │
│   ├── utils/
│   │   └── scoreCalculator.js  # Optional: integrity score calculation
│   │
│   ├── uploads/                # (Optional) store uploaded videos locally (ignored in Git)
│   │
│   ├── .env                    # MongoDB URI & PORT
│   ├── package.json
│   └── server.js               # Express server & API endpoints
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Candidate.jsx    # Candidate interview page
│   │   │   ├── Interviewer.jsx  # Interviewer dashboard
│   │   │   └── Report.jsx       # Proctoring reports
│   │   │
│   │   ├── App.js
│   │   └── index.js
│   │
│   ├── public/
│   │   └── index.html
│   │
│   ├── .env                     # REACT_APP_API_URL=https://your-backend-link
│   └── package.json
│
├── README.md                    # Polished README template
└── .gitignore

💻 Notes

Ensure camera/microphone permissions are allowed

System works best on Chrome or Edge

Accuracy depends on lighting and camera quality

📞 Contact

Project Author: Kanishka Deogade
