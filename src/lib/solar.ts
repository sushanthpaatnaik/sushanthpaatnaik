/**
 * Actual sunrise and sunset for the visitor's location, from the clock alone.
 *
 * Auto's last-resort signal used to be a fixed window — light 07:00 to 18:30,
 * dark otherwise. That is wrong nearly everywhere and badly wrong in summer and
 * winter at any distance from the equator: in Delhi in June the sun is up at
 * 05:24 and still up at 19:22, so a fixed window renders dark for three hours
 * of broad daylight. This computes the real thing.
 *
 * Location without asking for it
 * ------------------------------
 * The geolocation API is off the table: it prompts, and a permission dialog to
 * pick a colour scheme is not a trade worth offering. So both coordinates come
 * from things the browser already volunteers.
 *
 * Longitude comes from the timezone offset, since 15° of longitude is one hour.
 * It has to be the *standard* offset, not whatever is in force today: daylight
 * saving moves the clock without moving the city, so deriving longitude from a
 * summer offset puts Oslo on the 30th meridian instead of the 11th and drags
 * sunset an hour and a quarter early. So the offset is sampled in January and
 * July and the standard one taken, while the wall-clock conversion at the end
 * uses the offset actually in force.
 *
 * Latitude has no such trick, and latitude is what sets day length, so it comes
 * from a table keyed by the IANA zone name, holding the namesake city's value
 * rounded to a degree. An unrecognised zone falls back to the fixed window
 * rather than guessing.
 *
 * How wrong this can be
 * ---------------------
 * Sunrise moves about four minutes per degree of latitude in the temperate
 * zones, so the error is roughly the distance from the visitor to their zone's
 * namesake city. For most zones that is small. For a zone spanning a continent
 * it is not: Asia/Kolkata covers India from 8°N to 35°N, so a reader in Delhi
 * sees the switch about forty minutes early at midsummer and a reader in
 * Chennai about half an hour late. The table value is the population weight
 * rather than the geographic middle, which is the best available answer when
 * the alternative is a permission prompt. Either way it is a large improvement
 * on the fixed window it replaces, which was out by two to three hours.
 */

