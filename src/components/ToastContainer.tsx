// src/components/ToastContainer.tsx
'use client';

import React from 'react';
import { Toast } from '@/components/ui/Toast';
import { useToast } from '@/hooks/useToast';

export function ToastContainer() {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          toast={toast}
          onRemove={removeToast}
        />
      ))}
    </div>
  );
}