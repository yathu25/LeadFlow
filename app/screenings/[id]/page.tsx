"use client";

import { Shell } from "@/components/Shell";
import { fetchScreening } from "@/lib/screenings";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const statusClass = (status: string) => {
  switch (status) {
    case "COMPLETED":
      return "badge badge-success";
    case "RUNNING":
      return "badge badge-running";
    case "FAILED":
      return "badge badge-failed";
    default:
      return "badge badge-default";
  }
};

export default function ScreeningDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [screening, setScreening] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchScreening(id)
      .then((data) => setScreening(data))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <Shell>
        <p>Loading...</p>
      </Shell>
    );
  }

  if (!screening) {
    return (
      <Shell>
        <p>Screening not found.</p>
      </Shell>
    );
  }

  const { target, library, events } = screening;

  return (
    <Shell>
      <div className="card">
        <div className="card-header">
          <div>
            <h2>
              Screening #{screening.id} – {target?.name}
            </h2>
            <p className="muted">
              {screening.screening_type} · {target?.type} target · Library:{" "}
              {library?.name}
            </p>
          </div>
          <Link href="/screenings" className="btn btn-secondary">
            ← Back to all screenings
          </Link>
        </div>

        <div className="detail-grid">
          <section>
            <h3>Summary</h3>
            <div className="summary-row">
              <span>Status</span>
              <span className={statusClass(screening.status)}>
                {screening.status}
              </span>
            </div>
            <div className="summary-row">
              <span>Priority</span>
              <span>{screening.priority}</span>
            </div>
            <div className="summary-row">
              <span>Compute profile</span>
              <span>{screening.requested_compute || "N/A"}</span>
            </div>
            <div className="summary-row">
              <span>Created</span>
              <span>{new Date(screening.created_at).toLocaleString()}</span>
            </div>
            <div className="summary-row">
              <span>Last updated</span>
              <span>{new Date(screening.updated_at).toLocaleString()}</span>
            </div>
            <div className="summary-row">
              <span>Requested by</span>
              <span>{screening.user?.name}</span>
            </div>
          </section>

          <section>
            <h3>Target &amp; library</h3>
            <p>
              <strong>Target:</strong> {target?.name} ({target?.type})
            </p>
            {target?.external_id && (
              <p>
                <strong>External ID:</strong> {target.external_id}
              </p>
            )}
            {target?.organism && (
              <p>
                <strong>Organism:</strong> {target.organism}
              </p>
            )}
            {target?.description && <p className="muted">{target.description}</p>}

            <hr />

            <p>
              <strong>Library:</strong> {library?.name}
            </p>
            {library?.size && (
              <p>
                <strong>Library size:</strong>{" "}
                {library.size.toLocaleString()} compounds
              </p>
            )}
            {library?.description && (
              <p className="muted">{library.description}</p>
            )}
          </section>
        </div>

        <section>
          <h3>Events</h3>
          {(!events || events.length === 0) && <p>No events recorded yet.</p>}
          <ul className="timeline">
            {events?.map((event: any) => (
              <li key={event.id} className="timeline-item">
                <div className="timeline-dot" />
                <div className="timeline-content">
                  <div className="timeline-meta">
                    <span className="timeline-type">{event.event_type}</span>
                    <span className="timeline-time">
                      {new Date(event.created_at).toLocaleString()}
                    </span>
                  </div>
                  <p>{event.message}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </Shell>
  );
}
