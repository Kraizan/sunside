# 🌅 SunSide — Window Seat Sunlight Optimizer

**SunSide** helps travelers choose the **ideal window seat** by analyzing sun positions during flights. Whether you want to bask in golden hour views or avoid harsh sunlight, SunSide recommends the side of the plane (left or right) offering the best scenic experience — based on real-time solar calculations.

---

## ✈️ Features

- 🌞 **Sun Position Tracking** – Uses real-time solar position to track sunrise/sunset along flight path.
- 🧭 **Dynamic Path Sampling** – Divides flight path into 1-minute intervals for precision.
- 💺 **Seat Side Recommendation** – Tells you which side (left/right) gets the best sun experience.
- 🕰️ **Customizable Preferences** – Choose whether you want sunrise, sunset, or just the sunny side.

---

## 🧠 How It Works

1. **Flight Path Calculation**: Uses Turf.js to calculate a Bezier curve from source to destination.
2. **Time Sampling**: Breaks the flight into 1-minute segments to compute position over time.
3. **Sun Position**: Computes sun altitude/azimuth using `suncalc3` and subsolar point using astronomical math.
4. **Event Detection**: Identifies if and when sunrise/sunset is visible from the aircraft.
5. **Seat Side Logic**: Determines sun-facing side using vector geometry and dot/cross product.

---

## 🛠️ Tech Stack

| Tech                | Purpose                                   |
|---------------------|-------------------------------------------|
| **React + Tailwind**| Frontend & UI                             |
| **Turf.js**         | Flight path generation                    |
| **SunCalc3**        | Sun position and events                   |
| **Three.js + Globe**| 3D globe with solar terminator overlay    |
| **Leaflet.js**      | 2D interactive maps                       |
| **Framer Motion**   | UI animations                             |
| **AeroDataBox API** | Airport location data                     |
| **Vercel**          | Hosting & deployment                      |

---

## 🧪 Local Setup

### Prerequisites

- Node.js ≥ 18
- `pnpm` or `npm`
- AeroDataBox API Key

### 1. Clone and Install

```bash
git clone https://github.com/yourusername/sunside.git
cd sunside
npm install
````

### 2. Setup Environment Variables

Create a `.env.local` file:

```env
AERODATA_API_KEY=your_key_here
AERODATA_BASE_URL=aerodata_base_url_for_prod
MONGODB_URI=your_mongodb_uri

```

### 3. Run the App

```bash
npm run dev
```

Open [`http://localhost:3000`](http://localhost:3000)

---

## 📁 Folder Structure

```
├── app/ # App Router pages and layout (Next.js)
├── components/ # Reusable UI components (FlightForm, Navbar, etc.)
├── context/ # Global React contexts (theme)
├── hooks/ # Custom React hooks (e.g., useAirportData)
├── lib/ # Utility libraries (e.g., suncalc helpers, sun-side logic)
├── models/ # Database models (MongoDB schema)
├── public/ # Static assets (icons)
├── types/ # Global TypeScript types (flight, airport, etc.)

```

---

## 📈 Recommendation Logic Overview

```ts
// For each minute of the flight:
- Compute aircraft location
- Calculate sun position and events
- Determine sun-facing side (LEFT or RIGHT)

// Final decision based on:
- Sunrise/sunset preferences
- Total sunlight exposure
- Priority between sunrise vs sunset
```

---

## 🔐 Feature Gating (Coming Soon)

* 👤 User Signup and Login
* 🌅 3D Globe View – for premium users
* 📊 Historic and future solar tracking
* ☁️ Weather & cloud coverage data

---

## 📦 Roadmap

* [x] Base flight & sun-side logic
* [x] SunCalc integration
* [x] Journey timeline overview
* [x] Mobile responsiveness
* [ ] Profile + saved journeys
* [ ] 3D map support
* [ ] Cloud/satellite overlays

---