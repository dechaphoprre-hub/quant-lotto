# Lottery Data API Contract

The frontend reads validated draw records from:

`GET {VITE_DATA_API_BASE_URL}/markets/{market}/draws`

`market` is one of `THAI`, `LAO`, `HANOI`, or `HANOI_VIP`.

The response must be JSON with this shape:

```json
{
  "market": "THAI",
  "fetchedAt": "2026-09-16T08:00:00.000Z",
  "source": "provider-name",
  "draws": [
    {
      "id": "th-2026-09-01",
      "market": "THAI",
      "date": "2026-09-01",
      "dayOfWeekTh": "อังคาร",
      "drawNumber": "งวด 1 ก.ย. 69",
      "topPrize": "417212",
      "twoDigitTop": "12",
      "twoDigitBottom": "04",
      "threeDigitTop": "212",
      "threeDigitFront": ["257", "346"],
      "threeDigitBack": ["136", "740"]
    }
  ]
}
```

The frontend rejects responses when:

- `market` does not match the requested market;
- `draws` is not an array;
- any record fails the market-specific schema;
- the dataset is empty;
- duplicate IDs or draw dates are present.

The backend remains responsible for source acquisition, provider credentials, deduplication across providers, provenance, freshness checks, and audit history. A static GitHub Pages build must never contain provider secrets.
