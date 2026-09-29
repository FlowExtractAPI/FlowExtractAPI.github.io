# Google Flights Scraper — Live Fares, Prices & Schedules

Scrape live flight prices, schedules, airlines and aircraft from **Google Flights** — one way, round trip or multi-city, any route, any currency, any market. No API key and no Google account.

You get **one row per flight option**, with the **true total price**, every segment, CO2, the exact filters Google applied, and a link that opens that flight in Google Flights. On request, each flight also gets what Google shows when you click it: **booking options** (every airline fare and travel agency, with fare names, bag fees and seller links) and, for round trips, its **return flights**. You can also get Google's **price graph** (the cheapest fare per day) and **Google Explore** (the cheapest places to go from an airport).

There are two ways to search, and you can use both in one run:

- **Option A — paste Google Flights links.** Set up a search on Google Flights, copy the link, paste it. The Actor replays it exactly, filters and all.
- **Option B — build the search in the form.** Type places by name (`Paris`, `United Kingdom`) or code (`JFK`), pick dates and travellers, and use the same filters as Google's filter bar.

---

## Quick start

**Paste a link** — the simplest and most exact way (use your own link from Google Flights' results page):

```json
{
  "searchUrls": ["https://www.google.com/travel/flights/search?tfs=…your link…"]
}
```

**Build a round trip by city name:**

```json
{
  "tripType": "round_trip",
  "origin": ["New York"],
  "destination": ["Paris"],
  "departureDate": "2027-06-10",
  "returnDate": "2027-06-17",
  "adults": 2
}
```

**Add filters** — nonstop only, SkyTeam airlines, leaving in the morning, the cheapest list sorted by price:

```json
{
  "tripType": "round_trip",
  "origin": ["JFK"],
  "destination": ["CDG"],
  "departureDate": "2027-06-10",
  "returnDate": "2027-06-17",
  "maxStops": "nonstop",
  "alliances": ["SKYTEAM"],
  "outboundDepartureTime": "6-12",
  "resultsView": "cheapest",
  "sortBy": "price"
}
```

**Booking options, return flights and the price graph** for the same search:

```json
{
  "tripType": "round_trip",
  "origin": ["JFK"],
  "destination": ["LAX"],
  "departureDate": "2027-06-10",
  "returnDate": "2027-06-17",
  "bookingOptionsTop": 3,
  "returnFlightsTop": 3,
  "priceGraphDays": 60
}
```

**Explore** — the cheapest weekend trips from New York in November:

```json
{
  "tripType": "explore",
  "origin": ["New York"],
  "exploreTripLength": "weekend",
  "exploreMonth": "november"
}
```

Every field is optional except what a search needs: a link, **or** a route (origin, destination and a departure date — plus a return date for round trips, or the flights list for multi-city; for Explore, just the origin).

---

## How it works

### Option A — links

Build the search on Google Flights, press **Search**, and copy the link from the address bar of the **results** page.

- **A link decides everything about its own search**: route, dates, travellers, cabin, every filter in it, the tab it was copied from (Best or Cheapest), its sort order, and its currency, market and language. It is sent to Google **byte for byte**, so even filters this form does not have (checked bags, for example) apply.
- The form's settings **never change a link**. They only fill in what a link does not carry — for example a link copied before choosing a tab uses the form's Best/Cheapest setting.
- **Many links, one run:** each link is a separate search, capped at `maxResults` on its own.
- **Also accepted:** a **Google Explore** link (`google.com/travel/explore?tfs=…`) gives one row per destination, and a round-trip page where you **already chose the outbound** gives that outbound's return flights, exactly as Google lists them (`segmentsForLeg` is 2 on those rows).
- **Refused links:** the Google Flights home page (no destination yet), a link whose dates are in the past, and a booking page (every flight already chosen — there is no list left to return; use booking options instead). Each is refused with the reason.

### Option B — the form

Pick the trip type first; it decides which fields are used.

| Trip type | Fill in | Times |
|---|---|---|
| `round_trip` | `origin`, `destination`, `departureDate`, `returnDate` | outbound and return time boxes |
| `one_way` | `origin`, `destination`, `departureDate` | outbound time boxes |
| `multi_city` | `multiCityFlights` — 2 to 5 flights, each with origin, destination, date | time boxes inside each flight |
| `explore` | `origin`; optionally `destination` as a region (`Europe`); flexible dates (`exploreTripLength`, `exploreMonth`) or both dates | — |

Fields that don't belong to the chosen trip type are ignored, and the run log says so.

### Links and form together

If you give both, **every link and the form run as separate searches** in the same run. Every row says which one it came from (`searchSource`: `url` or `route`; `searchLabel`: `link 2`, `route form`). One faulty link never stops the others.

### Best or Cheapest

Google shows two tabs, and they are **different lists**:

| | Best (default) | Cheapest |
|---|---|---|
| What | Google's recommended flights | Google's full cheapest list, including separate-ticket and mixed-airline combinations |
| Typical size | 50–300 flights | about 200 flights (Google stops at 300) |
| Speed | 1–2 seconds | 10–40 seconds (needs a real browser) |
| Cost | tiny | about $0.01–0.02 of platform usage per search |

---

## Input reference

In the same order as the form.

### 🔗 Links

| Key | Type | What it is |
|---|---|---|
| `searchUrls` | list of strings | Google Flights **results-page** links, or Google Explore links. Each one is its own search. Only `google.com/travel/flights…?tfs=…` and `google.com/travel/explore?tfs=…` links are accepted. |

### 🧭 Trip type, 📍 route and dates

| Key | Type | Example | Rules |
|---|---|---|---|
| `tripType` | string | `round_trip` | `round_trip`, `one_way`, `multi_city` or `explore`. |
| `origin` | list | `["New York"]` | Airport code (`JFK`), city (`Paris`) or country (`Algeria`), one per entry. **Up to 10**, all searched together. |
| `destination` | list | `["Paris", "LHR"]` | Same as `origin`. For `explore`: empty for anywhere, or a region, country or city to explore within (`Europe`). |
| `departureDate` | string | `2027-06-10` | `YYYY-MM-DD`, today or later. For `explore`: optional, together with `returnDate` for one exact trip. |
| `returnDate` | string | `2027-06-17` | Round trip (and `explore` with exact dates); on or after the departure date. |

Every row records what each name matched (`originSearched`, `destinationSearched`), so a typed name can always be checked.

### 🕐 Times — round trip and one way

Google's **Times** filter: when each flight may leave and land. Each box takes **two whole hours as a range**: `6-12` means leaving from 06:00 until 12:00 (11:59 is in, 12:00 is out). `0-24` or empty means any time. A range can't cross midnight — Google's can't either.

| Key | Used for |
|---|---|
| `outboundDepartureTime` | the first flight (one way and round trip) — when it may leave |
| `outboundArrivalTime` | the first flight — when it may land |
| `returnDepartureTime` | the flight home (round trip only) — when it may leave |
| `returnArrivalTime` | the flight home — when it may land |

### 🗺️ Multi-city flights

`multiCityFlights` is a list of **2 to 5 flights**, in the order you take them:

| Key in each flight | Example | Rules |
|---|---|---|
| `origin`, `destination` | `["London"]` | Codes, cities or countries; up to 10 each. |
| `date` | `2027-06-14` | On or after the previous flight's date. |
| `departureTime`, `arrivalTime` | `"18-24"` | Optional time windows for this flight, same format as above. |

```json
{
  "tripType": "multi_city",
  "multiCityFlights": [
    { "origin": ["London"], "destination": ["Paris"], "date": "2027-06-10", "departureTime": "6-12" },
    { "origin": ["Paris"], "destination": ["Tokyo"], "date": "2027-06-14" },
    { "origin": ["Tokyo"], "destination": ["London"], "date": "2027-06-24", "arrivalTime": "12-24" }
  ]
}
```

### 🌍 Explore — flexible dates

Google Explore's "Flexible dates" menu, used when `tripType` is `explore` and both dates are empty.

| Key | Values | Default | What it does |
|---|---|---|---|
| `exploreTripLength` | `weekend`, `one_week`, `two_weeks` | `one_week` | Trip length: a weekend is 1–4 days, a week 6–9, two weeks 13–16 (measured on Google's answers). |
| `exploreMonth` | `next_6_months`, `january` … `december` | `next_6_months` | When to travel. |

Each destination comes with the dates Google found cheapest. Explore uses Google Explore's own filters: stops, airlines, bags, price and duration.

### 👥 Travellers and cabin

| Key | Range | Notes |
|---|---|---|
| `adults` | 1–9 | At least one adult. |
| `children` | 0–8 | Aged 2–11. |
| `infantsInSeat` | 0–8 | Under 2, own seat. |
| `infantsOnLap` | 0–8 | Under 2, on an adult's lap. |
| `cabinClass` | — | `economy`, `premium_economy`, `business`, `first`. |

At most **9 travellers** in total, at least as many adults as lap infants, and at most 2 infants per adult.

### 🎛️ Filters — in the order of Google's filter bar

They apply to the form search and to **every flight of the trip**. Leave a box empty for Google's default. Links keep their own filters.

| Google's filter | Key | Format | What it does |
|---|---|---|---|
| **Stops** | `maxStops` | `any`, `nonstop`, `1-stop`, `2-stops` | Most stops allowed. |
| **Airlines** | `alliances` | list: `ONEWORLD`, `SKYTEAM`, `STAR_ALLIANCE` | Only flights sold by members of these alliances. |
| | `airlinesOnly` | list of airline names as Google lists them — `Air France`, `British Airways` — or codes (`AF`, `BA`) | Only flights sold by these airlines. Combines with `alliances`. |
| | `airlinesExclude` | airline names or codes, as above | Every airline except these. Use this **or** the two above, not both. |
| **Bags** | `carryOnBags` | whole number | Carry-on bags for the whole party; at most one per traveller with a seat. **Adds the bag fees to prices.** |
| **Price** | `maxPrice` | whole number | Highest total price, in the run's currency. |
| **Emissions** | `lessEmissionsOnly` | `true` / `false` | Only flights with CO2 below the route's typical figure. |
| **Connecting airports** | `minLayoverHours` | hours, half-hour steps: `1.5` | Shortest layover allowed (0.5–48). |
| | `maxLayoverHours` | hours, half-hour steps | Longest layover allowed (0.5–48). |
| | `connectOnlyVia` | list of 3-letter airport codes — the letters Google shows in brackets, e.g. Amsterdam (`AMS`): `DUB`, `AMS`, `IST` | Connections only through these airports. |
| | `neverConnectVia` | list of 3-letter airport codes | Connections anywhere except these. Use this **or** `connectOnlyVia`, not both. |
| **Duration** | `maxDurationHours` | whole hours, 1–72 | Longest total journey per flight, layovers included. |
| *(not in the bar)* | `excludeBasicEconomy` | `true` / `false` | Prices every flight at its cheapest fare that is **not** basic economy. Flights stay; the price moves up (New York → Los Angeles: Delta $239 → $304, Alaska $204 → $259). Google supports it in the search but doesn't show it in its filter bar. |

Nonstop flights are always kept by the layover and connecting-airport filters — they have no connection.

**Airline names:** Google's Airlines menu shows names, not codes, so type them the way it lists them. The Actor matches each one against the airlines Google lists **for your route** (`"Air France"` → `AF`, shown in `appliedFilters.airlines.matchedNames`). A name that isn't on the route, or matches several airlines (`"Air"`), is reported in `filterWarnings`. If none of the airlines you asked for is on the route, the search isn't sent: the row says no flight can match, rather than quietly searching every airline.

### 📋 Which flights to return

| Key | Values | Default |
|---|---|---|
| `resultsView` | `best`, `cheapest` | `best` |
| `sortBy` | `top_flights`, `price`, `departure_time`, `arrival_time`, `duration`, `emissions` | `top_flights` |
| `maxResults` | 1–500, per search | 200 |

Sorting is done by Google, so `sortBy: "price"` with `maxResults: 10` gives the 10 cheapest.

### 🧾 Extra details — optional

What Google Flights shows when you click a flight or open its price graph. All are off at 0, and counted per search from the top of the list.

| Key | Values | Default | What you get |
|---|---|---|---|
| `bookingOptionsTop` | 0–50 flights | 0 | Google's **booking options** for the first N flights: every airline fare tier and travel agency, with fare name, basic-economy flag, price, checked-bag fees, legroom and the seller link. |
| `returnFlightsTop` | 0–50 outbound flights | 0 | Round trips: Google's **return flights** for the first N outbounds, each priced as the whole round trip. |
| `returnFlightsPerOutbound` | 1–100 | 10 | How many return flights to keep per outbound. |
| `priceGraphDays` | 0–330 days | 0 | Google's **price graph**: the lowest fare for each departure date from your departure date on, one row per day. Round trips keep their trip length. One way and round trip. |

Measured on the platform: booking options for 3 flights in 6–23 seconds, return flights for 3 outbounds in 4 seconds, a 90-day price graph in 7 seconds, an Explore search in 8–12 seconds. Each adds well under a cent of platform usage.

How they work, and one limit to know: booking options, the price graph and Explore are requests Google answers on some connections and rejects on others. The Actor retries each one on up to 10 fresh residential IPs. If none answers, the flights are still delivered and the row says so (`bookingOptionsError`, or a `price_graph_failed` row).

### 🌍 Currency, market and language

| Key | Values | Default |
|---|---|---|
| `currency` | 143 currency codes (`USD`, `EUR`, `DZD`, `TND`…) | `USD` |
| `market` | 186 country codes — fares differ by market | `US` |
| `language` | 72 languages — airport and airline names come back in it | `en-US` |

Every value in these lists was tested against Google Flights: Google silently swaps an unknown currency for the market's own, so an unverified code could label prices wrongly.

---

## Output reference

One row per flight option (`rowType: "flight"`). The price graph adds `calendar_day` rows and Explore gives `destination` rows, in the same dataset; the Console has a view for each. A search that finds nothing, or input that can't be used, produces **one status row** instead (see below).

### Flight rows

| Field | Meaning |
|---|---|
| `price` | Total price for the whole itinerary and all travellers, in `currency`. Round trips are Google's coupled round-trip total. `null` when Google shows "price unavailable". |
| `priceAvailable` | `false` when `price` is null. |
| `currency` | Currency of `price`. |
| `tripType` | `round-trip`, `one-way` or `multi-city`. |
| `cabinClass`, `passengers` | What was searched. |
| `origin`, `destination` | First and last airport of the first flight. |
| `departureTime`, `arrivalTime` | Local times, `YYYY-MM-DDTHH:MM`. |
| `airlines`, `carrierCode` | Airlines operating the first flight. |
| `stops`, `stopsLabel` | Number of stops and a label (`Nonstop`, `1 stop`). |
| `durationMinutes`, `duration` | Whole journey of the first flight, layovers included. |
| `segments` | Every plane of the first flight: airports (code and name), times, duration, airline, flight number, aircraft. |
| `tripLegs` | Every flight of the trip, with what each typed place matched. |
| `carbonEmissionsGrams`, `typicalCarbonEmissionsGrams` | CO2 of this option and Google's typical figure for the route. |
| `priceInsights` | `priceLevel`, `currentPrice`, `typicalPrice`, `lowestSeenPrice`, `highestSeenPrice`, `priceHistory` — when Google provides them, otherwise `null`. |
| `appliedFilters` | The filters Google was asked to apply, read back from the search itself: `maxStops`, `maxPrice`, `lessEmissionsOnly`, `maxDurationHours`, `carryOnBags`, `checkedBags` (links only), `layoverHours`, `connectingAirports`, `airlines` (with `matchedNames` for airline names), `times` (one entry per flight). |
| `filterWarnings` | Messages about the filters, for example an airport or airline code that doesn't exist on this route. Empty when all is well. |
| `searchSource`, `searchLabel` | Which search the row came from (`url` / `route`; `link 1`, `route form`). |
| `resultsView`, `sortedBy`, `index` | Which Google list, its order, and the row's position in it. |
| `source_url` | The Google Flights search the row came from. |
| `googleFlightsUrl` | This flight opened in Google Flights: its **booking page** when it completes the trip (one way, or the last flight), otherwise Google's page for choosing the next flight with this one chosen — for a round trip, its return flights. |
| `segmentsForLeg` | Which flight of the trip `segments` describe: 1 normally, 2 for a pasted link whose outbound was already chosen. |
| `bookingOptions` | With `bookingOptionsTop`: list of `{seller, sellerCode, isAirline, fareName, fareCode, cabin, isBasicEconomy, price, flightNumbers, bookingSite, bookingUrl, checkedBags, legroom}`. Google's panel can mix cabins (a business search also lists the premium-economy fare), so each option says its `cabin`. `price` is `null` for sellers Google lists without one. `bookingUrl` is Google's own link (`google.com/travel/clk/f?u=…`); opening it lands on the seller's site with the fare filled in. `checkedBags` is `{first, second}`, each `{included, fee}` as Google lists it for that fare. |
| `cheapestBookingOption` | The lowest-priced entry of `bookingOptions` in the cabin you searched. |
| `bookingOptionsFor` | Round trips: the return flight the options were fetched for (Google's cheapest return for this outbound) and its round-trip price. |
| `bookingOptionsError` | Why this flight has no booking options, when it doesn't. |
| `returnFlights` | With `returnFlightsTop`: Google's return flights for this outbound — `{price, departureTime, arrivalTime, airlines, stops, durationMinutes, flightNumbers, segments, googleFlightsUrl}`. `price` is the whole round trip. |
| `returnFlightsFound`, `returnFlightsError` | How many returns Google listed; why there are none, when there are none. |

Round trips and multi-city trips are listed the way Google lists them: one row per option for the **first** flight, priced for the **whole trip**. `segments` describe the first flight; `tripLegs` lists them all.

### Price-graph rows (`rowType: "calendar_day"`)

`origin`, `destination`, `tripType`, `departureDate`, `returnDate` (round trips), `tripLengthDays`, `price` (lowest fare that day), `currency`, `isCheapest` (lowest in the graph), `appliedFilters`, and `googleFlightsUrl` — the same search on that date.

### Explore rows (`rowType: "destination"`)

`index`, `origin`, `city`, `country`, `airport` (the airport the priced trip flies to: Google prices Miami through Fort Lauderdale when that is cheaper), `latitude`, `longitude`, `departureDate`, `returnDate`, `tripLengthDays`, `price` (round trip), `airlines`, `airlineCode`, `stops`, `durationMinutes`, `hotelPricePerNight` (the hotel price Google shows on the same card), and `googleFlightsUrl` — a Google Flights search for that trip, which you can paste back into `searchUrls` to get every flight.

### Status rows

| `status` | Meaning | What to do |
|---|---|---|
| `input_error` | The input can't be searched as given — the `message` says why and the `hint` says how to fix it. Nothing was sent to Google for that search. | Fix the named field. |
| `no_results` | Google has no fares for this search. With filters on, the message names them: usually the filters removed everything. | Relax a filter, change the date or cabin. |
| `search_failed` | Google's service failed repeatedly for this search. | Run again in a few minutes. |
| `price_graph_failed` | The flights are complete, but no connection got the price graph answered. | Run again. |

A run never fails because of one bad search: other links and the form still run.

### Sample flight row (shortened)

```json
{
  "price": 1016,
  "currency": "USD",
  "priceIsTotal": true,
  "tripType": "round-trip",
  "cabinClass": "economy",
  "origin": "EWR",
  "destination": "CDG",
  "departureTime": "2027-06-10T17:00",
  "arrivalTime": "2027-06-11T06:10",
  "airlines": ["Air France"],
  "stops": 0,
  "stopsLabel": "Nonstop",
  "duration": "7h 10m",
  "segments": [
    {
      "departureAirport": "EWR",
      "arrivalAirport": "CDG",
      "airline": "Air France",
      "flightNumber": "AF71",
      "aircraft": "Airbus A350",
      "duration": "7h 10m"
    }
  ],
  "carbonEmissionsGrams": 333000,
  "typicalCarbonEmissionsGrams": 428000,
  "appliedFilters": {
    "maxStops": "1-stop",
    "airlines": { "alliances": ["SKYTEAM"], "onlyAirlines": null, "neverAirlines": null },
    "times": null
  },
  "filterWarnings": [],
  "searchSource": "route",
  "searchLabel": "route form"
}
```

### Sample booking option (one entry of `bookingOptions`)

```json
{
  "seller": "Delta",
  "sellerCode": "DL",
  "isAirline": true,
  "fareName": "Delta Main Basic",
  "fareCode": "DELTA MAIN BASIC",
  "cabin": "economy",
  "isBasicEconomy": true,
  "price": 239,
  "flightNumbers": ["DL713"],
  "bookingSite": "www.delta.com/...",
  "bookingUrl": "https://www.google.com/travel/clk/f?u=…",
  "checkedBags": { "first": { "included": false, "fee": 45 }, "second": { "included": false, "fee": 55 } },
  "legroom": ["31 in"]
}
```

---

## Google's rules worth knowing

These are how Google Flights itself behaves. The Actor follows them and tells you when they bite.

- **Airline filters work on who *sells* a flight, not who flies it.** Allowing BA also returns American Airlines flights that BA sells. Excluding an airline only removes flights no other airline sells, so excluding Virgin Atlantic may change nothing, because Delta and Air France sell the same flights.
- **The bag filter changes prices, not the list.** It adds each airline's bag fee into the price (a £27 Ryanair fare becomes £75 with a carry-on), and only where Google knows the fee.
- **Which airports and airlines make sense depends on the route.** Google's menus only offer the ones on that route. A code that isn't there is accepted silently and matches nothing, so the Actor warns in the log and in `filterWarnings`. An airline code Google doesn't know at all makes it reject the whole search; the Actor reports that as an `input_error` naming the code.
- **Duration and layover ranges depend on the route.** New York → Boston can be filtered to 2 hours; Chicago → London has nothing under 8. A limit below the shortest flight returns a `no_results` row naming the filter.
- **Lowercase codes are ignored by Google**, so the Actor upper-cases every code for you, and matches airline names regardless of case.
- **Impossible searches aren't refused by Google** — it quietly answers a different one (10 travellers are priced as one adult; a 6th multi-city flight is dropped). The Actor checks these limits first and refuses with a reason instead of returning a wrong price.
- **Searches with infants, some searches with children, and multi-city trips** are priced by Google inside a browser, so they take 15–40 seconds.
- **Prices move through the day.** Two runs minutes apart can differ; that is the market.
- **Google's Cheapest tab can price a flight a few dollars below its own booking panel.** Measured: JetBlue 1023 at $238 on the Cheapest tab, $249 on the Best tab, in the booking panel and in the price graph. Each row reports the list it came from; `bookingOptions` report the booking panel.
- **Booking options, the price graph and Explore are answered only on some connections.** The Actor retries on fresh residential IPs (measured: German IPs are answered about 3 times as often as US ones, with identical prices — the market comes from `market`, not the IP).
- **Explore prices the cheapest airport of a city.** Miami's cheapest trip may land at Fort Lauderdale; `airport` says which.

---

## What this version does not do

- **Booking options for multi-city trips** need every flight chosen: paste Google's page for the last flight, and set `bookingOptionsTop`.
- **The price graph** covers one way and round trip, not multi-city. Google's two-dimensional date grid is not included.
- **Checked bags** are not in the form, because Google's Bags filter only has carry-on. A pasted link that carries checked bags is still replayed as-is.

---

## Use cases

- **Flight price monitoring** — schedule a run daily and catch price drops on your routes
- **Travel agencies and OTAs** — live comparison fares for your own tools
- **Airfare research** — compare carriers, alliances, cabins, markets and currencies
- **Revenue management** — watch competitor pricing on the routes you operate
- **Deal sites and newsletters** — the cheapest fares on a route, including self-transfer combinations, and Explore's cheapest destinations from any airport
- **Fare comparison** — every airline fare tier and travel agency for a flight, with bag fees and the link to book
- **Data and AI** — clean, filter-labelled flight data for dashboards, models and agents

---

## FAQ

**How many flights does one search return?**
Best: roughly 50–300. Cheapest: about 200. Google stops at 300 per list; `maxResults` (default 200, up to 500) caps what is stored.

**Is the round-trip price the real total?**
Yes. Google prices a round trip as one total, and that is what each row carries. Adding an outbound fare to a return fare — a common mistake — roughly doubles the real price.

**Do I need a Google account or an API key?**
No.

**Can I search by city or country?**
Yes. `Paris`, `Algiers` or `United Kingdom` work anywhere an airport code does, up to 10 places per side.

**Can I use every Google Flights filter?**
Yes: in the form (stops, airlines and alliances, carry-on bags, price, times, emissions, layovers, connecting airports, duration), or by pasting a link that carries any filter at all.

**Can I get booking links?**
Yes. Set `bookingOptionsTop`: each of the first N flights gets Google's booking options, with a `bookingUrl` per seller that opens the airline's or agency's site with the fare filled in. Every flight row also has `googleFlightsUrl`, which opens that flight on Google Flights.

**Can I find the cheapest day to fly, or the cheapest place to go?**
Yes. `priceGraphDays` gives the lowest fare for each day; `tripType: "explore"` gives Google Explore's cheapest destinations from your airport.

**How do I know a filter was applied?**
Every row has `appliedFilters`, read back from the search that produced it, and `filterWarnings` if something about a filter didn't fit the route.

**How fast is it?**
About 1–2 seconds per plain search; 10–40 seconds for the Cheapest list and for searches Google prices in a browser. Extra details add a few seconds each (see the Extra details section).

**Is scraping Google Flights legal?**
This Actor collects publicly available flight information and stores no personal data. You are responsible for how you use the data.

---

## Support

🌐 Website [flowextractapi.com](https://flowextractapi.com) · 📧 flowextractapi@outlook.com · 💬 GitHub [FlowExtractAPI](https://github.com/FlowExtractAPI) · 💼 LinkedIn [flowextract-api](https://www.linkedin.com/in/flowextract-api/) · 🐦 X [@FlowExtractAPI](https://x.com/FlowExtractAPI) · 📱 Facebook [flowextractapi](https://www.facebook.com/flowextractapi) · 🎵 TikTok [@flowextractapi](https://www.tiktok.com/@flowextractapi)

## Legal & compliance

Collects **publicly available data only** · respects the source's rate limits and terms · **stores no personal information** · suitable for commercial use. No affiliation with or endorsement by Google Flights is implied.

*Google Flights Scraper — by FlowExtract API. Turn any website into structured data.*