/** Latitude of each IANA zone's namesake city, to the nearest degree. */
const ZONE_LATITUDE: Record<string, number> = {
  // Asia
  "Asia/Kolkata": 23, "Asia/Calcutta": 23, "Asia/Dhaka": 24, "Asia/Karachi": 25,
  "Asia/Kathmandu": 28, "Asia/Colombo": 7, "Asia/Dubai": 25, "Asia/Qatar": 25,
  "Asia/Riyadh": 25, "Asia/Kuwait": 29, "Asia/Baghdad": 33, "Asia/Tehran": 36,
  "Asia/Jerusalem": 32, "Asia/Beirut": 34, "Asia/Damascus": 33, "Asia/Amman": 32,
  "Asia/Istanbul": 41, "Asia/Yerevan": 40, "Asia/Baku": 40, "Asia/Tbilisi": 42,
  "Asia/Tashkent": 41, "Asia/Almaty": 43, "Asia/Bishkek": 43, "Asia/Kabul": 35,
  "Asia/Bangkok": 14, "Asia/Ho_Chi_Minh": 11, "Asia/Saigon": 11, "Asia/Phnom_Penh": 12,
  "Asia/Vientiane": 18, "Asia/Yangon": 17, "Asia/Jakarta": -6, "Asia/Makassar": -5,
  "Asia/Jayapura": -2, "Asia/Kuala_Lumpur": 3, "Asia/Singapore": 1, "Asia/Manila": 15,
  "Asia/Brunei": 5, "Asia/Hong_Kong": 22, "Asia/Macau": 22, "Asia/Taipei": 25,
  "Asia/Shanghai": 31, "Asia/Chongqing": 30, "Asia/Urumqi": 44, "Asia/Seoul": 38,
  "Asia/Pyongyang": 39, "Asia/Tokyo": 36, "Asia/Ulaanbaatar": 48, "Asia/Vladivostok": 43,
  "Asia/Yakutsk": 62, "Asia/Irkutsk": 52, "Asia/Krasnoyarsk": 56, "Asia/Novosibirsk": 55,
  "Asia/Omsk": 55, "Asia/Yekaterinburg": 57, "Asia/Magadan": 60, "Asia/Kamchatka": 53,
  // Europe
  "Europe/London": 51, "Europe/Dublin": 53, "Europe/Lisbon": 39, "Europe/Madrid": 40,
  "Europe/Paris": 49, "Europe/Brussels": 51, "Europe/Amsterdam": 52, "Europe/Luxembourg": 50,
  "Europe/Berlin": 53, "Europe/Zurich": 47, "Europe/Vienna": 48, "Europe/Prague": 50,
  "Europe/Rome": 42, "Europe/Malta": 36, "Europe/Athens": 38, "Europe/Sofia": 43,
  "Europe/Bucharest": 44, "Europe/Budapest": 47, "Europe/Warsaw": 52, "Europe/Bratislava": 48,
  "Europe/Ljubljana": 46, "Europe/Zagreb": 46, "Europe/Belgrade": 45, "Europe/Sarajevo": 44,
  "Europe/Skopje": 42, "Europe/Tirane": 41, "Europe/Copenhagen": 56, "Europe/Oslo": 60,
  "Europe/Stockholm": 59, "Europe/Helsinki": 60, "Europe/Tallinn": 59, "Europe/Riga": 57,
  "Europe/Vilnius": 55, "Europe/Minsk": 54, "Europe/Kyiv": 50, "Europe/Kiev": 50,
  "Europe/Moscow": 56, "Europe/Samara": 53, "Europe/Istanbul": 41, "Europe/Reykjavik": 64,
  // Africa
  "Africa/Cairo": 30, "Africa/Tripoli": 33, "Africa/Tunis": 37, "Africa/Algiers": 37,
  "Africa/Casablanca": 34, "Africa/Lagos": 6, "Africa/Accra": 6, "Africa/Abidjan": 5,
  "Africa/Dakar": 15, "Africa/Nairobi": -1, "Africa/Kampala": 0, "Africa/Dar_es_Salaam": -7,
  "Africa/Addis_Ababa": 9, "Africa/Khartoum": 16, "Africa/Kinshasa": -4, "Africa/Luanda": -9,
  "Africa/Harare": -18, "Africa/Lusaka": -15, "Africa/Maputo": -26, "Africa/Johannesburg": -26,
  "Africa/Windhoek": -22, "Africa/Gaborone": -25,
  // Americas
  "America/New_York": 41, "America/Toronto": 44, "America/Montreal": 46, "America/Detroit": 42,
  "America/Chicago": 42, "America/Winnipeg": 50, "America/Mexico_City": 19, "America/Monterrey": 26,
  "America/Denver": 40, "America/Edmonton": 54, "America/Phoenix": 33, "America/Los_Angeles": 34,
  "America/Vancouver": 49, "America/Anchorage": 61, "America/Halifax": 45, "America/St_Johns": 48,
  "America/Bogota": 5, "America/Lima": -12, "America/Caracas": 10, "America/Quito": 0,
  "America/La_Paz": -17, "America/Santiago": -33, "America/Asuncion": -25, "America/Montevideo": -35,
  "America/Argentina/Buenos_Aires": -35, "America/Sao_Paulo": -24, "America/Bahia": -13,
  "America/Manaus": -3, "America/Panama": 9, "America/Havana": 23, "America/Jamaica": 18,
  "America/Santo_Domingo": 19, "America/Puerto_Rico": 18, "America/Guatemala": 15,
  "America/Costa_Rica": 10,
  // Oceania
  "Australia/Sydney": -34, "Australia/Melbourne": -38, "Australia/Brisbane": -27,
  "Australia/Adelaide": -35, "Australia/Perth": -32, "Australia/Hobart": -43,
  "Australia/Darwin": -12, "Pacific/Auckland": -37, "Pacific/Fiji": -18,
  "Pacific/Port_Moresby": -9, "Pacific/Honolulu": 21, "Pacific/Guam": 13,
};

/** Latitude for the device's zone, or null when the zone is not in the table. */
export function localLatitude(): number | null {
  try {
    const zone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (!zone) return null;
    const lat = ZONE_LATITUDE[zone];
    return typeof lat === "number" ? lat : null;
  } catch {
    // Intl is present everywhere this site runs, but a locked-down engine
    // throwing here should cost the fallback window, not the page.
    return null;
  }
}

