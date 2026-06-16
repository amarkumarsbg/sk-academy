import { AdminHeader } from "@/components/admin/admin-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const demoResults = [
  { subject: "English", maxMarks: 100, marks: 88 },
  { subject: "Mathematics", maxMarks: 100, marks: 92 },
  { subject: "Science", maxMarks: 100, marks: 85 },
  { subject: "Social Science", maxMarks: 100, marks: 90 },
  { subject: "Hindi", maxMarks: 100, marks: 87 },
];

export default function ResultsPage() {
  const total = demoResults.reduce((sum, r) => sum + r.marks, 0);
  const maxTotal = demoResults.reduce((sum, r) => sum + r.maxMarks, 0);
  const percentage = ((total / maxTotal) * 100).toFixed(1);

  return (
    <>
      <AdminHeader title="Results" />
      <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-6">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-base">Enter / View Results</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-4">
            <div className="space-y-2">
              <Label>Exam</Label>
              <Select defaultValue="midterm">
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="midterm">Mid-Term 2026</SelectItem>
                  <SelectItem value="unit">Unit Test 3</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Class</Label>
              <Select defaultValue="X-A">
                <SelectTrigger className="w-36">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="X-A">X-A</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Student</Label>
              <Input defaultValue="Aarav Sharma" className="w-48" />
            </div>
            <div className="flex items-end">
              <Button disabled>Load</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Aarav Sharma — Mid-Term 2026 (Demo)</CardTitle>
            <p className="text-sm font-medium text-primary">{percentage}% · Grade A</p>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Subject</TableHead>
                  <TableHead>Max Marks</TableHead>
                  <TableHead>Marks Obtained</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {demoResults.map((row) => (
                  <TableRow key={row.subject}>
                    <TableCell>{row.subject}</TableCell>
                    <TableCell>{row.maxMarks}</TableCell>
                    <TableCell>{row.marks}</TableCell>
                  </TableRow>
                ))}
                <TableRow className="font-semibold">
                  <TableCell>Total</TableCell>
                  <TableCell>{maxTotal}</TableCell>
                  <TableCell>{total}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
