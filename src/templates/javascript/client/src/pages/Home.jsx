import React, { useState } from "react";
import axios from "axios";
import { API_URL } from "@/constants";
import { 
  FaReact, 
  FaNodeJs, 
  FaDatabase, 
  FaRocket, 
  FaCheckCircle, 
  FaExclamationCircle,
  FaPlay,
  FaBolt,
  FaCode,
  FaCoffee,
  FaHeart,
  FaMagic
} from "react-icons/fa";

const Home = () => {
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const checkBackend = async () => {
    setLoading(true);
    setStatus("");
    try {
      const res = await axios.get(`${API_URL}/api/v1/health`);
      setStatus(res.data.message);
    } catch (err) {
      setStatus("Could not connect to backend.");
    }
    setLoading(false);
  };

  const features = [
    { icon: FaBolt, title: "Lightning Fast", desc: "Vite-powered development" },
    { icon: FaRocket, title: "Zero Config", desc: "Ready to code instantly" },
    { icon: FaCode, title: "Clean Imports", desc: "@ path aliases included" },
    { icon: FaDatabase, title: "MongoDB Ready", desc: "Mongoose integrated" },
    { icon: FaReact, title: "Modern React", desc: "Hooks & latest features" },
    { icon: FaMagic, title: "Production Ready", desc: "Optimized builds" }
  ];

  const techStack = [
    { name: "React 18", color: "text-cyan-400" },
    { name: "JavaScript", color: "text-yellow-400" },
    { name: "Express", color: "text-gray-300" },
    { name: "MongoDB", color: "text-emerald-400" },
    { name: "Tailwind", color: "text-cyan-400" },
    { name: "Vite", color: "text-purple-400" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-gray-900 text-white">
      {/* Header */}
      <div className="border-b border-slate-700/50 bg-slate-900/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center overflow-hidden">
                <img src="/mern.svg" alt="MERN Stack" className="w-full h-full object-contain" />
              </div>
              <div>
                <h1 className="text-lg font-bold">JavaScript MERN</h1>
                <p className="text-sm text-gray-400">Fast & Flexible</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="px-2 py-1 bg-yellow-500/20 text-yellow-300 rounded text-xs font-medium">
                JavaScript
              </span>
              <span className="px-2 py-1 bg-emerald-500/20 text-emerald-300 rounded text-xs font-medium">
                v1.0.0
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-yellow-400 via-emerald-500 to-cyan-600 bg-clip-text text-transparent">
            Build at the speed of thought
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
            Lightning-fast MERN stack with modern JavaScript, zero configuration, and instant setup.
          </p>
          
          {/* Tech Stack Pills */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {techStack.map((tech, index) => (
              <span key={index} className={`px-4 py-2 bg-slate-800/50 backdrop-blur-sm rounded-full text-sm font-medium ${tech.color} border border-slate-700/50`}>
                {tech.name}
              </span>
            ))}
          </div>

          {/* Backend Test */}
          <div className="max-w-sm mx-auto">
            <button
              onClick={checkBackend}
              className="w-full bg-gradient-to-r from-yellow-600 to-emerald-600 hover:from-yellow-700 hover:to-emerald-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 transform hover:scale-105 disabled:opacity-50 disabled:transform-none flex items-center justify-center space-x-2"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Testing...</span>
                </>
              ) : (
                <>
                  <FaPlay className="w-4 h-4" />
                  <span>Test Backend</span>
                </>
              )}
            </button>
            
            {status && (
              <div className={`mt-4 p-3 rounded-lg text-center font-medium backdrop-blur-sm ${
                status.includes("Could not") 
                  ? "bg-red-500/20 text-red-300 border border-red-500/30" 
                  : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
              }`}>
                <div className="flex items-center justify-center space-x-2">
                  {status.includes("Could not") ? (
                    <FaExclamationCircle className="w-4 h-4" />
                  ) : (
                    <FaCheckCircle className="w-4 h-4" />
                  )}
                  <span>{status}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div key={index} className="group bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50 hover:border-yellow-500/50 transition-all duration-200 hover:transform hover:scale-105">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="p-2 bg-yellow-500/20 rounded-lg group-hover:bg-yellow-500/30 transition-colors">
                    <IconComponent className="w-5 h-5 text-yellow-400" />
                  </div>
                  <h3 className="font-semibold text-lg">{feature.title}</h3>
                </div>
                <p className="text-gray-400 text-sm">{feature.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Quick Stats */}
        <div className="bg-gradient-to-r from-slate-800/80 to-slate-900/80 backdrop-blur-sm rounded-2xl p-8 mb-16 border border-slate-700/50">
          <h3 className="text-2xl font-bold text-center mb-8 flex items-center justify-center space-x-2">
            <FaCoffee className="w-6 h-6 text-yellow-400" />
            <span>Why JavaScript Rocks</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-yellow-400 mb-2">30s</div>
              <div className="text-gray-300">Setup Time</div>
              <div className="text-sm text-gray-500">No compilation needed</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-emerald-400 mb-2">∞</div>
              <div className="text-gray-300">Flexibility</div>
              <div className="text-sm text-gray-500">Dynamic and adaptable</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-cyan-400 mb-2">Fast</div>
              <div className="text-gray-300">Development</div>
              <div className="text-sm text-gray-500">Rapid prototyping</div>
            </div>
          </div>
        </div>

        {/* Getting Started */}
        <div className="bg-gradient-to-r from-yellow-900/30 to-emerald-900/30 backdrop-blur-sm rounded-2xl p-8 border border-yellow-500/20">
          <h3 className="text-2xl font-bold text-center mb-8 flex items-center justify-center space-x-2">
            <FaRocket className="w-6 h-6 text-yellow-400" />
            <span>Ready to Rock?</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-10 h-10 bg-yellow-500/20 text-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-lg">1</div>
              <h4 className="font-semibold mb-2">Configure</h4>
              <p className="text-sm text-gray-400">Set your MongoDB URI</p>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-lg">2</div>
              <h4 className="font-semibold mb-2">Develop</h4>
              <p className="text-sm text-gray-400"><code className="bg-slate-800 px-2 py-1 rounded">npm run dev</code></p>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 bg-cyan-500/20 text-cyan-400 rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-lg">3</div>
              <h4 className="font-semibold mb-2">Deploy</h4>
              <p className="text-sm text-gray-400"><code className="bg-slate-800 px-2 py-1 rounded">npm run build</code></p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-16 text-center text-gray-500">
          <p className="flex items-center justify-center space-x-2 text-sm">
            <span>Built with</span>
            <FaHeart className="w-4 h-4 text-red-400" />
            <span>for JavaScript enthusiasts</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
