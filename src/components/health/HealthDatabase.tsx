"use client";

import { useState } from "react";
import { Plus, ChevronDown, ChevronRight, Trash2, GripVertical } from "lucide-react";
import { HealthDatabase as HealthDatabaseType, HealthDatabaseRow, HealthDatabaseColumn } from "@/types";
import { v4 as uuidv4 } from "uuid";

interface HealthDatabaseProps {
  database: HealthDatabaseType;
  onUpdate: (db: HealthDatabaseType) => void;
  defaultExpanded?: boolean;
}

function CellEditor({
  column,
  value,
  onChange,
}: {
  column: HealthDatabaseColumn;
  value: string | number | boolean | string[] | undefined;
  onChange: (val: string | number | boolean | string[]) => void;
}) {
  switch (column.type) {
    case "checkbox":
      return (
        <button
          onClick={() => onChange(!value)}
          className="w-5 h-5 rounded border flex items-center justify-center"
          style={{
            borderColor: value ? "var(--brand-primary)" : "var(--border)",
            backgroundColor: value ? "var(--brand-primary)" : "transparent",
          }}
        >
          {value && (
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M2.5 6L5 8.5L9.5 3.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </button>
      );

    case "select":
      return (
        <select
          value={(value as string) || ""}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-transparent text-sm outline-none cursor-pointer"
          style={{ color: "var(--foreground)" }}
        >
          <option value="">—</option>
          {column.options?.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      );

    case "multi-select": {
      const selected = (value as string[]) || [];
      return (
        <div className="flex flex-wrap gap-1">
          {column.options?.map((opt) => {
            const isSelected = selected.includes(opt);
            return (
              <button
                key={opt}
                onClick={() => {
                  if (isSelected) {
                    onChange(selected.filter((s) => s !== opt));
                  } else {
                    onChange([...selected, opt]);
                  }
                }}
                className="text-xs px-2 py-0.5 rounded-full border transition-colors"
                style={{
                  borderColor: isSelected ? "var(--brand-primary)" : "var(--border)",
                  backgroundColor: isSelected ? "var(--brand-primary)" : "transparent",
                  color: isSelected ? "white" : "var(--muted)",
                }}
              >
                {opt}
              </button>
            );
          })}
        </div>
      );
    }

    case "number":
      return (
        <input
          type="number"
          value={(value as number) ?? ""}
          onChange={(e) => onChange(e.target.value ? Number(e.target.value) : "")}
          className="w-full bg-transparent text-sm outline-none"
          style={{ color: "var(--foreground)" }}
          placeholder="—"
        />
      );

    case "date":
      return (
        <input
          type="date"
          value={(value as string) || ""}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-transparent text-sm outline-none"
          style={{ color: "var(--foreground)" }}
        />
      );

    case "url":
      return (
        <input
          type="url"
          value={(value as string) || ""}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-transparent text-sm outline-none"
          style={{ color: "var(--foreground)" }}
          placeholder="https://..."
        />
      );

    default:
      return (
        <input
          type="text"
          value={(value as string) || ""}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-transparent text-sm outline-none"
          style={{ color: "var(--foreground)" }}
          placeholder="—"
        />
      );
  }
}

export default function HealthDatabase({ database, onUpdate, defaultExpanded = true }: HealthDatabaseProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);

  const addRow = () => {
    const newRow: HealthDatabaseRow = {
      id: uuidv4(),
      cells: {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    for (const col of database.columns) {
      if (col.type === "date") {
        newRow.cells[col.id] = new Date().toISOString().split("T")[0];
      } else if (col.type === "checkbox") {
        newRow.cells[col.id] = false;
      } else if (col.type === "multi-select") {
        newRow.cells[col.id] = [];
      } else if (col.type === "number") {
        newRow.cells[col.id] = "";
      } else {
        newRow.cells[col.id] = "";
      }
    }

    onUpdate({
      ...database,
      rows: [newRow, ...database.rows],
    });
  };

  const updateCell = (rowId: string, colId: string, value: string | number | boolean | string[]) => {
    onUpdate({
      ...database,
      rows: database.rows.map((row) =>
        row.id === rowId
          ? { ...row, cells: { ...row.cells, [colId]: value }, updatedAt: new Date().toISOString() }
          : row
      ),
    });
  };

  const deleteRow = (rowId: string) => {
    onUpdate({
      ...database,
      rows: database.rows.filter((row) => row.id !== rowId),
    });
  };

  return (
    <div
      className="rounded-xl border mb-6 overflow-hidden"
      style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
    >
      {/* Database Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-3 p-4 hover:bg-black/5 transition-colors"
      >
        {expanded ? (
          <ChevronDown size={16} style={{ color: "var(--muted)" }} />
        ) : (
          <ChevronRight size={16} style={{ color: "var(--muted)" }} />
        )}
        <span className="text-lg">{database.icon}</span>
        <div className="text-left flex-1">
          <h3 className="font-semibold text-sm" style={{ color: "var(--foreground)" }}>
            {database.name}
          </h3>
          <p className="text-xs" style={{ color: "var(--muted)" }}>
            {database.description} · {database.rows.length} {database.rows.length === 1 ? "entry" : "entries"}
          </p>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            addRow();
            if (!expanded) setExpanded(true);
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium hover:opacity-80"
          style={{ backgroundColor: "var(--brand-primary)", color: "white" }}
        >
          <Plus size={12} />
          New
        </button>
      </button>

      {/* Table */}
      {expanded && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderTop: "1px solid var(--border)" }}>
                <th className="w-8" />
                {database.columns.map((col) => (
                  <th
                    key={col.id}
                    className="text-left px-3 py-2 text-xs font-medium uppercase tracking-wider"
                    style={{
                      color: "var(--muted)",
                      width: col.width ? `${col.width}px` : "auto",
                      borderRight: "1px solid var(--border)",
                    }}
                  >
                    {col.name}
                  </th>
                ))}
                <th className="w-10" />
              </tr>
            </thead>
            <tbody>
              {database.rows.length === 0 && (
                <tr>
                  <td
                    colSpan={database.columns.length + 2}
                    className="text-center py-8 text-sm"
                    style={{ color: "var(--muted)" }}
                  >
                    No entries yet. Click <strong>+ New</strong> to add your first entry.
                  </td>
                </tr>
              )}
              {database.rows.map((row) => (
                <tr
                  key={row.id}
                  className="group hover:bg-black/[0.02]"
                  style={{ borderTop: "1px solid var(--border)" }}
                >
                  <td className="px-1">
                    <GripVertical
                      size={14}
                      className="opacity-0 group-hover:opacity-40 cursor-grab"
                      style={{ color: "var(--muted)" }}
                    />
                  </td>
                  {database.columns.map((col) => (
                    <td
                      key={col.id}
                      className="px-3 py-2"
                      style={{ borderRight: "1px solid var(--border)" }}
                    >
                      <CellEditor
                        column={col}
                        value={row.cells[col.id]}
                        onChange={(val) => updateCell(row.id, col.id, val)}
                      />
                    </td>
                  ))}
                  <td className="px-2">
                    <button
                      onClick={() => deleteRow(row.id)}
                      className="opacity-0 group-hover:opacity-60 hover:!opacity-100 p-1 rounded"
                    >
                      <Trash2 size={14} className="text-red-400" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Add row footer */}
          <button
            onClick={addRow}
            className="w-full flex items-center gap-2 px-4 py-2.5 text-xs hover:bg-black/[0.02] transition-colors"
            style={{ color: "var(--muted)", borderTop: "1px solid var(--border)" }}
          >
            <Plus size={12} />
            New entry
          </button>
        </div>
      )}
    </div>
  );
}
