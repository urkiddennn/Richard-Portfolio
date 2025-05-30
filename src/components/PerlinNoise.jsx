import React, { useEffect, useRef } from "react";
// TODO: Improve and add this the spaceship is added
function generateWhiteNoise(width, height) {
  if (width <= 0 || height <= 0) {
    throw new RangeError("Width and height must be positive numbers.");
  }

  const noise = new Array(width * height);
  for (let i = 0; i < noise.length; i++) {
    noise[i] = Math.random();
  }
  return noise;
}

function interpolate(x0, x1, alpha) {
  return x0 * (1 - alpha) + alpha * x1;
}

function generatePerlinNoise(width, height, octaveCount = 4) {
  const baseNoise = generateWhiteNoise(width, height);
  const smoothNoise = [];

  let persistence = 0.5;

  for (let i = 0; i < octaveCount; i++) {
    smoothNoise.push(generateSmoothNoise(baseNoise, width, height, i));
  }

  const perlinNoise = new Array(width * height).fill(0);
  let amplitude = 1.0;
  let totalAmplitude = 0.0;

  for (let octave = octaveCount - 1; octave >= 0; octave--) {
    amplitude *= persistence;
    totalAmplitude += amplitude;

    for (let i = 0; i < width * height; i++) {
      perlinNoise[i] += smoothNoise[octave][i] * amplitude;
    }
  }

  // Normalization
  for (let i = 0; i < width * height; i++) {
    perlinNoise[i] /= totalAmplitude;
  }

  return perlinNoise;
}

function generateSmoothNoise(baseNoise, width, height, octave) {
  const smoothNoise = new Array(width * height);
  const samplePeriod = 1 << octave;
  const sampleFrequency = 1.0 / samplePeriod;

  for (let y = 0; y < height; y++) {
    const sampleY0 = Math.floor(y / samplePeriod) * width;
    const sampleY1 = (sampleY0 + samplePeriod * width) % (width * height);
    const verticalBlend = (y % samplePeriod) * sampleFrequency;

    for (let x = 0; x < width; x++) {
      const sampleX0 = x & ~(samplePeriod - 1);
      const sampleX1 = (sampleX0 + samplePeriod) % width;
      const horizontalBlend = (x % samplePeriod) * sampleFrequency;

      const top = interpolate(
        baseNoise[sampleY0 + sampleX0],
        baseNoise[sampleY0 + sampleX1],
        horizontalBlend,
      );

      const bottom = interpolate(
        baseNoise[sampleY1 + sampleX0],
        baseNoise[sampleY1 + sampleX1],
        horizontalBlend,
      );

      smoothNoise[y * width + x] = interpolate(top, bottom, verticalBlend);
    }
  }

  return smoothNoise;
}

const PerlinNoiseCanvas = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const width = canvas.width;
    const height = canvas.height;

    const noise = generatePerlinNoise(width, height);
    const imageData = ctx.createImageData(width, height);

    for (let i = 0; i < noise.length; i++) {
      const value = Math.floor(noise[i] * 255);
      imageData.data[i * 4] = value;
      imageData.data[i * 4 + 1] = value;
      imageData.data[i * 4 + 2] = value;
      imageData.data[i * 4 + 3] = 255; // alpha
    }

    ctx.putImageData(imageData, 0, 0);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={256}
      height={256}
      style={{ border: "1px solid black" }}
    />
  );
};

export default PerlinNoiseCanvas;
