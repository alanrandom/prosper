import { getClinicians } from "../api/clinicians";
import { AvailableAppointmentSlot } from "../models/appointment";
import { PatientSlots } from "../models/assessment-slot"
import { Clinician } from "../models/clinician";
import { Patient } from "../models/patient"
import { getDateMap, getDaysInBetween, canAddSlot } from "./helpers";
import { optimize, optimizeSlots } from "./optimizing";

const PSYCHOLOGIST_DURATION = 90;

export function getTherapistSlots(
    allSlots: AvailableAppointmentSlot[],
    therapist: Clinician,
    shouldOptimize: boolean=false,
): Date[] {
    // Therapists should show all availability times unless they hit max appointment.
    const existingAppointments = getDateMap(therapist.appointments)
    const availableSlots = allSlots.filter((slot) => canAddSlot(
        slot,
        therapist.maxDailyAppointments,
        therapist.maxWeeklyAppointments,
        existingAppointments,
    ))

    const baseSlots = availableSlots.map((slot) => slot.date);

    return shouldOptimize ? optimize(baseSlots, 60) : baseSlots
}

export function getPsychologistSlots(
    startingSlots: AvailableAppointmentSlot[],
    psychologist: Clinician,
    shouldOptimize: boolean = false,
    specificStartSlot: AvailableAppointmentSlot | null = null,
): [Date, Date][] {
    // Given the list of all slots, find all pairs of slots that differ by 1-7 days. Assume this list is sorted.
    // This can be optimized to do binary search for first and last slots that fit the condition, but this will suffice for now. The max number
    // of items to check per first slot is 7 * 24 * 4 = 692.

    const existingAppointments = getDateMap(psychologist.appointments)

    const allSlots = shouldOptimize ? optimizeSlots(startingSlots, PSYCHOLOGIST_DURATION) : startingSlots

    const availableSlots = allSlots.filter((slot) => canAddSlot(
        slot,
        psychologist.maxDailyAppointments,
        psychologist.maxWeeklyAppointments,
        existingAppointments,
    ))
    console.log(existingAppointments)
    console.log(psychologist.appointments)

    const offerableSlotPairs: [Date, Date][] = [];
    for (let firstIdx = 0; firstIdx < availableSlots.length; firstIdx++) {
        const maybeFirstSlot = availableSlots[firstIdx];
        if (specificStartSlot && specificStartSlot.date.toDateString() != maybeFirstSlot.date.toDateString()) {
            continue
        }
        for (let secondIdx = firstIdx + 1; secondIdx < availableSlots.length; secondIdx++) {
            const maybeSecondSlot = availableSlots[secondIdx]
            const daysBetween = getDaysInBetween(maybeSecondSlot.date, maybeFirstSlot.date)
            if (daysBetween > 0 && daysBetween < 8) {
                //Also need to ensure that we do not add 2 appointments and go over the weekly capacity
                if (!(maybeSecondSlot.date.getDay() > maybeFirstSlot.date.getDay() && 
                    !canAddSlot(maybeSecondSlot, psychologist.maxDailyAppointments, psychologist.maxWeeklyAppointments - 1, existingAppointments))
                ) {
                    offerableSlotPairs.push([maybeFirstSlot.date, maybeSecondSlot.date])
                }
            } else if (daysBetween >= 8) {
                break;
            }
        }
    }
    return offerableSlotPairs;
}


export function getAssessmentSlots(
    patient: Patient, 
    shouldOptimize: boolean,
    mockDocData: Clinician[],
    maybeStart: AvailableAppointmentSlot | null = null,
): PatientSlots {
    // Given a patient, return a list of available clinician spots they can book grouped by clinician.
    // We will grab all clinicians that the patient can go to (just mocked for now). For each clinician,
    // We simply run the getSlots code written above to get availabilities.

    const allClinicians = (
        mockDocData 
        ? getClinicians({mockData: mockDocData, insurance: patient.insurance, state: patient.state}) 
        : getClinicians({insurance:patient.insurance, state:patient.state}) 
    )

    const clinicianMap = new Map(allClinicians.map(clinician => [clinician.id, 
        clinician.clinicianType == "PSYCHOLOGIST"
        ? getPsychologistSlots(clinician.availableSlots, clinician, shouldOptimize, maybeStart)
        : getTherapistSlots(clinician.availableSlots, clinician, shouldOptimize)
    ]));

    return clinicianMap
}
