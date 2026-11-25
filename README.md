# Taiwan Historical Daylight Saving Time Dataset (1946–1979)

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

Verified, machine-readable dataset (**JSON** & **CSV**) and zero-dependency JavaScript helper for every historical Daylight Saving Time (夏令時間 / 日光節約時間) period observed in Taiwan (`Asia/Taipei`).

- **Interactive Online Lookup (繁體中文):** [台灣歷史夏令時間查詢工具 — MyLuckie](https://myluckie.com/gongju/xialing)
- **English Solar Time & BaZi Calculator:** [MyLuckie English Calculator](https://myluckie.com/en)

## Why This Dataset Matters

Taiwan does not currently observe Daylight Saving Time, so many modern applications assume `Asia/Taipei` has always been fixed at `UTC+08:00`. In reality, Taiwan moved clocks forward by **+1 hour (`UTC+09:00`)** across **19 historical summers** between **1946 and 1979** (ROC years 35–68):

- **1946–1961 (民國 35–50 年):** 16 consecutive post-war years (with varying start/end dates from March to October)
- **1974–1975 (民國 63–64 年):** 2 years reinstated during the first oil crisis
- **1979 (民國 68 年):** Final single-year reinstatement during the second oil crisis
- **1980–present:** Discontinued permanently

> **Note on 1937–1945:** From October 1, 1937 to September 20, 1945 (late Japanese colonial era), Taiwan adopted Japan Standard Time (`UTC+09:00`) year-round as a standard timezone change rather than seasonal Daylight Saving Time.

Common real-world use cases where ignoring historical Taiwan DST causes 1-hour errors:
1. **Historical timestamp & archive normalization** (hospital records, civil registry logs, aviation/weather archives).
2. **Genealogy & astronomical event reconstruction** (sunrise/sunset, solar noon, true solar time).
3. **Traditional Chinese calendar & birth-chart systems (八字四柱 / 紫微斗數)** — birth certificates issued during those 19 summers recorded wall-clock DST (`UTC+9`), which must be converted back to standard time (`UTC+8`) before computing solar time and the 2-hour Chinese *Shichen* (時辰).

## Complete Table (19 Years)

| Year | ROC Year | Start Date (00:00 → 01:00) | Last Day (24:00 → 23:00) | Duration | Offset | Historical Era |
| ---: | :--- | :--- | :--- | ---: | :--- | :--- |
| 1946 | 民國 35 年 | `1946-05-15` | `1946-09-30` | 139 days | +60 min (UTC+9) | Post-war annual DST (1946-1961) |
| 1947 | 民國 36 年 | `1947-04-15` | `1947-10-31` | 200 days | +60 min (UTC+9) | Post-war annual DST (1946-1961) |
| 1948 | 民國 37 年 | `1948-05-01` | `1948-09-30` | 153 days | +60 min (UTC+9) | Post-war annual DST (1946-1961) |
| 1949 | 民國 38 年 | `1949-05-01` | `1949-09-30` | 153 days | +60 min (UTC+9) | Post-war annual DST (1946-1961) |
| 1950 | 民國 39 年 | `1950-05-01` | `1950-09-30` | 153 days | +60 min (UTC+9) | Post-war annual DST (1946-1961) |
| 1951 | 民國 40 年 | `1951-05-01` | `1951-09-30` | 153 days | +60 min (UTC+9) | Post-war annual DST (1946-1961) |
| 1952 | 民國 41 年 | `1952-03-01` | `1952-10-31` | 245 days | +60 min (UTC+9) | Post-war annual DST (1946-1961) |
| 1953 | 民國 42 年 | `1953-04-01` | `1953-10-31` | 214 days | +60 min (UTC+9) | Post-war annual DST (1946-1961) |
| 1954 | 民國 43 年 | `1954-04-01` | `1954-10-31` | 214 days | +60 min (UTC+9) | Post-war annual DST (1946-1961) |
| 1955 | 民國 44 年 | `1955-04-01` | `1955-09-30` | 183 days | +60 min (UTC+9) | Post-war annual DST (1946-1961) |
| 1956 | 民國 45 年 | `1956-04-01` | `1956-09-30` | 183 days | +60 min (UTC+9) | Post-war annual DST (1946-1961) |
| 1957 | 民國 46 年 | `1957-04-01` | `1957-09-30` | 183 days | +60 min (UTC+9) | Post-war annual DST (1946-1961) |
| 1958 | 民國 47 年 | `1958-04-01` | `1958-09-30` | 183 days | +60 min (UTC+9) | Post-war annual DST (1946-1961) |
| 1959 | 民國 48 年 | `1959-04-01` | `1959-09-30` | 183 days | +60 min (UTC+9) | Post-war annual DST (1946-1961) |
| 1960 | 民國 49 年 | `1960-06-01` | `1960-09-30` | 122 days | +60 min (UTC+9) | Post-war annual DST (1946-1961) |
| 1961 | 民國 50 年 | `1961-06-01` | `1961-09-30` | 122 days | +60 min (UTC+9) | Post-war annual DST (1946-1961) |
| 1974 | 民國 63 年 | `1974-04-01` | `1974-09-30` | 183 days | +60 min (UTC+9) | First oil crisis reinstatement (1974-1975) |
| 1975 | 民國 64 年 | `1975-04-01` | `1975-09-30` | 183 days | +60 min (UTC+9) | First oil crisis reinstatement (1974-1975) |
| 1979 | 民國 68 年 | `1979-07-01` | `1979-09-30` | 92 days | +60 min (UTC+9) | Second oil crisis final reinstatement (1979) |

## Files

- [`data/taiwan-dst-1946-1979.json`](data/taiwan-dst-1946-1979.json) — Structured JSON with ISO-8601 UTC transition timestamps, ROC years, and era metadata.
- [`data/taiwan-dst-1946-1979.csv`](data/taiwan-dst-1946-1979.csv) — Flat CSV ready for spreadsheets, SQL imports, or Python/R pandas workflows.
- [`src/taiwan-dst.mjs`](src/taiwan-dst.mjs) — Zero-dependency ESM helper (`checkTaiwanDst`) handling active DST, standard time, skipped start hour (`00:00–00:59`), repeated end hour (`23:00–23:59`), and 1937–1945 wartime `UTC+9`.
- [`scripts/verify.mjs`](scripts/verify.mjs) — Cross-verification test suite comparing every JSON and CSV boundary against Node's built-in IANA `Asia/Taipei` tzdb.

## Quick Usage (Node.js 18+)

```js
import { checkTaiwanDst } from './src/taiwan-dst.mjs';

console.log(checkTaiwanDst('1979-08-15T14:00'));
// {
//   input: '1979-08-15T14:00',
//   isDst: true,
//   status: 'dst_active',
//   dstOffsetMinutes: 60,
//   utcOffset: '+09:00',
//   standardLocalDateTime: '1979-08-15T13:00',
//   period: { year: 1979, roc_year: 68, start_date: '1979-07-01', end_date: '1979-09-30', ... }
// }
```

### Run Verification

```bash
node scripts/verify.mjs
```

## 繁體中文說明

本資料集收錄台灣西元 **1946–1979 年（民國 35–68 年）** 共 19 個實施夏令時間（日光節約時間）的完整起訖日期、UTC 切換時間點與標準時間換算程式，逐年與 IANA `Asia/Taipei` 時區資料庫交叉驗證。

若想直接在瀏覽器輸入出生日期與時間查詢是否落於夏令時間並換算真太陽時，可使用互動工具：[台灣歷史夏令時間查詢 — MyLuckie](https://myluckie.com/gongju/xialing)。

## License

MIT License — free for commercial, academic, and open-source use.