/**
 * Central meridian of a timezone offset. `getTimezoneOffset` returns minutes to
 * add to local time to reach UTC, so it is positive west — hence the negation
 * to get an east-positive longitude.
 */
export function longitudeFromOffset(offsetMinutes: number): number {
  return (-offsetMinutes / 60) * 15;
}

/**
 * The zone's offset ignoring daylight saving, by sampling both solstial halves
 * of the year and taking the one further west. DST always moves the clock
 * forward, which in this positive-west convention makes the offset smaller, so
 * the larger of the two is standard time — and that holds in both hemispheres,
 * where the DST half of the year is a different half.
 */
export function standardOffsetMinutes(year: number): number {
  const jan = new Date(year, 0, 1).getTimezoneOffset();
  const jul = new Date(year, 6, 1).getTimezoneOffset();
  return Math.max(jan, jul);
}

export type SunTimes =
  | { kind: "normal"; sunrise: number; sunset: number }
  /** Above the Arctic or below the Antarctic circle, at the right time of year. */
  | { kind: "polar-day" }
  | { kind: "polar-night" };

const RAD = Math.PI / 180;
const sin = (deg: number) => Math.sin(deg * RAD);
const cos = (deg: number) => Math.cos(deg * RAD);

/**
 * Sunrise and sunset as local wall-clock hours, by the standard sunrise
 * equation. The -0.833° altitude is the usual convention: the sun's disc has a
 * radius of about 16 arcminutes and atmospheric refraction lifts it another 34,
 * so "sunrise" is the moment the upper limb appears rather than the moment the
 * centre crosses the horizon.
 */
export function sunTimes(date: Date, latitude: number, longitude: number, offsetMinutes: number): SunTimes {
  // Julian day number for the local calendar date.
  const y = date.getFullYear();
  const m = date.getMonth() + 1;
  const d = date.getDate();
  const a = Math.floor((14 - m) / 12);
  const yy = y + 4800 - a;
  const mm = m + 12 * a - 3;
  const jdn =
    d + Math.floor((153 * mm + 2) / 5) + 365 * yy +
    Math.floor(yy / 4) - Math.floor(yy / 100) + Math.floor(yy / 400) - 32045;

  const n = jdn - 2451545 + 0.0008;
  // Minus, not plus: the classical sunrise equation is written for longitude
  // measured positive *west*, and this longitude is positive east. Getting this
  // backwards leaves day length exactly right — it is symmetric — while sliding
  // sunrise and sunset by twice the longitude in hours, which is why it has to
  // be checked away from the prime meridian to be checked at all.
  const meanSolarNoon = n - longitude / 360;
  const M = (357.5291 + 0.98560028 * meanSolarNoon) % 360;
  const C = 1.9148 * sin(M) + 0.02 * sin(2 * M) + 0.0003 * sin(3 * M);
  const lambda = (M + C + 180 + 102.9372) % 360;
  const transit = 2451545.0 + meanSolarNoon + 0.0053 * sin(M) - 0.0069 * sin(2 * lambda);
  const sinDec = sin(lambda) * sin(23.4397);
  const cosDec = Math.cos(Math.asin(sinDec));

  const cosOmega = (sin(-0.833) - sin(latitude) * sinDec) / (cos(latitude) * cosDec);
  if (cosOmega > 1) return { kind: "polar-night" };
  if (cosOmega < -1) return { kind: "polar-day" };
  const omega = Math.acos(cosOmega) / RAD;

  const toLocalHours = (julian: number) => {
    const utcMs = (julian - 2440587.5) * 86400000;
    const localMs = utcMs - offsetMinutes * 60000;
    return (((localMs / 3600000) % 24) + 24) % 24;
  };

  return {
    kind: "normal",
    sunrise: toLocalHours(transit - omega / 360),
    sunset: toLocalHours(transit + omega / 360),
  };
}

/**
 * Is the sun up right now? Null when the zone is unknown, which is the caller's
 * cue to use the fixed window instead.
 */
