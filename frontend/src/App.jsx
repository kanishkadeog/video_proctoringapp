import React from "react";
import Candidate from "./components/Candidate";
import Interviewer from "./components/Interviewer";
import ReportList from "./components/Report";

export default function App() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
      <div>
        <Candidate />
      </div>
      <div>
        <Interviewer />
        <hr />
        <ReportList />
      </div>
    </div>
  );
}
