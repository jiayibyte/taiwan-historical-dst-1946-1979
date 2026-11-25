import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { TAIWAN_DST_DATASET, TAIWAN_DST_PERIODS, checkTaiwanDst } from '../src/taiwan-dst.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const csvText = fs.readFileSync(path.resolve(__dirname, '../data/taiwan-dst-1946-1979.csv'), 'utf8').trim();
const csvLines = csvText.split('\n');

// 1. Verify exact period count and JSON/CSV parity
assert.equal(TAIWAN_DST_PERIODS.length, 19, 'Expected exactly 19 Taiwan historical DST years');
assert.equal(TAIWAN_DST_DATASET.total_years, 19);
assert.equal(csvLines.length - 1, 19, 'CSV row count must match JSON period count');

// 2. Cross-verify every period against Node built-in IANA Asia/Taipei timezone database
const fmt = new Intl.DateTimeFormat('en-US', {
  timeZone: 'Asia/Taipei',
  hourCycle: 'h23',
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
  second: 'numeric',
});

function offsetMinAt(utcMs) {
  const n = {};
  for (const p of fmt.formatToParts(new Date(utcMs))) {
    if (p.type !== 'literal') n[p.type] = Number(p.value);
  }
  const wallMs = Date.UTC(n.year, n.month - 1, n.day, n.hour, n.minute, n.second);
  return Math.round((wallMs - utcMs) / 60000);
}

for (let i = 0; i < TAIWAN_DST_PERIODS.length; i++) {
  const p = TAIWAN_DST_PERIODS[i];
  assert.equal(p.roc_year, p.year - 1911, `ROC year mismatch for ${p.year}`);
  assert.equal(p.dst_offset_minutes, 60);

  const startMs = Date.parse(p.start_utc_iso);
  const endMs = Date.parse(p.end_utc_iso);
  assert.equal(offsetMinAt(startMs - 60_000), 480, `Expected UTC+8 right before ${p.year} DST start`);
  assert.equal(offsetMinAt(startMs + 60_000), 540, `Expected UTC+9 right after ${p.year} DST start`);
  assert.equal(offsetMinAt(endMs - 60_000), 540, `Expected UTC+9 right before ${p.year} DST end`);
  assert.equal(offsetMinAt(endMs + 60_000), 480, `Expected UTC+8 right after ${p.year} DST end`);

  const row = csvLines[i + 1].split(',');
  assert.equal(Number(row[0]), p.year);
  assert.equal(row[2], p.start_date);
  assert.equal(row[3], p.end_date);
}

// 3. Unit tests for checkTaiwanDst()
const r1979 = checkTaiwanDst('1979-08-15T14:00');
assert.equal(r1979.isDst, true);
assert.equal(r1979.status, 'dst_active');
assert.equal(r1979.standardLocalDateTime, '1979-08-15T13:00');

const r1980 = checkTaiwanDst('1980-08-15T14:00');
assert.equal(r1980.isDst, false);
assert.equal(r1980.status, 'standard_time');
assert.equal(r1980.standardLocalDateTime, '1980-08-15T14:00');

const rSkipped = checkTaiwanDst('1979-07-01T00:30');
assert.equal(rSkipped.status, 'skipped_hour');

const rRepeated = checkTaiwanDst('1979-09-30T23:30');
assert.equal(rRepeated.status, 'repeated_hour');

const rWartime = checkTaiwanDst('1944-06-01T10:00');
assert.equal(rWartime.status, 'wartime_standard_utc_plus_9');
assert.equal(rWartime.isDst, false);

console.log('OK: Verified all 19 Taiwan historical DST periods (JSON + CSV + IANA tzdb + edge cases).');
