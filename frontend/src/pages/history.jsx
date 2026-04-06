import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function HistoryPage() {
  const [data, setData] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [filter, setFilter] = useState('all');
  const [selectedItem, setSelectedItem] = useState(null);

  const filterData = filter === 'all' ? data : data.filter((item) => item.type === filter);

  const deletSingle = async (id) => {
    try {
      await axios.delete(`http://localhost:3003/data/${id}`);
      fetch_data();
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };

  const deleteData = async () => {
    try {
      await axios.delete('http://localhost:3003/data');
      fetch_data();
      setShowConfirm(false);
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };

  const fetch_data = async () => {
    try {
      const response = await fetch('http://localhost:3003/data', {
        method: 'GET',
      });
      const data_receivced = await response.json();
      setData(data_receivced.data || []);
    } catch (error) {
      console.error('Fetch failed:', error);
    }
  };

  useEffect(() => {
    fetch_data();
  }, []);

  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-emerald-900 to-teal-950 text-white p-6">
      <div className="flex justify-between items-center mb-10">
        <h1 onClick={() => navigate('/')} className="text-2xl font-bold cursor-pointer">
          🌐 Dashboard
        </h1>

        <button
          onClick={() => navigate('/')}
          className="bg-white/10 px-4 py-2 rounded-lg hover:bg-white/20 transition"
        >
          ⬅ Back
        </button>
      </div>

      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h2 className="text-4xl font-extrabold mb-3">📜 History Service</h2>
          <p className="text-gray-300">View saved weather requests and AI-generated results.</p>
        </div>

        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-white/10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h3 className="text-2xl font-bold">Saved Activity</h3>
              <p className="text-gray-300 text-sm">Browse your saved text and image results.</p>
            </div>

            <div className="flex gap-3">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="bg-white/10 px-4 py-2 rounded-xl text-white"
              >
                <option value="all" className="text-black">
                  All
                </option>
                <option value="text" className="text-black">
                  Text
                </option>
                <option value="image" className="text-black">
                  Image
                </option>
              </select>

              <button
                onClick={() => setShowConfirm(true)}
                disabled={data.length === 0}
                className={`px-4 py-2 rounded-xl transition ${
                  data.length === 0
                    ? 'bg-gray-500/30 cursor-not-allowed'
                    : 'bg-red-500/80 hover:bg-red-500'
                }`}
              >
                Clear All
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {filterData.map((item) => (
              <div
                key={item._id}
                className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/10 transition"
              >
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="inline-block text-xs px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-200 mb-3">
                      {item.type}
                    </div>

                    <h4 className="text-xl font-semibold mb-2">{item.title}</h4>

                    {item.type === 'image' ? (
                      <div className="space-y-3">
                        <img
                          src={item.result}
                          alt={item.title}
                          className="w-full max-w-sm h-52 object-cover rounded-xl border border-white/10"
                        />
                        <p className="text-sm text-gray-300 break-all">{item.result}</p>
                      </div>
                    ) : (
                      <p className="text-gray-300 leading-7 line-clamp-3">{item.result}</p>
                    )}
                  </div>

                  <div className="md:text-right">
                    <p className="text-sm text-gray-400 mb-3">
                      {item.createdAt ? new Date(item.createdAt).toLocaleString() : 'No date'}
                    </p>

                    <div className="flex md:justify-end gap-2">
                      <button
                        onClick={() => setSelectedItem(item)}
                        className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg transition"
                      >
                        View
                      </button>

                      <button
                        onClick={() => deletSingle(item._id)}
                        className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg transition"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {data.length === 0 && (
            <div className="text-center text-gray-400 py-16">No history found.</div>
          )}
        </div>
      </div>

      {showConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-slate-900 rounded-2xl p-6 w-[350px] shadow-2xl border border-white/10">
            <h3 className="text-xl font-bold mb-3 text-white">⚠️ Confirm Delete</h3>

            <p className="text-gray-300 mb-6">
              Are you sure you want to delete all history? This action cannot be undone.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition"
              >
                Cancel
              </button>

              <button
                onClick={deleteData}
                className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedItem && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 rounded-2xl p-6 w-full max-w-3xl shadow-2xl border border-white/10 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between gap-4 mb-6">
              <div>
                <div className="inline-block text-xs px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-200 mb-3">
                  {selectedItem.type}
                </div>
                <h3 className="text-2xl font-bold">{selectedItem.title}</h3>
                <p className="text-sm text-gray-400 mt-2">
                  {selectedItem.createdAt
                    ? new Date(selectedItem.createdAt).toLocaleString()
                    : 'No date'}
                </p>
              </div>

              <button
                onClick={() => setSelectedItem(null)}
                className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition"
              >
                ✕
              </button>
            </div>

            <div className="space-y-6">
              {selectedItem.prompt && (
                <div>
                  <h4 className="text-lg font-semibold mb-2 text-emerald-300">Prompt</h4>
                  <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-gray-200 whitespace-pre-wrap break-words">
                    {selectedItem.prompt}
                  </div>
                </div>
              )}

              <div>
                <h4 className="text-lg font-semibold mb-2 text-emerald-300">Result</h4>

                {selectedItem.type === 'image' ? (
                  <div className="space-y-4">
                    <img
                      src={selectedItem.result}
                      alt={selectedItem.title}
                      className="w-full max-h-[500px] object-contain rounded-xl border border-white/10 bg-black/20"
                    />
                    <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-gray-300 break-all">
                      {selectedItem.result}
                    </div>
                  </div>
                ) : (
                  <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-gray-200 whitespace-pre-wrap break-words leading-7">
                    {selectedItem.result}
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={() => setSelectedItem(null)}
                className="bg-blue-500 hover:bg-blue-600 px-5 py-2 rounded-lg transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
