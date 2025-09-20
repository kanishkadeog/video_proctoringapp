// frontend/src/components/Candidate.jsx
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";

import * as faceLandmarksDetection from "@tensorflow-models/face-landmarks-detection";
import * as cocoSsd from "@tensorflow-models/coco-ssd";
import * as tf from "@tensorflow/tfjs";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const Candidate = () => {
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const recordedChunks = useRef([]);
  const sessionIdRef = useRef(null);

  const [detector, setDetector] = useState(null);
  const [objectModel, setObjectModel] = useState(null);

  const noFaceTimer = useRef(0);
  const lookingAwayTimer = useRef(0);

  // Start session
  const startSession = async () => {
    try {
      const res = await axios.post(`${API_URL}/api/sessions/start`, { candidate: "test-user" });
      sessionIdRef.current = res.data._id;
      console.log("Session started:", res.data);
    } catch (err) {
      console.error("API error:", err.message);
    }
  };

  // End session
  const endSession = async () => {
    if (!sessionIdRef.current) return;

    // Stop recording
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }

    // Upload video if recorded
    if (recordedChunks.current.length > 0) {
      const blob = new Blob(recordedChunks.current, { type: "video/webm" });
      const formData = new FormData();
      formData.append("video", blob, `interview_${Date.now()}.webm`);
      formData.append("candidateName", "test-user");

      try {
        await axios.post(`${API_URL}/api/reports`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        console.log("Video uploaded successfully");
      } catch (err) {
        console.error("Video upload error:", err);
      }
    }

    // End session API
    try {
      await axios.patch(`${API_URL}/api/sessions/${sessionIdRef.current}/end`);
      console.log("Session ended");
      sessionIdRef.current = null;
    } catch (err) {
      console.error("Error ending session:", err.message);
    }
  };

  // Log event
  const logEvent = async (type, details) => {
    const event = { type, details, timestamp: new Date() };
    if (!sessionIdRef.current) return;

    try {
      await axios.patch(`${API_URL}/api/sessions/${sessionIdRef.current}/event`, event);
      console.log("Event logged:", event);
    } catch (err) {
      console.error("Error logging event:", err.message);
    }
  };

  // Load models
  const loadModels = async () => {
    try {
      await tf.setBackend("webgl");
      const faceDetector = await faceLandmarksDetection.createDetector(
        faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh,
        { runtime: "tfjs" }
      );
      setDetector(faceDetector);

      const objModel = await cocoSsd.load();
      setObjectModel(objModel);

      console.log("Models loaded successfully");
    } catch (err) {
      console.error("Error loading models:", err);
    }
  };

  // Setup camera and recording
  const setupCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      videoRef.current.srcObject = stream;

      // Start MediaRecorder
      mediaRecorderRef.current = new MediaRecorder(stream);
      mediaRecorderRef.current.ondataavailable = (e) => recordedChunks.current.push(e.data);
      mediaRecorderRef.current.start();

      await new Promise((resolve) => {
        videoRef.current.onloadedmetadata = () => resolve(videoRef.current.play());
      });

      console.log("Camera & recording started");
    } catch (err) {
      console.error("Camera error:", err);
    }
  };

  // Detection loop
  const detect = async () => {
    if (!videoRef.current || !detector || !objectModel) {
      requestAnimationFrame(detect);
      return;
    }

    try {
      const faces = await detector.estimateFaces(videoRef.current);

      // ---- No face >10s ----
      if (faces.length === 0) {
        noFaceTimer.current += 1000 / 60;
        if (noFaceTimer.current > 10000) {
          logEvent("Focus Lost", "No face detected >10s");
          noFaceTimer.current = 0;
        }
        lookingAwayTimer.current += 1000 / 60;
      } else {
        noFaceTimer.current = 0;

        // ---- Looking away >5s ----
        const faceLookingAway = faces.some((face) => {
          const nose = face.keypoints.find((kp) => kp.name === "noseTip");
          if (!nose) return false;
          const deviation = Math.abs(nose.x - videoRef.current.videoWidth / 2);
          return deviation > videoRef.current.videoWidth * 0.2;
        });

        if (faceLookingAway) {
          lookingAwayTimer.current += 1000 / 60;
          if (lookingAwayTimer.current > 5000) {
            logEvent("Focus Warning", "User looking away >5s");
            lookingAwayTimer.current = 0;
          }
        } else {
          lookingAwayTimer.current = 0;
        }
      }

      if (faces.length > 1) logEvent("Focus Warning", "Multiple faces detected");

      // ---- Object Detection ----
      const objects = await objectModel.detect(videoRef.current);
      objects.forEach((obj) => {
        if (["cell phone", "book", "laptop", "tablet"].includes(obj.class)) {
          logEvent("Suspicious Item", obj.class);
        }
      });
    } catch (err) {
      console.error("Detection error:", err);
    }

    requestAnimationFrame(detect);
  };

  useEffect(() => {
    const init = async () => {
      await startSession();
      await setupCamera();
      await loadModels();
      requestAnimationFrame(detect);
    };

    init();

    window.addEventListener("beforeunload", endSession);
    return () => window.removeEventListener("beforeunload", endSession);
  }, []);

  return (
    <div>
      <h2>Candidate Page</h2>
      <video ref={videoRef} width="640" height="480" autoPlay playsInline muted />
      <button onClick={endSession}>End Session</button>
    </div>
  );
};

