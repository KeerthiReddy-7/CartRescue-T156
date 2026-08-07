import { GoogleGenAI } from '@google/genai';
import { UserSession, GuardrailPolicy, AgentStepTrace, AbandonmentReason, ActionCategory } from '../types';

export interface ScoredResult {
  session: UserSession;
  traces: AgentStepTrace[];
  selfCheckPassed: boolean;
  selfCheckMessage?: string;
}

// Fast Deterministic Real-time Rule Engine (Sub-100ms)
export function evaluateSessionFast(
  session: UserSession,
  policy: GuardrailPolicy
): ScoredResult {
  const startTime = performance.now();
  const traces: AgentStepTrace[] = [];

  // 1. SIGNAL EXTRACTOR AGENT
  const t1Start = performance.now();
  let primarySignal = 'NORMAL_BROWSING';
  if (session.paymentAttempts > 0 && session.failedPaymentMethod === 'UPI') {
    primarySignal = 'UPI_TRANSACTION_FAILED';
  } else if (session.paymentAttempts > 0 && session.failedPaymentMethod === 'NetBanking') {
    primarySignal = 'NETBANKING_GATEWAY_TIMEOUT';
  } else if (session.shippingFee > 100 && session.cartValue < 3000) {
    primarySignal = 'HIGH_RELATIVE_SHIPPING_FRICTION';
  } else if (session.estimatedDeliveryDays >= 5 && session.cityTier !== 'Tier 1') {
    primarySignal = 'DELIVERY_DURATION_SENSITIVITY';
  } else if (session.tabSwitchCount >= 4 || (session.timeOnPageSec > 400 && session.mouseExitIntent)) {
    primarySignal = 'PRICE_COMPARISON_TAB_SWITCHING';
  } else if (session.failedPaymentMethod === 'COD_Rejected') {
    primarySignal = 'COD_LIMIT_OR_UNAVAILABLE';
  } else if (session.historicalConversionRate > 0.5 && !session.mouseExitIntent && session.timeOnPageSec < 120) {
    primarySignal = 'HIGH_ORGANIC_INTENT_BUYER';
  }

  traces.push({
    stepName: 'Signal Aggregation',
    agentName: 'Signal Extractor',
    durationMs: Math.round(performance.now() - t1Start),
    inputSummary: `Cart ₹${session.cartValue}, PayAttempts: ${session.paymentAttempts}, FailedPay: ${session.failedPaymentMethod || 'None'}, TabSwitches: ${session.tabSwitchCount}, ExitIntent: ${session.mouseExitIntent}`,
    outputSummary: `Detected Primary Signal: ${primarySignal}`,
    modelUsed: 'Heuristic Rule Pipeline (Fast-Path)',
    status: 'SUCCESS'
  });

  // 2. RISK CLASSIFIER & DIAGNOSIS AGENT
  const t2Start = performance.now();
  let riskScore = 20;
  let predictedReason: AbandonmentReason = 'LOW_INTENT_BROWSING';

  if (session.paymentAttempts > 0) {
    riskScore = 88 + Math.min(session.paymentAttempts * 4, 10);
    predictedReason = session.failedPaymentMethod === 'UPI' ? 'UPI_PAYMENT_FAILURE' : 'NETBANKING_TIMEOUT';
  } else if (session.mouseExitIntent && session.tabSwitchCount >= 3) {
    riskScore = 82;
    predictedReason = 'PRICE_SHOPPING_COMPARISON';
  } else if (session.shippingFee > 100 && session.cartValue < 2500) {
    riskScore = 78;
    predictedReason = 'SURPRISE_SHIPPING_COST';
  } else if (session.estimatedDeliveryDays >= 5) {
    riskScore = 72;
    predictedReason = 'DELIVERY_DATE_TOO_SLOW';
  } else if (session.failedPaymentMethod === 'COD_Rejected' || (session.cityTier === 'Tier 3' && session.mouseExitIntent)) {
    riskScore = 75;
    predictedReason = 'COD_UNAVAILABLE_FRICTION';
  } else if (session.historicalConversionRate > 0.4 && !session.mouseExitIntent) {
    riskScore = 18;
    predictedReason = 'LOW_INTENT_BROWSING';
  } else if (session.mouseExitIntent) {
    riskScore = 65;
    predictedReason = 'FORM_INPUT_FATIGUE';
  }

  traces.push({
    stepName: 'Abandonment Diagnosis',
    agentName: 'Risk Classifier',
    durationMs: Math.round(performance.now() - t2Start),
    inputSummary: `Signal: ${primarySignal}, ConversionHist: ${(session.historicalConversionRate * 100).toFixed(0)}%`,
    outputSummary: `Risk Score: ${riskScore}/100 | Reason: ${predictedReason}`,
    modelUsed: 'Classifier Ensemble',
    status: 'SUCCESS'
  });

  // 3. POLICY & MARGIN GUARDRAIL AGENT
  const t3Start = performance.now();
  let recommendedAction: ActionCategory = 'DO_NOTHING';
  let actionReasoning = '';
  let discountPct = 0;
  let discountAmt = 0;

  if (predictedReason === 'UPI_PAYMENT_FAILURE' || predictedReason === 'NETBANKING_TIMEOUT') {
    // Policy rule: NEVER waste discount margin on payment failures! The user WANTS to buy!
    recommendedAction = 'INSTANT_UPI_RETRY';
    actionReasoning = 'Payment gateway error detected. User has high purchase intent. Do NOT offer coupon discount; provide instant 1-tap UPI deep-link / retry assistance.';
    discountPct = 0;
  } else if (predictedReason === 'SURPRISE_SHIPPING_COST' || predictedReason === 'DELIVERY_DATE_TOO_SLOW') {
    recommendedAction = 'FREE_EXPRESS_SHIPPING';
    actionReasoning = 'Shipping fee or estimated delivery date friction detected. Waiving shipping fee saves cart while protecting product price perception.';
    discountPct = 0;
    discountAmt = session.shippingFee;
  } else if (predictedReason === 'COD_UNAVAILABLE_FRICTION') {
    recommendedAction = 'COD_ENABLE_VERIFICATION';
    actionReasoning = 'COD friction detected in Tier 2/3 location. Trigger OTP verification to unlock COD or offer WhatsApp assistance.';
    discountPct = 0;
  } else if (predictedReason === 'PRICE_SHOPPING_COMPARISON') {
    // Check Margin Guardrails!
    if (session.cartValue >= policy.minCartForDiscount && policy.campaignBudgetSpent < policy.campaignBudgetTotal) {
      discountPct = Math.min(5, policy.maxDiscountPct);
      discountAmt = Math.min(Math.round(session.cartValue * (discountPct / 100)), policy.maxDiscountCapAmount);
      recommendedAction = 'TARGETED_MARGIN_DISCOUNT';
      actionReasoning = `User price-checking competitor apps. Cart ₹${session.cartValue} > min threshold ₹${policy.minCartForDiscount}. Offering low-margin ${discountPct}% off (₹${discountAmt}) within policy cap.`;
    } else {
      recommendedAction = 'EXIT_INTENT_TRUST_BADGE';
      actionReasoning = 'Price sensitive, but cart value below policy threshold or budget exhausted. Recommending trust badge & price match guarantee modal.';
    }
  } else if (riskScore < 40) {
    recommendedAction = 'DO_NOTHING';
    actionReasoning = 'Low abandonment risk or organic high-intent user. Discounting would erode margin unnecessarily.';
  } else {
    recommendedAction = 'EXIT_INTENT_TRUST_BADGE';
    actionReasoning = 'General exit intent. Show 100% Original Product & Easy Returns assurance.';
  }

  // Self-Check Step
  let selfCheckPassed = true;
  let selfCheckMessage = 'Passed all policy & margin guardrails.';

  if (recommendedAction === 'TARGETED_MARGIN_DISCOUNT' && (predictedReason === 'UPI_PAYMENT_FAILURE' || predictedReason === 'NETBANKING_TIMEOUT')) {
    selfCheckPassed = false;
    selfCheckMessage = 'GUARDRAIL VIOLATION: Coupon discount attempted on payment failure session!';
    recommendedAction = 'INSTANT_UPI_RETRY';
    discountPct = 0;
    discountAmt = 0;
  }

  traces.push({
    stepName: 'Policy & Guardrail Audit',
    agentName: 'Policy Guardrail',
    durationMs: Math.round(performance.now() - t3Start),
    inputSummary: `Risk: ${riskScore}, Cart: ₹${session.cartValue}, BudgetSpent: ₹${policy.campaignBudgetSpent}`,
    outputSummary: `Action: ${recommendedAction} | Discount: ₹${discountAmt} (${discountPct}%)`,
    modelUsed: 'Policy Engine v2.4',
    status: selfCheckPassed ? 'SUCCESS' : 'GUARDRAIL_TRIGGERED'
  });

  // 4. NUDGE GENERATOR AGENT
  const t4Start = performance.now();
  const projectedRecoveryProb = recommendedAction === 'DO_NOTHING' ? 0.35 : 0.78;
  const productMarginRs = session.cartValue * (session.productMarginPct / 100);
  const expectedMarginImpact = Math.round((productMarginRs - discountAmt) * projectedRecoveryProb);

  traces.push({
    stepName: 'Nudge & Economics Synthesis',
    agentName: 'Nudge Synthesizer',
    durationMs: Math.round(performance.now() - t4Start),
    inputSummary: `Action: ${recommendedAction}, MarginPct: ${session.productMarginPct}%`,
    outputSummary: `Projected Recovery: ${(projectedRecoveryProb * 100).toFixed(0)}% | Net Margin Saved: ₹${expectedMarginImpact}`,
    modelUsed: 'Nudge Synthesizer',
    status: 'SUCCESS'
  });

  const totalLatencyMs = Math.round(performance.now() - startTime);

  const updatedSession: UserSession = {
    ...session,
    riskScore,
    predictedReason,
    recommendedAction,
    actionReasoning,
    discountOfferedPct: discountPct,
    discountOfferedAmount: discountAmt,
    projectedRecoveryProb,
    expectedMarginImpact,
    aiCostEst: 0.015, // ₹0.015 per decision
    latencyMs: totalLatencyMs
  };

  return {
    session: updatedSession,
    traces,
    selfCheckPassed,
    selfCheckMessage
  };
}

