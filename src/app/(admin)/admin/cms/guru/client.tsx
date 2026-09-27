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
import { createTeacher, updateTeacher, deleteTeacher } from "./actions";
import type { Teacher } from "@prisma/client";

export function GuruClient({ initialData }: { initialData: Teacher[] }) {
  const [data, setData] = useState(initialData);
  const [editItem, setEditItem] = useState<Teacher | null>(null);

  async function handleCreate(formData: FormData) {
    await createTeacher(formData);
    window.location.reload();
  }

  async function handleUpdate(formData: FormData) {
    if (!editItem) return;
    await updateTeacher(editItem.id, formData);
    window.location.reload();
  }

  async function handleDelete(id: string) {
    await deleteTeacher(id);
    setData(data.filter((d) => d.id !== id));
  }

  const formFields = (item?: Teacher) => (
    <form action={item ? handleUpdate : handleCreate} className="space-y-4 mt-4">
      <div className="space-y-2"><Label>Nama *</Label><Input name="name" defaultValue={item?.name} required /></div>
      <div className="space-y-2"><Label>Jabatan / Mapel</Label><Input name="role" defaultValue={item?.role || ""} /></div>
      <div className="space-y-2"><Label>Bio</Label><Textarea name="bio" defaultValue={item?.bio || ""} rows={2} /></div>
      <div className="space-y-2"><Label>Urutan</Label><Input name="order" type="number" defaultValue={item?.order} /></div>
      <Button type="submit" className="w-full">{item ? "Update" : "Simpan"}</Button>
    </form>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-heading text-lg font-semibold">Daftar Guru</h3>
        <Dialog>
          <DialogTrigger><Button><Plus className="mr-2 h-4 w-4" />Tambah</Button></DialogTrigger>
          <DialogContent className="max-w-lg"><DialogHeader><DialogTitle>Tambah Guru</DialogTitle></DialogHeader>{formFields()}</DialogContent>
        </Dialog>
      </div>
      <div className="rounded-md border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow><TableHead>Nama</TableHead><TableHead>Jabatan</TableHead><TableHead className="w-[100px]">Aksi</TableHead></TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow><TableCell colSpan={3} className="text-center text-muted-foreground py-8">Belum ada data</TableCell></TableRow>
            ) : data.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{item.role || "-"}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Dialog>
                      <DialogTrigger><Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setEditItem(item)}><Pencil className="h-4 w-4" /></Button></DialogTrigger>
                      <DialogContent className="max-w-lg"><DialogHeader><DialogTitle>Edit Guru</DialogTitle></DialogHeader>{editItem?.id === item.id && formFields(item)}</DialogContent>
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
