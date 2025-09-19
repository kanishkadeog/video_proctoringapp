// scoreCalculator.js
function calculateIntegrityScore(base = 100, events = []) {
  // Simple deduction rules (customize as you like)
  let score = base;
  events.forEach((ev) => {
    if (ev.includes("No face")) score -= 8;
    if (ev.includes("Looking away")) score -= 5;
    if (ev.includes("Multiple faces")) score -= 15;
    if (ev.includes("Phone detected")) score -= 20;
    if (ev.includes("Book detected") || ev.includes("Notes detected")) score -= 10;
    if (ev.includes("Drowsy")) score -= 10;
  });
  if (score < 0) score = 0;
  return Math.round(score);
}

module.exports = { calculateIntegrityScore };