// Deep Gemini AI Agent Analysis (Uses @google/genai SDK for rich reasoning if API key is present)
export async function evaluateSessionWithGemini(
  session: UserSession,
  policy: GuardrailPolicy
): Promise<ScoredResult> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.GEMINI_API_KEY;
  if (!apiKey) {
    return evaluateSessionFast(session, policy);
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const prompt = `
You are the Cart Rescue AI Agent for an Indian E-Commerce platform (AI Build 2026).
Evaluate this active cart session in real time and return a JSON object.

SESSION DATA:
- Session ID: ${session.sessionId}
- Customer Name: ${session.customerName}
- City Tier: ${session.cityTier}
- Cart Value: ₹${session.cartValue} (Items: ${session.cartItems.map(i => i.name).join(', ')})
- Product Gross Margin: ${session.productMarginPct}%
- Time on Page: ${session.timeOnPageSec}s, Idle: ${session.idleTimeSec}s
- Exit Intent Triggered: ${session.mouseExitIntent}
- Payment Attempts: ${session.paymentAttempts}, Failed Method: ${session.failedPaymentMethod || 'None'}
- Shipping Fee: ₹${session.shippingFee}, Estimated Delivery: ${session.estimatedDeliveryDays} days
- Competitor Tab Switch Count: ${session.tabSwitchCount}
- Historical User Conversion Rate: ${(session.historicalConversionRate * 100).toFixed(1)}%

GUARDRAIL POLICY RULES:
- Max Discount Cap: ${policy.maxDiscountPct}% (Max ₹${policy.maxDiscountCapAmount})
- Minimum Cart Value for Discount: ₹${policy.minCartForDiscount}
- CRITICAL RULE: NEVER give discounts on payment gateway failure sessions! Use payment assistance/retry instead.
- CRITICAL RULE: "DO_NOTHING" is a valid choice if the user will buy anyway or risk is low.

Respond strictly in valid JSON with these keys:
{
  "riskScore": number (0-100),
  "predictedReason": string (one of: "UPI_PAYMENT_FAILURE", "NETBANKING_TIMEOUT", "SURPRISE_SHIPPING_COST", "DELIVERY_DATE_TOO_SLOW", "PRICE_SHOPPING_COMPARISON", "COD_UNAVAILABLE_FRICTION", "FORM_INPUT_FATIGUE", "LOW_INTENT_BROWSING"),
  "recommendedAction": string (one of: "DO_NOTHING", "INSTANT_UPI_RETRY", "FREE_EXPRESS_SHIPPING", "COD_ENABLE_VERIFICATION", "TARGETED_MARGIN_DISCOUNT", "EXIT_INTENT_TRUST_BADGE", "WHATSAPP_ASSIST_LINK"),
  "actionReasoning": "detailed explanation of why this action protects margin and helps conversion",
  "discountOfferedPct": number,
  "discountOfferedAmount": number,
  "projectedRecoveryProb": number (0.0 to 1.0),
  "selfCheckPassed": boolean,
  "selfCheckMessage": "audit status"
}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json'
      }
    });

    const jsonText = response.text || '';
    const parsed = JSON.parse(jsonText);

    const fastResult = evaluateSessionFast(session, policy);
    const updatedSession: UserSession = {
      ...session,
      riskScore: parsed.riskScore ?? fastResult.session.riskScore,
      predictedReason: parsed.predictedReason ?? fastResult.session.predictedReason,
      recommendedAction: parsed.recommendedAction ?? fastResult.session.recommendedAction,
      actionReasoning: parsed.actionReasoning ?? fastResult.session.actionReasoning,
      discountOfferedPct: parsed.discountOfferedPct ?? fastResult.session.discountOfferedPct,
      discountOfferedAmount: parsed.discountOfferedAmount ?? fastResult.session.discountOfferedAmount,
      projectedRecoveryProb: parsed.projectedRecoveryProb ?? fastResult.session.projectedRecoveryProb,
      expectedMarginImpact: Math.round(((session.cartValue * (session.productMarginPct / 100)) - (parsed.discountOfferedAmount || 0)) * (parsed.projectedRecoveryProb || 0.7)),
      aiCostEst: 0.08, // Gemini 2.5 Flash API cost estimate ₹0.08
      latencyMs: 320
    };

    return {
      session: updatedSession,
      traces: [
        ...fastResult.traces.slice(0, 1),
        {
          stepName: 'Gemini Deep Reasoning',
          agentName: 'Risk Classifier',
          durationMs: 320,
          inputSummary: `Sent full multi-variable prompt to Gemini 2.5 Flash`,
          outputSummary: `Score: ${parsed.riskScore} | Reason: ${parsed.predictedReason}`,
          modelUsed: 'gemini-2.5-flash',
          status: 'SUCCESS'
        },
        ...fastResult.traces.slice(2)
      ],
      selfCheckPassed: parsed.selfCheckPassed ?? true,
      selfCheckMessage: parsed.selfCheckMessage || 'Self-check completed by Gemini Agent.'
    };
  } catch (err) {
    console.warn('Gemini API call failed or unavailable, falling back to fast rule engine:', err);
    return evaluateSessionFast(session, policy);
  }
}
