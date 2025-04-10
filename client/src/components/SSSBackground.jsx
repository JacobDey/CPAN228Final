// src/components/AnimatedBackground.jsx
import React from "react";

function SSSBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden z-0">
      {["bg-red-500", "bg-blue-500", "bg-yellow-400", "bg-purple-500", "bg-green-500",
        "bg-orange-500", "bg-indigo-500", "bg-pink-400", "bg-teal-500"].map((color, index) => (
          <div
            key={index}
            className={`absolute w-24 h-36 ${color} opacity-15 rounded-lg transform animate-float`}
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              transform: `rotate(${Math.random() * 40 - 20}deg)`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 5}s`,
              zIndex: 1
            }}
          />
        ))}
    </div>
  );
}

export default SSSBackground;