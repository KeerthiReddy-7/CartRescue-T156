import { DatasetPreset, UserSession } from '../types';

export const MOCK_SESSIONS_DIWALI: UserSession[] = [
  {
    sessionId: 'SESS-2026-9081',
    customerName: 'Aarav Sharma',
    customerPhone: '+91 98765 43210',
    customerEmail: 'aarav.s@gmail.com',
    cityTier: 'Tier 2',
    isFirstTimeUser: true,
    cartItems: [
      { id: 'p1', name: 'Noise ColorFit Pulse Smartwatch', category: 'Wearables', price: 1799, quantity: 1 },
      { id: 'p2', name: 'Boat Rockerz 255 Pro+ Neckband', category: 'Audio', price: 1299, quantity: 1 }
    ],
    cartValue: 3098,
    productMarginPct: 40,
    timeOnPageSec: 340,
    idleTimeSec: 45,
    mouseExitIntent: true,
    paymentAttempts: 2,
    failedPaymentMethod: 'UPI',
    shippingFee: 0,
    estimatedDeliveryDays: 3,
    tabSwitchCount: 1,
    historicalConversionRate: 0.12,
    timestamp: '10:14:22',
    status: 'ACTIVE'
  },
  {
    sessionId: 'SESS-2026-9082',
    customerName: 'Priya Sundaram',
    customerPhone: '+91 91234 56789',
    customerEmail: 'priya.sun@yahoo.co.in',
    cityTier: 'Tier 1',
    isFirstTimeUser: false,
    cartItems: [
      { id: 'p3', name: 'Anouk Kurta Set with Dupatta', category: 'Fashion', price: 2499, quantity: 1 }
    ],
    cartValue: 2499,
    productMarginPct: 55,
    timeOnPageSec: 180,
    idleTimeSec: 12,
    mouseExitIntent: false,
    paymentAttempts: 1,
    failedPaymentMethod: 'NetBanking',
    shippingFee: 149,
    estimatedDeliveryDays: 2,
    tabSwitchCount: 5,
    historicalConversionRate: 0.28,
    timestamp: '10:16:05',
    status: 'ACTIVE'
  },
  {
    sessionId: 'SESS-2026-9083',
    customerName: 'Rohan Verma',
    customerPhone: '+91 99887 76655',
    customerEmail: 'rohan.v@outlook.com',
    cityTier: 'Tier 3',
    isFirstTimeUser: true,
    cartItems: [
      { id: 'p4', name: 'Redmi Power Bank 20000mAh', category: 'Electronics', price: 1899, quantity: 1 },
      { id: 'p5', name: 'Type-C Braided Cable 2m', category: 'Accessories', price: 299, quantity: 2 }
    ],
    cartValue: 2497,
    productMarginPct: 30,
    timeOnPageSec: 520,
    idleTimeSec: 110,
    mouseExitIntent: true,
    paymentAttempts: 0,
    failedPaymentMethod: 'COD_Rejected',
    shippingFee: 99,
    estimatedDeliveryDays: 6,
    tabSwitchCount: 0,
    historicalConversionRate: 0.05,
    timestamp: '10:18:40',
    status: 'ACTIVE'
  },
  {
    sessionId: 'SESS-2026-9084',
    customerName: 'Deepika Patel',
    customerPhone: '+91 94567 89012',
    customerEmail: 'deepika.p@gmail.com',
    cityTier: 'Tier 1',
    isFirstTimeUser: false,
    cartItems: [
      { id: 'p6', name: 'Apple AirPods Pro Gen 2', category: 'Audio', price: 22900, quantity: 1 }
    ],
    cartValue: 22900,
    productMarginPct: 18,
    timeOnPageSec: 90,
    idleTimeSec: 5,
    mouseExitIntent: false,
    paymentAttempts: 0,
    failedPaymentMethod: 'None',
    shippingFee: 0,
    estimatedDeliveryDays: 1,
    tabSwitchCount: 0,
    historicalConversionRate: 0.65,
    timestamp: '10:20:11',
    status: 'ACTIVE'
  },
  {
    sessionId: 'SESS-2026-9085',
    customerName: 'Vikram Choudhury',
    customerPhone: '+91 97112 23344',
    customerEmail: 'vikram.c@rediffmail.com',
    cityTier: 'Tier 2',
    isFirstTimeUser: false,
    cartItems: [
      { id: 'p7', name: 'Puma Men Running Shoes', category: 'Footwear', price: 3299, quantity: 1 }
    ],
    cartValue: 3299,
    productMarginPct: 45,
    timeOnPageSec: 610,
    idleTimeSec: 180,
    mouseExitIntent: true,
    paymentAttempts: 0,
    failedPaymentMethod: 'None',
    shippingFee: 199,
    estimatedDeliveryDays: 5,
    tabSwitchCount: 8,
    historicalConversionRate: 0.18,
    timestamp: '10:22:50',
    status: 'ACTIVE'
  },
  {
    sessionId: 'SESS-2026-9086',
    customerName: 'Ananya Roy',
    customerPhone: '+91 98300 11223',
    customerEmail: 'ananya.roy@gmail.com',
    cityTier: 'Tier 1',
    isFirstTimeUser: true,
    cartItems: [
      { id: 'p8', name: 'Mamaearth Onion Hair Oil 250ml', category: 'Beauty', price: 399, quantity: 1 },
      { id: 'p9', name: 'Dot & Key Vitamin C Serum', category: 'Beauty', price: 549, quantity: 1 }
    ],
    cartValue: 948,
    productMarginPct: 60,
    timeOnPageSec: 290,
    idleTimeSec: 30,
    mouseExitIntent: true,
    paymentAttempts: 1,
    failedPaymentMethod: 'UPI',
    shippingFee: 70,
    estimatedDeliveryDays: 2,
    tabSwitchCount: 2,
    historicalConversionRate: 0.22,
    timestamp: '10:25:33',
    status: 'ACTIVE'
  }
];