export default Candidate;




// ////good code-------------------
// // frontend/src/components/Candidate.jsx
// import React, { useEffect, useRef, useState } from "react";
// import axios from "axios";

// import * as faceLandmarksDetection from "@tensorflow-models/face-landmarks-detection";
// import * as cocoSsd from "@tensorflow-models/coco-ssd";
// import * as tf from "@tensorflow/tfjs";

// const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

// const Candidate = () => {
//   const videoRef = useRef(null);
//   const [sessionId, setSessionId] = useState(null);
//   const [detector, setDetector] = useState(null);
//   const [objectModel, setObjectModel] = useState(null);
//   const [events, setEvents] = useState([]);

//   // Start session
//   const startSession = async () => {
//     try {
//       const res = await axios.post(`${API_URL}/api/sessions/start`, { candidate: "test-user" });
//       setSessionId(res.data._id);
//       console.log("Session started:", res.data);
//     } catch (err) {
//       console.error("API error:", err.message);
//     }
//   };

//   // End session
//   const endSession = async () => {
//     if (!sessionId) return;
//     try {
//       await axios.patch(`${API_URL}/api/sessions/${sessionId}/end`);
//       console.log("Session ended");
//       setSessionId(null);
//     } catch (err) {
//       console.error("Error ending session:", err.message);
//     }
//   };

//   // Log events (keep only last 2)
//   const logEvent = async (type, details) => {
//     const event = { type, details, timestamp: new Date() };
//     setEvents((prev) => [...prev.slice(-1), event]); // last 2 events
//     if (!sessionId) return;
//     try {
//       await axios.patch(`${API_URL}/api/sessions/${sessionId}/event`, event);
//     } catch (err) {
//       console.error("Error logging event:", err.message);
//     }
//   };

//   // Load models
//   const loadModels = async () => {
//     try {
//       await tf.setBackend("webgl");
//       const faceDetector = await faceLandmarksDetection.createDetector(
//         faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh,
//         { runtime: "tfjs" }
//       );
//       setDetector(faceDetector);

//       const objModel = await cocoSsd.load();
//       setObjectModel(objModel);

//       console.log("Models loaded successfully");
//     } catch (err) {
//       console.error("Error loading models:", err);
//     }
//   };

//   // Setup camera
//   const setupCamera = async () => {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({ video: true });
//       videoRef.current.srcObject = stream;

//       // Ensure video metadata loaded before playing
//       await new Promise((resolve) => {
//         videoRef.current.onloadedmetadata = () => resolve(videoRef.current.play());
//       });

//       console.log("Camera started successfully");
//     } catch (err) {
//       console.error("Camera play interrupted, ignoring.", err);
//     }
//   };

//   // Detection loop
//   const detect = async () => {
//     if (
//       videoRef.current &&
//       videoRef.current.videoWidth > 0 &&
//       videoRef.current.videoHeight > 0 &&
//       detector &&
//       objectModel
//     ) {
//       try {
//         const faces = await detector.estimateFaces(videoRef.current);

//         // Focus detection
//         if (faces.length === 0) logEvent("Focus Lost", "No face detected");
//         if (faces.length > 1) logEvent("Focus Warning", "Multiple faces detected");

//         // Object detection
//         const objects = await objectModel.detect(videoRef.current);
//         objects.forEach((obj) => {
//           if (["cell phone", "book", "laptop", "tablet"].includes(obj.class)) {
//             logEvent("Suspicious Item", obj.class);
//           }
//         });
//       } catch (err) {
//         console.error("Detection error:", err);
//       }
//     }
//     requestAnimationFrame(detect);
//   };

//   useEffect(() => {
//     const init = async () => {
//       await startSession();
//       await setupCamera();
//       await loadModels();
//       requestAnimationFrame(detect);
//     };

//     init();

//     const handleUnload = () => endSession();
//     window.addEventListener("beforeunload", handleUnload);
//     return () => window.removeEventListener("beforeunload", handleUnload);
//   }, []);

//   return (
//     <div>
//       <h2>Candidate Page</h2>
//       <video ref={videoRef} width="640" height="480" autoPlay playsInline muted />
//       {sessionId && <p>Session ID: {sessionId}</p>}
//       <button onClick={endSession}>End Session</button>

      
//     </div>
//   );
// };

// export default Candidate;


