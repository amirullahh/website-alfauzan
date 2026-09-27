"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, AlertCircle } from "lucide-react";
import { submitPsb, type PsbFormState } from "@/app/(public)/psb/actions";

export function PsbForm() {
  const [state, formAction, isPending] = useActionState<PsbFormState, FormData>(
    submitPsb,
    {}
  );

  if (state.success) {
    return (
      <Card className="border-green-200 bg-green-50">
        <CardContent className="p-8 text-center">
          <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
          <h3 className="font-heading text-xl font-semibold text-green-800 mb-2">
            Pendaftaran Berhasil Diterima
          </h3>
          <p className="text-sm text-green-700">
            {state.message}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <form action={formAction} className="space-y-5">
      {state.message && !state.success && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {state.message}
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="studentName">
            Nama Calon Santri <span className="text-destructive">*</span>
          </Label>
          <Input
            id="studentName"
            name="studentName"
            placeholder="Masukkan nama lengkap"
            className={state.errors?.studentName ? "border-destructive" : ""}
          />
          {state.errors?.studentName && (
            <p className="text-xs text-destructive flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              {state.errors.studentName[0]}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="studentDob">Tanggal Lahir</Label>
          <Input
            id="studentDob"
            name="studentDob"
            type="date"
          />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="parentName">
            Nama Wali / Orang Tua <span className="text-destructive">*</span>
          </Label>
          <Input
            id="parentName"
            name="parentName"
            placeholder="Masukkan nama wali"
            className={state.errors?.parentName ? "border-destructive" : ""}
          />
          {state.errors?.parentName && (
            <p className="text-xs text-destructive flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              {state.errors.parentName[0]}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">
            Nomor Telepon <span className="text-destructive">*</span>
          </Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            placeholder="Contoh: 0812-3456-7890"
            className={state.errors?.phone ? "border-destructive" : ""}
          />
          {state.errors?.phone && (
            <p className="text-xs text-destructive flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              {state.errors.phone[0]}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="Contoh: email@domain.com"
          className={state.errors?.email ? "border-destructive" : ""}
        />
        {state.errors?.email && (
          <p className="text-xs text-destructive flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            {state.errors.email[0]}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Alamat</Label>
        <Textarea
          id="address"
          name="address"
          placeholder="Masukkan alamat lengkap"
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Catatan Tambahan</Label>
        <Textarea
          id="notes"
          name="notes"
          placeholder="Informasi tambahan yang ingin disampaikan"
          rows={3}
        />
      </div>

      <Button
        type="submit"
        disabled={isPending}
        className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
      >
        {isPending ? "Mengirim..." : "Kirim Pendaftaran"}
      </Button>
    </form>
  );
}
