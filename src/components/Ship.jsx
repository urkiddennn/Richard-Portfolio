import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

const Ship = () => {
  const shipRef = useRef(null);
  const [lastMouseX, setLastMouseX] = useState(null);
  const [lastMouseY, setLastMouseY] = useState(null);
  const [lastDirectionX, setLastDirectionX] = useState(0);
  const [lastDirectionY, setLastDirectionY] = useState(0);

  useEffect(() => {
    let xVelocity = 0;
    let yVelocity = 0;

    const handleMouseMove = (e) => {
      const ship = shipRef.current;
      const rect = ship.getBoundingClientRect();
      const shipCenterX = rect.left + rect.width / 2;
      const shipCenterY = rect.top + rect.height / 2;

      // Calculate angle to mouse
      const deltaX = e.clientX - shipCenterX;
      const deltaY = e.clientY - shipCenterY;
      const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);

      // Calculate velocity for tilt and positioning
      const currentMouseX = e.clientX;
      const currentMouseY = e.clientY;
      if (lastMouseX !== null && lastMouseY !== null) {
        xVelocity = currentMouseX - lastMouseX;
        yVelocity = currentMouseY - lastMouseY;
        // Update last direction only if velocity is non-zero
        if (xVelocity !== 0) setLastDirectionX(xVelocity / Math.abs(xVelocity));
        if (yVelocity !== 0) setLastDirectionY(yVelocity / Math.abs(yVelocity));
      }
      setLastMouseX(currentMouseX);
      setLastMouseY(currentMouseY);

      // Cap tilt angle for smooth effect
      const tiltAngle = Math.max(-30, Math.min(30, xVelocity * 0.5));

      // Calculate speed for dynamic offset
      const speed = Math.sqrt(xVelocity * xVelocity + yVelocity * yVelocity);
      const maxOffset = 100; // Maximum offset distance
      const minOffset = 50; // Minimum offset when stationary
      const offsetScale = Math.max(minOffset, Math.min(speed * 5, maxOffset)); // Ensure minimum offset
      const offsetX =
        xVelocity === 0
          ? -lastDirectionX * offsetScale
          : (-xVelocity / Math.abs(xVelocity)) * offsetScale;
      const offsetY =
        yVelocity === 0
          ? -lastDirectionY * offsetScale
          : (-yVelocity / Math.abs(yVelocity)) * offsetScale;

      // Get the parent container's offset
      const parent = ship.offsetParent || document.body;
      const parentRect = parent.getBoundingClientRect();

      // Animate ship position, rotation, and scale
      gsap.to(shipRef.current, {
        x: e.clientX - parentRect.left - rect.width / 2 + offsetX,
        y: e.clientY - parentRect.top - rect.height / 2 + offsetY,
        rotation: angle - 90, // Point toward mouse
        scale: 1 + Math.min(speed * 0.01, 0.2), // Subtle scale based on speed
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
  }, [lastMouseX, lastMouseY, lastDirectionX, lastDirectionY]);

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
