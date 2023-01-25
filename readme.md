# Time Circles (TC)
Time Circles (TC) are a time-dependent display unit for [Circles](https://github.com/CirclesUBI/circles-contracts).

The unit is rooted in the daily UBI payout every user receives in CRC and the fixed inflation rate. It normalizes the daily UBI payout to 24 TC regardless of the inflation.

# Example
If you just want to convert TC to CRC and vice versa you can use https://circlesubi.github.io/timecircles/

# Usage
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
