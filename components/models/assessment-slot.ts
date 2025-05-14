import { MOCK_SLOT_DATA } from "./mock-slot-data";

//This is just for the mock data. 
export type AssessmentSlot = {
    length: number;
    date: Date;
}

//Return type is either single slots for a therapist or pairs of slots for a psychologist.
export type PatientSlots = Map<string, ([Date, Date][] | Date[])>

export const MOCK_ASSESSMENT_SLOTS = MOCK_SLOT_DATA.map((slot) => ({
    length: slot.length,
    date: new Date(slot.date)
}))