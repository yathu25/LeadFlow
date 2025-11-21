// lib/screenings.ts

/**
 * API-backed helpers for screenings.
 *
 * These functions read NEXT_PUBLIC_API_BASE (inlined by Next.js) and use the
 * global fetch so they work on the client. They throw an Error when responses
 * are not ok.
 */

type Target = {
  id?: number;
  name: string;
  type: "PROTEIN" | "RNA";
  external_id?: string | null;
  organism?: string | null;
  description?: string;
};

type User = {
  id: number;
  name?: string;
  email?: string;
};

type Event = {
  id: string | number;
  event_type: "STATUS_CHANGE" | "INFO" | "ERROR";
  message: string;
  created_at: string;
};

export type Screening = {
  id: string | number;
  user?: User;
  target?: Target;
  library?: any;
  screening_type?: string;
  priority?: string;
  requested_compute?: string;
  status?: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
  events?: Event[];
};

export type CreateScreeningPayload = {
  user_id: number;
  target: {
    name: string;
    type: "PROTEIN" | "RNA";
    external_id?: string | null;
    organism?: string | null;
  };
  library_id: number | string;
  screening_type: "VIRTUAL_SCREENING" | "DOCKING" | "QSAR" | "HTS";
  priority: "LOW" | "MEDIUM" | "HIGH";
  requested_compute: "SMALL" | "MEDIUM" | "LARGE";
  notes?: string;
};

const API_BASE = (process.env.NEXT_PUBLIC_API_BASE || "").replace(/\/+$/g, "");

function ensureBase() {
  if (!API_BASE) {
    throw new Error(
      "NEXT_PUBLIC_API_BASE is not set. Add NEXT_PUBLIC_API_BASE to .env.local and restart the dev server."
    );
  }
  return API_BASE;
}

function urlFor(path: string) {
  const base = ensureBase();
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

async function handleResponse(res: Response) {
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    // include body text when possible for better diagnostics
    throw new Error(`API error ${res.status}: ${text || res.statusText}`);
  }
  return res.json();
}

/**
 * GET /screenings -> returns items array (or [] fallback)
 */
export async function fetchScreenings(): Promise<Screening[]> {
  const url = urlFor("/screenings");
  console.debug("fetchScreenings ->", url);
  const res = await fetch(url, {
    method: "GET",
    headers: { Accept: "application/json" },
  });
  const json = await handleResponse(res);
  return Array.isArray(json?.items) ? json.items : [];
}

/**
 * GET /screenings/{id} -> returns full screening object (including events)
 */
export async function fetchScreening(id: string | number): Promise<Screening> {
  if (id === undefined || id === null) {
    throw new Error("fetchScreening requires an id");
  }
  const url = urlFor(`/screenings/${encodeURIComponent(String(id))}`);
  console.debug("fetchScreening ->", url);
  const res = await fetch(url, {
    method: "GET",
    headers: { Accept: "application/json" },
  });
  return handleResponse(res);
}

/**
 * POST /screenings -> create a screening, return created object
 */
export async function createScreening(payload: CreateScreeningPayload): Promise<Screening> {
  const url = urlFor("/screenings");
  console.debug("createScreening ->", url, payload);
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}
