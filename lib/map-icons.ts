import { Icon, DivIcon } from "leaflet";

export const createPlaneIcon = (rotation: number) => {
  return new DivIcon({
    className: "",
    html: `<div style="transform: rotate(${rotation}deg)">
      <img src="/plane.png" style="width: 48px; height: 48px;" />
    </div>`,
    iconSize: [48, 48],
    iconAnchor: [24, 24],
  });
};

export const StartIcon = new Icon({
  iconUrl: "/marker-start.png",
  iconSize: [25, 25],
  iconAnchor: [12, 25],
});

export const EndIcon = new Icon({
  iconUrl: "/marker-end.png",
  iconSize: [25, 25],
  iconAnchor: [13, 22],
});

export const SunIcon = new Icon({
  iconUrl: "/sun-marker.png",
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  className: "sun", // Apply glow effect
});
