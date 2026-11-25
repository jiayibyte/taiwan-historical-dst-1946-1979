import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATASET_PATH = path.resolve(__dirname, '../data/taiwan-dst-1946-1979.json');

export const TAIWAN_DST_DATASET = JSON.parse(fs.readFileSync(DATASET_PATH, 'utf8'));
export const TAIWAN_DST_PERIODS = TAIWAN_DST_DATASET.periods;

const pad2 = (n) => String(n).padStart(2, '0');

/**
 * Inspect whether a Taiwan local wall-clock date/time ("YYYY-MM-DD" or "YYYY-MM-DDTHH:MM")
 * fell within Taiwan's 1946-1979 historical Daylight Saving Time windows.
 */
export function checkTaiwanDst(localDateTime) {
  const m = /^(\d{4})-(\d{2})-(\d{2})(?:[T ](\d{2}):(\d{2}))?$/.exec(localDateTime.trim());
  if (!m) {
    throw new Error(`Invalid local date/time format: "${localDateTime}". Expected YYYY-MM-DD or YYYY-MM-DDTHH:MM`);
  }
  const year = Number(m[1]);
  const month = Number(m[2]);
  const day = Number(m[3]);
  const hasTime = m[4] !== undefined;
  const hour = hasTime ? Number(m[4]) : 12;
  const minute = hasTime ? Number(m[5]) : 0;
  const dateStr = `${year}-${pad2(month)}-${pad2(day)}`;

  // 1937-10-01 to 1945-09-20: year-round UTC+9 standard timezone change (not seasonal DST)
  if (dateStr >= '1937-10-01' && dateStr <= '1945-09-20') {
    return {
      input: localDateTime,
      isDst: false,
      status: 'wartime_standard_utc_plus_9',
      dstOffsetMinutes: 0,
      utcOffset: '+09:00',
      standardLocalDateTime: hasTime ? `${dateStr}T${pad2(hour)}:${pad2(minute)}` : dateStr,
      note: 'Late Japanese colonial era year-round standard timezone (UTC+9), not seasonal DST.',
    };
  }

  const period = TAIWAN_DST_PERIODS.find((p) => p.year === year);
  if (!period || dateStr < period.start_date || dateStr > period.end_date) {
    return {
      input: localDateTime,
      isDst: false,
      status: 'standard_time',
      dstOffsetMinutes: 0,
      utcOffset: '+08:00',
      standardLocalDateTime: hasTime ? `${dateStr}T${pad2(hour)}:${pad2(minute)}` : dateStr,
      period: null,
    };
  }

  if (hasTime && dateStr === period.start_date && hour === 0) {
    return {
      input: localDateTime,
      isDst: false,
      status: 'skipped_hour',
      dstOffsetMinutes: null,
      utcOffset: null,
      standardLocalDateTime: null,
      period,
      note: 'Clocks sprang forward from 00:00 to 01:00 on DST start day; 00:00-00:59 did not exist on local clocks.',
    };
  }

  if (hasTime && dateStr === period.end_date && hour === 23) {
    return {
      input: localDateTime,
      isDst: true,
      status: 'repeated_hour',
      dstOffsetMinutes: 60,
      utcOffset: '+09:00 or +08:00',
      standardLocalDateTime: `${dateStr}T22:${pad2(minute)} (first occurrence) or ${dateStr}T23:${pad2(minute)} (second occurrence)`,
      period,
      note: 'Clocks fell back at 24:00 DST to 23:00 CST; 23:00-23:59 occurred twice on the final day.',
    };
  }

  const wallMs = Date.UTC(year, month - 1, day, hour, minute) - period.dst_offset_minutes * 60_000;
  const std = new Date(wallMs);
  const stdStr = hasTime
    ? `${std.getUTCFullYear()}-${pad2(std.getUTCMonth() + 1)}-${pad2(std.getUTCDate())}T${pad2(std.getUTCHours())}:${pad2(std.getUTCMinutes())}`
    : dateStr;

  return {
    input: localDateTime,
    isDst: true,
    status: 'dst_active',
    dstOffsetMinutes: period.dst_offset_minutes,
    utcOffset: '+09:00',
    standardLocalDateTime: stdStr,
    period,
  };
}
