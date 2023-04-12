# Time Circles (TC)
Time Circles (TC) are a time-dependent display unit for [Circles](https://github.com/CirclesUBI/circles-contracts). The unit is based on the daily UBI payout every user receives in CRC and the fixed inflation rate. It normalizes the daily UBI payout to 24 TC regardless of the inflation.

## Converter
If you want to convert TC to CRC and vice versa, you can use https://circlesubi.github.io/timecircles/.

## Explanation
### CRC & Inflation
The [Circles Hub contract](https://blockscout.com/xdai/mainnet/address/0x29b9a7fBb8995b2423a71cC17cf9810798F6C543/read-contract#address-tabs) is responsible for the UBI payout to the user. It contains a hardcoded inflation rate of 7% per year. This means the daily amount of CRC a user receives increases every year by 7%.

[Inflation](https://en.wikipedia.org/wiki/Inflation), also known as devaluation of money, occurs when the supply of money increases, but the number of goods and services that can be purchased stays the same. This results in products and services becoming more expensive and the single unit of money being worth less.

### TC & Demurrage
With Time Circles, the daily UBI payout is fixed to 24 TC. At first glance, the inflation rate is not present anymore. However, the inflation rate is still hardcoded in the contract and the actual UBI payout is still in CRC. The additional CRC payout must have an effect on the Time Circles as well. Time Circles resort to so-called "[demurrage](https://www.investopedia.com/terms/d/demurrage.asp)" to represent the loss of value. This means that a Time Circle received today will be worth a little less tomorrow. The effect of demurrage is that the user's TC balance will decrease over time while the prices for goods and services stay the same.


## Usage
### js + typescript
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

### postgres
Execute the scripts from the 'plpgsql' folder to prepare your database.
```sql
-- 
-- Note: The functions use millisecond based unix timestamps as arguments so you need to multiply the postgres timestamp with 1000
-- 
select crc_to_tc((extract(epoch from '2023-02-01T13:13:04'::timestamp) * 1000)::numeric, 1);
select tc_to_crc((extract(epoch from '2023-02-01T13:13:04'::timestamp) * 1000)::numeric, 2.56667391670206905732776536);
```

## Bookkeeping with Time Circles
When using Time Circles for bookkeeping, it's important to keep in mind that the value of a Time Circle decreases over time due to demurrage. 
Therefore, the sum of all Time Circles received and spent during a period of time will not add up to the actual balance at the end of that period. 
To account for this, it's necessary to add a correction booking at the end of each period to denote the value lost due to demurrage.

### Example
Here's an example to illustrate how demurrage affects the balance of an account over time. 
Let's say an account receives 300 Time Circles every 5 days. 
The CRC price for one Time Circle increases daily due to inflation, which means that the balance of the account decreases due to demurrage.

| Time                | CRC in | TC in | CRC total | TC total |
|---------------------|--------|-------|-----------|----------|
| 2022-01-01          | 108.59 | 300   | 108.59    | 300      |
| 2022-01-05          | 108.67 | 300   | 217.26    | 599.74   |
| 2022-01-10          | 108.77 | 300   | 326.03    | 899.15   |
| 2022-01-15          | 108.88 | 300   | 434.91    | 1198.3   |
| 2022-01-20          | 108.98 | 300   | 543.89    | 1497.16  |
| 2022-01-25          | 109.08 | 300   | 652.97    | 1795.73  |
| 2022-01-30          | 109.18 | 300   | 762.15    | 2094.02  |
| 2022-01-31          | -      | -     | 762.15    | 2093.62  |
| End of month total: | 762.15 | 2100  | 762.15    | 2093.62  |

As you can see, the sum of all Time Circles received during the month does not match the actual balance at the end of the month. 
In this case, there is a difference of 6.38 TC between the total TC inflow and the TC balance at the end of the month. 
This difference is the demurrage and needs to be booked as a negative correction at the end of the period.
