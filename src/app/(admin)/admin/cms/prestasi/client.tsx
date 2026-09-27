"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { createAchievement, updateAchievement, deleteAchievement } from "./actions";
import type { Achievement } from "@prisma/client";

export function PrestasiClient({ initialData }: { initialData: Achievement[] }) {
  const [data, setData] = useState(initialData);
  const [editItem, setEditItem] = useState<Achievement | null>(null);

  async function handleCreate(formData: FormData) {
    await createAchievement(formData);
    window.location.reload();
  }

  async function handleUpdate(formData: FormData) {
    if (!editItem) return;
    await updateAchievement(editItem.id, formData);
    window.location.reload();
  }

  async function handleDelete(id: string) {
    await deleteAchievement(id);
    setData(data.filter((d) => d.id !== id));
  }

  const formFields = (item?: Achievement) => (
    <form action={item ? handleUpdate : handleCreate} className="space-y-4 mt-4">
      <div className="space-y-2"><Label>Judul *</Label><Input name="title" defaultValue={item?.title} required /></div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2"><Label>Kategori</Label><Input name="category" defaultValue={item?.category || ""} /></div>
        <div className="space-y-2"><Label>Level</Label><Input name="level" defaultValue={item?.level || ""} /></div>
      </div>
      <div className="space-y-2"><Label>Tahun *</Label><Input name="year" type="number" defaultValue={item?.year} required /></div>
      <Button type="submit" className="w-full">{item ? "Update" : "Simpan"}</Button>
    </form>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-heading text-lg font-semibold">Daftar Prestasi</h3>
        <Dialog>
          <DialogTrigger><Button><Plus className="mr-2 h-4 w-4" />Tambah</Button></DialogTrigger>
          <DialogContent className="max-w-lg"><DialogHeader><DialogTitle>Tambah Prestasi</DialogTitle></DialogHeader>{formFields()}</DialogContent>
        </Dialog>
      </div>
      <div className="rounded-md border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow><TableHead>Judul</TableHead><TableHead>Kategori</TableHead><TableHead>Level</TableHead><TableHead>Tahun</TableHead><TableHead className="w-[100px]">Aksi</TableHead></TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-8">Belum ada data</TableCell></TableRow>
            ) : data.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.title}</TableCell>
                <TableCell className="text-sm">{item.category || "-"}</TableCell>
                <TableCell className="text-sm">{item.level || "-"}</TableCell>
                <TableCell className="text-sm">{item.year}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Dialog>
                      <DialogTrigger><Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setEditItem(item)}><Pencil className="h-4 w-4" /></Button></DialogTrigger>
                      <DialogContent className="max-w-lg"><DialogHeader><DialogTitle>Edit Prestasi</DialogTitle></DialogHeader>{editItem?.id === item.id && formFields(item)}</DialogContent>
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
