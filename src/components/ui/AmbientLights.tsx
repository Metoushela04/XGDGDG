"use client";

// Ambient animated background lights - soft blurred glows in blue, cyan, violet, pink
export function AmbientLights() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
      {/* Blue glow - top left area */}
      <div
        className="absolute"
        style={{
          width: "600px",
          height: "600px",
          top: "-200px",
          left: "-100px",
          background: "radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%)",
          filter: "blur(80px)",
          animation: "ambientFloat1 20s ease-in-out infinite",
        }}
      />

      {/* Cyan glow - center right */}
      <div
        className="absolute"
        style={{
          width: "500px",
          height: "500px",
          top: "20%",
          right: "-150px",
          background: "radial-gradient(circle, rgba(6, 182, 212, 0.12) 0%, transparent 70%)",
          filter: "blur(100px)",
          animation: "ambientFloat2 25s ease-in-out infinite",
        }}
      />

      {/* Violet glow - bottom center */}
      <div
        className="absolute"
        style={{
          width: "700px",
          height: "700px",
          bottom: "-250px",
          left: "30%",
          background: "radial-gradient(circle, rgba(139, 92, 246, 0.1) 0%, transparent 70%)",
          filter: "blur(90px)",
          animation: "ambientFloat3 30s ease-in-out infinite",
        }}
      />

      {/* Pink glow - top right */}
      <div
        className="absolute"
        style={{
          width: "550px",
          height: "550px",
          top: "10%",
          right: "20%",
          background: "radial-gradient(circle, rgba(236, 72, 153, 0.08) 0%, transparent 70%)",
          filter: "blur(110px)",
          animation: "ambientFloat4 22s ease-in-out infinite",
        }}
      />

      <style jsx>{`
        @keyframes ambientFloat1 {
          0%, 100% {
            transform: translate(0, 0) scale(1);
            opacity: 0.6;
          }
          33% {
            transform: translate(80px, 60px) scale(1.1);
            opacity: 0.8;
          }
          66% {
            transform: translate(40px, 100px) scale(0.95);
            opacity: 0.7;
          }
        }

        @keyframes ambientFloat2 {
          0%, 100% {
            transform: translate(0, 0) scale(1);
            opacity: 0.7;
          }
          50% {
            transform: translate(-100px, 80px) scale(1.15);
            opacity: 0.9;
          }
        }

        @keyframes ambientFloat3 {
          0%, 100% {
            transform: translate(0, 0) scale(1);
            opacity: 0.5;
          }
          40% {
            transform: translate(60px, -80px) scale(1.05);
            opacity: 0.7;
          }
          80% {
            transform: translate(-40px, -40px) scale(0.9);
            opacity: 0.6;
          }
        }

        @keyframes ambientFloat4 {
          0%, 100% {
            transform: translate(0, 0) scale(1);
            opacity: 0.6;
          }
          25% {
            transform: translate(-60px, 40px) scale(1.1);
            opacity: 0.8;
          }
          75% {
            transform: translate(40px, -60px) scale(0.95);
            opacity: 0.7;
          }
        }
      `}</style>
    </div>
  );
}
