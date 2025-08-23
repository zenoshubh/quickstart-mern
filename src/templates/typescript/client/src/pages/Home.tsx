import React, { useState } from "react";
import axios from "axios";
import { API_URL } from "../constants";
import {
  Zap,
  Shield,
  Code2,
  Database,
  Rocket,
  CheckCircle,
  AlertCircle,
  Play,
  Sparkles,
  Coffee,
  Heart,
} from "lucide-react";

const Home: React.FC = () => {
  const [status, setStatus] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const checkBackend = async (): Promise<void> => {
    setLoading(true);
    setStatus("");
    try {
      const res = await axios.get<{ message: string }>(
        `${API_URL}/api/v1/health`
      );
      setStatus(res.data.message);
    } catch (err) {
      setStatus("Could not connect to backend.");
    }
    setLoading(false);
  };

  const features = [
    { icon: Shield, title: "Type Safe", desc: "Zero runtime errors" },
    { icon: Zap, title: "Lightning Fast", desc: "Vite + TSX powered" },
    { icon: Code2, title: "Clean Imports", desc: "@ path aliases" },
    { icon: Database, title: "MongoDB Ready", desc: "Mongoose ODM" },
    { icon: Rocket, title: "Production Ready", desc: "Optimized builds" },
    { icon: Sparkles, title: "Modern Stack", desc: "Latest versions" },
  ];

  const techStack = [
    { name: "React 18", color: "text-blue-400" },
    { name: "TypeScript", color: "text-blue-500" },
    { name: "Express", color: "text-green-400" },
    { name: "MongoDB", color: "text-green-500" },
    { name: "Tailwind", color: "text-cyan-400" },
    { name: "Vite", color: "text-purple-400" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-gray-900 text-white">
      {/* Header */}
      <div className="border-b border-slate-700/50 bg-slate-900/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 flex items-center justify-center overflow-hidden">
                <img
                  src="/mern.svg"
                  alt="MERN Stack"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h1 className="text-lg font-bold">TypeScript MERN</h1>
                <p className="text-sm text-gray-400">Type-Safe & Powerful</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded text-xs font-medium">
                TypeScript
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
          <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Ship faster with TypeScript
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
            Production-ready MERN stack with type safety, modern tooling, and
            zero configuration.
          </p>

          {/* Tech Stack Pills */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {techStack.map((tech, index) => (
              <span
                key={index}
                className={`px-4 py-2 bg-slate-800/50 backdrop-blur-sm rounded-full text-sm font-medium ${tech.color} border border-slate-700/50`}
              >
                {tech.name}
              </span>
            ))}
          </div>

          {/* Backend Test */}
          <div className="max-w-sm mx-auto">
            <button
              onClick={checkBackend}
              className="w-full bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-700 hover:to-cyan-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 transform hover:scale-105 disabled:opacity-50 disabled:transform-none flex items-center justify-center space-x-2"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Testing...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  <span>Test Backend</span>
                </>
              )}
            </button>

            {status && (
              <div
                className={`mt-4 p-3 rounded-lg text-center font-medium backdrop-blur-sm ${
                  status.includes("Could not")
                    ? "bg-red-500/20 text-red-300 border border-red-500/30"
                    : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                }`}
              >
                <div className="flex items-center justify-center space-x-2">
                  {status.includes("Could not") ? (
                    <AlertCircle className="w-4 h-4" />
                  ) : (
                    <CheckCircle className="w-4 h-4" />
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
              <div
                key={index}
                className="group bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50 hover:border-emerald-500/50 transition-all duration-200 hover:transform hover:scale-105"
              >
                <div className="flex items-center space-x-3 mb-3">
                  <div className="p-2 bg-emerald-500/20 rounded-lg group-hover:bg-emerald-500/30 transition-colors">
                    <IconComponent className="w-5 h-5 text-emerald-400" />
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
            <Coffee className="w-6 h-6 text-cyan-400" />
            <span>Why Developers Love It</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-emerald-400 mb-2">0</div>
              <div className="text-gray-300">Runtime Errors</div>
              <div className="text-sm text-gray-500">
                TypeScript catches bugs early
              </div>
            </div>
            <div>
              <div className="text-3xl font-bold text-cyan-400 mb-2">2min</div>
              <div className="text-gray-300">Setup Time</div>
              <div className="text-sm text-gray-500">
                Up and running instantly
              </div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-400 mb-2">100%</div>
              <div className="text-gray-300">Type Coverage</div>
              <div className="text-sm text-gray-500">
                Full-stack type safety
              </div>
            </div>
          </div>
        </div>

        {/* Getting Started */}
        <div className="bg-gradient-to-r from-emerald-900/30 to-cyan-900/30 backdrop-blur-sm rounded-2xl p-8 border border-emerald-500/20">
          <h3 className="text-2xl font-bold text-center mb-8 flex items-center justify-center space-x-2">
            <Rocket className="w-6 h-6 text-emerald-400" />
            <span>Ready to Launch?</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-10 h-10 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-lg">
                1
              </div>
              <h4 className="font-semibold mb-2">Configure</h4>
              <p className="text-sm text-gray-400">Set your MongoDB URI</p>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 bg-cyan-500/20 text-cyan-400 rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-lg">
                2
              </div>
              <h4 className="font-semibold mb-2">Develop</h4>
              <p className="text-sm text-gray-400">
                <code className="bg-slate-800 px-2 py-1 rounded">
                  npm run dev
                </code>
              </p>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 bg-blue-500/20 text-blue-400 rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-lg">
                3
              </div>
              <h4 className="font-semibold mb-2">Deploy</h4>
              <p className="text-sm text-gray-400">
                <code className="bg-slate-800 px-2 py-1 rounded">
                  npm run build
                </code>
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-16 text-center text-gray-500">
          <p className="flex items-center justify-center space-x-2 text-sm">
            <span>Built with</span>
            <Heart className="w-4 h-4 text-red-400" />
            <span>for TypeScript developers</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
