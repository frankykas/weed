/**
 * MindBody Public API v6 client (server-only).
 *
 * Reads the weekly class schedule so the booking page can render it in the
 * GIGI design. Credentials come from environment variables — currently the
 * free sandbox (Site -99). To go live, swap MINDBODY_SITE_ID / USERNAME /
 * PASSWORD for the studio's real values (needs paid API access).
 */

const BASE = 'https://api.mindbodyonline.com/public/v6';

export type MindbodyEnv = {
  MINDBODY_API_KEY?: string;
  MINDBODY_SITE_ID?: string;
  MINDBODY_USERNAME?: string;
  MINDBODY_PASSWORD?: string;
};

export type ScheduleLocation = {id: number; name: string};

export type ScheduleClass = {
  id: number;
  name: string;
  staff: string;
  time: string; // "7:00 AM"
  day: number; // 0 (Sun) – 6 (Sat)
  locationId: number;
  isFull: boolean;
  bookUrl: string;
};

export type BookingSchedule = {
  configured: boolean;
  sandbox: boolean;
  locations: ScheduleLocation[];
  classes: ScheduleClass[];
};

// In-memory token cache (survives within a warm server instance).
let tokenCache: {token: string; expires: number} | null = null;

async function issueToken(env: MindbodyEnv): Promise<string> {
  if (tokenCache && tokenCache.expires > Date.now()) return tokenCache.token;
  const res = await fetch(`${BASE}/usertoken/issue`, {
    method: 'POST',
    headers: {
      'Api-Key': env.MINDBODY_API_KEY ?? '',
      SiteId: env.MINDBODY_SITE_ID ?? '',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      Username: env.MINDBODY_USERNAME,
      Password: env.MINDBODY_PASSWORD,
    }),
  });
  const data = (await res.json()) as {AccessToken?: string};
  if (!res.ok || !data.AccessToken) {
    throw new Error(`MindBody auth failed (${res.status})`);
  }
  tokenCache = {token: data.AccessToken, expires: Date.now() + 55 * 60 * 1000};
  return data.AccessToken;
}

async function apiGet(
  env: MindbodyEnv,
  token: string,
  path: string,
): Promise<any> {
  const res = await fetch(`${BASE}${path}`, {
    headers: {
      'Api-Key': env.MINDBODY_API_KEY ?? '',
      SiteId: env.MINDBODY_SITE_ID ?? '',
      Authorization: token,
    },
  });
  if (!res.ok) throw new Error(`MindBody GET ${path} -> ${res.status}`);
  return res.json();
}

/** Turn "2026-08-01T07:00:00" into {day: 6, time: "7:00 AM"} without timezone drift. */
function parseSlot(iso: string): {day: number; time: string} {
  const datePart = iso.slice(0, 10);
  const hh = parseInt(iso.slice(11, 13), 10);
  const mm = iso.slice(14, 16);
  const day = new Date(`${datePart}T00:00:00Z`).getUTCDay();
  const ampm = hh >= 12 ? 'PM' : 'AM';
  const h12 = hh % 12 === 0 ? 12 : hh % 12;
  return {day, time: `${h12}:${mm} ${ampm}`};
}

function isoDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export async function getBookingSchedule(
  env: MindbodyEnv,
): Promise<BookingSchedule> {
  const empty: BookingSchedule = {
    configured: false,
    sandbox: false,
    locations: [],
    classes: [],
  };
  if (!env.MINDBODY_API_KEY || !env.MINDBODY_SITE_ID) return empty;

  const sandbox = env.MINDBODY_SITE_ID === '-99';
  try {
    const token = await issueToken(env);

    // Current Sun–Sat week (UTC to avoid boundary drift).
    const now = new Date();
    const weekStart = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - now.getUTCDay()),
    );
    const weekEnd = new Date(weekStart);
    weekEnd.setUTCDate(weekStart.getUTCDate() + 7);

    const [locData, classData] = await Promise.all([
      apiGet(env, token, `/site/locations`),
      apiGet(
        env,
        token,
        `/class/classes?StartDateTime=${isoDate(weekStart)}T00:00:00&EndDateTime=${isoDate(weekEnd)}T00:00:00&Limit=200`,
      ),
    ]);

    const siteId = env.MINDBODY_SITE_ID;
    const locations: ScheduleLocation[] = ((locData?.Locations ?? []) as any[])
      // Drop non-physical "Online Store" style locations.
      .filter((l) => l?.HasClasses !== false && l?.Name && l?.Id !== 98)
      .map((l) => ({id: l.Id, name: l.Name}));

    const classes: ScheduleClass[] = ((classData?.Classes ?? []) as any[])
      .filter((c) => c && !c.IsCanceled && c.StartDateTime)
      .map((c) => {
        const {day, time} = parseSlot(c.StartDateTime as string);
        const cap = c.WebCapacity ?? c.MaxCapacity ?? 0;
        const booked = c.TotalBooked ?? 0;
        return {
          id: c.Id,
          name: c.ClassDescription?.Name ?? 'Class',
          staff: c.Staff?.Name ?? '',
          time,
          day,
          locationId: c.Location?.Id ?? 0,
          isFull: cap > 0 && booked >= cap,
          bookUrl: `https://clients.mindbodyonline.com/classic/mainclass?studioid=${siteId}&classId=${c.Id}`,
        };
      })
      .sort((a, b) => a.time.localeCompare(b.time));

    // Keep only locations that actually have classes this week.
    const usedLocationIds = new Set(classes.map((c) => c.locationId));
    const shownLocations = locations.filter((l) => usedLocationIds.has(l.id));

    return {
      configured: true,
      sandbox,
      locations: shownLocations.length ? shownLocations : locations,
      classes,
    };
  } catch (error) {
    console.error('MindBody schedule error:', error);
    return {configured: true, sandbox, locations: [], classes: []};
  }
}
