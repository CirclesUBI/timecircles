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
    const a = daysInCurrentCirclesYear / 365.25;
    return x * (1 - a) + y * a;
}
/**
 * Converts a CRC amount to a TC amount.
 * @param timestamp The point in time when the CRC transaction happened
 * @param amount The CRC value of the transaction
 * @return The TC value of the transaction
 */
export function crcToTc(timestamp, amount) {
    const payoutAtTimestamp = getCrcPayoutAt(timestamp.getTime());
    return amount / payoutAtTimestamp * 24;
}
/**
 * Converts a TC amount to a CRC amount.
 * @param timestamp The point in time when the TC transaction happened
 * @param amount The TC value of the transaction
 * @returns The CRC value of the transaction
 */
export function tcToCrc(timestamp, amount) {
    const payoutAtTimestamp = getCrcPayoutAt(timestamp.getTime());
    return amount / 24 * payoutAtTimestamp;
}
