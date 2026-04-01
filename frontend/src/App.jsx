import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import WeatherPage from "./pages/weather";
import GenAIPage from "./pages/genai";
import HistoryPage from "./pages/history";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/weather" element={<WeatherPage />} />
        <Route path="/genai" element={<GenAIPage />} />
        <Route path="/history" element={<HistoryPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;