"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, CheckCircle } from "lucide-react";
import { changePassword } from "./actions";
import { useSession } from "next-auth/react";

export default function AdminPengaturanPage() {
  const { data: session } = useSession();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit(formData: FormData) {
    setError("");
    setSuccess(false);

    if (!session?.user?.email) {
      setError("Session tidak valid");
      return;
    }

    const result = await changePassword(session.user.email, formData);

    if (result.error) {
      const firstError = Object.values(result.error)[0];
      setError(Array.isArray(firstError) ? firstError[0] : "Terjadi kesalahan");
    } else if (result.success) {
      setSuccess(true);
    }
  }

  return (
    <div className="max-w-lg space-y-6">
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="font-heading text-base">Ubah Password</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={handleSubmit} className="space-y-4">
            {error && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {error}
              </div>
            )}
            {success && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-green-50 text-green-700 text-sm">
                <CheckCircle className="h-4 w-4 shrink-0" />
                Password berhasil diubah
              </div>
            )}
            <div className="space-y-2">
              <Label>Password Saat Ini</Label>
              <Input name="currentPassword" type="password" required />
            </div>
            <div className="space-y-2">
              <Label>Password Baru</Label>
              <Input name="newPassword" type="password" required minLength={6} />
            </div>
            <Button type="submit">Ubah Password</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
