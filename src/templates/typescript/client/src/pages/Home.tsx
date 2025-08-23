import React, { useState } from "react";
import axios from "axios";
import { API_URL } from "../constants";

const Home: React.FC = () => {
  const [status, setStatus] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const checkBackend = async (): Promise<void> => {
    setLoading(true);
    setStatus("");
    try {
      const res = await axios.get<{ message: string }>(`${API_URL}/api/v1/health`);
      setStatus(res.data.message);
    } catch (err) {
      setStatus("Could not connect to backend.");
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full text-center">
        <h1 className="text-3xl font-bold mb-2 text-blue-600">
          Welcome to your MERN App 🚀
        </h1>
        <p className="mb-4 text-gray-700">
          This project uses{" "}
          <span className="font-semibold text-green-600">MongoDB</span>,{" "}
          <span className="font-semibold text-blue-700">Express</span>,{" "}
          <span className="font-semibold text-cyan-600">React</span>, and{" "}
          <span className="font-semibold text-yellow-600">Node.js</span>.
          <br />
          <span className="text-sm text-gray-500">
            Full-stack, ready for production!
          </span>
        </p>
        <button
          onClick={checkBackend}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition mb-4"
          disabled={loading}
        >
          {loading ? "Checking..." : "Check Backend Status"}
        </button>
        {status && (
          <div className="mt-2 text-lg font-medium text-green-700">
            {status}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
