  // src/types/logs.ts
  export interface WateringLogInput {
    date: Date;
    amount: number | null;
    notes: string | null;
  }
  
  export interface FertilizingLogInput {
    date: Date;
    amount: number | null;
    notes: string | null;
    fertilizer: string | null;
  }

  