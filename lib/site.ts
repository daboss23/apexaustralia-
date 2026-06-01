// Central content + config for the T-APEX Australia experience.

export const HERO_METRICS = [
  { label: "SPEED", value: "11.2", unit: "m/s", pos: { top: "18%", left: "8%" } },
  { label: "FORCE", value: "842", unit: "N", pos: { top: "30%", right: "7%" } },
  { label: "POWER", value: "1.94", unit: "kW", pos: { top: "62%", left: "6%" } },
  { label: "ACCEL", value: "9.6", unit: "m/s²", pos: { bottom: "16%", right: "10%" } },
  { label: "RESISTANCE", value: "32", unit: "kgf", pos: { top: "46%", left: "46%" } },
];

export const WORK_STEPS = [
  {
    no: "01",
    title: "Athlete Connects Device",
    body: "Tether in seconds. T-APEX locks to the athlete and zeroes itself against their mass and stance.",
  },
  {
    no: "02",
    title: "AI Calibrates Resistance",
    body: "The intelligence engine reads the first movements and tunes load profiles to the session objective.",
  },
  {
    no: "03",
    title: "Real-Time Data Collection",
    body: "Speed, force, power and movement quality stream off the unit at high frequency — every rep, every stride.",
  },
  {
    no: "04",
    title: "Instant Performance Feedback",
    body: "Live telemetry surfaces on the dashboard so coaches adjust load and timing mid-session.",
  },
  {
    no: "05",
    title: "Progress Tracking",
    body: "Single, comparative and trending reports build a measurable athlete profile over time.",
  },
];

export const PRODUCT_HOTSPOTS = [
  { id: "motor", title: "Motor System", body: "High-torque Quasi Direct Drive — instant, precise force delivery." },
  { id: "engine", title: "Resistance Engine", body: "Programmable load, electronically controlled to a fraction of a kgf." },
  { id: "sensors", title: "Sensor Array", body: "Captures speed, force, distance and movement quality in real time." },
  { id: "ai", title: "AI Software", body: "Calibration, telemetry and adaptive progression intelligence." },
  { id: "battery", title: "Battery System", body: "Detachable power for untethered, fly-anywhere training." },
];

export const DASH_METRICS = [
  { k: "Top Speed", v: "11.24", u: "m/s", d: "+0.3" },
  { k: "Peak Force", v: "842", u: "N", d: "+18" },
  { k: "Power", v: "1.94", u: "kW", d: "+0.11" },
  { k: "Symmetry", v: "98.2", u: "%", d: "+1.4" },
];

// Each sport swaps its own KPIs / readouts in the selector.
export type Sport = {
  id: string;
  name: string;
  line: string;
  kpis: { k: string; v: string; u: string }[];
};

export const SPORTS: Sport[] = [
  {
    id: "sprint",
    name: "Sprint",
    line: "Explosive acceleration and top-end speed, measured stride by stride.",
    kpis: [
      { k: "Acceleration", v: "9.6", u: "m/s²" },
      { k: "Top Speed", v: "11.2", u: "m/s" },
      { k: "Ground Contact", v: "0.089", u: "s" },
    ],
  },
  {
    id: "afl",
    name: "AFL",
    line: "Two-way running power and repeat efforts across the ground.",
    kpis: [
      { k: "Acceleration", v: "8.9", u: "m/s²" },
      { k: "Repeat Sprint", v: "94", u: "%" },
      { k: "Explosive Power", v: "1.8", u: "kW" },
    ],
  },
  {
    id: "rugby",
    name: "Rugby",
    line: "Collision-ready force and acceleration off the mark.",
    kpis: [
      { k: "Collision Force", v: "1240", u: "N" },
      { k: "Leg Drive", v: "38", u: "kgf" },
      { k: "Acceleration", v: "8.4", u: "m/s²" },
    ],
  },
  {
    id: "swimming",
    name: "Swimming",
    line: "Dryland and in-water power that transfers to the pool.",
    kpis: [
      { k: "Stroke Power", v: "612", u: "W" },
      { k: "Pull Force", v: "284", u: "N" },
      { k: "Efficiency", v: "91", u: "%" },
    ],
  },
  {
    id: "cricket",
    name: "Cricket",
    line: "Fast-bowling velocity and explosive fielding power.",
    kpis: [
      { k: "Bowling Velocity", v: "142", u: "km/h" },
      { k: "Explosive Power", v: "1.6", u: "kW" },
      { k: "Throw Force", v: "520", u: "N" },
    ],
  },
  {
    id: "strength",
    name: "Strength Training",
    line: "Eccentric, tempo and overload progressions with exact load.",
    kpis: [
      { k: "Peak Force", v: "2180", u: "N" },
      { k: "Eccentric Load", v: "42", u: "kgf" },
      { k: "Power Output", v: "2.4", u: "kW" },
    ],
  },
];

export const AU_SPORTS = [
  { name: "AFL", code: "AFL", line: "Two-way running power & repeat efforts." },
  { name: "Rugby League", code: "NRL", line: "Collision force and acceleration off the mark." },
  { name: "Rugby Union", code: "RU", line: "Scrum drive, breakdown power and pace." },
  { name: "Cricket", code: "CRK", line: "Fast-bowling velocity and explosive fielding." },
  { name: "Swimming", code: "SWM", line: "Dryland power that transfers to the pool." },
  { name: "Track & Field", code: "T&F", line: "Sprint, jump and throw — measured precisely." },
];

export const PROOF = [
  { quote: "It's the first system that lets me coach the rep I can actually see.", who: "High-Performance Coach", tag: "Olympic Pathway" },
  { quote: "Resisted to assisted in one unit, with data I trust. Nothing else compares.", who: "Strength & Conditioning Lead", tag: "National Program" },
  { quote: "Return-to-play decisions backed by symmetry data, not feel.", who: "Sports Physiotherapist", tag: "Pro Club" },
];

export const NAV_LINKS = [
  { href: "#technology", label: "Technology" },
  { href: "#how", label: "How It Works" },
  { href: "#product", label: "Product" },
  { href: "#dashboard", label: "Dashboard" },
  { href: "#australia", label: "Australia" },
];
