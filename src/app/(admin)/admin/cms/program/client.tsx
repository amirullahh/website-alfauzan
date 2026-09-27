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
import { createProgram, updateProgram, deleteProgram } from "./actions";
import type { Program } from "@prisma/client";

export function ProgramClient({ initialData }: { initialData: Program[] }) {
  const [data, setData] = useState(initialData);
  const [editItem, setEditItem] = useState<Program | null>(null);

  async function handleCreate(formData: FormData) {
    await createProgram(formData);
    window.location.reload();
  }

  async function handleUpdate(formData: FormData) {
    if (!editItem) return;
    await updateProgram(editItem.id, formData);
    window.location.reload();
  }

  async function handleDelete(id: string) {
    await deleteProgram(id);
    setData(data.filter((d) => d.id !== id));
  }

  const formFields = (item?: Program) => (
    <form action={item ? handleUpdate : handleCreate} className="space-y-4 mt-4">
      <div className="space-y-2"><Label>Nama *</Label><Input name="name" defaultValue={item?.name} required /></div>
      <div className="space-y-2"><Label>Slug *</Label><Input name="slug" defaultValue={item?.slug} required /></div>
      <div className="space-y-2"><Label>Deskripsi *</Label><Textarea name="description" defaultValue={item?.description} rows={3} required /></div>
      <div className="space-y-2"><Label>Urutan</Label><Input name="order" type="number" defaultValue={item?.order} /></div>
      <Button type="submit" className="w-full">{item ? "Update" : "Simpan"}</Button>
    </form>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-heading text-lg font-semibold">Daftar Program</h3>
        <Dialog>
          <DialogTrigger><Button><Plus className="mr-2 h-4 w-4" />Tambah</Button></DialogTrigger>
          <DialogContent className="max-w-lg"><DialogHeader><DialogTitle>Tambah Program</DialogTitle></DialogHeader>{formFields()}</DialogContent>
        </Dialog>
      </div>
      <div className="rounded-md border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow><TableHead>Nama</TableHead><TableHead>Slug</TableHead><TableHead>Urutan</TableHead><TableHead className="w-[100px]">Aksi</TableHead></TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground py-8">Belum ada data</TableCell></TableRow>
            ) : data.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{item.slug}</TableCell>
                <TableCell className="text-sm">{item.order}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Dialog>
                      <DialogTrigger><Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setEditItem(item)}><Pencil className="h-4 w-4" /></Button></DialogTrigger>
                      <DialogContent className="max-w-lg"><DialogHeader><DialogTitle>Edit Program</DialogTitle></DialogHeader>{editItem?.id === item.id && formFields(item)}</DialogContent>
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
