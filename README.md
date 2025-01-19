# Marine Mission Planner

A React-based application for creating and visualizing marine missions using OpenLayers maps. This application empowers users to draw LineStrings and Polygons, calculate distances, and manage waypoints seamlessly through an interactive interface.

---

## 🌟 Features

### 1. **Drawing Functionality**

- **LineString Drawing**:

  - Draw routes with multiple waypoints.
  - Press the **Enter** key to complete the LineString.
  - Features visual representation with **blue lines**, **arrows**, and **dots**.
  - Displays real-time distance calculations between points.

- **Polygon Drawing**:
  - Create polygons with multiple vertices.
  - Press the **Enter** key to complete the polygon.
  - Features visual representation with **orange dotted lines**.
  - Displays automatic perimeter distance calculations.

### 2. **Interactive Modals**

- **Mission Modal**:

  - Displays waypoint coordinates and distances.
  - Supports expandable/collapsible sections for polygons.
  - Updates dynamically during drawing.
  - Coordinates displayed in decimal format.
  - Distance displayed in meters.

- **Polygon Modal**:
  - Displays polygon waypoints and distances.
  - Coordinates displayed in N/S format.
  - Import functionality for adding polygons to missions.

### 3. **Polygon Integration**

- Insert polygons before/after any LineString point.
- Visual connections between LineStrings and Polygons:
  - **Single Line** for connections at endpoints.
  - **Two Lines** for connections to midpoints.
- Maintains consistent distance calculations with proper coordinate transformations.

### 4. **User Interface**

- **"Draw" Button** to initiate drawing mode.
- Intuitive modal interfaces for managing data.
- **Three-dot Menu** for polygon insertion options.
- Responsive map interactions for seamless navigation.

---

## 📦 Setup and Installation

### Prerequisites

Before you start, ensure your development environment includes the following:

- **Node.js** (v14 or higher): [Download Node.js](https://nodejs.org/)
- **npm** (v6 or higher) or **yarn** for package management.
- A modern browser for running the application.

### Steps

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/razak571/marine-mapper.git
   ```

2. **Navigate to the Project Directory**:

   ```bash
   cd marine-mapper
   ```

3. **Install Dependencies**:

   - Using **npm**:
     ```bash
     npm install
     ```
   - Using **yarn**:
     ```bash
     yarn install
     ```

4. **Start the Development Server**:

   - Using **npm**:
     ```bash
     npm run dev
     ```
   - Using **yarn**:
     ```bash
     yarn dev
     ```

5. **Open the Application**:
   Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📖 How to Use

1. **Start Drawing**:

   - Click the **"Draw"** button to activate drawing mode.
   - Click on the map to create LineString points.
   - Press **Enter** to complete the LineString.

2. **Insert Polygons**:

   - Use the **three-dot menu** to insert polygons before/after LineString points.
   - Draw polygons and import them into the mission.

3. **Manage Waypoints**:

   - Open the **Mission Modal** to view, edit, or analyze waypoints and distances.

4. **Visualize Connections**:
   - Observe visual connections between LineStrings and Polygons for enhanced data relationships.

---

## 🧑‍💻 Contributing

You are welcome for contributions to improve Marine Mission Planner! Follow these steps to contribute:

1. **Fork the Repository**:

   ```bash
   git fork https://github.com/razak571/marine-mapper.git
   ```

2. **Create a New Branch**:

   ```bash
   git checkout -b feature-name
   ```

3. **Commit Changes**:

   ```bash
   git commit -m "Add your message here"
   ```

4. **Push the Branch**:

   ```bash
   git push origin feature-name
   ```

5. **Submit a Pull Request**.

---

## 📧 Contact

For any inquiries, feel free to reach out:

- **Email**: abdulr87273@gmail.com

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
