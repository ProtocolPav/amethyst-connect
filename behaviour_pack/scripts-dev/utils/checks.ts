import { differenceInSeconds } from 'date-fns';


/**
 * Checks if the distance between two points falls within
 * the given radius
 */
function distance_check(c1: [number, number], c2: [number, number], radius: number): Boolean {
    const distance = Math.sqrt((c1[0] - c2[0]) ** 2 + (c1[1] - c2[1]) ** 2)

    if (distance <= radius) {
        return true
    }

    return false
}


function timer_check(now: Date, start: Date, seconds: number): boolean {
    if (differenceInSeconds(now, start) > seconds) {
        return false
    }

    return true
}

const checks = {
    timer_check: timer_check,
    distance_check: distance_check
}

export default checks