"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Pencil, Trash2, Plus } from "lucide-react";
import { createAgenda, updateAgenda, deleteAgenda } from "./actions";
import type { Agenda } from "@prisma/client";

export function AgendaClient({ initialData }: { initialData: Agenda[] }) {
  const [data, setData] = useState(initialData);
  const [editItem, setEditItem] = useState<Agenda | null>(null);

  async function handleCreate(formData: FormData) {
    await createAgenda(formData);
    window.location.reload();
  }

  async function handleUpdate(formData: FormData) {
    if (!editItem) return;
    await updateAgenda(editItem.id, formData);
    window.location.reload();
  }

  async function handleDelete(id: string) {
    await deleteAgenda(id);
    setData(data.filter((d) => d.id !== id));
  }

  const formFields = (item?: Agenda) => (
    <form action={item ? handleUpdate : handleCreate} className="space-y-4 mt-4">
      <div className="space-y-2"><Label>Judul *</Label><Input name="title" defaultValue={item?.title} required /></div>
      <div className="space-y-2"><Label>Deskripsi</Label><Textarea name="description" defaultValue={item?.description || ""} rows={2} /></div>
      <div className="space-y-2"><Label>Lokasi</Label><Input name="location" defaultValue={item?.location || ""} /></div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2"><Label>Tanggal Mulai *</Label><Input name="startDate" type="date" defaultValue={item?.startDate ? new Date(item.startDate).toISOString().split("T")[0] : ""} required /></div>
        <div className="space-y-2"><Label>Tanggal Selesai</Label><Input name="endDate" type="date" defaultValue={item?.endDate ? new Date(item.endDate).toISOString().split("T")[0] : ""} /></div>
      </div>
      <Button type="submit" className="w-full">{item ? "Update" : "Simpan"}</Button>
    </form>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-heading text-lg font-semibold">Daftar Agenda</h3>
        <Dialog>
          <DialogTrigger><Button><Plus className="mr-2 h-4 w-4" />Tambah</Button></DialogTrigger>
          <DialogContent className="max-w-lg"><DialogHeader><DialogTitle>Tambah Agenda</DialogTitle></DialogHeader>{formFields()}</DialogContent>
        </Dialog>
      </div>
      <div className="rounded-md border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow><TableHead>Judul</TableHead><TableHead>Lokasi</TableHead><TableHead>Tanggal</TableHead><TableHead className="w-[100px]">Aksi</TableHead></TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground py-8">Belum ada data</TableCell></TableRow>
            ) : data.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.title}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{item.location || "-"}</TableCell>
                <TableCell className="text-sm">
                  {new Date(item.startDate).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                  {item.endDate && ` - ${new Date(item.endDate).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}`}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Dialog>
                      <DialogTrigger><Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setEditItem(item)}><Pencil className="h-4 w-4" /></Button></DialogTrigger>
                      <DialogContent className="max-w-lg"><DialogHeader><DialogTitle>Edit Agenda</DialogTitle></DialogHeader>{editItem?.id === item.id && formFields(item)}</DialogContent>
                    </Dialog>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDelete(item.id)}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
