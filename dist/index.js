"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tcToCrc = exports.crcToTc = void 0;
/**
 * The point in time when the Circles Hub contract was deployed.
 */
const circlesInceptionTimestamp = new Date("2020-10-15T00:00:00.000Z").getTime();
const oneDayInMilliSeconds = 86400 * 1000;
/**
 * Circles years have 365.25 days.
 */
const oneCirclesYearInDays = 365.25;
const oneCirclesYearInMilliSeconds = oneCirclesYearInDays * 24 * 60 * 60 * 1000;
function getCrcPayoutAt(timestamp) {
    // How many days passed between the circles inception and the transaction?
    const daysSinceCirclesInception = (timestamp - circlesInceptionTimestamp) / oneDayInMilliSeconds;
    // How many circles years passed between the circles inception and the transaction?
    const circlesYearsSince = (timestamp - circlesInceptionTimestamp) / oneCirclesYearInMilliSeconds;
    // How many days passed since the last circles new-year?
    const daysInCurrentCirclesYear = daysSinceCirclesInception % oneCirclesYearInDays;
    // Everyone got 8 CRC per day in the first year
    const initialDailyCrcPayout = 8;
    let circlesPayoutInCurrentYear = initialDailyCrcPayout;
    let previousCirclesPerDayValue = initialDailyCrcPayout;
    // Add the yearly inflation to the initial payout and keep track
    // of the previous and current year's value
    for (let index = 0; index < circlesYearsSince; index++) {
        previousCirclesPerDayValue = circlesPayoutInCurrentYear;
        circlesPayoutInCurrentYear = circlesPayoutInCurrentYear * 1.07;
    }
    // The daily payout for the previous and current year
    const payoutPerDayInYear = {
        current: circlesPayoutInCurrentYear,
        previous: previousCirclesPerDayValue
    };
    // Use linear interpolation to find the 'exact' payout amount at the given point in time
    const x = payoutPerDayInYear.previous;
    const y = payoutPerDayInYear.current;
    const a = daysInCurrentCirclesYear / oneCirclesYearInDays;
    return x * (1 - a) + y * a;
}
/**
 * Converts a CRC amount to a TC amount.
 * @param timestamp The point in time when the CRC transaction happened
 * @param amount The CRC value of the transaction
 * @return The TC value of the transaction
 */
function crcToTc(timestamp, amount) {
    const ts = timestamp instanceof Date
        ? timestamp.getTime()
        : timestamp;
    const payoutAtTimestamp = getCrcPayoutAt(ts);
    return amount / payoutAtTimestamp * 24;
}
exports.crcToTc = crcToTc;
/**
 * Converts a TC amount to a CRC amount.
 * @param timestamp The point in time when the TC transaction happened
 * @param amount The TC value of the transaction
 * @returns The CRC value of the transaction
 */
function tcToCrc(timestamp, amount) {
    const ts = timestamp instanceof Date
        ? timestamp.getTime()
        : timestamp;
    const payoutAtTimestamp = getCrcPayoutAt(ts);
    return amount / 24 * payoutAtTimestamp;
}
exports.tcToCrc = tcToCrc;
//# sourceMappingURL=index.js.map