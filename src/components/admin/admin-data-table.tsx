import type { ReactNode } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";

interface Column<T> {
  key: keyof T | string;
  label: string;
  render?: (row: T) => React.ReactNode;
  hideOnMobile?: boolean;
  primary?: boolean;
  /** Combine with another column on one line in mobile cards */
  mobileInlineWith?: string;
}

interface AdminDataTableProps<T extends object> {
  columns: Column<T>[];
  data: T[];
}

function getCellValue<T extends object>(row: T, col: Column<T>) {
  return col.render ? col.render(row) : String(row[col.key as keyof T] ?? "");
}

function isEmptyValue(value: ReactNode) {
  if (value === null || value === undefined || value === false) return true;
  if (typeof value === "string" && value.trim() === "") return true;
  return false;
}

export function AdminDataTable<T extends object>({
  columns,
  data,
}: AdminDataTableProps<T>) {
  const mobileColumns = columns.filter((col) => !col.hideOnMobile);
  const primaryColumn = mobileColumns.find((col) => col.primary) ?? mobileColumns[0];
  const actionsColumn = mobileColumns.find((col) => col.key === "actions");
  const detailColumns = mobileColumns.filter(
    (col) => col !== primaryColumn && col !== actionsColumn && !col.mobileInlineWith
  );
  const inlinePairs = mobileColumns.filter((col) => col.mobileInlineWith);

  return (
    <Card className="overflow-hidden py-0 shadow-sm">
      <div className="space-y-3 p-3 md:hidden">
        {data.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">No records found.</p>
        ) : (
          data.map((row, i) => {
            const primaryValue = primaryColumn ? getCellValue(row, primaryColumn) : null;
            const statusCol = mobileColumns.find((c) => c.key === "status");
            const statusValue = statusCol ? getCellValue(row, statusCol) : null;

            const classCol = mobileColumns.find((c) => c.key === "class");
            const rollCol = mobileColumns.find((c) => c.key === "rollNo");
            const classValue = classCol ? getCellValue(row, classCol) : null;
            const rollValue = rollCol ? getCellValue(row, rollCol) : null;

            return (
              <div key={i} className="rounded-xl border bg-background p-3 shadow-sm">
                <div className="mb-2 flex items-start justify-between gap-2 border-b pb-2">
                  <div className="min-w-0">
                    {primaryColumn && !isEmptyValue(primaryValue) && (
                      <div className="text-sm font-semibold">{primaryValue}</div>
                    )}
                    {(classValue || rollValue) && (
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {[classValue && `Class ${classValue}`, rollValue && `Roll ${rollValue}`]
                          .filter(Boolean)
                          .join(" · ")}
                      </p>
                    )}
                  </div>
                  {statusValue && <div className="shrink-0">{statusValue}</div>}
                </div>

                <dl className="space-y-1.5">
                  {detailColumns
                    .filter((col) => col.key !== "status" && col.key !== "class" && col.key !== "rollNo")
                    .map((col) => {
                      const value = getCellValue(row, col);
                      if (isEmptyValue(value)) return null;

                      return (
                        <div key={String(col.key)} className="flex items-baseline justify-between gap-3">
                          <dt className="shrink-0 text-xs text-muted-foreground">{col.label}</dt>
                          <dd className="text-right text-sm">{value}</dd>
                        </div>
                      );
                    })}
                  {inlinePairs.map((col) => {
                    const partner = mobileColumns.find((c) => String(c.key) === col.mobileInlineWith);
                    if (!partner) return null;
                    const v1 = getCellValue(row, col);
                    const v2 = getCellValue(row, partner);
                    if (isEmptyValue(v1) && isEmptyValue(v2)) return null;
                    return null;
                  })}
                </dl>

                {actionsColumn && (
                  <div className="mt-3 flex justify-end gap-2 border-t pt-2">
                    {getCellValue(row, actionsColumn)}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      <div className="hidden overflow-x-auto md:block">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((col) => (
                <TableHead key={String(col.key)}>{col.label}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row, i) => (
              <TableRow key={i}>
                {columns.map((col) => (
                  <TableCell key={String(col.key)}>{getCellValue(row, col)}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}

export type { Column as AdminDataTableColumn };
