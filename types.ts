export type AbandonmentReason = 
  | 'UPI_PAYMENT_FAILURE'
  | 'NETBANKING_TIMEOUT'
  | 'SURPRISE_SHIPPING_COST'
  | 'DELIVERY_DATE_TOO_SLOW'
  | 'PRICE_SHOPPING_COMPARISON'
  | 'COD_UNAVAILABLE_FRICTION'
  | 'FORM_INPUT_FATIGUE'
  | 'LOW_INTENT_BROWSING';

export type ActionCategory = 
  | 'DO_NOTHING'
  | 'INSTANT_UPI_RETRY'
  | 'FREE_EXPRESS_SHIPPING'
  | 'COD_ENABLE_VERIFICATION'
  | 'TARGETED_MARGIN_DISCOUNT'
  | 'EXIT_INTENT_TRUST_BADGE'
  | 'WHATSAPP_ASSIST_LINK';

export interface CartItem {
  id: string;
  name: string;
  category: string;
  price: number; // in INR ₹
  quantity: number;
  image?: string;
}

export interface UserSession {
  sessionId: string;
  customerName: string;
  customerPhone?: string;
  customerEmail?: string;
  cityTier: 'Tier 1' | 'Tier 2' | 'Tier 3';
  isFirstTimeUser: boolean;
  cartItems: CartItem[];
  cartValue: number; // ₹
  productMarginPct: number; // e.g., 35%
  timeOnPageSec: number;
  idleTimeSec: number;
  mouseExitIntent: boolean;
  paymentAttempts: number;
  failedPaymentMethod?: 'UPI' | 'Card' | 'NetBanking' | 'COD_Rejected' | 'None';
  shippingFee: number; // ₹
  estimatedDeliveryDays: number;
  tabSwitchCount: number; // checking competitor apps
  historicalConversionRate: number; // e.g., 0.15
  
  // Scored outputs
  riskScore?: number; // 0 - 100
  predictedReason?: AbandonmentReason;
  recommendedAction?: ActionCategory;
  actionReasoning?: string;
  discountOfferedPct?: number;
  discountOfferedAmount?: number;
  projectedRecoveryProb?: number; // e.g. 0.65
  expectedMarginImpact?: number; // ₹ net profit impact
  aiCostEst?: number; // ₹ cost of AI decision (e.g. ₹0.02)
  latencyMs?: number; // e.g. 142ms
  timestamp: string;
  status: 'ACTIVE' | 'RECOVERED' | 'ABANDONED' | 'CONVERTED_ORGANIC';
}

export interface GuardrailPolicy {
  maxDiscountPct: number; // e.g., 10%
  maxDiscountCapAmount: number; // e.g., ₹500
  minCartForDiscount: number; // e.g., ₹999
  campaignBudgetTotal: number; // e.g. ₹100,000
  campaignBudgetSpent: number; // e.g. ₹34,200
  preventBlanketDiscountOnPaymentFail: boolean;
  allowCodOnTier3: boolean;
  requireSelfCheckAudit: boolean;
}

export interface AgentStepTrace {
  stepName: string;
  agentName: 'Signal Extractor' | 'Risk Classifier' | 'Policy Guardrail' | 'Nudge Synthesizer';
  durationMs: number;
  inputSummary: string;
  outputSummary: string;
  modelUsed: string;
  status: 'SUCCESS' | 'GUARDRAIL_TRIGGERED' | 'FALLBACK';
}

export interface HoldoutExperimentResult {
  groupName: 'Treatment (Cart Rescue AI)' | 'Control A (No Action)' | 'Control B (Blanket 10% Discount)';
  sessionCount: number;
  convertedCount: number;
  conversionRate: number; // %
  grossRevenue: number; // ₹
  totalDiscountCost: number; // ₹
  netMargin: number; // ₹
  avgDiscountPerSession: number; // ₹
  incrementalMarginVsControlA: number; // ₹
}

export interface DatasetPreset {
  id: string;
  name: string;
  description: string;
  totalSessions: number;
  abandonmentRate: number;
  avgCartValue: number;
  sessions: UserSession[];
}
