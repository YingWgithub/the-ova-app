/* Calendar conversion uses lunar-javascript 1.7.7 (MIT, see vendor license). */
function nextBirthdayDate(birthday, now = new Date()) {
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const [, month, day] = birthday.birthDate.split("-").map(Number);
  const firstYear = birthday.calendar === "lunar"
    ? Solar.fromDate(today).getLunar().getYear()
    : today.getFullYear();
  for (let year = firstYear; year <= firstYear + 2; year++) {
    let next;
    if (birthday.calendar === "lunar") {
      const lunarMonth = birthday.leapMonth && LunarMonth.fromYm(year, -month)
        ? -month : month;
      const days = LunarMonth.fromYm(year, lunarMonth).getDayCount();
      const solar = Lunar.fromYmd(year, lunarMonth, Math.min(day, days)).getSolar();
      next = new Date(solar.getYear(), solar.getMonth() - 1, solar.getDay());
    } else {
      const days = new Date(year, month, 0).getDate();
      next = new Date(year, month - 1, Math.min(day, days));
    }
    if (next >= today) return next;
  }
  throw new Error("Could not calculate birthday");
}

function birthdayDaysAway(birthday, now = new Date()) {
  const next = nextBirthdayDate(birthday, now);
  return Math.round((Date.UTC(next.getFullYear(), next.getMonth(), next.getDate())
    - Date.UTC(now.getFullYear(), now.getMonth(), now.getDate())) / 86400000);
}
