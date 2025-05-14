import { Patient } from "./patient";

export const patient: Patient = {
  id: "some-uuidv4",
  firstName: "Byrne",
  lastName: "Hollander",
  state: "NY",
  insurance: "AETNA",
  createdAt: new Date(),
  updatedAt: new Date(),
};

// Just a patient copy but state is CA
export const patientCA: Patient = {
  id: "some-other-uuidv4",
  firstName: "Byrne",
  lastName: "Hollander",
  state: "CA",
  insurance: "AETNA",
  createdAt: new Date(),
  updatedAt: new Date(),
};