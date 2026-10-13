// Single source for office addresses (contact details) and the branch globe.
export interface Office {
  id: string;
  city: string;
  country: string;
  role: "hq" | "branch";
  lines: string[];
  lat: number;
  lon: number;
}

export const offices: Office[] = [
  {
    id: "singapore",
    city: "Singapore",
    country: "Singapore",
    role: "hq",
    lines: ["2 Central Boulevard, #32-01", "IOI Central Boulevard Towers", "Singapore 018916"],
    lat: 1.28,
    lon: 103.85,
  },
  {
    id: "prosper",
    city: "Prosper",
    country: "United States",
    role: "branch",
    lines: ["Algorims Inc.", "990 Corinthian Rd, Prosper, TX 75078"],
    lat: 33.24,
    lon: -96.8,
  },
  {
    id: "tirupati",
    city: "Tirupati",
    country: "India",
    role: "branch",
    lines: ["STPI, Survey No. 234, Padmavathipuram, Beside Mahilapranganam, Tiruchanur Road, Tirupati, AP 517503"],
    lat: 13.63,
    lon: 79.42,
  },
  {
    id: "bengaluru",
    city: "Bengaluru",
    country: "India",
    role: "branch",
    lines: ["2nd Floor, No 29/1, SK Mapple Hoskote Rd, Whitefield, Kadugodi, Bengaluru, Karnataka 560067"],
    lat: 12.99,
    lon: 77.76,
  },
];

export const headquarters = offices.find((office) => office.role === "hq")!;
export const branches = offices.filter((office) => office.role === "branch");
