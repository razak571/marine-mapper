import { useEffect, useRef, useState } from "react";
import "ol/ol.css";
import Map from "ol/Map.js";
import View from "ol/View.js";
import OSM from "ol/source/OSM.js";
import TileLayer from "ol/layer/Tile.js";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { Draw } from "ol/interaction"; // Add this import

const MarineMap = () => {
  const mapElement = useRef();
  const [map, setMap] = useState(null);
  const [drawMode, setDrawMode] = useState(null);

  useEffect(() => {
    // Create vector source for drawings
    const vectorSource = new VectorSource();
    const vectorLayer = new VectorLayer({
      source: vectorSource,
    });

    // Initialize map
    const initialMap = new Map({
      layers: [
        new TileLayer({ source: new OSM() }),
        vectorLayer, // Add vector layer for drawings
      ],
      view: new View({
        center: [0, 0],
        zoom: 2,
      }),
      target: mapElement.current,
    });

    setMap(initialMap);

    // Cleanup
    return () => initialMap.setTarget(undefined);
  }, []);

  // Function to handle drawing
  const startDrawing = (type) => {
    if (!map) return;

    // Remove any existing draw interactions
    map.getInteractions().forEach((interaction) => {
      if (interaction instanceof Draw) {
        map.removeInteraction(interaction);
      }
    });

    // Create new draw interaction
    const drawInteraction = new Draw({
      source: map.getLayers().getArray()[1].getSource(), // Get vector layer's source
      type: type,
    });

    // Add the interaction to map
    map.addInteraction(drawInteraction);
    setDrawMode(type);
  };

  return (
    <div style={{ width: "100%", height: "100%", position: "absolute" }}>
      {/* className="h-screen w-full relative" */}
      {/* Drawing Controls */}
      <div className="absolute top-4 left-4 z-10 bg-white p-4 rounded-lg shadow-lg">
        <button
          className="w-full mb-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={() => startDrawing("LineString")}
        >
          Draw LineString
        </button>
        <button
          className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={() => startDrawing("Polygon")}
        >
          Draw Polygon
        </button>
      </div>

      <div
        ref={mapElement}
        style={{ width: "100%", height: "100%", position: "absolute" }}
        className="w-full h-full"
      />
    </div>
  );
};

export default MarineMap;
