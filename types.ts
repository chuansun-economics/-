export interface QuoteData {
  content: string;
  source: string;
  year?: string;
  explanation: string;
}

export interface QuoteState {
  data: QuoteData | null;
  loading: boolean;
  error: string | null;
}