"use client"

import { Toast, ToastProvider, ToastViewport, ToastAction, ToastClose, ToastTitle, ToastDescription } from "@/components/ui/toast"
import { Toaster as ShadcnToaster } from "@/components/ui/toast"
import { useToast } from "@/components/ui/use-toast"

export function Toaster() {
  const { toasts, dismiss } = useToast()

  return (
    <ToastProvider>
      <ToastViewport />
      {toasts.map(function ({ id, title, description, action, open, ...props }) {
        return (
          <Toast key={id} open={open} onOpenChange={(open) => {
            if (!open) dismiss(id);
          }} {...props}>
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && (
                <ToastDescription>
                  {description}
                </ToastDescription>
              )}
            </div>
            {action}
            <ToastClose />
          </Toast>
        )
      })}
    </ToastProvider>
  )
}
