import { useEffect, useRef, useState } from "react";
import "ol/ol.css";
import Map from "ol/Map.js";
import View from "ol/View.js";
import OSM from "ol/source/OSM.js";
import TileLayer from "ol/layer/Tile.js";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { Draw } from "ol/interaction";
import { transform } from "ol/proj";
import { getLength } from "ol/sphere";
import { LineString } from "ol/geom";
import { Point } from "ol/geom";
import { Style, Stroke, Circle, Fill, Icon } from "ol/style";

const arrowImage =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path fill="%233b82f6" d="M12 2L4 12h7.8v8h0.4v-8H20z"/></svg>';

const createLineStyle = (feature) => {
  const styles = [];
  const geometry = feature.getGeometry();

  // Line style
  styles.push(
    new Style({
      stroke: new Stroke({
        color: "#3b82f6",
        width: 2,
      }),
    })
  );

  // Get coordinates
  const coordinates = geometry.getCoordinates();

  // Add dots at each point
  coordinates.forEach((coord) => {
    styles.push(
      new Style({
        geometry: new Point(coord),
        image: new Circle({
          radius: 5,
          fill: new Fill({
            color: "#3b82f6",
          }),
        }),
      })
    );
  });

  // Using  segment iteration approach for arrows
  geometry.forEachSegment(function (start, end) {
    const dx = end[0] - start[0];
    const dy = end[1] - start[1];
    const rotation = Math.atan2(dy, dx);

    // Calculate midpoint for arrow placement
    const midPoint = [start[0] + dx / 2, start[1] + dy / 2];

    // Add arrow at midpoint
    styles.push(
      new Style({
        geometry: new Point(midPoint),
        image: new Icon({
          src: arrowImage,
          anchor: [0.5, 1],
          scale: 1,
          rotateWithView: true,
          rotation: -rotation + Math.PI / 2,
        }),
      })
    );
  });

  return styles;
};

