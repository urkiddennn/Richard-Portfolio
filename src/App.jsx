import { useState } from "react";
import PolarNoiseCanvas from "./components/PerlinNoise.jsx";
import "./App.css";
import Ship from "./components/Ship.jsx";

function App() {
  return (
    <>
      <p>Hello world</p>
      <div>
        <Ship />
      </div>

      {/* TODO: Uncomment this when the cursor ship is added
       */}
      {/*     <PolarNoiseCanvas />*/}
    </>
  );
}

export default App;
