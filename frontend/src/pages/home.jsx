import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-900 to-purple-900 text-white">

      {/* Navbar */}
      <div className="flex justify-between items-center px-8 py-6">
        <h1 className="text-2xl font-bold">🌐 Cloud AI Platform</h1>
        <div className="space-x-6">
          <button onClick={() => navigate("/weather")} className="hover:text-blue-400">Weather</button>
          <button onClick={() => navigate("/genai")} className="hover:text-purple-400">GenAI</button>
          <button onClick={() => navigate("/history")} className="hover:text-green-400">History</button>
        </div>
      </div>

      {/* Hero */}
      <div className="text-center mt-20">
        <h2 className="text-5xl font-extrabold mb-4">
          Smart Cloud Services Dashboard
        </h2>
        <p className="text-gray-300 text-lg">
          Weather • AI Generation • Data History
        </p>
      </div>

      {/* Cards */}
      <div className="grid md:grid-cols-3 gap-8 px-12 mt-20">

        {/* Weather */}
        <div className="bg-white/10 backdrop-blur-xl p-6 rounded-2xl shadow-xl hover:scale-105 transition">
          <h3 className="text-xl font-semibold mb-3">🌤 Weather</h3>
          <p className="text-gray-300 mb-4">
            Check real-time weather for any city.
          </p>
          <button
            onClick={() => navigate("/weather")}
            className="bg-blue-500 hover:bg-blue-600 w-full py-2 rounded-lg"
          >
            Open
          </button>
        </div>

        {/* GenAI */}
        <div className="bg-white/10 backdrop-blur-xl p-6 rounded-2xl shadow-xl hover:scale-105 transition">
          <h3 className="text-xl font-semibold mb-3">🤖 GenAI</h3>
          <p className="text-gray-300 mb-4">
            Generate content using AI prompts.
          </p>
          <button
            onClick={() => navigate("/genai")}
            className="bg-purple-500 hover:bg-purple-600 w-full py-2 rounded-lg"
          >
            Open
          </button>
        </div>

        {/* History */}
        <div className="bg-white/10 backdrop-blur-xl p-6 rounded-2xl shadow-xl hover:scale-105 transition">
          <h3 className="text-xl font-semibold mb-3">📜 History</h3>
          <p className="text-gray-300 mb-4">
            View saved prompts and results.
          </p>
          <button
            onClick={() => navigate("/history")}
            className="bg-green-500 hover:bg-green-600 w-full py-2 rounded-lg"
          >
            Open
          </button>
        </div>

      </div>
    </div>
  );
}