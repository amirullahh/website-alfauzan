"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Pencil, Trash2, Plus } from "lucide-react";

interface Column {
  key: string;
  label: string;
  render?: (value: unknown, row: Record<string, unknown>) => React.ReactNode;
}

interface CrudTableProps {
  title: string;
  columns: Column[];
  rows: Record<string, unknown>[];
  onDelete: (id: string) => void;
  formComponent: React.ReactNode;
  editFormComponent?: (row: Record<string, unknown>) => React.ReactNode;
}

export function CrudTable({
  title,
  columns,
  rows,
  onDelete,
  formComponent,
  editFormComponent,
}: CrudTableProps) {
  const [editRow, setEditRow] = useState<Record<string, unknown> | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-heading text-lg font-semibold">{title}</h3>
        <Dialog>
          <DialogTrigger>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Tambah
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Tambah {title}</DialogTitle>
            </DialogHeader>
            {formComponent}
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((col) => (
                <TableHead key={col.key}>{col.label}</TableHead>
              ))}
              <TableHead className="w-[100px]">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length + 1}
                  className="text-center text-muted-foreground py-8"
                >
                  Belum ada data
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row) => (
                <TableRow key={String(row.id)}>
                  {columns.map((col) => (
                    <TableCell key={col.key}>
                      {col.render
                        ? col.render(row[col.key], row)
                        : String(row[col.key] ?? "-")}
                    </TableCell>
                  ))}
                  <TableCell>
                    <div className="flex items-center gap-1">
                      {editFormComponent && (
                        <Dialog
                          open={editRow?.id === row.id}
                          onOpenChange={(open) =>
                            setEditRow(open ? row : null)
                          }
                        >
                          <DialogTrigger>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => setEditRow(row)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>Edit {title}</DialogTitle>
                            </DialogHeader>
                            {editFormComponent(row)}
                          </DialogContent>
                        </Dialog>
                      )}
                      <Dialog
                        open={deleteId === row.id}
                        onOpenChange={(open) =>
                          setDeleteId(open ? String(row.id) : null)
                        }
                      >
                        <DialogTrigger>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:text-destructive"
                            onClick={() => setDeleteId(String(row.id))}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Hapus Data</DialogTitle>
                          </DialogHeader>
                          <p className="text-sm text-muted-foreground">
                            Apakah Anda yakin ingin menghapus data ini? Tindakan ini tidak dapat dibatalkan.
                          </p>
                          <div className="flex justify-end gap-2 mt-4">
                            <Button
                              variant="outline"
                              onClick={() => setDeleteId(null)}
                            >
                              Batal
                            </Button>
                            <Button
                              variant="destructive"
                              onClick={() => {
                                onDelete(String(row.id));
                                setDeleteId(null);
                              }}
                            >
                              Hapus
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