export const DATASET_PRESETS: DatasetPreset[] = [
  {
    id: 'diwali-festive-2026',
    name: 'Big Festive Sale (1,200 Real-Time Sessions)',
    description: 'High volume, UPI server traffic congestion, price-sensitive shoppers comparing Amazon/Flipkart tabs.',
    totalSessions: 1200,
    abandonmentRate: 68.4,
    avgCartValue: 2850,
    sessions: MOCK_SESSIONS_DIWALI
  },
  {
    id: 'upi-outage-stress',
    name: 'National UPI Gateway Outage Scenario',
    description: 'Surge in failed payment attempts (NPCI timeout). High margin risk if blanket discounting is triggered instead of payment retry links.',
    totalSessions: 850,
    abandonmentRate: 81.2,
    avgCartValue: 3400,
    sessions: [
      {
        sessionId: 'SESS-OUTAGE-01',
        customerName: 'Kavita Menon',
        customerPhone: '+91 98450 99887',
        customerEmail: 'kavita.m@gmail.com',
        cityTier: 'Tier 1',
        isFirstTimeUser: false,
        cartItems: [{ id: 'p10', name: 'Philips Air Fryer XL', category: 'Home', price: 8999, quantity: 1 }],
        cartValue: 8999,
        productMarginPct: 35,
        timeOnPageSec: 420,
        idleTimeSec: 10,
        mouseExitIntent: true,
        paymentAttempts: 3,
        failedPaymentMethod: 'UPI',
        shippingFee: 0,
        estimatedDeliveryDays: 2,
        tabSwitchCount: 1,
        historicalConversionRate: 0.40,
        timestamp: '10:28:10',
        status: 'ACTIVE'
      },
      ...MOCK_SESSIONS_DIWALI.slice(0, 3)
    ]
  },
  {
    id: 'tier2-cod-heavy',
    name: 'Tier 2/3 City Fashion & Electronics Funnel',
    description: 'High COD demand, delivery duration sensitivity (>5 days), and trust/prepayment hesitancy.',
    totalSessions: 950,
    abandonmentRate: 74.0,
    avgCartValue: 1920,
    sessions: [
      {
        sessionId: 'SESS-TIER2-09',
        customerName: 'Suresh Patil',
        customerPhone: '+91 97654 32109',
        customerEmail: 'suresh.patil@gmail.com',
        cityTier: 'Tier 3',
        isFirstTimeUser: true,
        cartItems: [{ id: 'p11', name: 'Realme Buds Wireless 3', category: 'Audio', price: 1699, quantity: 1 }],
        cartValue: 1699,
        productMarginPct: 42,
        timeOnPageSec: 480,
        idleTimeSec: 90,
        mouseExitIntent: true,
        paymentAttempts: 0,
        failedPaymentMethod: 'COD_Rejected',
        shippingFee: 120,
        estimatedDeliveryDays: 7,
        tabSwitchCount: 0,
        historicalConversionRate: 0.10,
        timestamp: '10:30:15',
        status: 'ACTIVE'
      },
      ...MOCK_SESSIONS_DIWALI.slice(2, 5)
    ]
  }
];
