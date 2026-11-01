
import { useNavigate } from "react-router-dom";

function Results() {
  const navigate = useNavigate();

  const savedResult = sessionStorage.getItem("accusationResult");
  const savedMystery = sessionStorage.getItem("generatedMystery");

  const result = savedResult ? JSON.parse(savedResult) : null;
  const mystery = savedMystery ? JSON.parse(savedMystery) : null;

  const accusedSuspect = sessionStorage.getItem("accusedSuspect");

  const playAgain = () => {
    sessionStorage.removeItem("generatedMystery");
    sessionStorage.removeItem("accusationResult");
    sessionStorage.removeItem("accusedSuspect");
    sessionStorage.removeItem("mysteryDifficulty");

    navigate("/create");
  };

  if (!result) {
    return (
      <div className="min-h-screen bg-[#080b14] flex flex-col items-center justify-center px-6 text-white text-center">
        <h1 className="text-3xl font-bold">No Results Found</h1>
        <p className="mt-3 text-gray-400">
          Please complete a mystery investigation first.
        </p>
        <button
          onClick={() => navigate("/create")}
          className="mt-6 rounded-xl bg-purple-600 px-6 py-3 font-semibold hover:bg-purple-500"
        >
          Create a Mystery
        </button>
      </div>
    );
  }

  const correct = result.correct;
  const score = result.score ?? 0;

  return (
    <div className="min-h-screen bg-[#080b14] px-6 py-16 text-white">
      <div className="mx-auto max-w-3xl text-center">

        <div className="text-6xl">
          {correct ? "🏆" : "🔍"}
        </div>

        <p className="mt-6 text-sm uppercase tracking-[0.3em] text-purple-400">
          Investigation Complete
        </p>

        <h1 className="mt-4 text-4xl font-extrabold md:text-5xl">
          {correct ? "Case Solved!" : "Not Quite!"}
        </h1>

        <p className="mt-4 text-gray-400">
          {correct
            ? "Excellent detective work! You uncovered the mystery."
            : "Good attempt! Review the evidence and learn from this mystery."}
        </p>

        {mystery && (
          <p className="mt-3 text-purple-300 font-semibold">
            {mystery.title}
          </p>
        )}

        <div className="mt-10 rounded-2xl border border-purple-400/30 bg-purple-500/10 p-8">
          <p className="text-gray-400">Your Final Score</p>

          <p className="mt-3 text-6xl font-extrabold text-purple-300">
            {score}
          </p>

          <p className="mt-2 text-sm text-gray-400">Points</p>
        </div>

        <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-left">
          <h2 className="text-xl font-bold">Investigation Summary</h2>

          <div className="mt-5 space-y-4 text-gray-300">
            <p>
              Your accusation:{" "}
              <span className="font-bold text-purple-300">
                {accusedSuspect || result.accusedSuspect || "Not available"}
              </span>
            </p>

            <p>
              Actual culprit:{" "}
              <span className="font-bold text-green-400">
                {result.culprit || "Not available"}
              </span>
            </p>

            <p>
              Clues discovered:{" "}
              <span className="font-bold text-purple-300">
                {result.discoveredClues ?? 0}
              </span>
            </p>

            <p>
              Hints used:{" "}
              <span className="font-bold text-purple-300">
                {result.hintsUsed ?? 0}
              </span>
            </p>
          </div>
        </div>

        <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-left">
          <h2 className="text-xl font-bold">Case Explanation</h2>

          <p className="mt-3 leading-7 text-gray-400">
            {result.explanation || "No explanation is available for this mystery."}
          </p>
        </div>

        <button
          onClick={playAgain}
          className="mt-8 rounded-xl bg-purple-600 px-8 py-4 font-semibold transition hover:bg-purple-500"
        >
          Play Another Mystery →
        </button>

        <div>
          <button
            onClick={() => navigate("/")}
            className="mt-5 text-gray-400 transition hover:text-white"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}

export default Results;
