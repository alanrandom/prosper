import { getAssessmentSlots, getPsychologistSlots, getTherapistSlots } from "../../components/utils/assessment-slots"
import { patient, patientCA } from "../../components/models/mock-patient"
import { psychologist, therapist } from "../../components/models/mock-clinician"
import { assessmentToAvailableSlot } from "../../components/utils/helpers"
import { Clinician } from "../../components/models/clinician"
import { PatientSlots } from "../../components/models/assessment-slot"
import { assert } from "console"
import { Appointment } from "../../components/models/appointment"


describe('Assessment Slot Retrieval', () => {

    const examplePsychologistData = [
      {
        "length": 90,
        "date": "2024-08-19T12:00:00.000Z"
      },
      {
        "length": 90,
        "date": "2024-08-19T12:15:00.000Z"
      },
      {
        "length": 90,
        "date": "2024-08-21T12:00:00.000Z"
      },
      {
        "length": 90,
        "date": "2024-08-21T15:00:00.000Z"
      },
      {
        "length": 90,
        "date": "2024-08-22T15:00:00.000Z"
      },
      {
        "length": 90,
        "date": "2024-08-28T12:15:00.000Z"
      }
    ].map((slot) => (assessmentToAvailableSlot({
        length: slot.length,
        date: new Date(slot.date)
    })))

    const exampleTherapistData = [
      {
        "length": 60,
        "date": "2024-08-19T12:00:00.000Z"
      },
      {
        "length": 60,
        "date": "2024-08-19T12:15:00.000Z"
      },
      {
        "length": 60,
        "date": "2024-08-21T12:00:00.000Z"
      },
      {
        "length": 60,
        "date": "2024-08-21T15:00:00.000Z"
      },
      {
        "length": 60,
        "date": "2024-08-22T15:00:00.000Z"
      },
      {
        "length": 60,
        "date": "2024-08-28T12:15:00.000Z"
      }
    ].map((slot) => (assessmentToAvailableSlot({
        length: slot.length,
        date: new Date(slot.date)
    })))

    const mockPsychologist: Clinician = {...psychologist, availableSlots: examplePsychologistData}
    const mockTherapist: Clinician = {...therapist, availableSlots: examplePsychologistData}

    const expectedTherapistDates = exampleTherapistData.map((slot) => slot.date)
    const expectedPsychologistDates: [Date, Date][] = [
        ["2024-08-19T12:00:00.000Z", "2024-08-21T12:00:00.000Z"],
        ["2024-08-19T12:00:00.000Z", "2024-08-21T15:00:00.000Z"],
        ["2024-08-19T12:00:00.000Z", "2024-08-22T15:00:00.000Z"],
        ["2024-08-19T12:15:00.000Z", "2024-08-21T12:00:00.000Z"],
        ["2024-08-19T12:15:00.000Z", "2024-08-21T15:00:00.000Z"],
        ["2024-08-19T12:15:00.000Z", "2024-08-22T15:00:00.000Z"],
        ["2024-08-21T12:00:00.000Z", "2024-08-22T15:00:00.000Z"],
        ["2024-08-21T12:00:00.000Z", "2024-08-28T12:15:00.000Z"],
        ["2024-08-21T15:00:00.000Z", "2024-08-22T15:00:00.000Z"],
        ["2024-08-21T15:00:00.000Z", "2024-08-28T12:15:00.000Z"],
        ["2024-08-22T15:00:00.000Z", "2024-08-28T12:15:00.000Z"]
    ].map((slotPair) => [new Date(slotPair[0]), new Date(slotPair[1])])
    const expectedAssessmentSlots: PatientSlots = new Map()
    expectedAssessmentSlots.set("8c516382-c5b2-4677-a7ac-4e100fa35bdd", expectedTherapistDates)
    expectedAssessmentSlots.set("9c516382-c5b2-4677-a7ac-4e100fa35bdd", expectedPsychologistDates)
    const expectedAssessmentSlotsCA: PatientSlots = new Map()
    expectedAssessmentSlotsCA.set("9c516382-c5b2-4677-a7ac-4e100fa35bdd", expectedPsychologistDates)

    const expectedOptimizedPsychologistData: [Date, Date][] = [
        [ "2024-08-19T12:00:00.000Z", "2024-08-21T12:00:00.000Z" ],
        [ "2024-08-19T12:00:00.000Z", "2024-08-21T15:00:00.000Z" ],
        [ "2024-08-19T12:00:00.000Z", "2024-08-22T15:00:00.000Z" ],
        [ "2024-08-21T12:00:00.000Z", "2024-08-22T15:00:00.000Z" ],
        [ "2024-08-21T12:00:00.000Z", "2024-08-28T12:15:00.000Z" ],
        [ "2024-08-21T15:00:00.000Z", "2024-08-22T15:00:00.000Z" ],
        [ "2024-08-21T15:00:00.000Z", "2024-08-28T12:15:00.000Z" ],
        [ "2024-08-22T15:00:00.000Z", "2024-08-28T12:15:00.000Z" ],
    ].map((slotPair) => [new Date(slotPair[0]), new Date(slotPair[1])])
    const expectedOptimizedTherapistData = [
      {
        "length": 90,
        "date": "2024-08-19T12:00:00.000Z"
      },
      {
        "length": 90,
        "date": "2024-08-21T12:00:00.000Z"
      },
      {
        "length": 90,
        "date": "2024-08-21T15:00:00.000Z"
      },
      {
        "length": 90,
        "date": "2024-08-22T15:00:00.000Z"
      },
      {
        "length": 90,
        "date": "2024-08-28T12:15:00.000Z"
      }
    ].map((slot) => new Date(slot.date));

    const expectedOptimizedSlots: PatientSlots = new Map()
    expectedOptimizedSlots.set("8c516382-c5b2-4677-a7ac-4e100fa35bdd", expectedOptimizedTherapistData)
    expectedOptimizedSlots.set("9c516382-c5b2-4677-a7ac-4e100fa35bdd", expectedOptimizedPsychologistData)

    const psychologistResult = getPsychologistSlots(examplePsychologistData, psychologist)
    const therapistResult = getTherapistSlots(exampleTherapistData, therapist)
    const assessmentSlotBaseResult = getAssessmentSlots(patient, false, [mockPsychologist, mockTherapist])
    const assessmentSlotCAResult = getAssessmentSlots(patientCA, false, [mockPsychologist, mockTherapist])
    const optimizedAssessmentSlotResult = getAssessmentSlots(patient, true, [mockPsychologist, mockTherapist])

    it("should return all available pairs of slots for psychologists", () => {
      expect(psychologistResult).toEqual(expectedPsychologistDates);
    })

    it("should return all available slots for therapists", () => {
      expect(therapistResult).toEqual(expectedTherapistDates);
    })

    it("should return data grouped by therapist for a patient", () => {
      expect(assessmentSlotBaseResult).toEqual(expectedAssessmentSlots)
    })

    it("should properly filter out clinicians that are not in scope", () => {
      assert(!assessmentSlotCAResult.has("8c516382-c5b2-4677-a7ac-4e100fa35bdd"))
      expect(assessmentSlotCAResult).toEqual(expectedAssessmentSlotsCA)
    })

    it("should optimize the slots when the optimize flag is true", () => {
      expect(optimizedAssessmentSlotResult).toEqual(expectedOptimizedSlots)
    })


    const apt: Appointment = {
        id: "id",
        patientId: "patientId",
        clinicianId: "clinicianId",
        scheduledFor: new Date("2024-08-19T12:00:00.000Z"),
        appointmentType: "ASSESSMENT_SESSION_1",
        status: "UPCOMING",
        createdAt: new Date("2024-08-19T12:00:00.000Z"),
        updatedAt: new Date("2024-08-19T12:00:00.000Z"),
    }
    const busyMockPsychologist: Clinician = {...psychologist, availableSlots: examplePsychologistData, appointments: [apt, apt]}
    const veryBusyMockPsychologist: Clinician = {...psychologist, availableSlots: examplePsychologistData, appointments: [apt, apt, apt, apt, apt, apt, apt, apt]}
    const weeklyBusyMockPsychologist: Clinician = {...psychologist, availableSlots: examplePsychologistData, appointments: [apt, apt, apt, apt, apt, apt, apt]}

    const busyPsychologistResult = getPsychologistSlots(examplePsychologistData, busyMockPsychologist, false)
    const expectedBusyPsychologistResult: [Date, Date][] = [
        ["2024-08-21T12:00:00.000Z", "2024-08-22T15:00:00.000Z"],
        ["2024-08-21T12:00:00.000Z", "2024-08-28T12:15:00.000Z"],
        ["2024-08-21T15:00:00.000Z", "2024-08-22T15:00:00.000Z"],
        ["2024-08-21T15:00:00.000Z", "2024-08-28T12:15:00.000Z"],
        ["2024-08-22T15:00:00.000Z", "2024-08-28T12:15:00.000Z"]
    ].map((slotPair) => [new Date(slotPair[0]), new Date(slotPair[1])])

    const veryBusyPsychologistResult = getPsychologistSlots(examplePsychologistData, veryBusyMockPsychologist, false)
    const expectedVeryBusyPsychologistResult: [Date, Date][] = []

    const weeklyBusyPsychologistResult = getPsychologistSlots(examplePsychologistData, weeklyBusyMockPsychologist, false)
    const expectedWeeklyBusyPsychologistResult: [Date, Date][] =[
        ["2024-08-21T12:00:00.000Z", "2024-08-28T12:15:00.000Z"],
        ["2024-08-21T15:00:00.000Z", "2024-08-28T12:15:00.000Z"],
        ["2024-08-22T15:00:00.000Z", "2024-08-28T12:15:00.000Z"]
    ].map((slotPair) => [new Date(slotPair[0]), new Date(slotPair[1])]) 

    it("should filter slots when clinicians are at daily capacity", () => {
      expect(busyPsychologistResult).toEqual(expectedBusyPsychologistResult)
    })

    it("should filter many slots when clinicians are at weekly capacity", () => {
      expect(veryBusyPsychologistResult).toEqual(expectedVeryBusyPsychologistResult)
    })

    it("should filter slots when there are too many in 1 week, but we can extend to next week", () => {
      expect(weeklyBusyPsychologistResult).toEqual(expectedWeeklyBusyPsychologistResult)
    })

})