export function isSunUp(now = new Date()): boolean | null {
  const latitude = localLatitude();
  if (latitude === null) return null;
  const offset = now.getTimezoneOffset();
  const lon = longitudeFromOffset(standardOffsetMinutes(now.getFullYear()));
  const t = sunTimes(now, latitude, lon, offset);
  if (t.kind === "polar-day") return true;
  if (t.kind === "polar-night") return false;
  const h = now.getHours() + now.getMinutes() / 60 + now.getSeconds() / 3600;
  // Far enough north or south, sunset can land after local midnight, so the
  // daylight span wraps rather than being a simple interval.
  return t.sunrise <= t.sunset ? h >= t.sunrise && h < t.sunset : h >= t.sunrise || h < t.sunset;
}

/**
 * Milliseconds until the sun next rises or sets, so the caller can sleep to the
 * boundary instead of polling. Null when the zone is unknown. Capped at an hour
 * so a machine that suspends through a boundary catches up soon after waking,
 * and floored at a second so a boundary landing on this exact tick cannot spin.
 */
export function msUntilSunBoundary(now = new Date()): number | null {
  const latitude = localLatitude();
  if (latitude === null) return null;
  const offset = now.getTimezoneOffset();
  const lon = longitudeFromOffset(standardOffsetMinutes(now.getFullYear()));
  const t = sunTimes(now, latitude, lon, offset);
  // Nothing to wait for today; look again in an hour in case the date rolls.
  if (t.kind !== "normal") return 3600_000;
  const h = now.getHours() + now.getMinutes() / 60 + now.getSeconds() / 3600;
  const candidates = [t.sunrise, t.sunset, t.sunrise + 24, t.sunset + 24].filter((x) => x > h);
  const next = Math.min(...candidates);
  return Math.min(Math.max((next - h) * 3600_000, 1000), 3600_000);
}

/**
 * The same calculation, as source, for the inline script in __root.tsx.
 *
 * That script has to run before first paint and so cannot import a module; the
 * alternative to duplicating the maths is a wrong theme for the minutes between
 * the fixed window's edges and the real sunrise, which is precisely the flash
 * the bootstrap exists to prevent. Duplication is the lesser problem, and it is
 * pinned: tools/check-solar-parity runs both over a matrix of zones and dates
 * and fails the build if they ever disagree.
 *
 * Defines `__sunUp()` returning true, false, or null for an unknown zone.
 */
export const SOLAR_INLINE = `
var __zl=${JSON.stringify(ZONE_LATITUDE)};
function __sunUp(){try{
var z=Intl.DateTimeFormat().resolvedOptions().timeZone;var la=__zl[z];
if(typeof la!=='number')return null;
var D=new Date(),o=D.getTimezoneOffset(),Y=D.getFullYear(),
so=Math.max(new Date(Y,0,1).getTimezoneOffset(),new Date(Y,6,1).getTimezoneOffset()),
lo=(-so/60)*15,R=Math.PI/180;
var s=function(x){return Math.sin(x*R)},c=function(x){return Math.cos(x*R)};
var y=D.getFullYear(),m=D.getMonth()+1,d=D.getDate();
var a=Math.floor((14-m)/12),yy=y+4800-a,mm=m+12*a-3;
var j=d+Math.floor((153*mm+2)/5)+365*yy+Math.floor(yy/4)-Math.floor(yy/100)+Math.floor(yy/400)-32045;
var n=j-2451545+0.0008,ms=n-lo/360;
var M=(357.5291+0.98560028*ms)%360;
var C=1.9148*s(M)+0.02*s(2*M)+0.0003*s(3*M);
var L=(M+C+180+102.9372)%360;
var tr=2451545+ms+0.0053*s(M)-0.0069*s(2*L);
var sd=s(L)*s(23.4397),cd=Math.cos(Math.asin(sd));
var co=(s(-0.833)-s(la)*sd)/(c(la)*cd);
if(co>1)return false;if(co<-1)return true;
var w=Math.acos(co)/R;
var tl=function(J){var u=(J-2440587.5)*86400000-o*60000;return((u/3600000)%24+24)%24;};
var sr=tl(tr-w/360),ss=tl(tr+w/360);
var h=D.getHours()+D.getMinutes()/60+D.getSeconds()/3600;
return sr<=ss?(h>=sr&&h<ss):(h>=sr||h<ss);
}catch(e){return null;}}
`;
