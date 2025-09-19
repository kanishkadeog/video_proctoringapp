


////good code-------------------
// frontend/src/components/Candidate.jsx
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import * as faceLandmarksDetection from "@tensorflow-models/face-landmarks-detection";
import * as cocoSsd from "@tensorflow-models/coco-ssd";
import * as tf from "@tensorflow/tfjs";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const Candidate = () => {
  const videoRef = useRef(null);
  const [sessionId, setSessionId] = useState(null);
  const [detector, setDetector] = useState(null);
  const [objectModel, setObjectModel] = useState(null);
  const [events, setEvents] = useState([]);

  // Start session
  const startSession = async () => {
    try {
      const res = await axios.post(`${API_URL}/api/sessions/start`, { candidate: "test-user" });
      setSessionId(res.data._id);
      console.log("Session started:", res.data);
    } catch (err) {
      console.error("API error:", err.message);
    }
  };

  // End session
  const endSession = async () => {
    if (!sessionId) return;
    try {
      await axios.patch(`${API_URL}/api/sessions/${sessionId}/end`);
      console.log("Session ended");
      setSessionId(null);
    } catch (err) {
      console.error("Error ending session:", err.message);
    }
  };

  // Log events (keep only last 2)
  const logEvent = async (type, details) => {
    const event = { type, details, timestamp: new Date() };
    setEvents((prev) => [...prev.slice(-1), event]); // last 2 events
    if (!sessionId) return;
    try {
      await axios.patch(`${API_URL}/api/sessions/${sessionId}/event`, event);
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

  // Setup camera
  const setupCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;

      // Ensure video metadata loaded before playing
      await new Promise((resolve) => {
        videoRef.current.onloadedmetadata = () => resolve(videoRef.current.play());
      });

      console.log("Camera started successfully");
    } catch (err) {
      console.error("Camera play interrupted, ignoring.", err);
    }
  };

  // Detection loop
  const detect = async () => {
    if (
      videoRef.current &&
      videoRef.current.videoWidth > 0 &&
      videoRef.current.videoHeight > 0 &&
      detector &&
      objectModel
    ) {
      try {
        const faces = await detector.estimateFaces(videoRef.current);

        // Focus detection
        if (faces.length === 0) logEvent("Focus Lost", "No face detected");
        if (faces.length > 1) logEvent("Focus Warning", "Multiple faces detected");

        // Object detection
        const objects = await objectModel.detect(videoRef.current);
        objects.forEach((obj) => {
          if (["cell phone", "book", "laptop", "tablet"].includes(obj.class)) {
            logEvent("Suspicious Item", obj.class);
          }
        });
      } catch (err) {
        console.error("Detection error:", err);
      }
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

    const handleUnload = () => endSession();
    window.addEventListener("beforeunload", handleUnload);
    return () => window.removeEventListener("beforeunload", handleUnload);
  }, []);

  return (
    <div>
      <h2>Candidate Page</h2>
      <video ref={videoRef} width="640" height="480" autoPlay playsInline muted />
      {sessionId && <p>Session ID: {sessionId}</p>}
      <button onClick={endSession}>End Session</button>

      
    </div>
  );
};

export default Candidate;


