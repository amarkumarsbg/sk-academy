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
import { students } from "@/data/mock";

export default function AttendancePage() {
  return (
    <>
      <AdminHeader title="Attendance" />
      <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-6">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-base">Mark Attendance</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-4">
            <div className="space-y-2">
              <Label>Date</Label>
              <Input type="date" defaultValue="2026-06-16" className="w-44" />
            </div>
            <div className="space-y-2">
              <Label>Class</Label>
              <Select defaultValue="X-A">
                <SelectTrigger className="w-44">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="X-A">Class X-A</SelectItem>
                  <SelectItem value="IX-B">Class IX-B</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button disabled>Load Students</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Class X-A — Demo Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {students.filter((s) => s.class === "X-A").map((student) => (
                <div key={student.id} className="flex items-center justify-between rounded-lg border p-3">
                  <div>
                    <p className="text-sm font-medium">{student.name}</p>
                    <p className="text-xs text-muted-foreground">Roll No: {student.rollNo}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="default">Present</Button>
                    <Button size="sm" variant="outline">Absent</Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
