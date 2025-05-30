import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

const Ship = () => {
  const shipRef = useRef(null);
  const [lastMouseX, setLastMouseX] = useState(null);
  const [lastMouseY, setLastMouseY] = useState(null);
  const [lastDirectionX, setLastDirectionX] = useState(0);
  const [lastDirectionY, setLastDirectionY] = useState(0);
  const [bullets, setBullets] = useState([]);
  const mousePos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    let xVelocity = 0;
    let yVelocity = 0;

    const handleMouseMove = (e) => {
      const ship = shipRef.current;
      const rect = ship.getBoundingClientRect();
      const shipCenterX = rect.left + rect.width / 2;
      const shipCenterY = rect.top + rect.height / 2;

      // Update mouse position
      mousePos.current = {
        x: e.clientX,
        y: e.clientY,
      };

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
        if (xVelocity !== 0) setLastDirectionX(xVelocity / Math.abs(xVelocity));
        if (yVelocity !== 0) setLastDirectionY(yVelocity / Math.abs(yVelocity));
      }
      setLastMouseX(currentMouseX);
      setLastMouseY(currentMouseY);

      // Cap tilt angle for smooth effect
      const tiltAngle = Math.max(-30, Math.min(30, xVelocity * 0.5));

      // Calculate speed for dynamic offset
      const speed = Math.sqrt(xVelocity * xVelocity + yVelocity * yVelocity);
      const maxOffset = 100;
      const minOffset = 50;
      const offsetScale = Math.max(minOffset, Math.min(speed * 5, maxOffset));
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
        rotation: angle - 90,
        scale: 1 + Math.min(speed * 0.01, 0.2),
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

    const handleMouseClick = (e) => {
      const ship = shipRef.current;
      const rect = ship.getBoundingClientRect();
      const parent = ship.offsetParent || document.body;
      const parentRect = parent.getBoundingClientRect();

      // Create a new bullet
      const bulletId = Date.now();
      const bullet = {
        id: bulletId,
        x: rect.left + rect.width / 2 - parentRect.left, // Ship center
        y: rect.top + rect.height / 2 - parentRect.top,
      };

      setBullets((prev) => [...prev, bullet]);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("click", handleMouseClick);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("click", handleMouseClick);
    };
  }, [lastMouseX, lastMouseY, lastDirectionX, lastDirectionY]);

  // Animate bullets when they are added
  useEffect(() => {
    bullets.forEach((bullet) => {
      const bulletElement = document.getElementById(`bullet-${bullet.id}`);
      if (bulletElement) {
        gsap.to(bulletElement, {
          x: () => mousePos.current.x - bullet.x - 8, // Relative to bullet's initial position
          y: () => mousePos.current.y - bullet.y - 8,
          duration: 0.5,
          ease: "linear",
          onComplete: () => {
            setBullets((prev) => prev.filter((b) => b.id !== bullet.id));
          },
        });
      }
    });
  }, [bullets]);

  return (
    <>
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
      {bullets.map((bullet) => (
        <svg
          key={bullet.id}
          id={`bullet-${bullet.id}`}
          className="absolute w-4 h-4"
          style={{
            left: bullet.x - 8, // Center bullet
            top: bullet.y - 8,
          }}
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            cx="10"
            cy="10"
            r="8"
            fill="#FF5555"
            stroke="#1A2A44"
            strokeWidth="2"
          />
        </svg>
      ))}
    </>
  );
};

export default Ship;
