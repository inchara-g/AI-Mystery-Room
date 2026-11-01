
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CreateMystery from "./pages/CreateMystery";
import InvestigationRoom from "./pages/InvestigationRoom";
import Results from "./pages/Results";
import Accusation from "./pages/Accusation";
function Home() {
  return (
    <div className="min-h-screen bg-[#080b14] text-white">
      <nav className="flex items-center justify-between border-b border-white/10 px-8 py-5">
        <h1 className="text-2xl font-bold tracking-wide">
          <span className="text-purple-400">✦</span> MYSTERY ROOM
        </h1>

        <span className="rounded-full border border-purple-400/30 px-4 py-2 text-sm text-purple-300">
          AI Investigation System
        </span>
      </nav>

      <main className="mx-auto flex max-w-6xl flex-col items-center px-6 py-24 text-center">
        <p className="mb-6 rounded-full border border-purple-400/30 bg-purple-400/10 px-5 py-2 text-sm text-purple-300">
          ✧ EVERY CLUE HAS A SECRET ✧
        </p>

        <h2 className="max-w-4xl text-5xl font-extrabold leading-tight md:text-7xl">
          Every Mystery Has
          <span className="block text-purple-400">A Hidden Truth.</span>
        </h2>

        <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-400">
          Enter a world of secrets, suspicious characters, and hidden clues.
          Use your detective skills and AI-powered hints to uncover the truth.
        </p>

        <button
          onClick={() => (window.location.href = "/create")}
          className="mt-10 rounded-xl bg-purple-600 px-8 py-4 text-lg font-semibold shadow-lg shadow-purple-900/40 transition hover:bg-purple-500"
        >
          Create Your Mystery →
        </button>

        <p className="mt-4 text-sm text-gray-500">
          Choose your difficulty. Investigate the evidence. Find the culprit.
        </p>

        <div className="mt-20 grid w-full gap-6 text-left md:grid-cols-3">
          {[
            {
              icon: "🔎",
              title: "Investigate Clues",
              text: "Examine evidence, connect details, and uncover hidden secrets.",
            },
            {
              icon: "🕵️",
              title: "Question Suspects",
              text: "Explore suspect profiles and discover who might be hiding the truth.",
            },
            {
              icon: "🧠",
              title: "Solve the Mystery",
              text: "Use logic, request hints, and make your final accusation.",
            },
          ].map((feature) => (
            <div
              key={feature.title}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-7 transition hover:border-purple-400/50"
            >
              <div className="mb-5 text-3xl">{feature.icon}</div>
              <h3 className="text-xl font-bold">{feature.title}</h3>
              <p className="mt-3 leading-7 text-gray-400">{feature.text}</p>
            </div>
          ))}
        </div>
      </main>

      <footer className="border-t border-white/10 px-6 py-6 text-center text-sm text-gray-500">
        AI MYSTERY ROOM · Every secret leaves a clue.
      </footer>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
   <Routes>
  <Route path="/" element={<Home />} />
  <Route path="/create" element={<CreateMystery />} />
  <Route path="/investigation" element={<InvestigationRoom />} />
  <Route path="/accusation" element={<Accusation />} />
  <Route path="/results" element={<Results />} />
</Routes>
    </BrowserRouter>
  );
}

export default App;
