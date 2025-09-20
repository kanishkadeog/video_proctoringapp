// frontend/src/components/Report.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const Report = () => {
  const [reports, setReports] = useState([]);

  const fetchReports = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/reports`);
      setReports(res.data);
    } catch (err) {
      console.error("Error fetching reports:", err);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  return (
    <div>
      <h2>Proctoring Reports</h2>
      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>Candidate</th>
            <th>Duration</th>
            <th>Focus Lost</th>
            <th>Multiple Faces</th>
            <th>Suspicious Items</th>
            <th>Integrity Score</th>
            <th>Video</th>
          </tr>
        </thead>
        <tbody>
          {reports.map((r) => (
            <tr key={r._id}>
              <td>{r.candidateName}</td>
              <td>
                {r.durationSeconds
                  ? `${r.durationSeconds} sec`
                  : r.startedAt && r.endedAt
                  ? Math.round((new Date(r.endedAt) - new Date(r.startedAt)) / 1000) + " sec"
                  : "Ongoing"}
              </td>
              <td>{r.lostFocusCount || r.events?.filter(e => e.type.includes("Focus")).length || 0}</td>
              <td>{r.multipleFaceCount || r.events?.filter(e => e.type.includes("Multiple Faces")).length || 0}</td>
              <td>{r.suspiciousEvents?.length || r.events?.filter(e => e.type.includes("Suspicious")).length || 0}</td>
              <td>{r.integrityScore !== undefined ? r.integrityScore : 100 - (r.events?.length || 0)}</td>
              <td>
                {r.videoPath ? (
                  <a href={`${API_URL}${r.videoPath}`} target="_blank" rel="noreferrer">View</a>
                ) : "N/A"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Report;




// // frontend/src/components/Report.jsx
// import React, { useEffect, useState } from "react";
// import axios from "axios";

// const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

// const Report = () => {
//   const [sessions, setSessions] = useState([]);

//   const fetchReports = async () => {
//     try {
//       const res = await axios.get(`${API_URL}/api/reports`);
//       setSessions(res.data.slice(-2)); // last 2 sessions only
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   useEffect(() => {
//     fetchReports();
//   }, []);

//   return (
//     <div>
//       <h2>Proctoring Reports</h2>
//       <table border="1" cellPadding="8">
//         <thead>
//           <tr>
//             <th>Candidate</th>
//             <th>Duration</th>
//             <th>Focus Lost</th>
//             <th>Suspicious Events</th>
//             <th>Integrity Score</th>
//           </tr>
//         </thead>
//         <tbody>
//           {sessions.map((s) => (
//             <tr key={s._id}>
//               <td>{s.candidate}</td>
//               <td>
//                 {s.startedAt && s.endedAt
//                   ? `${Math.round((new Date(s.endedAt) - new Date(s.startedAt)) / 1000)} sec`
//                   : "Ongoing"}
//               </td>
//               <td>{s.events.filter((e) => e.type.includes("Focus")).length}</td>
//               <td>{s.events.filter((e) => e.type.includes("Suspicious") || e.type.includes("Drowsiness")).length}</td>
//               <td>{100 - (s.events.length || 0)}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default Report;

