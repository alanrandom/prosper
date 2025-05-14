// DB model AvailableSlot {
//   id                      String
//   clinicianId             String    @db.Uuid
//   clinician               Clinician @relation(fields: [clinicianId], references: [id])
//   date                    DateTime
//   length                  Int
//   createdAt               DateTime  @default(now())
//   updatedAt               DateTime  @default(now()) @updatedAt
// }

import { AvailableAppointmentSlot } from "../models/appointment";
import { MOCK_ASSESSMENT_SLOTS } from "../models/assessment-slot";
import { assessmentToAvailableSlot } from "../utils/helpers";

//We're mocking calls to this. I normally have this in Django/postgres and just call model.get() but not set up here.

export function getAvailableSlotsMock(): AvailableAppointmentSlot[] {
    return MOCK_ASSESSMENT_SLOTS.map((slot) => assessmentToAvailableSlot(slot))
}