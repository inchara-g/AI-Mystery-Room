
import { useState } from "react";

function CreateMystery() {
  const [difficulty, setDifficulty] = useState("Easy");
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");

  const difficultyDetails = {
    Easy: { suspects: 3, clues: 5, hints: 2 },
    Medium: { suspects: 4, clues: 7, hints: 3 },
    Hard: { suspects: 5, clues: 9, hints: 3 },
  };

  async function generateMystery() {
    setGenerating(true);
    setError("");

    try {
      const response = await fetch("http://localhost:5000/api/mysteries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ difficulty }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Could not generate mystery.");
      }

      // Store the generated mystery for the investigation page.
      sessionStorage.setItem("generatedMystery", JSON.stringify(data));
      sessionStorage.setItem("mysteryDifficulty", difficulty);

      window.location.href = "/investigation";
    } catch (err) {
      console.error("Mystery generation error:", err);
      setError(err.message || "Something went wrong. Please try again.");
      setGenerating(false);
    }
  }

  const details = difficultyDetails[difficulty];

  return (
    <div className="min-h-screen bg-[#080b14] px-6 py-12 text-white">
      <div className="mx-auto max-w-3xl">
        <button
          onClick={() => (window.location.href = "/")}
          className="mb-8 text-gray-400 hover:text-white"
        >
          ← Back to Home
        </button>

        <div className="rounded-2xl border border-purple-400/20 bg-purple-500/10 p-8">
          <p className="text-sm uppercase tracking-[0.3em] text-purple-300">
            Create Your Case
          </p>

          <h1 className="mt-3 text-3xl font-extrabold">
            Choose Your Mystery
          </h1>

          <p className="mt-4 leading-7 text-gray-300">
            Select your difficulty and prepare to investigate suspects,
            uncover clues, and solve the case.
          </p>

          <h2 className="mt-8 text-xl font-bold">
            Select Difficulty
          </h2>

          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            {Object.keys(difficultyDetails).map((level) => (
              <button
                key={level}
                onClick={() => setDifficulty(level)}
                disabled={generating}
                className={`rounded-xl border p-5 text-left transition ${
                  difficulty === level
                    ? "border-purple-400 bg-purple-500/20"
                    : "border-white/10 bg-white/[0.03] hover:border-purple-400/50"
                }`}
              >
                <p className="text-lg font-bold">{level}</p>
                <p className="mt-2 text-sm text-gray-400">
                  {difficultyDetails[level].suspects} suspects
                </p>
                <p className="text-sm text-gray-400">
                  {difficultyDetails[level].clues} clues
                </p>
                <p className="text-sm text-gray-400">
                  {difficultyDetails[level].hints} hints
                </p>
              </button>
            ))}
          </div>

          <div className="mt-8 rounded-xl border border-white/10 bg-black/20 p-5">
            <h3 className="font-semibold">Your Case Settings</h3>
            <p className="mt-3 text-gray-300">
              Difficulty: {difficulty}
            </p>
            <p className="mt-2 text-gray-300">
              Suspects: {details.suspects}
            </p>
            <p className="mt-2 text-gray-300">
              Clues: {details.clues}
            </p>
            <p className="mt-2 text-gray-300">
              Available hints: {details.hints}
            </p>
          </div>

          {error && (
            <div className="mt-5 rounded-xl border border-red-400/30 bg-red-500/10 p-4 text-red-300">
              {error}
            </div>
          )}

          <button
            onClick={generateMystery}
            disabled={generating}
            className="mt-8 w-full rounded-xl bg-purple-600 px-8 py-4 font-semibold transition hover:bg-purple-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {generating ? "Generating Your Mystery..." : "Generate Mystery →"}
          </button>

          {generating && (
            <p className="mt-4 text-center text-sm text-purple-300">
              Gemini is creating your mystery. Please wait...
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default CreateMystery;
