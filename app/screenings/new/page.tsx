"use client";

import { Shell } from "@/components/Shell";
import { createScreening, type CreateScreeningPayload } from "@/lib/screenings";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type React from "react";

type FormState = {
  user_id: number;
  target_name: string;
  target_type: CreateScreeningPayload["target"]["type"];
  target_external_id: string;
  target_organism: string;
  library_id: number | string;
  screening_type: CreateScreeningPayload["screening_type"];
  priority: CreateScreeningPayload["priority"];
  requested_compute: CreateScreeningPayload["requested_compute"];
  notes: string;
};

export default function NewScreeningPage() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>({
    user_id: 1,
    target_name: "",
    target_type: "PROTEIN",
    target_external_id: "",
    target_organism: "",
    library_id: 3,
    screening_type: "VIRTUAL_SCREENING",
    priority: "MEDIUM",
    requested_compute: "MEDIUM",
    notes: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const updateField =
    <K extends keyof FormState>(field: K) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value as FormState[K] }));
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const payload = {
      user_id: form.user_id,
      target: {
        name: form.target_name,
        type: form.target_type,
        external_id: form.target_external_id,
        organism: form.target_organism,
      },
      library_id: form.library_id,
      screening_type: form.screening_type,
      priority: form.priority,
      requested_compute: form.requested_compute,
      notes: form.notes,
    };

    try {
      const created = await createScreening(payload);
      router.push(`/screenings/${created.id}`);
    } catch (err) {
      console.error(err);
      alert("Failed to create screening (mock). Check console.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Shell>
      <div className="card">
        <div className="card-header">
          <div>
            <h2>New Screening Request</h2>
            <p className="muted">
              Define your target, select a library and configure screening parameters.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="form-grid">
          <section>
            <h3>Target</h3>
            <label>
              Target name
              <input
                type="text"
                value={form.target_name}
                onChange={updateField("target_name")}
                required
                placeholder="EGFR, BRD4, SARS-CoV-2 RdRp..."
              />
            </label>

            <label>
              Target type
              <select value={form.target_type} onChange={updateField("target_type")}>
                <option value="PROTEIN">Protein</option>
                <option value="RNA">RNA</option>
              </select>
            </label>

            <label>
              External ID (optional)
              <input
                type="text"
                value={form.target_external_id}
                onChange={updateField("target_external_id")}
                placeholder="UniProt / Ensembl ID"
              />
            </label>

            <label>
              Organism (optional)
              <input
                type="text"
                value={form.target_organism}
                onChange={updateField("target_organism")}
                placeholder="Homo sapiens, SARS-CoV-2..."
              />
            </label>
          </section>

          <section>
            <h3>Screening setup</h3>

            <label>
              Library
              <select
                value={form.library_id}
                onChange={updateField("library_id")}
              >
                <option value={3}>LeadFactory Core Set</option>
                <option value={4}>Custom Library A</option>
              </select>
            </label>

            <label>
              Screening type
              <select
                value={form.screening_type}
                onChange={updateField("screening_type")}
              >
                <option value="VIRTUAL_SCREENING">Virtual screening</option>
                <option value="DOCKING">Docking</option>
                <option value="QSAR">QSAR</option>
                <option value="HTS">Wet-lab HTS</option>
              </select>
            </label>

            <label>
              Priority
              <select value={form.priority} onChange={updateField("priority")}>
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
              </select>
            </label>

            <label>
              Compute profile
              <select
                value={form.requested_compute}
                onChange={updateField("requested_compute")}
              >
                <option value="SMALL">Small</option>
                <option value="MEDIUM">Medium</option>
                <option value="LARGE">Large</option>
              </select>
            </label>

            <label>
              Notes (optional)
              <textarea
                rows={4}
                value={form.notes}
                onChange={updateField("notes")}
                placeholder="Any assay details or constraints for the LeadFactory pipeline..."
              />
            </label>
          </section>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? "Submitting..." : "Submit screening"}
            </button>
          </div>
        </form>
      </div>
    </Shell>
  );
}
