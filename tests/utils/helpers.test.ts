import { Appointment } from "../../components/models/appointment";
import { getDateMap } from "../../components/utils/helpers"



describe('helpers', () => {
    const apt: Appointment = {
        id: "id",
        patientId: "patientId",
        clinicianId: "clinicianId",
        scheduledFor: new Date("2024-08-19T12:00:00.000Z"), //Monday
        appointmentType: "ASSESSMENT_SESSION_1",
        status: "UPCOMING",
        createdAt: new Date("2024-08-19T12:00:00.000Z"),
        updatedAt: new Date("2024-08-19T12:00:00.000Z"),
    }
    //Sunday
    const dateTest: Appointment[] = [apt]
    const dateMapResult = getDateMap(dateTest);

    const expectedDateList: [string, [number, number]][] = [
        [new Date("2024-08-18T00:00:00.000Z").toISOString(), [0, 1]],
        [new Date("2024-08-19T00:00:00.000Z").toISOString(), [1, 1]],
        [new Date("2024-08-20T00:00:00.000Z").toISOString(), [0, 1]],
        [new Date("2024-08-21T00:00:00.000Z").toISOString(), [0, 1]],
        [new Date("2024-08-22T00:00:00.000Z").toISOString(), [0, 1]],
        [new Date("2024-08-23T00:00:00.000Z").toISOString(), [0, 1]],
        [new Date("2024-08-24T00:00:00.000Z").toISOString(), [0, 1]],
    ]
    const expectedDateMap = new Map<string, [number, number]>(expectedDateList)

    it("date map should return a valid date map", () => {
      expect(dateMapResult).toEqual(expectedDateMap)
    })

})