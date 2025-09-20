// frontend/src/components/Interviewer.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const Interviewer = () => {
  const [sessions, setSessions] = useState([]);

  const fetchSessions = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/reports`);
      setSessions(res.data.slice(-5)); // last 5 sessions
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  return (
    <div>
      <h2>Interviewer Dashboard</h2>
      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>Candidate</th>
            <th>Start Time</th>
            <th>End Time</th>
            <th>Focus Lost</th>
            <th>Multiple Faces</th>
            <th>Suspicious Items</th>
            <th>Integrity Score</th>
            <th>Video</th>
          </tr>
        </thead>
        <tbody>
          {sessions.map(s => (
            <tr key={s._id}>
              <td>{s.candidateName}</td>
              <td>{new Date(s.startedAt).toLocaleString()}</td>
              <td>{s.endedAt ? new Date(s.endedAt).toLocaleString() : "Ongoing"}</td>
              <td>{s.lostFocusCount || s.events?.filter(e => e.type.includes("Focus")).length || 0}</td>
              <td>{s.multipleFaceCount || s.events?.filter(e => e.type.includes("Multiple Faces")).length || 0}</td>
              <td>{s.suspiciousEvents?.length || s.events?.filter(e => e.type.includes("Suspicious")).length || 0}</td>
              <td>{s.integrityScore !== undefined ? s.integrityScore : 100 - (s.events?.length || 0)}</td>
              <td>
                {s.videoPath ? (
                  <a href={`${API_URL}${s.videoPath}`} target="_blank" rel="noreferrer">View</a>
                ) : "N/A"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Interviewer;



// // frontend/src/components/Interviewer.jsx
// import React, { useEffect, useState } from "react";
// import axios from "axios";

// const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

// const Interviewer = () => {
//   const [sessions, setSessions] = useState([]);

//   const fetchSessions = async () => {
//     try {
//       const res = await axios.get(`${API_URL}/api/reports`);
//       setSessions(res.data.slice(-2)); // only last 2 sessions
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   useEffect(() => {
//     fetchSessions();
//   }, []);

//   return (
//     <div>
//       <h2>Interviewer Dashboard</h2>
//       <table border="1" cellPadding="8">
//         <thead>
//           <tr>
//             <th>Candidate</th>
//             <th>Start Time</th>
//             <th>End Time</th>
//           </tr>
//         </thead>
//         <tbody>
//           {sessions.map((s) => (
//             <tr key={s._id}>
//               <td>{s.candidate}</td>
//               <td>{new Date(s.startedAt).toLocaleString()}</td>
//               <td>{s.endedAt ? new Date(s.endedAt).toLocaleString() : "Ongoing"}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default Interviewer;

