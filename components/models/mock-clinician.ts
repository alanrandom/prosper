import { MOCK_ASSESSMENT_SLOTS } from "./assessment-slot";
import { Clinician } from "./clinician";

export const psychologist: Clinician = {
  id: "9c516382-c5b2-4677-a7ac-4e100fa35bdd",
  firstName: "JaneP",
  lastName: "Doe",
  states: ["NY", "CA"],
  insurances: ["AETNA", "CIGNA"],
  clinicianType: "PSYCHOLOGIST",
  appointments: [],
  availableSlots: [],
  maxDailyAppointments: 2,
  maxWeeklyAppointments: 2,
  createdAt: new Date(),
  updatedAt: new Date(),
};

//made a therapist too just for mock data. Diffs are id is 8 instead of 9, clinician type, and state is missing CA.
export const therapist: Clinician = {
  id: "8c516382-c5b2-4677-a7ac-4e100fa35bdd",
  firstName: "JaneT",
  lastName: "Doe",
  states: ["NY"],
  insurances: ["AETNA", "CIGNA"],
  clinicianType: "THERAPIST",
  appointments: [],
  availableSlots: [],
  maxDailyAppointments: 2,
  maxWeeklyAppointments: 8,
  createdAt: new Date(),
  updatedAt: new Date(),
}


export const psychologist2: Clinician = {
  id: "0c516382-c5b2-4677-a7ac-4e100fa35bdd",
  firstName: "JaneP2",
  lastName: "Doe",
  states: ["NY", "CA"],
  insurances: ["AETNA", "CIGNA"],
  clinicianType: "PSYCHOLOGIST",
  appointments: [],
  availableSlots: MOCK_ASSESSMENT_SLOTS.map((slot) => ({
    id: "randomId",
    clinicianId: "0c516382-c5b2-4677-a7ac-4e100fa35bdd",
    date: slot.date,
    length: slot.length,
    createdAt: slot.date,
    updatedAt: slot.date,
  })),
  maxDailyAppointments: 2,
  maxWeeklyAppointments: 2,
  createdAt: new Date(),
  updatedAt: new Date(),
};
