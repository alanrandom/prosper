import { AssessmentSlot } from "../models/assessment-slot";
import { Appointment, AvailableAppointmentSlot } from "../models/appointment";
import { psychologist, therapist } from "../models/mock-clinician";


export function getDaysInBetween(d1: Date, d2: Date) {
    // Normalize to midnight (00:00:00) on the respective dates
    const normalizedD1 = new Date(d1.getFullYear(), d1.getMonth(), d1.getDate());
    const normalizedD2 = new Date(d2.getFullYear(), d2.getMonth(), d2.getDate());

    // Difference in milliseconds
    const diffMs = normalizedD1.getTime() - normalizedD2.getTime();

    // Convert to days
    return  Math.floor(diffMs / (1000 * 60 * 60 * 24));
}

export function assessmentToAvailableSlot(slot: AssessmentSlot): AvailableAppointmentSlot {
    // Helper to transform the mocked slot data from a barebones length/date into a full availability slot
    const now = new Date(Date.now())
    const clinicianId = slot.length == 60 ? therapist.id : psychologist.id
    return {
        id: crypto.randomUUID(),
        clinicianId: clinicianId,
        ...slot,
        createdAt: now,
        updatedAt: now,
    }

}

function getDateString(date: Date): string {
  const midnight = new Date(date);
  midnight.setUTCHours(0, 0, 0, 0)
  return midnight.toISOString();
}

function getWeekDates(date: Date): Date[] {
  //This function just returns the 7 days of the week that a specific input date falls under.
  const week: Date[] = []
  const dayOfWeek = date.getUTCDay();
  const sunday = date.setUTCHours(0, 0, 0, 0) - dayOfWeek * 1000 * 60 * 60 * 24;
  for (let i = 0; i < 7; i++) {
    const day = new Date(sunday + i* 1000 * 60 * 60 * 24);
    week.push(day)
  }
  return week;
}


export function getDateMap(existingAppointments: Appointment[]): Map<string, [number, number]> {
    // Helper to return how many dates are already selected in a single-day and 7-day period.
    // Maps don't handle date keys well so using strings instead. 
    const dateMap = new Map<string, [number, number]>()
    for (let idx = 0; idx < existingAppointments.length; idx++) {
      const currentApt = existingAppointments[idx]
      const currentDate = new Date(currentApt.scheduledFor)
      const fullWeekDays = getWeekDates(currentDate)
      for (let i = 0; i < 7; i++) {
        const day = getDateString(fullWeekDays[i]);
        const maybeExistingApts = dateMap.get(day)
        // If the day is already in our map, we add to the weekly, and also daily if it's the current date. Otherwise populate it.
        if (maybeExistingApts) {
          if (day == getDateString(currentDate)) {
            dateMap.set(day, [maybeExistingApts[0] + 1, maybeExistingApts[1] + 1])
          } else {
            dateMap.set(day, [maybeExistingApts[0], maybeExistingApts[1] + 1])
          }
        } else {
          if (day == getDateString(currentDate)) {
            dateMap.set(day, [1, 1])
          } else {
            dateMap.set(day, [0, 1])
          }
        }
      }
    }
    return dateMap
}

export function canAddSlot(
    slot: AvailableAppointmentSlot,
    dayMax: number,
    weekMax: number,
    existingAppointments: Map<string, [number, number]>,
): boolean {
    const maybeSlot = existingAppointments.get(getDateString(slot.date));
    if (maybeSlot && (maybeSlot[0] >= dayMax || maybeSlot[1] >= weekMax)) {
        return false
    }
    return true
}
