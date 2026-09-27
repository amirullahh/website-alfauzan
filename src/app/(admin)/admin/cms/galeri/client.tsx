"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Pencil, Trash2, Plus } from "lucide-react";
import { createGalleryItem, updateGalleryItem, deleteGalleryItem } from "./actions";
import type { GalleryItem } from "@prisma/client";

export function GaleriClient({ initialData }: { initialData: GalleryItem[] }) {
  const [data, setData] = useState(initialData);
  const [editItem, setEditItem] = useState<GalleryItem | null>(null);

  async function handleCreate(formData: FormData) {
    await createGalleryItem(formData);
    window.location.reload();
  }

  async function handleUpdate(formData: FormData) {
    if (!editItem) return;
    await updateGalleryItem(editItem.id, formData);
    window.location.reload();
  }

  async function handleDelete(id: string) {
    await deleteGalleryItem(id);
    setData(data.filter((d) => d.id !== id));
  }

  const formFields = (item?: GalleryItem) => (
    <form action={item ? handleUpdate : handleCreate} className="space-y-4 mt-4">
      <div className="space-y-2"><Label>Album</Label><Input name="album" defaultValue={item?.album || ""} /></div>
      <div className="space-y-2"><Label>Caption</Label><Input name="caption" defaultValue={item?.caption || ""} /></div>
      <div className="space-y-2"><Label>URL Gambar *</Label><Input name="imageUrl" defaultValue={item?.imageUrl} required /></div>
      <Button type="submit" className="w-full">{item ? "Update" : "Simpan"}</Button>
    </form>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-heading text-lg font-semibold">Daftar Galeri</h3>
        <Dialog>
          <DialogTrigger><Button><Plus className="mr-2 h-4 w-4" />Tambah</Button></DialogTrigger>
          <DialogContent className="max-w-lg"><DialogHeader><DialogTitle>Tambah Galeri</DialogTitle></DialogHeader>{formFields()}</DialogContent>
        </Dialog>
      </div>
      <div className="rounded-md border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow><TableHead>Album</TableHead><TableHead>Caption</TableHead><TableHead className="w-[100px]">Aksi</TableHead></TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow><TableCell colSpan={3} className="text-center text-muted-foreground py-8">Belum ada data</TableCell></TableRow>
            ) : data.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.album || "-"}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{item.caption || "-"}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Dialog>
                      <DialogTrigger><Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setEditItem(item)}><Pencil className="h-4 w-4" /></Button></DialogTrigger>
                      <DialogContent className="max-w-lg"><DialogHeader><DialogTitle>Edit Galeri</DialogTitle></DialogHeader>{editItem?.id === item.id && formFields(item)}</DialogContent>
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
