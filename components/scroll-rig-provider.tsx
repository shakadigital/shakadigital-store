"use client";

import React, { ReactNode } from "react";
import { GlobalCanvas, SmoothScrollbar } from "@14islands/r3f-scroll-rig";
import { Environment } from "@react-three/drei";
import "@14islands/r3f-scroll-rig/css";

export function ScrollRigProvider({ children }: { children: ReactNode }) {
  return (
    <>
      {/* GlobalCanvas handles all UseCanvas components across the site */}
      <GlobalCanvas
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100vh",
          pointerEvents: "none",
          zIndex: 0,
        }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={2} />
        <pointLight position={[0, 0, 0]} intensity={2} color="#818cf8" />
        <Environment preset="city" />
      </GlobalCanvas>
      
      {/* SmoothScrollbar hijacks native scroll for silky smooth Lenis scrolling */}
      <SmoothScrollbar />
      
      {/* Page content */}
      <div className="relative z-10">
        {children}
      </div>
    </>
  );
}
