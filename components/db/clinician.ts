
// DB model Clinician {
//   id                      String
//   firstName               String
//   lastName                String
//   states                  UsState[]
//   insurances              InsurancePayer[]
//   clinicianType           ClinicianType
//   appointments            Appointment[]
//   availableSlots          AvailableSlot[]
//   maxDailyAppointments    Int
//   maxWeeklyAppointments   Int
//   createdAt               DateTime  @default(now())
//   updatedAt               DateTime  @default(now()) @updatedAt
// }

import { MOCK_ASSESSMENT_SLOTS } from "../models/assessment-slot";
import { ClinicianType } from "../models/clinician";
import { psychologist, therapist } from "../models/mock-clinician";
import { assessmentToAvailableSlot } from "../utils/helpers";

//Mock of the db retrievals. I normally have this in Django/postgres and just call model.get() but we're mocking here.

export function getMockClinician(therapistType: ClinicianType) {
    const psychologistSlots = MOCK_ASSESSMENT_SLOTS.filter((slot) => slot.length == 90).map((slot) => assessmentToAvailableSlot(slot))
    const therapistSlots = MOCK_ASSESSMENT_SLOTS.filter((slot) => slot.length = 60).map((slot) => assessmentToAvailableSlot(slot))
    if (therapistType == "PSYCHOLOGIST") {
        return {
            ...psychologist,
            availableSlots: psychologistSlots,
        }
    } else {
        return {
            ...therapist,
            availableSlots: therapistSlots,
        }
    }
}
