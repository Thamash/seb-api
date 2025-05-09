'use client';

import { useUIStore } from '@/stores/uiStore';

const LoadingBackdrop = () => {
  const isLoading = useUIStore((s) => s.isLoading);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black opacity-50 bg-opacity-40 backdrop-blur-sm">
      <div className="w-12 h-12 border-4 rounded-full animate-spin spinner-green" />
    </div>
  );
};

export default LoadingBackdrop;
