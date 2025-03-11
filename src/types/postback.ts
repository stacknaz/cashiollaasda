export interface PostbackResponse {
  success: boolean;
  message: string;
  data?: {
    id: string;
    status: string;
    payout: number;
    click_id: string;
    created_at: string;
    [key: string]: any;
  };
  error?: string;
}

export interface PostbackRequest {
  click_id: string;
  payout: number;
  offer_id: string;
  tracking_id: string;
}

export interface TestResult {
  offerClick: {
    id: string;
    status: string;
    reward: number;
    created_at: string;
  };
  postbackResponse: {
    success: boolean;
    message: string;
    data: {
      id: string;
      status: string;
      payout: number;
    } | null;
  };
}