"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Pencil, Trash2, Plus } from "lucide-react";
import { createFacility, updateFacility, deleteFacility } from "./actions";
import type { Facility } from "@prisma/client";

export function FasilitasClient({ initialData }: { initialData: Facility[] }) {
  const [data, setData] = useState(initialData);
  const [editItem, setEditItem] = useState<Facility | null>(null);

  async function handleCreate(formData: FormData) {
    await createFacility(formData);
    window.location.reload();
  }

  async function handleUpdate(formData: FormData) {
    if (!editItem) return;
    await updateFacility(editItem.id, formData);
    window.location.reload();
  }

  async function handleDelete(id: string) {
    await deleteFacility(id);
    setData(data.filter((d) => d.id !== id));
  }

  const formFields = (item?: Facility) => (
    <form action={item ? handleUpdate : handleCreate} className="space-y-4 mt-4">
      <div className="space-y-2"><Label>Nama *</Label><Input name="name" defaultValue={item?.name} required /></div>
      <div className="space-y-2"><Label>Deskripsi</Label><Textarea name="description" defaultValue={item?.description || ""} rows={3} /></div>
      <div className="space-y-2"><Label>Urutan</Label><Input name="order" type="number" defaultValue={item?.order} /></div>
      <Button type="submit" className="w-full">{item ? "Update" : "Simpan"}</Button>
    </form>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-heading text-lg font-semibold">Daftar Fasilitas</h3>
        <Dialog>
          <DialogTrigger><Button><Plus className="mr-2 h-4 w-4" />Tambah</Button></DialogTrigger>
          <DialogContent className="max-w-lg"><DialogHeader><DialogTitle>Tambah Fasilitas</DialogTitle></DialogHeader>{formFields()}</DialogContent>
        </Dialog>
      </div>
      <div className="rounded-md border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow><TableHead>Nama</TableHead><TableHead>Deskripsi</TableHead><TableHead className="w-[100px]">Aksi</TableHead></TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow><TableCell colSpan={3} className="text-center text-muted-foreground py-8">Belum ada data</TableCell></TableRow>
            ) : data.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell className="text-sm text-muted-foreground max-w-xs truncate">{item.description || "-"}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Dialog>
                      <DialogTrigger><Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setEditItem(item)}><Pencil className="h-4 w-4" /></Button></DialogTrigger>
                      <DialogContent className="max-w-lg"><DialogHeader><DialogTitle>Edit Fasilitas</DialogTitle></DialogHeader>{editItem?.id === item.id && formFields(item)}</DialogContent>
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
