import { useNavigate } from "react-router-dom";

export default function HistoryPage() {
  const navigate = useNavigate();

  // temporary dummy data until backend is connected
  const historyItems = [
    {
      id: 1,
      service: "Weather",
      title: "Weather for Jeddah",
      content: "Temperature: 32°C, clear sky, humidity 58%",
      date: "2026-04-01 10:30 AM",
    },
    {
      id: 2,
      service: "GenAI",
      title: "Text Generation",
      content: "Generated a travel plan for a 3-day trip in Riyadh.",
      date: "2026-04-01 11:15 AM",
    },
    {
      id: 3,
      service: "GenAI",
      title: "Image Generation",
      content: "Generated an AI image based on a sunset city skyline prompt.",
      date: "2026-04-01 12:05 PM",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-emerald-900 to-teal-950 text-white p-6">
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

      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h2 className="text-4xl font-extrabold mb-3">📜 History Service</h2>
          <p className="text-gray-300">
            View saved weather requests and AI-generated results.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-white/10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h3 className="text-2xl font-bold">Saved Activity</h3>
              <p className="text-gray-300 text-sm">
                This page will later connect to your CRUD/history backend.
              </p>
            </div>

            <div className="flex gap-3">
              <button className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl transition">
                Filter
              </button>
              <button className="bg-red-500/80 hover:bg-red-500 px-4 py-2 rounded-xl transition">
                Clear All
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {historyItems.map((item) => (
              <div
                key={item.id}
                className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/10 transition"
              >
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div>
                    <div className="inline-block text-xs px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-200 mb-3">
                      {item.service}
                    </div>

                    <h4 className="text-xl font-semibold mb-2">{item.title}</h4>
                    <p className="text-gray-300 leading-7">{item.content}</p>
                  </div>

                  <div className="md:text-right">
                    <p className="text-sm text-gray-400 mb-3">{item.date}</p>

                    <div className="flex md:justify-end gap-2">
                      <button className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg transition">
                        View
                      </button>
                      <button className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg transition">
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {historyItems.length === 0 && (
            <div className="text-center text-gray-400 py-16">
              No history found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}