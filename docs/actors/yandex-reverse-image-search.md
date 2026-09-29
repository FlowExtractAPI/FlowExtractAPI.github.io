# Yandex Reverse Image Search

Search the web **by picture instead of by keywords**. Give it an image  paste a link or
upload a file  and get back every page where that image appears online, visually similar
pictures, other resolutions of the same image, any text written inside it, and descriptive
tags.

Yandex is widely regarded as one of the strongest reverse-image engines available,
especially for faces, places, artwork, and content that Western engines miss.

---

## Why this one

| | |
|---|---|
| 📁 **Upload a picture, not just a link** | Most reverse-image tools require a publicly reachable URL. This one takes a file straight from your computer  screenshots, private photos, anything not already published online. |
| 🌍 **Several regional indexes at once** | The Turkish index is largely separate from the international one. Searching both returns roughly **75% more unique matches**, merged into one clean result set. |
| 🧹 **No duplicate spam** | The same picture usually sits on many pages. You get one row per image listing every page carrying it  about **40% fewer rows, nothing lost**. |
| 🔤 **Reads text inside the picture** | Optional. Returns the text and where each word sits. |
| ⚖️ **A fair results limit** | Your limit is shared across the result types you picked, so a small cap still returns a mix of everything instead of filling up with page matches. |

---

## Input

Paste an image link and press **Start**. Everything else has a working default.

```json
{
  "imageUrl": "https://example.com/photo.jpg"
}
```

A fuller run:

```json
{
  "imageUrl": "https://example.com/photo.jpg",
  "searchRegions": ["yandex.com", "yandex.com.tr"],
  "resultTypes": ["matchingPages", "similarImages", "ocrText"],
  "maxResults": 50,
  "deduplicate": true
}
```

| Field | Type | Default | What it does |
|---|---|---|---|
| `imageUrl` | string |  | Link to the picture. Right-click any image in your browser → *Copy image address*. |
| `imageFile` | file |  | Upload a picture instead. JPG, PNG, WebP, GIF, BMP, up to 10 MB. If you fill both, the upload wins. |
| `crop` | string | — | Search only part of the picture: `left;top;right;bottom` as fractions, e.g. `0.25;0.25;0.75;0.75` for the middle. Leave empty for the whole image. |
| `searchRegions` | array | `["yandex.com"]` | Which regional indexes to search. Adding **Turkey** gives the biggest gain. *All regions* searches every one. |
| `resultTypes` | array | pages + similar | Which kinds of results to return. |
| `maxResults` | integer | `50` | Largest number of rows to take **from each region**. With 3 regions and a limit of 11 you get up to 33, before duplicate removal. `0` returns everything found. Within each region's share, rows are split fairly across the selected result types. |
| `deduplicate` | boolean | `true` | Collapse repeats of the same image into one row listing every page carrying it. |

To search a picture from your own computer, use **Or upload an image file** and leave the
link empty.

---

## Output

One row per result, tagged with `resultType` so you can filter.

| `resultType` | What it is | On by default |
|---|---|:---:|
| `matching_page` | A page where this image appears  title, snippet, site, full-size image link | ✅ |
| `similar_image` | A visually similar picture from elsewhere on the web | ✅ |
| `image_size` | The same image at another resolution, grouped small / medium / large | |
| `image_tag` | A short phrase describing what is in the picture | |
| `ocr_text` | Text read out of the image, with per-word positions | |
| `classification` | What kind of picture the engine judges this to be | |
| `barcode` | Barcode or QR content, when the picture contains one | |
| `detected_object` | A region the engine spotted in the picture, with its category and a ready-to-use crop string | |

### Example row

