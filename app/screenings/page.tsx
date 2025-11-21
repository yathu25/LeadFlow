"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Shell } from "@/components/Shell";
import { fetchScreenings } from "@/lib/screenings";

type Screening = Awaited<ReturnType<typeof fetchScreenings>>[number];

const statusClass = (status: string | undefined) => {
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

const formatUpdatedAt = (value: Screening["updated_at"]) => {
  return value ? new Date(value).toLocaleString() : "—";
};

export default function ScreeningListPage() {
  const [screenings, setScreenings] = useState<Screening[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchScreenings()
      .then((data) => setScreenings(data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Shell>
      <div className="card">
        <div className="card-header">
          <div>
            <h2>Screening Requests</h2>
            <p className="muted">
              Submit and track virtual screening / docking jobs against LeadFactory libraries.
            </p>
          </div>
          <Link href="/screenings/new" className="btn btn-primary">
            + New Screening
          </Link>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : screenings.length === 0 ? (
          <p>No screening requests yet. Create your first one.</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Target</th>
                <th>Type</th>
                <th>Library</th>
                <th>Screening Type</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Last Updated</th>
              </tr>
            </thead>
            <tbody>
              {screenings.map((s) => (
                <tr key={s.id}>
                  <td>
                    <Link href={`/screenings/${s.id}`} className="link">
                      #{s.id}
                    </Link>
                  </td>
                  <td>{s.target?.name}</td>
                  <td>{s.target?.type}</td>
                  <td>{s.library?.name}</td>
                  <td>{s.screening_type}</td>
                  <td>{s.priority}</td>
                  <td>
                    <span className={statusClass(s.status)}>{s.status}</span>
                  </td>
                  <td>{formatUpdatedAt(s.updated_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </Shell>
  );
}
