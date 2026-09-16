# Ad Campaign Contract

Campaigns are stored in `public.ad_campaigns` and must be served by the backend. The browser must never receive ad-provider secrets.

Required fields:

```json
{
  "id": "campaign-id",
  "name": "Campaign name",
  "marketCode": "THAI",
  "slot": "TOP_BANNER",
  "label": "SPONSORED",
  "imageUrl": "https://cdn.example.com/banner.webp",
  "targetUrl": "https://advertiser.example.com/landing",
  "startsAt": "2026-09-16T00:00:00Z",
  "endsAt": "2026-10-16T00:00:00Z"
}
```

The frontend should only render campaigns that are active, within the time window, and explicitly labeled `SPONSORED` or `HOUSE_AD`. Track impressions and clicks server-side or through a privacy-reviewed analytics provider.
