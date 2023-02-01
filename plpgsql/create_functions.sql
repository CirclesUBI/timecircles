CREATE OR REPLACE FUNCTION get_crc_payout_at(ts numeric)
RETURNS numeric
AS $$
DECLARE
  circlesInceptionTimestamp numeric = 1602720000000;
  oneDayInMilliseconds numeric = 86400000;
  oneCirclesYearInDays numeric = 365.25;
  oneCirclesYearInMilliSeconds numeric = 365.25 * 24 * 60 * 60 * 1000;
  initialDailyCrcPayout numeric = 8;

  days_since_circles_inception numeric;
  circles_years_since numeric;
  daysInCurrentCirclesYear numeric;
  circlesPayoutInCurrentYear numeric;
  previousCirclesPerDayValue numeric;

  x numeric;
  y numeric;
  a numeric;
BEGIN
  days_since_circles_inception = (ts - circlesInceptionTimestamp) / oneDayInMilliSeconds;
  circles_years_since = (ts - circlesInceptionTimestamp) / oneCirclesYearInMilliSeconds;
  daysInCurrentCirclesYear = days_since_circles_inception % oneCirclesYearInDays;

  circlesPayoutInCurrentYear = initialDailyCrcPayout;
  previousCirclesPerDayValue = initialDailyCrcPayout;

  FOR index IN 0..trunc(circles_years_since)
  LOOP
    previousCirclesPerDayValue = circlesPayoutInCurrentYear;
    circlesPayoutInCurrentYear = circlesPayoutInCurrentYear * 1.07;
  END LOOP;

  x = previousCirclesPerDayValue;
  y = circlesPayoutInCurrentYear;
  a = daysInCurrentCirclesYear / oneCirclesYearInDays;

  RETURN x * (1 - a) + y * a;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION crc_to_tc(ts numeric, amount numeric)
RETURNS numeric
AS $$
BEGIN
  RETURN amount / get_crc_payout_at(ts) * 24;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION tc_to_crc(ts numeric, amount numeric)
RETURNS double precision
AS $$
DECLARE
BEGIN
  RETURN amount / 24 * get_crc_payout_at(ts);
END;
$$ LANGUAGE plpgsql;
