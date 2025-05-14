import { optimize } from "../../components/utils/optimizing"

describe ("Slot Showing Optimization", () => {
    
    const appointments = [
        new Date("2024-08-19T12:00:00.000Z"),
        new Date("2024-08-19T12:15:00.000Z"),
        new Date("2024-08-19T12:30:00.000Z"),
        new Date("2024-08-19T12:45:00.000Z"),
        new Date("2024-08-19T13:00:00.000Z"),
        new Date("2024-08-19T13:15:00.000Z"),
        new Date("2024-08-19T13:30:00.000Z"),
    ]

    const result = optimize(appointments, 90);
    const expected = [
        new Date("2024-08-19T12:00:00.000Z"),
        new Date("2024-08-19T13:30:00.000Z"),
    ]

    test("Should filter for maximum availability", () => {
        expect(result).toEqual(expected);
    })

    const moreDates = [
        new Date("2024-08-20T13:30:00.000Z"),
        new Date("2024-08-19T12:00:00.000Z"),
        new Date("2024-08-19T12:15:00.000Z"),
        new Date("2024-08-19T12:30:00.000Z"),
        new Date("2024-08-19T12:45:00.000Z"),
        new Date("2024-08-19T13:00:00.000Z"),
        new Date("2024-08-19T13:15:00.000Z"),
        new Date("2024-08-19T13:30:00.000Z"),
        new Date("2024-08-20T13:00:00.000Z"),
        new Date("2024-08-20T12:00:00.000Z"),
        new Date("2024-08-20T13:15:00.000Z"),
    ]

    const moreResult = optimize(moreDates, 90)

    const moreExpected = [
        new Date("2024-08-19T12:00:00.000Z"),
        new Date("2024-08-19T13:30:00.000Z"),
        new Date("2024-08-20T12:00:00.000Z"),
        new Date("2024-08-20T13:30:00.000Z"),
    ]

    test("should filter multiple days of unsorted data", () => {
        expect(moreResult).toEqual(moreExpected);
    })


})
