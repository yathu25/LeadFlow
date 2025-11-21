"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

export const Shell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const isScreenings = pathname.startsWith("/screenings");

  return (
    <div className="app-root">
      <aside className="sidebar">
        <div className="logo">AIDD LeadFactory</div>
        <nav>
          <Link
            href="/screenings"
            className={isScreenings ? "nav-link active" : "nav-link"}
          >
            Screening Requests
          </Link>
        </nav>
      </aside>

      <main className="main">
        <header className="topbar">
          <h1 className="topbar-title">LeadFlow – Screening Request &amp; Status Tracker</h1>
        </header>
        <section className="content">{children}</section>
      </main>
    </div>
  );
};
