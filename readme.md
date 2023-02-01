# Time Circles (TC)
Time Circles (TC) are a time-dependent display unit for [Circles](https://github.com/CirclesUBI/circles-contracts).

The unit is rooted in the daily UBI payout every user receives in CRC and the fixed inflation rate. It normalizes the daily UBI payout to 24 TC regardless of the inflation.

# Example
If you just want to convert TC to CRC and vice versa you can use https://circlesubi.github.io/timecircles/

# Usage (js + typescript)
```js
import {crcToTc, tcToCrc} from "@circles/timecircles";

// Since TC are time-dependent we'll always need a timestamp
const transactionTimestamp = new Date("2022-05-03T04:21:25.000Z");
// The amount in CRC
const transactionCrcAmount = 8.566935185185093;  

// Convert to TC
const tcAmount = crcToTc(transactionTimestamp, transactionCrcAmount);
console.log(`${transactionCrcAmount} CRC are ${tcAmount} TC at ${transactionTimestamp}`);

// Convert back to CRC
const crcAmount = tcToCrc(transactionTimestamp, tcAmount);
console.log(`${crcAmount} TC are ${crcAmount} CRC at ${transactionTimestamp}`);
```

# Usage (postgres)
Execute the scripts from the 'plpgsql' folder to prepare your database.
```sql
-- 
-- Note: The functions use millisecond based unix timestamps as arguments so you need to multiply the postgres timestamp with 1000
-- 
select crc_to_tc((extract(epoch from '2023-02-01T13:13:04'::timestamp) * 1000)::numeric, 1);
select tc_to_crc((extract(epoch from '2023-02-01T13:13:04'::timestamp) * 1000)::numeric, 2.56667391670206905732776536);
```
