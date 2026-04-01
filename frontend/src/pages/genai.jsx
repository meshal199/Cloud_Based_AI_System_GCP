import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function GenAIPage() {
  const navigate = useNavigate();

  const [prompt, setPrompt] = useState("");
  const [type, setType] = useState("text");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setLoading(true);

    // temporary fake result until backend is connected
    setTimeout(() => {
      if (type === "text") {
        setResult(
          `Generated response for: "${prompt}". This is a sample AI output preview.`
        );
      } else {
        setResult(
          "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=80"
        );
      }
      setLoading(false);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-900 to-indigo-950 text-white p-6">
      <div className="flex justify-between items-center mb-10">
        <h1
          onClick={() => navigate("/")}
          className="text-2xl font-bold cursor-pointer"
        >
          🌐 Dashboard
        </h1>

        <button
          onClick={() => navigate("/")}
          className="bg-white/10 px-4 py-2 rounded-lg hover:bg-white/20 transition"
        >
          ⬅ Back
        </button>
      </div>

      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-8 items-start">
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/10">
          <div className="mb-8">
            <h2 className="text-4xl font-extrabold mb-3">🤖 GenAI Service</h2>
            <p className="text-gray-300">
              Enter a prompt and preview AI-generated content.
            </p>
          </div>

          <div className="mb-6">
            <label className="block mb-2 text-sm text-gray-300">
              Generation Type
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setType("text")}
                className={`py-3 rounded-xl font-medium transition ${
                  type === "text"
                    ? "bg-purple-500 text-white"
                    : "bg-white/10 hover:bg-white/20"
                }`}
              >
                Text Output
              </button>

              <button
                onClick={() => setType("image")}
                className={`py-3 rounded-xl font-medium transition ${
                  type === "image"
                    ? "bg-pink-500 text-white"
                    : "bg-white/10 hover:bg-white/20"
                }`}
              >
                Image Output
              </button>
            </div>
          </div>

          <div className="mb-6">
            <label className="block mb-2 text-sm text-gray-300">Prompt</label>
            <textarea
              rows="7"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe what you want the AI to generate..."
              className="w-full rounded-2xl bg-white/10 border border-white/20 px-4 py-4 outline-none resize-none placeholder:text-gray-400"
            />
          </div>

          <button
            onClick={handleGenerate}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 font-semibold hover:scale-[1.01] transition"
          >
            {loading ? "Generating..." : "Generate"}
          </button>
        </div>

        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/10 min-h-[520px]">
          <h3 className="text-2xl font-bold mb-4">✨ Result Preview</h3>
          <p className="text-gray-300 mb-6">
            This section will show the generated result from your AI service.
          </p>

          {!result && !loading && (
            <div className="h-[360px] rounded-2xl border border-dashed border-white/20 flex items-center justify-center text-gray-400 text-center px-6">
              Your generated output will appear here.
            </div>
          )}

          {loading && (
            <div className="h-[360px] rounded-2xl bg-white/5 flex items-center justify-center text-lg text-gray-300 animate-pulse">
              Generating content...
            </div>
          )}

          {!loading && result && type === "text" && (
            <div className="rounded-2xl bg-white/5 border border-white/10 p-6 text-gray-100 leading-7">
              {result}
            </div>
          )}

          {!loading && result && type === "image" && (
            <div className="rounded-2xl overflow-hidden border border-white/10 bg-white/5">
              <img
                src={result}
                alt="Generated preview"
                className="w-full h-[360px] object-cover"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}