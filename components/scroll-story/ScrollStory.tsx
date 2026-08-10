"use client";

import React, { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { StorySceneType } from "./types";

gsap.registerPlugin(ScrollTrigger);

export function ScrollStory({ scenes }: { scenes: StorySceneType[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeScene, setActiveScene] = useState(0);

  useGSAP(() => {
    if (!containerRef.current) return;

    // Select all scene wrappers
    const sections = gsap.utils.toArray(".scene-wrapper") as HTMLElement[];

    // Calculate total scroll distance based on number of scenes
    // E.g., 4 scenes = 3 window heights to scroll through them
    const totalScroll = (scenes.length - 1) * 100; // in vh

    // Master timeline attached to scroll
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: `+=${totalScroll}%`,
        pin: true,
        scrub: 1, // Smooth interpolation
        onUpdate: (self) => {
          // Update active scene state for progress indicator
          const progress = self.progress;
          const newIndex = Math.min(
            Math.floor(progress * scenes.length),
            scenes.length - 1
          );
          if (newIndex !== activeScene) {
            setActiveScene(newIndex);
          }
        }
      }
    });

    // Build the animation sequence
    sections.forEach((section, i) => {
      if (i === 0) return; // First scene is already visible by default
      
      const img = section.querySelector('.scene-img');
      const text = section.querySelector('.scene-text');
      const prevText = sections[i-1].querySelector('.scene-text');
      
      const transitionLabel = `transition-${i}`;
      tl.addLabel(transitionLabel);
      
      // 1. Fade out previous text
      tl.to(prevText, { 
        opacity: 0, 
        y: -30, 
        filter: "blur(8px)", 
        duration: 1 
      }, transitionLabel);
      
      // 2. Reveal new image (clip-path wipe from bottom + subtle scale down)
      tl.fromTo(img, 
        { clipPath: "inset(100% 0 0 0)", scale: 1.1 },
        { clipPath: "inset(0% 0 0 0)", scale: 1, duration: 2, ease: "power2.inOut" },
        transitionLabel
      );
      
      // 3. Fade in new text
      tl.fromTo(text,
        { opacity: 0, y: 30, filter: "blur(8px)" },
        { opacity: 1, y: 0, filter: "blur(0px)", duration: 1, ease: "power2.out" },
        `${transitionLabel}+=1` // Starts halfway through the image transition
      );
    });

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, { dependencies: [scenes], scope: containerRef });

  return (
    <section 
      ref={containerRef} 
      className="story-container relative w-full h-[100vh] overflow-hidden bg-zinc-950 text-white"
    >
      {/* Background Images & Text */}
      <div className="absolute inset-0 w-full h-full">
        {scenes.map((scene, i) => (
          <div 
            key={scene.id} 
            className="scene-wrapper absolute inset-0 w-full h-full z-0" 
            style={{ zIndex: i }}
          >
            <div 
              className="scene-img absolute inset-0 w-full h-full overflow-hidden"
              style={{
                clipPath: i === 0 ? "inset(0 0 0 0)" : "inset(100% 0 0 0)",
              }}
            >
              <img 
                src={scene.image} 
                alt={scene.title}
                className="w-full h-full object-cover"
                loading={i === 0 ? "eager" : "lazy"}
              />
              {/* Vignette / Overlay for readability */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
            </div>
            
            {/* Story Content */}
            <div className="absolute inset-0 flex items-center justify-start px-6 md:px-24">
              <div 
                className="scene-text max-w-3xl"
                style={{
                  opacity: i === 0 ? 1 : 0,
                  transform: i === 0 ? "translateY(0)" : "translateY(30px)",
                  filter: i === 0 ? "blur(0px)" : "blur(8px)"
                }}
              >
                <p className="text-xs md:text-sm font-semibold tracking-widest uppercase text-white/60 mb-4 flex items-center gap-2">
                  <span className="w-8 h-px bg-white/60 block" />
                  {scene.eyebrow}
                </p>
                <h2 className="text-4xl md:text-7xl font-bold tracking-tighter mb-6 leading-[1.1] text-transparent bg-clip-text bg-gradient-to-b from-white to-white/70">
                  {scene.title}
                </h2>
                <p className="text-lg md:text-2xl text-white/80 leading-relaxed font-light max-w-2xl">
                  {scene.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Progress Indicator (Fixed to Right) */}
      <div className="absolute right-4 md:right-12 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-6">
        {scenes.map((scene, i) => (
          <div key={scene.id} className="flex items-center justify-end gap-4 group">
            <span 
              className={`hidden md:block text-xs tracking-widest font-mono transition-all duration-500 ${
                activeScene === i ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"
              }`}
            >
              {scene.label}
            </span>
            <button 
              className="relative flex items-center justify-center p-2 focus:outline-none"
              onClick={() => {
                const totalScroll = (scenes.length - 1) * window.innerHeight;
                const scrollPos = containerRef.current!.offsetTop + (i / (scenes.length - 1)) * totalScroll;
                window.scrollTo({
                  top: scrollPos,
                  behavior: "smooth"
                });
              }}
              aria-label={`Scroll to ${scene.label}`}
            >
              {/* Line indicator */}
              <div 
                className={`w-1 transition-all duration-500 rounded-full bg-white ${
                  activeScene === i ? "h-12 opacity-100" : "h-4 opacity-30 group-hover:opacity-70 group-hover:h-6"
                }`} 
              />
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
