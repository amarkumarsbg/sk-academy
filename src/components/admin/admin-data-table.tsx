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
  /** Hide this field in the mobile card layout (e.g. duplicate action columns). */
  hideOnMobile?: boolean;
  /** Show prominently at the top of the mobile card (first matching column wins). */
  primary?: boolean;
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

  return (
    <Card className="overflow-hidden py-0">
      <div className="space-y-3 p-3 md:hidden">
        {data.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">No records found.</p>
        ) : (
          data.map((row, i) => {
            const primaryValue = primaryColumn ? getCellValue(row, primaryColumn) : null;

            return (
              <div key={i} className="rounded-lg border bg-background p-3 shadow-sm">
                {primaryColumn && !isEmptyValue(primaryValue) && (
                  <div className="mb-2 border-b pb-2">
                    <p className="text-xs font-medium text-muted-foreground">{primaryColumn.label}</p>
                    <div className="text-sm font-semibold">{primaryValue}</div>
                  </div>
                )}
                <dl className="space-y-2">
                  {mobileColumns
                    .filter((col) => col !== primaryColumn)
                    .map((col) => {
                      const value = getCellValue(row, col);
                      if (isEmptyValue(value)) return null;

                      return (
                        <div key={String(col.key)} className="flex flex-col gap-0.5">
                          <dt className="text-xs font-medium text-muted-foreground">{col.label}</dt>
                          <dd className="text-sm break-words">{value}</dd>
                        </div>
                      );
                    })}
                </dl>
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
