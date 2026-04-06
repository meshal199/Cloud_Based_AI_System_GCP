import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios'
export default function GenAIPage() {
  const navigate = useNavigate();

  const [prompt, setPrompt] = useState("");
  const [type, setType] = useState("text");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [savedMessage, setSavedMessage] = useState("");
  const [lastPrompt, setLastPrompt] = useState("");
  const [saving, setSaving] = useState(false);

const handleGenerate = async () => {
  if (!prompt.trim()) return;

  setLoading(true);
  setError("");
  setSavedMessage("");
  setResult("");

  try {
    // IMAGE
    if (type === "image") {
      const { data } = await axios.post(
        "http://localhost:3002/api/genai/generateImage",
        { prompt }
      );

      if (!data.success) {
        throw new Error(data.message || "Image generation failed");
      }

      setResult(data.result);
      setLastPrompt(prompt);
      
      setPrompt("");
      return;
    }

    // TEXT
    const { data } = await axios.post(
      "http://localhost:3002/api/genai/generatetext",
      { prompt }
    );

    if (!data.success) {
      throw new Error(data.message || "Generation failed");
    }

    setResult(data.result);
    setLastPrompt(prompt);
    setPrompt("");
  } catch (err) {
    setError(err.response?.data?.message || err.message);
  } finally {
    setLoading(false);
  }
};

  const handleSaveResult = async () => {
    if (!result) return;

    setSaving(true);
    setSavedMessage("");
    setError("");

    try {
      const response = await axios.post("http://localhost:3003/save", { lastPrompt, result,type })
      console.log(response)
      console.log(lastPrompt, result, type)
      
      setSavedMessage("Result saved successfully.");
    } catch (err) {
      setError(err.message || "Failed to save result.");
    } finally {
      setSaving(false);
    }
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

          {error && (
            <div className="mb-4 rounded-2xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-red-200">
              {error}
            </div>
          )}

          {savedMessage && (
            <div className="mb-4 rounded-2xl border border-green-400/30 bg-green-500/10 px-4 py-3 text-green-200">
              {savedMessage}
            </div>
          )}

          <button
            onClick={handleGenerate}
            disabled={!prompt.trim() || loading}
            className={`w-full py-3 rounded-2xl font-semibold transition ${
              !prompt.trim() || loading
                ? "bg-gray-500/40 cursor-not-allowed"
                : "bg-gradient-to-r from-purple-500 to-pink-500 hover:scale-[1.01]"
            }`}
          >
            {loading ? "Generating..." : "Generate"}
          </button>
        </div>

        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/10 min-h-[520px]">
          <h3 className="text-2xl font-bold mb-4">✨ Result Preview</h3>
          <p className="text-gray-300 mb-6">
            This section will show the generated result from your AI service.
          </p>

          {!result && !loading && !error && (
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
            <div className="space-y-4">
              <div className="rounded-2xl bg-white/5 border border-white/10 p-6 text-gray-100 leading-7 whitespace-pre-wrap">
                {result}
              </div>

              <button
                onClick={handleSaveResult}
                disabled={saving}
                className={`w-full py-3 rounded-2xl font-semibold transition ${
                  saving
                    ? "bg-gray-500/40 cursor-not-allowed"
                    : "bg-gradient-to-r from-emerald-500 to-teal-500 hover:scale-[1.01]"
                }`}
              >
                {saving ? "Saving..." : "Save Result"}
              </button>
            </div>
          )}

          {!loading && result && type === "image" && (
            <div className="space-y-4">
              <div className="rounded-2xl overflow-hidden border border-white/10 bg-white/5 flex items-center justify-center h-[360px]">
                <img
                  src={result}
                  alt="Generated preview"
                  className="max-w-full max-h-full object-contain"
                />
              </div>

              <button
                onClick={handleSaveResult}
                disabled={saving}
                className={`w-full py-3 rounded-2xl font-semibold transition ${
                  saving
                    ? "bg-gray-500/40 cursor-not-allowed"
                    : "bg-gradient-to-r from-emerald-500 to-teal-500 hover:scale-[1.01]"
                }`}
              >
                {saving ? "Saving..." : "Save Result"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}