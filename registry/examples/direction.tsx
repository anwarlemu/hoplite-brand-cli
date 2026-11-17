"use client";

import { DirectionProvider } from "@/components/ui/direction";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function Preview() {
  return (
    <DirectionProvider dir="rtl">
      <div dir="rtl" className="grid gap-4">
        <p className="ds-label">الفوترة</p>
        <Tabs defaultValue="monthly">
          <TabsList aria-label="فترة الفوترة">
            <TabsTrigger value="monthly">شهري</TabsTrigger>
            <TabsTrigger value="yearly">سنوي</TabsTrigger>
          </TabsList>
          <TabsContent value="monthly" className="text-body-sm text-fg-secondary">
            ٢٠ دولارًا لكل مقعد، تُدفع كل شهر.
          </TabsContent>
          <TabsContent value="yearly" className="text-body-sm text-fg-secondary">
            تُدفع مرة واحدة في السنة.
          </TabsContent>
        </Tabs>
      </div>
    </DirectionProvider>
  );
}

export function LeftToRight() {
  return (
    <DirectionProvider dir="ltr">
      <div dir="ltr" className="grid gap-4">
        <p className="ds-label">Billing</p>
        <Tabs defaultValue="monthly">
          <TabsList aria-label="Billing period">
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
            <TabsTrigger value="yearly">Yearly</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </DirectionProvider>
  );
}
