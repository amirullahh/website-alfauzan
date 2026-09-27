"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Trash2 } from "lucide-react";
import { updatePsbStatus, deletePsbSubmission } from "./actions";
import type { PsbSubmission, PsbStatus } from "@prisma/client";

const statusColors: Record<string, string> = {
  BARU: "bg-blue-100 text-blue-700",
  DIPROSES: "bg-amber-100 text-amber-700",
  SELESAI: "bg-green-100 text-green-700",
  DITOLAK: "bg-red-100 text-red-700",
};

export function PsbClient({ initialData }: { initialData: PsbSubmission[] }) {
  const [data, setData] = useState(initialData);

  async function handleStatusChange(id: string, status: string) {
    const formData = new FormData();
    formData.set("status", status);
    await updatePsbStatus(id, formData);
    setData(data.map((d) => (d.id === id ? { ...d, status: status as PsbStatus } : d)));
  }

  async function handleDelete(id: string) {
    await deletePsbSubmission(id);
    setData(data.filter((d) => d.id !== id));
  }

  return (
    <div className="rounded-md border border-border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nama Santri</TableHead>
            <TableHead>Wali</TableHead>
            <TableHead>Telepon</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Tanggal</TableHead>
            <TableHead className="w-[80px]">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                Belum ada pendaftaran
              </TableCell>
            </TableRow>
          ) : (
            data.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.studentName}</TableCell>
                <TableCell className="text-sm">{item.parentName}</TableCell>
                <TableCell className="text-sm">{item.phone}</TableCell>
                <TableCell>
                  <select
                    value={item.status}
                    onChange={(e) => handleStatusChange(item.id, e.target.value)}
                    className={`rounded-md px-2 py-1 text-xs font-medium border-0 cursor-pointer ${statusColors[item.status] || "bg-muted"}`}
                  >
                    <option value="BARU">Baru</option>
                    <option value="DIPROSES">Diproses</option>
                    <option value="SELESAI">Selesai</option>
                    <option value="DITOLAK">Ditolak</option>
                  </select>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {new Date(item.createdAt).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDelete(item.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
