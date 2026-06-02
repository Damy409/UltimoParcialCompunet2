import { request } from "./http.js";

const DEMO_FLIGHTS_KEY = "demoFlights";

const initialDemoFlights = [
  {
    id: 1,
    code: "AV-120",
    airline: "Avianca",
    origin: "Bogota",
    destination: "Medellin",
    departureTime: "2026-06-03T08:30",
    arrivalTime: "2026-06-03T09:25",
    status: "PROGRAMADO"
  },
  {
    id: 2,
    code: "LA-421",
    airline: "LATAM",
    origin: "Cali",
    destination: "Cartagena",
    departureTime: "2026-06-03T10:15",
    arrivalTime: "2026-06-03T11:45",
    status: "EN_VUELO"
  }
];

function isDemoMode() {
  return localStorage.getItem("token") === "demo-flight-token";
}

function readDemoFlights() {
  const stored = localStorage.getItem(DEMO_FLIGHTS_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
  localStorage.setItem(DEMO_FLIGHTS_KEY, JSON.stringify(initialDemoFlights));
  return initialDemoFlights;
}

function saveDemoFlights(flights) {
  localStorage.setItem(DEMO_FLIGHTS_KEY, JSON.stringify(flights));
  return flights;
}

export function findAllFlights() {
  if (isDemoMode()) {
    return Promise.resolve(readDemoFlights());
  }

  return request("/flights");
}

export function createFlight(flight) {
  if (isDemoMode()) {
    const flights = readDemoFlights();
    const newFlight = { ...flight, id: Date.now() };
    saveDemoFlights([newFlight, ...flights]);
    return Promise.resolve(newFlight);
  }

  return request("/flights", {
    method: "POST",
    body: JSON.stringify(flight)
  });
}

export function updateFlight(id, flight) {
  if (isDemoMode()) {
    const flights = readDemoFlights().map((current) =>
      current.id === id ? { ...current, ...flight, id } : current
    );
    saveDemoFlights(flights);
    return Promise.resolve(flights.find((current) => current.id === id));
  }

  return request(`/flights/${id}`, {
    method: "PUT",
    body: JSON.stringify(flight)
  });
}

export function updateFlightStatus(id, status) {
  if (isDemoMode()) {
    const flights = readDemoFlights().map((flight) =>
      flight.id === id ? { ...flight, status } : flight
    );
    saveDemoFlights(flights);
    return Promise.resolve(flights.find((flight) => flight.id === id));
  }

  return request(`/flights/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status })
  });
}

export function deleteFlight(id) {
  if (isDemoMode()) {
    const flights = readDemoFlights().filter((flight) => flight.id !== id);
    saveDemoFlights(flights);
    return Promise.resolve(null);
  }

  return request(`/flights/${id}`, {
    method: "DELETE"
  });
}
