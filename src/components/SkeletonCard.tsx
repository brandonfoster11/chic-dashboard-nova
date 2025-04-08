import React from 'react';

export const SkeletonCard = () => (
  <div className="animate-pulse space-y-4 rounded-lg bg-muted p-4">
    <div className="h-32 bg-muted-foreground/30 rounded-md" />
    <div className="h-4 bg-muted-foreground/30 w-3/4 rounded" />
    <div className="h-4 bg-muted-foreground/30 w-1/2 rounded" />
  </div>
);

export const SkeletonOutfitCard = () => (
  <div className="animate-pulse space-y-4 rounded-lg bg-muted p-4">
    <div className="h-40 bg-muted-foreground/30 rounded-md" />
    <div className="space-y-2">
      <div className="h-4 bg-muted-foreground/30 w-3/4 rounded" />
      <div className="h-3 bg-muted-foreground/30 w-1/2 rounded" />
      <div className="flex space-x-2">
        <div className="h-3 w-12 bg-muted-foreground/30 rounded" />
        <div className="h-3 w-12 bg-muted-foreground/30 rounded" />
      </div>
    </div>
  </div>
);
