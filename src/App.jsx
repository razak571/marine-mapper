// import "./style.css";
import { Map, View } from "ol";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";

function App() {
  const map = new Map({
    target: "map",
    layers: [
      new TileLayer({
        source: new OSM(),
      }),
    ],
    view: new View({
      center: [0, 0],
      zoom: 2,
    }),
  });

  return (
    <>
      <h1>Project setup and clean-up</h1>
      <div
        id="map"
        style={{
          position: "absolute",
          color: "white",
          width: "100%",
          top: 0,
          bottom: 0,
        }}
      ></div>
    </>
  );
}

export default App;
