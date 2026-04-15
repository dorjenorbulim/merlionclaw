# Weather Edge Data API

**Product:** Aviation METAR Arbitrage Data Feed  
**Status:** Live (April 7, 2026)  
**Price:** $5,000/month per subscriber  

---

## What We Sell

Real-time METAR (aviation weather) mismatches vs. market-implied probabilities.

**Data Points:**
- 10 major airports (global coverage)
- Updates every 5 minutes
- Mismatch detection (>15% edge threshold)
- Historical win rate tracking
- Recommended action (buy/sell/hold)

---

## Delivery Methods

| Method | Format | Latency |
|--------|--------|---------|
| **API** | JSON REST | <1 second |
| **WebSocket** | Real-time stream | Live |
| **Email** | Daily digest | 8 PM SGT |
| **Slack/Discord** | Alert bot | <1 minute |

---

## API Endpoint

```
GET https://api.weatheredge.io/v1/mismatches
Authorization: Bearer <API_KEY>

Response:
{
  "timestamp": "2026-04-07T14:00:00Z",
  "airport": "KSFO",
  "condition": "FOG",
  "market_price": 0.35,
  "fair_value": 0.58,
  "edge": "39.7%",
  "action": "BUY",
  "confidence": "HIGH"
}
```

---

## Pricing Tiers

| Tier | Price | Features |
|------|-------|----------|
| **Basic** | $5K/month | API access, 5 airports, 5-min updates |
| **Pro** | $10K/month | API + WebSocket, 10 airports, 1-min updates |
| **Enterprise** | $25K/month | Full access, custom airports, SLA |

---

## Target Customers

- Quantitative hedge funds
- Prop trading firms
- Crypto funds (weather derivatives)
- Prediction market traders
- Family office trading desks

---

## Contact

**Sales:** Michael K C Lim  
**Email:** michael@weatheredge.io  
**Telegram:** @michaelangelo_sg  

---

*Data is for informational purposes. Not financial advice.*
