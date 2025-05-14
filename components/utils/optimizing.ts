

// Proof that the optimizer is optimal:    
// Assume we did not hit the max number from our optimizer. This means there is some other subset of the times which would
// give us a greater number of dates. At any point within our algorithm, we could have selected the first time that is in
// this hypothetical optimal list because our first value is the earliest time. This means that for each subsequent value
// in our hypothetical list, we could have retrieved that value because we select the first-available value after our current
// one. Recurse until the end. Thus, our optimizer would have been able to recreate this max number value, but that breaks the 

import { AvailableAppointmentSlot } from "../models/appointment";

// assumption so there is no higher max number from our optimizer.
function optimizeWithIndices(dates: Date[], duration: number): [Date[], number[]] {
    // Given a list of dates, and a duration, filter it to maximize number of possible appointments that can be scheduled.
    // Returns a list of dates and their indexes in the original function.
    // This should be a greedy algorithm. First we check the max number of days we can show by taking the first time and all 
    // the first next-available times until we hit the end of the input list. 
    
    let maxDateAmount = 0;
    let prevDate: Date | null = null;
    const optimizedDates = [];
    const optimizedIndices = [];
    const isNotOverlapping = (d1: Date, d2: Date, minutes:number) => {
        return d2.getTime() - d1.getTime() >= minutes * 60 * 1000
    }

    for (let idx = 0; idx < dates.length; idx++) {
        const currentDate = dates[idx];
        if (!prevDate || isNotOverlapping(prevDate, currentDate, duration)) {
            maxDateAmount = maxDateAmount + 1;
            optimizedDates.push(currentDate);
            optimizedIndices.push(idx)
            prevDate = currentDate;
        }
    }
    return [optimizedDates, optimizedIndices];
}

export function optimize(dates: Date[], duration: number): Date[] {
    dates = dates.sort((a, b) => a.getTime() - b.getTime());
    const datesAndIndices = optimizeWithIndices(dates, duration);
    return datesAndIndices[0];
}

export function optimizeSlots(slots: AvailableAppointmentSlot[], duration: number): AvailableAppointmentSlot[] {
    slots = slots.sort((a, b) => a.date.getTime() - b.date.getTime())
    const slotDates = slots.map((slot) => slot.date);
    const optimizedSlotDates = optimizeWithIndices(slotDates, duration);
    const optimizedIndices = optimizedSlotDates[1];
    const finalSlots = optimizedIndices.map((idx) => slots[idx])
    return finalSlots
}