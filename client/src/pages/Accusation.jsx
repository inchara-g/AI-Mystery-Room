
import { useState } from "react";

function Accusation() {
  const savedMystery = sessionStorage.getItem("generatedMystery");
  const mystery = savedMystery ? JSON.parse(savedMystery) : null;

  const [selectedSuspect, setSelectedSuspect] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

 const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
  if (!mystery) {
    return (
      <div className="min-h-screen bg-[#080b14] p-8 text-center text-white">
        <h1 className="text-2xl font-bold">No Mystery Found</h1>
        <p className="mt-3 text-gray-400">
          Please generate a new mystery first.
        </p>

        <button
          onClick={() => (window.location.href = "/create")}
          className="mt-6 rounded-xl bg-purple-600 px-6 py-3"
        >
          Create Mystery
        </button>
      </div>
    );
  }

  async function submitAccusation() {
    if (!selectedSuspect) {
      setError("Please select a suspect first.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${API_URL}/api/mysteries/${mystery.caseId}/accuse`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            suspectName: selectedSuspect,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Could not submit accusation.");
      }

      // Save the actual backend result
      sessionStorage.setItem(
        "accusationResult",
        JSON.stringify(data)
      );

      sessionStorage.setItem("accusedSuspect", selectedSuspect);

      window.location.href = "/results";
    } catch (err) {
      console.error("Accusation error:", err);
      setError(err.message || "Something went wrong.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#080b14] px-6 py-12 text-white">
      <div className="mx-auto max-w-3xl">

        <button
          onClick={() => (window.location.href = "/investigation")}
          className="mb-8 text-gray-400 hover:text-white"
        >
          ← Back to Investigation
        </button>

        <div className="rounded-2xl border border-purple-400/20 bg-purple-500/10 p-8">

          <p className="text-sm uppercase tracking-[0.3em] text-purple-300">
            Final Decision
          </p>

          <h1 className="mt-3 text-3xl font-extrabold">
            Make Your Accusation
          </h1>

          <p className="mt-4 text-gray-300">
            Who do you believe is responsible for
            <span className="font-semibold text-purple-300">
              {" "}{mystery.title}
            </span>?
            Choose one suspect based on the evidence you discovered.
          </p>

          {/* Dynamic Suspects */}
          <div className="mt-8 space-y-4">
            {mystery.suspects.map((suspect, index) => (
              <button
                key={suspect.name}
                onClick={() => setSelectedSuspect(suspect.name)}
                disabled={loading}
                className={`w-full rounded-xl border p-5 text-left transition ${
                  selectedSuspect === suspect.name
                    ? "border-purple-400 bg-purple-500/20"
                    : "border-white/10 bg-white/[0.03] hover:border-purple-400/50"
                }`}
              >
                <span className="flex items-center justify-between gap-3">
                  <span>
                    <span className="block font-semibold">
                      {index + 1}. {suspect.name}
                    </span>

                    <span className="mt-1 block text-sm text-purple-300">
                      {suspect.role}
                    </span>
                  </span>

                  <span className="text-sm text-purple-300">
                    {selectedSuspect === suspect.name
                      ? "✓ Selected"
                      : "Select"}
                  </span>
                </span>
              </button>
            ))}
          </div>

          {/* Error Message */}
          {error && (
            <div className="mt-5 rounded-xl border border-red-400/30 bg-red-500/10 p-4 text-red-300">
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            onClick={submitAccusation}
            disabled={loading || !selectedSuspect}
            className="mt-8 w-full rounded-xl bg-purple-600 px-8 py-4 font-semibold transition hover:bg-purple-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading
              ? "Checking Your Accusation..."
              : "Submit Final Accusation →"}
          </button>

        </div>
      </div>
    </div>
  );
}

export default Accusation;
