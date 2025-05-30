import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

const Ship = () => {
  const shipRef = useRef(null);
  const [lastMouseX, setLastMouseX] = useState(null);

  useEffect(() => {
    let velocity = 0;

    const handleMouseMove = (e) => {
      const ship = shipRef.current;
      const rect = ship.getBoundingClientRect();
      const shipCenterX = rect.left + rect.width / 2;
      const shipCenterY = rect.top + rect.height / 2;

      // Calculate angle to mouse
      const deltaX = e.clientX - shipCenterX;
      const deltaY = e.clientY - shipCenterY;
      const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);

      // Calculate horizontal velocity for tilt
      const currentMouseX = e.clientX;
      if (lastMouseX !== null) {
        velocity = currentMouseX - lastMouseX;
      }
      setLastMouseX(currentMouseX);

      // TODO: Calculate when the Ship is the upper corner with go up
      // TODO: More implementations to it and functionalities

      // Cap tilt angle for smooth effect
      const tiltAngle = Math.max(-30, Math.min(30, velocity * 0.5));

      // Get the parent container's offset
      const parent = ship.offsetParent || document.body;
      const parentRect = parent.getBoundingClientRect();

      // Animate ship position and rotation
      gsap.to(shipRef.current, {
        x: e.clientX - parentRect.left - rect.width / 2,
        y: e.clientY - parentRect.top,
        rotation: angle - 90, // Adjust so ship points toward mouse
        duration: 0.5,
        ease: "power2.out",
        transformOrigin: "center center",
      });

      // Apply tilt animation
      gsap.to(shipRef.current, {
        rotation: angle - 90 + tiltAngle,
        duration: 0.2,
        ease: "power1.out",
        overwrite: "auto",
      });
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [lastMouseX]);

  return (
    <svg
      ref={shipRef}
      className="absolute w-16 h-16"
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M50 20 L80 60 L50 80 L20 60 Z"
        fill="#4B5EAA"
        stroke="#1A2A44"
        strokeWidth="4"
      />
    </svg>
  );
};

export default Ship;
