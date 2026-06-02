import { request } from "./http.js";

const DEMO_RESERVATIONS_KEY = "demoReservations";

const initialDemoReservations = [
  {
    id: 1,
    customerName: "Ana Perez",
    serviceName: "Salon principal",
    reservationDate: "2026-06-03T10:00",
    people: 4,
    status: "PENDIENTE"
  },
  {
    id: 2,
    customerName: "Carlos Gomez",
    serviceName: "Mesa ejecutiva",
    reservationDate: "2026-06-03T13:30",
    people: 2,
    status: "CONFIRMADA"
  }
];

function isDemoMode() {
  return localStorage.getItem("token") === "demo-reservation-token";
}

function readDemoReservations() {
  const stored = localStorage.getItem(DEMO_RESERVATIONS_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
  localStorage.setItem(DEMO_RESERVATIONS_KEY, JSON.stringify(initialDemoReservations));
  return initialDemoReservations;
}

function saveDemoReservations(reservations) {
  localStorage.setItem(DEMO_RESERVATIONS_KEY, JSON.stringify(reservations));
  return reservations;
}

export function findAllReservations() {
  if (isDemoMode()) {
    return Promise.resolve(readDemoReservations());
  }

  return request("/reservations");
}

export function createReservation(reservation) {
  if (isDemoMode()) {
    const reservations = readDemoReservations();
    const newReservation = { ...reservation, id: Date.now() };
    saveDemoReservations([newReservation, ...reservations]);
    return Promise.resolve(newReservation);
  }

  return request("/reservations", {
    method: "POST",
    body: JSON.stringify(reservation)
  });
}

export function updateReservation(id, reservation) {
  if (isDemoMode()) {
    const numericId = Number(id);
    const reservations = readDemoReservations().map((current) =>
      current.id === numericId ? { ...current, ...reservation, id: numericId } : current
    );
    saveDemoReservations(reservations);
    return Promise.resolve(reservations.find((current) => current.id === numericId));
  }

  return request(`/reservations/${id}`, {
    method: "PUT",
    body: JSON.stringify(reservation)
  });
}

export function updateReservationStatus(id, status) {
  if (isDemoMode()) {
    const numericId = Number(id);
    const reservations = readDemoReservations().map((reservation) =>
      reservation.id === numericId ? { ...reservation, status } : reservation
    );
    saveDemoReservations(reservations);
    return Promise.resolve(reservations.find((reservation) => reservation.id === numericId));
  }

  return request(`/reservations/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status })
  });
}

export function deleteReservation(id) {
  if (isDemoMode()) {
    const numericId = Number(id);
    const reservations = readDemoReservations().filter((reservation) => reservation.id !== numericId);
    saveDemoReservations(reservations);
    return Promise.resolve(null);
  }

  return request(`/reservations/${id}`, {
    method: "DELETE"
  });
}

