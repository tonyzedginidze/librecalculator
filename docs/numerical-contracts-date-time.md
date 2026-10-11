# Date and time numerical contracts

Civil dates are strict `YYYY-MM-DD`, years 0001–9999, proleptic Gregorian leap rule (divisible by 4 except centuries not divisible by 400), validated before arithmetic. A bounded integer ordinal counts days from year one. These engines never read the clock, timezone or storage. Date inputs are text; adapters preserve their canonical format. All computed numeric rows derive from the same result.

## Age

Completed years at an explicit reference date; subtract one from year difference until the birthday month/day is reached. Birth cannot follow reference. February 29 birthdays advance March 1 in non-leap years; this is a mathematical convention, not a legal age determination. Independent fixtures 2000-02-29 to 2024-02-29=24; 2000-10-20 to 2024-10-19=23; same date=0.

## Date difference and countdown

Elapsed days are signed end ordinal minus start ordinal. Inclusive counting adds one and requires non-reversed dates. Countdown uses signed target minus explicit reference, with past events negative. No DST, exact hours, workdays or holidays. Independent fixtures 2024-02-28 to 2024-03-01=2 elapsed or 3 inclusive; reverse=-2; 2024-12-20 to 2025-01-01=12. Days-between-dates is merged into date-difference.

## Work hours

Strict 24-hour `HH:MM`. Explicit shift-end choice `same-day` or `next-day`, mapped to the next-day flag 0 or 1, elapsed minutes `end−start+1440×flag`, bounded 0–1440. Unpaid break integer minutes 0–elapsed. Paid decimal hours `(elapsed−break)/60`. Wall-clock duration without DST or wage/overtime rules. Independent fixtures 09:00–17:00 minus 30 minutes=7.5h; 22:00–06:00 next-day=8h; 10:00–12:15 minus15=2h. Negative elapsed shifts or oversized breaks fail.

## Fixed UTC offsets

Source hour 0–23, minute 0–59; whole-minute offsets −840 through +840, chosen from the offsets in use (UTC−12:00 to UTC+14:00) as IDs such as `utc-minus-5` or `utc-plus-5-30`. Total source minute−source offset+target offset; floor division by1440 returns day shift, remainder returns target minute-of-day 0–1439. Minute-of-day is the primary numeric output; the view shows it as HH:MM with the day shift, and the lesson explains the conversion. Independent fixtures 23:30 UTC→UTC+2 returns90 minutes, day+1; 01:00 UTC+2→UTC returns1380 minutes, day−1; noon UTC→UTC+5:30 returns1050 minutes. No named-zone or DST database; use known offsets for the event date.

## Video status

Age, date-difference, countdown, work-hours and time-zone are explicitly **video pending**. Narration and wide/tall rendering remain launch readiness work.
