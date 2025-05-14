// This file for API calls related to AvailabilitySlots. Interface layer between DB and client.

import { getAvailableSlotsMock } from "../db/availableSlots";
import { AvailableAppointmentSlot } from "../models/appointment";
// import { ClinicianType } from "../models/clinician";
import { InsurancePayer } from "../models/payer";
import { UsStateAbbreviation } from "../models/us-states";


export function getAvailabilities({
    state, 
    insurance, 
    mockData
}:{
    state?: UsStateAbbreviation,
    insurance?: InsurancePayer,
    mockData?: AvailableAppointmentSlot[],
    // firstName?: string,
    // lastName?: string,
    // clinicianType?: ClinicianType,
}): AvailableAppointmentSlot[] {
    // Get all available clinician slots given a set of requirements.
    // As we are just using the mock data, we will just return that data.
    // Normally, we would filter in the DB based on our given requirements if they exist.
    // Assuming the slots DB has clinician data:
    // const slotList = slotsDB.get().where(
    //     clinician.firstName = firstName,
    //     clinician.lastName = lastName,
    //     clinician.state = state,
    //     clinician.insurance = insurance,
    //     clinician.clinicianType = clinicianType
    // )
    // .sortBy(date)
    if (mockData) {
        return mockData
    }
    return getAvailableSlotsMock()
}