```json
{
  "resultType": "matching_page",
  "position": 1,
  "title": "Product page  Example Store",
  "snippet": "Available in three colours.",
  "link": "https://example-store.com/product/123",
  "source": "example-store.com",
  "thumbnail": "https://…/thumb.jpg",
  "original": "https://example-store.com/img/product-full.jpg",
  "originalWidth": 850,
  "originalHeight": 565,
  "searchRegions": ["yandex.com", "yandex.com.tr"],
  "pages": ["https://example-store.com/product/123", "https://blog.example.com/review"],
  "duplicateCount": 2,
  "scrapedAt": "2026-09-01T20:14:03Z"
}
```

`pages` and `duplicateCount` are what make duplicate removal additive: you see *more* per
row, not less.

### Views

Four ready-made dataset views: **All results**, **Pages containing this image**,
**Visually similar images**, and **Text found in the image**  the last two omit columns
those result types never fill.

---

## What people use it for

- **Find where your images are used**  track unauthorised use of product photos, artwork, or brand assets.
- **Brand protection**  surface sites and marketplaces using your imagery.
- **Image provenance and fact-checking**  trace earlier and higher-resolution versions of a picture.
- **Find the original** uncompressed version of a cropped or low-quality image.
- **Build datasets** of visually similar images.
- **Read text out of screenshots** in bulk.

---

## Pricing

**This Actor is currently free to run.** You pay only Apify's normal platform usage for the
run itself  there is no per-result charge.

<!-- MONETIZATION SWITCH: when billing is turned on, replace the paragraph above with the
     tier table below. Prices come from .actor/pay_per_event.json - keep them identical.

| Your Apify plan | Price per result | Per 1,000 results |
|---|---|---|
| Free            | $0.0150 | $15.00 |
| Bronze          | $0.0050 |  $5.00 |
| Silver          | $0.0045 |  $4.50 |
| Gold and above  | $0.0040 |  $4.00 |

You are charged once per result row delivered. Duplicate copies of the same picture are
merged into a single row before billing, so you are never charged twice for the same image,
and a run that returns nothing costs nothing.
-->

## Known issues

Being worked on. None of these stop the Actor returning results.

| Issue | Effect on you |
|---|---|
| **No shopping matches** | Matching a picture to purchasable products is not offered. The upstream section exists but has never returned data to us across ~50 attempts, so the option is deliberately absent rather than present-but-empty. |

## Limitations

- Set **Maximum results** to `0` to fetch everything: one image can return **3,000+ matches**
  from a single region. The default of 50 costs one request; larger limits fetch more pages,
  so a very large run takes proportionally longer.
- **Shopping matches, barcodes, and detected objects are empty for most pictures.** They are
  off by default for that reason  turn them on only if your images are likely to contain
  products or codes.
- Russia, Belarus, Kazakhstan, and Uzbekistan overlap almost entirely with the international
  index and add only a handful of extra results. **Turkey is the one that genuinely differs.**
- Very small images (under 1 KB  spacers and tracking pixels) cannot be searched.
- Maximum image size is 10 MB.
- Selecting more regions makes a run take longer. All six still finish in well under a minute.
- Results reflect what the engine has indexed; a brand-new image may not be found anywhere yet.
- If you supply something unusable, the run still finishes successfully and returns a single
  row explaining what to fix  it does not fail.

---

## Support

🌐 Website [flowextractapi.com](https://flowextractapi.com) · 📧 flowextractapi@outlook.com · 💬 GitHub [FlowExtractAPI](https://github.com/FlowExtractAPI) · 💼 LinkedIn [flowextract-api](https://www.linkedin.com/in/flowextract-api/) · 🐦 X [@FlowExtractAPI](https://x.com/FlowExtractAPI) · 📱 Facebook [flowextractapi](https://www.facebook.com/flowextractapi) · 🎵 TikTok [@flowextractapi](https://www.tiktok.com/@flowextractapi)

## Legal & compliance

Public data only · respects source rate limits and terms · no storage of personal
information · suitable for commercial use · No affiliation with or endorsement by Yandex is
implied.

*Yandex Reverse Image Search  by FlowExtract API. Turn any website into structured data.*