const MarineMap = () => {
  const mapElement = useRef();
  const vectorSourceRef = useRef(new VectorSource());
  const [map, setMap] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [showMissionModal, setShowMissionModal] = useState(false);
  const [coordinates, setCoordinates] = useState([]);
  const [distances, setDistances] = useState([]);
  const [currentDraw, setCurrentDraw] = useState(null);
  const [drawnCoordinates, setDrawnCoordinates] = useState([]);
  const [drawnDistances, setDrawnDistances] = useState([]);

  // Initialize map
  useEffect(() => {
    const vectorLayer = new VectorLayer({
      source: vectorSourceRef.current,
      style: createLineStyle,
    });

    const initialMap = new Map({
      layers: [new TileLayer({ source: new OSM() }), vectorLayer],
      view: new View({
        // center: [0, 0],
        center: transform([12.97169189, 12.97169189], "EPSG:4326", "EPSG:3857"),
        zoom: 3,
      }),
      target: mapElement.current,
    });

    setMap(initialMap);

    return () => {
      if (initialMap) {
        initialMap.setTarget(undefined);
      }
    };
  }, []);

  const calculateDistance = (coord1, coord2) => {
    const line = new LineString([coord1, coord2]);
    return getLength(line);
  };
  //const updateCoordinates
  (event) => {
    const coords = event.target.getCoordinates();
    const transformed = coords.map((coord) =>
      transform(coord, "EPSG:3857", "EPSG:4326")
    );

    // Calculate distances
    const newDistances = [];
    for (let i = 1; i < transformed.length; i++) {
      const distance = calculateDistance(
        transform(coords[i - 1], "EPSG:4326", "EPSG:3857"),
        transform(coords[i], "EPSG:4326", "EPSG:3857")
      );
      newDistances.push(Math.round(distance));
    }

    setCoordinates(transformed);
    setDistances(newDistances);
  };

  const startDrawing = () => {
    if (!map) return;

    setShowMissionModal(true);
    setIsDrawing(false);
    setCoordinates([]);
    setDistances([]);
    setDrawnCoordinates([]); // Clear previous drawn coordinates
    setDrawnDistances([]); // Clear previous drawn distances

    map.getInteractions().forEach((interaction) => {
      if (interaction instanceof Draw) {
        map.removeInteraction(interaction);
      }
    });

    const drawInteraction = new Draw({
      source: vectorSourceRef.current,
      type: "LineString",
    });

    // Handle real-time coordinate updates
    let sketch;
    drawInteraction.on("drawstart", (evt) => {
      setIsDrawing(true);
      sketch = evt.feature;

      // Listen to geometry changes
      sketch.getGeometry().on("change", (evt) => {
        const geom = evt.target;
        const coords = geom.getCoordinates();

        // Transform coordinates
        const transformed = coords.map((coord) =>
          transform(coord, "EPSG:3857", "EPSG:4326")
        );

        // Calculate distances
        const newDistances = [];
        for (let i = 1; i < coords.length; i++) {
          const distance = calculateDistance(coords[i - 1], coords[i]);
          // Convert to smaller units (divide by a larger number)
          const adjustedDistance = distance / 1000; // Adjust this divisor to get numbers similar to the PDF
          newDistances.push(adjustedDistance);
        }

        setCoordinates(transformed);
        setDistances(newDistances);
      });
    });

    drawInteraction.on("drawend", () => {
      setIsDrawing(false);
      sketch = null;
    });

    map.addInteraction(drawInteraction);
    setCurrentDraw(drawInteraction);
  };

  useEffect(() => {
    if (!isDrawing && coordinates.length > 0) {
      setDrawnCoordinates(coordinates);
      setDrawnDistances(distances);
    }
  }, [isDrawing, coordinates, distances]);

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === "Enter" && currentDraw) {
        currentDraw.finishDrawing();
      }
    };

    document.addEventListener("keydown", handleKeyPress);
    return () => document.removeEventListener("keydown", handleKeyPress);
  }, [currentDraw]);

  const MissionModal = () => (
    <div
      style={{
        position: "fixed",
        right: "20px",
        top: "20px",
        backgroundColor: "white",
        padding: "20px",
        borderRadius: "8px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        zIndex: 1000,
        maxHeight: "80vh",
        overflow: "auto",
        width: "400px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
          borderBottom: "1px solid #eee",
          paddingBottom: "10px",
        }}
      >
        <h2 style={{ margin: 0 }}>Mission Creation</h2>
        <button
          onClick={() => {
            if (currentDraw) {
              map.removeInteraction(currentDraw);
              setCurrentDraw(null);
            }
            setIsDrawing(false);
            setShowMissionModal(false);
          }}
          style={{
            border: "none",
            background: "none",
            fontSize: "20px",
            cursor: "pointer",
            padding: "5px",
          }}
        >
          ×
        </button>
      </div>
      {(coordinates.length > 0 || drawnCoordinates.length > 0) && (
        <div style={{ marginTop: "20px" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "30px 80px 1fr 100px 30px",
              gap: "10px",
              marginBottom: "10px",
              fontWeight: "bold",
              alignItems: "center",
              padding: "8px",
            }}
          >
            <div>
              <input type="checkbox" />
            </div>
            <div>WP</div>
            <div>Coordinates</div>
            <div>Distance (m)</div>
            <div></div>
          </div>
          {(isDrawing ? coordinates : drawnCoordinates).map((coord, index) => (
            <div
              key={index}
              style={{
                display: "grid",
                gridTemplateColumns: "30px 80px 1fr 100px 30px",
                gap: "10px",
                padding: "8px",
                borderBottom: "1px solid #eee",
                alignItems: "center",
              }}
            >
              <div>
                <input type="checkbox" />
              </div>
              <div>{String(index).padStart(2, "0")}</div>
              <div>{`${Math.abs(coord[0]).toFixed(6)}, ${Math.abs(
                coord[1]
              ).toFixed(6)}`}</div>
              <div>
                {index > 0
                  ? `${(isDrawing ? distances : drawnDistances)[
                      index - 1
                    ].toFixed(1)}`
                  : "--"}
              </div>

              <div style={{ position: "relative" }}>
                <button
                  style={{
                    border: "none",
                    background: "none",
                    cursor: "pointer",
                    padding: "5px",
                    fontSize: "16px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "2px",
                  }}
                >
                  <span style={{ lineHeight: "0.5" }}>•</span>
                  <span style={{ lineHeight: "0.5" }}>•</span>
                  <span style={{ lineHeight: "0.5" }}>•</span>
                </button>
                <div
                  className="dropdown-content"
                  style={{
                    position: "absolute",
                    right: "95%",
                    top: "10%",
                    backgroundColor: "#f8f9fa",
                    border: "1px solid #eee",
                    borderRadius: "4px",
                    display: "none",
                    zIndex: 1000,
                    width: "200px",
                  }}
                >
                  <button
                    style={{
                      display: "block",
                      width: "100%",
                      padding: "8px",
                      textAlign: "left",
                      border: "none",
                      background: "none",
                      cursor: "pointer",
                    }}
                  >
                    Insert Polygon Before
                  </button>
                  <button
                    style={{
                      display: "block",
                      width: "100%",
                      padding: "8px",
                      textAlign: "left",
                      border: "none",
                      background: "none",
                      cursor: "pointer",
                    }}
                  >
                    Insert Polygon After
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {((!coordinates.length && !drawnCoordinates.length) || isDrawing) && (
        <p
          style={{
            padding: "15px",
            backgroundColor: "#f8f9fa",
            border: "2px dashed #dee2e6",
            borderRadius: "4px",
            marginBottom: "15px",
          }}
        >
          Click on the map to mark points of the route and then press ↵ to
          complete the route.
        </p>
      )}
      <div style={{ textAlign: "right", marginTop: "15px" }}>
        <button
          style={{
            padding: "8px 16px",
            backgroundColor: "#6366f1", // Changed to match the purple in the screenshot
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Generate Data
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ width: "100%", height: "100%", position: "absolute" }}>
      <button
        onClick={startDrawing}
        style={{
          position: "absolute",
          top: "20px",
          left: "40px",
          zIndex: 10,
          padding: "8px 16px",
          backgroundColor: "#3b82f6",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        Draw
      </button>

      <div
        ref={mapElement}
        style={{ width: "100%", height: "100%", position: "absolute" }}
      />

      {showMissionModal && <MissionModal />}
    </div>
  );
};

export default MarineMap;
