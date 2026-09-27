"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
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
import { createNews, updateNews, deleteNews } from "./actions";
import type { News } from "@prisma/client";

export function BeritaClient({ initialData }: { initialData: News[] }) {
  const [data, setData] = useState(initialData);
  const [editItem, setEditItem] = useState<News | null>(null);

  async function handleCreate(formData: FormData) {
    const result = await createNews(formData);
    if (result.success) {
      window.location.reload();
    }
  }

  async function handleUpdate(formData: FormData) {
    if (!editItem) return;
    const result = await updateNews(editItem.id, formData);
    if (result.success) {
      window.location.reload();
    }
  }

  async function handleDelete(id: string) {
    await deleteNews(id);
    setData(data.filter((d) => d.id !== id));
  }

  const formFields = (item?: News) => (
    <form action={item ? handleUpdate : handleCreate} className="space-y-4 mt-4">
      <div className="space-y-2">
        <Label>Judul *</Label>
        <Input name="title" defaultValue={item?.title} required />
      </div>
      <div className="space-y-2">
        <Label>Slug *</Label>
        <Input name="slug" defaultValue={item?.slug} required />
      </div>
      <div className="space-y-2">
        <Label>Ringkasan</Label>
        <Textarea name="excerpt" defaultValue={item?.excerpt || ""} rows={2} />
      </div>
      <div className="space-y-2">
        <Label>Konten *</Label>
        <Textarea name="content" defaultValue={item?.content} rows={5} required />
      </div>
      <div className="flex items-center gap-2">
        <Switch name="isPublished" defaultChecked={item?.isPublished} />
        <Label>Published</Label>
      </div>
      <Button type="submit" className="w-full">{item ? "Update" : "Simpan"}</Button>
    </form>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-heading text-lg font-semibold">Daftar Berita</h3>
        <Dialog>
          <DialogTrigger>
            <Button><Plus className="mr-2 h-4 w-4" />Tambah</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle>Tambah Berita</DialogTitle></DialogHeader>
            {formFields()}
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Judul</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[100px]">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground py-8">Belum ada data</TableCell></TableRow>
            ) : data.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.title}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{item.slug}</TableCell>
                <TableCell>
                  <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${item.isPublished ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
                    {item.isPublished ? "Published" : "Draft"}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Dialog>
                      <DialogTrigger>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setEditItem(item)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                        <DialogHeader><DialogTitle>Edit Berita</DialogTitle></DialogHeader>
                        {editItem?.id === item.id && formFields(item)}
                      </DialogContent>
                    </Dialog>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDelete(item.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
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
