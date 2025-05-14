// This file for API calls related to clinicians. Interface layer between DB and client.

import { getMockClinician } from "../db/clinician";
import { Clinician } from "../models/clinician";
import { InsurancePayer } from "../models/payer";
import { UsStateAbbreviation } from "../models/us-states";


export function getClinicians({
    state, 
    insurance, 
    mockData
}:{
    state?: UsStateAbbreviation,
    insurance?: InsurancePayer,
    mockData?: Clinician[],
    // firstName?: string,
    // lastName?: string,
    // clinicianType?: ClinicianType,
}): Clinician[] {
    // Get all clinicians slots given a set of requirements.
    // As we are just using the mock data, we will just return that data.
    // Normally, we would filter in the DB based on our given requirements if they exist.
    // const slotList = ClinicianDB.get().where(
    //     clinician.firstName = firstName,
    //     clinician.lastName = lastName,
    //     clinician.state = state,
    //     clinician.insurance = insurance,
    //     clinician.clinicianType = clinicianType
    // )
    // .sortBy(date)
    if (mockData) {
        mockData = mockData.filter((clinician) => (!state || clinician.states.includes(state)) && (!insurance || clinician.insurances.includes(insurance)))
        return mockData
    }
    return [getMockClinician("THERAPIST"), getMockClinician("PSYCHOLOGIST")]
}




