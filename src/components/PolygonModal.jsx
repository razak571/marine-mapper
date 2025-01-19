/* eslint-disable react/prop-types */
const PolygonModal = ({
  onBack,
  onDiscard,
  onImport,
  coordinates,
  distances,
  isDrawing,
}) => {
  return (
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
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <button
          onClick={onBack}
          style={{
            border: "none",
            background: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          ← Mission Planner
        </button>
      </div>

      <h2 style={{ margin: "0 0 15px 0" }}>Polygon Tool</h2>

      {!isDrawing && (
        <p
          style={{
            padding: "15px",
            backgroundColor: "#f8f9fa",
            border: "2px dashed #dee2e6",
            borderRadius: "4px",
            marginBottom: "15px",
          }}
        >
          Click on the map to mark points of the polygons perimeter, then press
          ↵ to close and complete the polygon
        </p>
      )}

      {coordinates.length > 0 && (
        <div style={{ marginTop: "20px", marginBottom: "20px" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "80px 1fr 100px",
              gap: "10px",
              marginBottom: "10px",
              fontWeight: "bold",
            }}
          >
            <div>WP</div>
            <div>Coordinates</div>
            <div>Distance (m)</div>
          </div>
          {coordinates.map((coord, index) => (
            <div
              key={index}
              style={{
                display: "grid",
                gridTemplateColumns: "80px 1fr 100px",
                gap: "10px",
                padding: "8px",
                borderBottom: "1px solid #eee",
              }}
            >
              <div>{String(index).padStart(2, "0")}</div>
              <div>{`${Math.abs(coord[0]).toFixed(6)}° N, ${Math.abs(
                coord[1]
              ).toFixed(6)}° S`}</div>
              <div>{index > 0 ? distances[index - 1].toFixed(1) : "--"}</div>
            </div>
          ))}
        </div>
      )}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "15px",
        }}
      >
        <button
          onClick={onDiscard}
          style={{
            padding: "8px 16px",
            backgroundColor: "#f1f5f9",
            color: "black",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Discard
        </button>

        <button
          onClick={onImport}
          style={{
            padding: "8px 16px",
            backgroundColor: "#0ea5e9",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Import Points
        </button>
      </div>
    </div>
  );
};
export default PolygonModal;
