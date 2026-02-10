# 🏠 PropertyFinder Scraper

**Extract real estate property listings from PropertyFinder across UAE, Saudi Arabia, Bahrain, Egypt, and Qatar.**

This powerful Apify actor extracts comprehensive property data from PropertyFinder platforms, delivering structured information about real estate listings including prices, locations, agent contacts, amenities, and detailed property specifications.

---

## 🌟 Key Features

### 🌍 Multi-Country Support
- **UAE** - propertyfinder.ae
- **Saudi Arabia** - propertyfinder.sa
- **Bahrain** - propertyfinder.bh
- **Egypt** - propertyfinder.eg
- **Qatar** - propertyfinder.qa

### 📊 Comprehensive Data Extraction
- **Property Details** - Type, title, bedrooms, bathrooms, size, furnished status
- **Pricing Information** - Value, currency, period (yearly/monthly/sale)
- **Location Data** - Full location hierarchy with GPS coordinates
- **Contact Information** - Agent and broker details with email, phone, and WhatsApp
- **Visual Assets** - Property images in multiple sizes
- **Amenities** - Complete list of property features
- **Descriptions** - Full property descriptions in local languages

### ⚡ Performance & Reliability
- **Smart Pagination** - Automatically handles multi-page results
- **Rate Limiting** - Random delays between requests (1-1.5s)
- **Retry Logic** - Exponential backoff with 3 retry attempts
- **Error Recovery** - Continues scraping even if individual pages fail
- **Batch Processing** - Efficient data storage in 50-property batches
- **Domain Detection** - Automatic domain extraction for accurate URLs

### 🎯 Flexible Configuration
- **Multiple URLs** - Process multiple search URLs in one run
- **Result Limits** - Control maximum results per URL (or scrape all)
- **Proxy Support** - Optional Apify Proxy configuration for stability

---

## 🚀 Quick Start

### Basic Usage

```json
{
  "startUrls": [
    { "url": "https://www.propertyfinder.ae/en/search?c=2&fu=0&rp=y&ob=mr" }
  ],
  "maxResults": 50,
  "proxyConfiguration": {
    "useApifyProxy": true
  }
}
```

### Multi-Country Scraping

```json
{
  "startUrls": [
    { "url": "https://www.propertyfinder.ae/en/search?c=2&fu=0&rp=y&ob=mr" },
    { "url": "https://www.propertyfinder.sa/en/search?c=4&fu=0&rp=y&ob=mr" },
    { "url": "https://www.propertyfinder.bh/en/search?c=1&fu=0&ob=mr" }
  ],
  "maxResults": 100
}
```

---

## 📋 Input Configuration

### Input Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `startUrls` | array | ✅ Yes | - | PropertyFinder search URLs to scrape |
| `maxResults` | integer | ❌ No | 10 | 10 properties per URL |
| `proxyConfiguration` | object | ❌ No |  RESIDENTIAL | Apify proxy settings for stable scraping |

### Input Schema Details

#### startUrls
Array of URL objects with PropertyFinder search URLs. Each URL should be a valid PropertyFinder search page.

**Example URLs:**
```json
{
  "startUrls": [
    { "url": "https://www.propertyfinder.ae/en/search?c=2&fu=0&rp=y&ob=mr" },
    { "url": "https://www.propertyfinder.sa/en/search?c=4&fu=0&rp=y&ob=mr" }
  ]
}
```

#### maxResults
Integer value controlling how many properties to scrape per URL:
- `10`: Scrape only 10 properties per URL
- `100`: Scrape 100 properties per URL

#### proxyConfiguration
Optional proxy settings for improved reliability:

```json
{
  "proxyConfiguration": {
    "useApifyProxy": true,
    "apifyProxyGroups": ["RESIDENTIAL"]
  }
}
```

---

## 📤 Output Structure

### Property Data Format

```json
{
  "id": "15740250",
  "type": "Apartment",
  "title": "RAK WATERFRONT | FULLY FURNISHED| NEWLY RENOVATED",
  "price": {
    "value": 40000,
    "currency": "AED",
    "period": "yearly",
    "is_hidden": false
  },
  "location": {
    "id": "4781",
    "name": "Marina Apartments A",
    "full_name": "Marina Apartments A, Al Hamra Marina Residences, Al Hamra Village, Ras Al Khaimah",
    "coordinates": {
      "lat": 25.69594383239746,
      "lon": 55.78130340576172
    }
  },
  "images": [
    {
      "small": "https://www.propertyfinder.ae/property/.../small.jpg",
      "medium": "https://www.propertyfinder.ae/property/.../medium.jpg"
    }
  ],
  "agent": {
    "id": "161964",
    "name": "Daniela Giannone",
    "email": "daniela.probima@gmail.com",
    "is_super_agent": true
  },
  "broker": {
    "id": "2964",
    "name": "Probima Centre FZ-LLC",
    "email": "paula.probima@gmail.com",
    "phone": "+971566918386"
  },
  "bedrooms": "studio",
  "bathrooms": "1",
  "size": {
    "value": 550,
    "unit": "sqft"
  },
  "furnished": "YES",
  "amenities": [
    "Central A/C",
    "Balcony",
    "Shared Pool",
    "Security",
    "Covered Parking"
  ],
  "details_url": "https://www.propertyfinder.ae/en/plp/rent/apartment-for-rent-...",
  "listed_date": "2025-11-29T15:28:14Z",
  "contact_options": [
    {
      "type": "email",
      "value": "daniela.probima@gmail.com",
      "link": "mailto:daniela.probima@gmail.com",
      "is_did": false
    },
    {
      "type": "phone",
      "value": "+971569374836",
      "link": "tel:+971569374836",
      "is_did": false
    },
    {
      "type": "whatsapp",
      "value": "+97145560345",
      "link": "https://api.whatsapp.com/send?phone=...",
      "is_did": false
    }
  ],
  "description": "Stunning brand new apartment overlooking the Yacht Club...",
  "domain": "www.propertyfinder.ae"
}
```

### Output Fields Explained

#### Property Information
- `id` - Unique property identifier
- `type` - Property type (Apartment, Villa, Office Space, Penthouse, etc.)
- `title` - Property listing title
- `bedrooms` - Number of bedrooms or "studio"
- `bathrooms` - Number of bathrooms
- `size` - Property size with value and unit (sqft or sqm)
- `furnished` - Furnishing status: YES, NO, or PARTLY
- `description` - Full property description
- `listed_date` - ISO 8601 timestamp of listing

#### Pricing
- `price.value` - Price amount
- `price.currency` - Currency code (AED, SAR, BHD, EGP, QAR)
- `price.period` - Price period (yearly, monthly, or sell)
- `price.is_hidden` - Whether price is publicly displayed

#### Location
- `location.id` - Location identifier
- `location.name` - Location name
- `location.full_name` - Complete location hierarchy
- `location.coordinates.lat` - Latitude
- `location.coordinates.lon` - Longitude

#### Visual Assets
- `images` - Array of property images
- `images[].small` - Small thumbnail URL (416x272)
- `images[].medium` - Medium image URL (668x452)

#### Contact Information
- `agent` - Listing agent details (id, name, email, super agent status)
- `broker` - Broker company details (id, name, email, phone)
- `contact_options` - Array of contact methods (email, phone, WhatsApp)

#### Additional Data
- `amenities` - Array of property features and amenities
- `details_url` - Full URL to property details page
- `domain` - PropertyFinder domain (identifies country)

---

## 📊 Pre-Configured Data Views

### 1. 🏠 Overview
Quick summary of all properties with essential information.

**Fields:** ID, type, title, price, location, bedrooms, bathrooms, size, furnished status, URL, domain

**Use Case:** Initial property review and filtering

### 2. 📋 Detailed View
Complete property information including images, contacts, and amenities.

**Fields:** All property data including images, agent, broker, amenities, description

**Use Case:** In-depth property analysis and client presentations

### 3. 📞 Contact Information
Focused view of agent and broker contact details.

**Fields:** Property ID, title, agent details, broker details, contact options, URL

**Use Case:** Lead generation and contact list building

### 4. 💰 Price Analysis
Property pricing data optimized for market analysis.

**Fields:** ID, type, title, price details, location, bedrooms, size, market (domain)

**Use Case:** Market research, price comparison, investment analysis

### 5. 📍 Location Data
Geographic distribution with coordinates for mapping.

**Fields:** ID, title, type, price, location with coordinates, URL, country

**Use Case:** Geographic analysis, location-based filtering, map visualization

---

## 💡 Use Cases

### 🏢 Real Estate Professionals
- **Property Research** - Find properties matching client requirements
- **Market Analysis** - Compare prices across locations and property types
- **Lead Generation** - Extract agent and broker contact information
- **Competitive Intelligence** - Monitor competitor listings and pricing

### 📊 Data Analysis & Research
- **Market Trends** - Analyze pricing patterns across regions
- **Geographic Distribution** - Map property availability by location
- **Amenity Analysis** - Identify popular features and amenities
- **Investment Opportunities** - Find undervalued properties

### 🤖 Automation & Integration
- **CRM Integration** - Import property data into sales systems
- **Price Monitoring** - Track price changes over time
- **Alert Systems** - Notify when new properties match criteria
- **Database Building** - Create comprehensive property databases

### 📱 App Development
- **Property Aggregators** - Build multi-source property search platforms
- **Comparison Tools** - Create property comparison applications
- **Investment Calculators** - Develop ROI and rental yield calculators
- **Market Intelligence Dashboards** - Build real estate analytics platforms

---

## ⚙️ Advanced Configuration

### Using Proxies

For reliable scraping, especially at scale, use Apify Proxy:

```json
{
  "startUrls": [
    { "url": "https://www.propertyfinder.ae/en/search?c=2&fu=0" }
  ],
  "maxResults": 500,
  "proxyConfiguration": {
    "useApifyProxy": true,
    "apifyProxyGroups": ["RESIDENTIAL"]
  }
}
```

### Limiting Results

Control scraping volume per URL:

```json
{
  "startUrls": [
    { "url": "https://www.propertyfinder.ae/en/search?l=43&c=1" },
    { "url": "https://www.propertyfinder.sa/en/search?l=82&c=4" }
  ],
  "maxResults": 25
}
```

This will scrape 25 properties from each URL (50 total).

### Unlimited Scraping

To scrape all available properties:

```json
{
  "startUrls": [
    { "url": "https://www.propertyfinder.bh/en/search?c=1&fu=0" }
  ],
  "maxResults": 100000000
}
```

Or simply omit the `maxResults` parameter.

---

## 📈 Performance Metrics

### Scraping Speed
- **Single Property** - ~0.1 seconds
- **Page (25 properties)** - ~2-3 seconds (including delay)
- **100 Properties** - ~15-20 seconds
- **1000 Properties** - ~2-3 minutes

### Resource Usage
- **Memory** - 512MB maximum
- **CPU** - Low usage (HTTP-based scraping)
- **Network** - Moderate bandwidth usage

---

## ⚠️ Important Notes

### Legal Considerations

This actor extracts publicly available data from PropertyFinder. Users must:
- Comply with PropertyFinder's Terms of Service
- Respect robots.txt directives
- Follow applicable data protection laws (GDPR, etc.)
- Use data responsibly and ethically

**The actor creator is not responsible for how users utilize the extracted data.**

### Data Accuracy

- Data is extracted as-is from PropertyFinder
- Property availability may change between scraping and viewing
- Contact information is provided by listing agents/brokers
- Prices and details should be verified with agents

### Rate Limiting

- Built-in delays prevent server overload
- Proxy usage recommended for large-scale scraping
- PropertyFinder may implement rate limiting

### Updates & Maintenance

PropertyFinder may update their website structure. If the actor stops working:
1. Check for actor updates on Apify
2. Report issues via Apify issues 
3. Monitor actor changelog for fixes

---
## 📚 Additional Resources

### Sample Search URLs

**UAE (propertyfinder.ae)**
```
https://www.propertyfinder.ae/en/search?c=2&fu=0&rp=y&ob=mr
```

**Saudi Arabia (propertyfinder.sa)**
```
https://www.propertyfinder.sa/en/search?c=4&fu=0&rp=y&ob=mr
```

**Bahrain (propertyfinder.bh)**
```
https://www.propertyfinder.bh/en/search?c=1&fu=0&ob=mr
```

**Egypt (propertyfinder.eg)**
```
https://www.propertyfinder.eg/ar/search?c=3&fu=0&ob=mr
```

**Qatar (propertyfinder.qa)**
```
https://www.propertyfinder.qa/en/search?c=2&fu=0&rp=m&ob=mr
```

### URL Parameters

- `c` - Property purpose (1=buy, 2=rent, 3=commercial, 4=both)
- `fu` - Furnished (0=any, 1=yes, 2=no)
- `rp` - Rental period (y=yearly, m=monthly, w=weekly, d=daily)
- `ob` - Order by (mr=most recent, pa=price ascending, pd=price descending)
- `l` - Location ID

---

## 💬 Support & Contact

- 🌐 **Website**: [flowextractapi.com](https://flowextractapi.com)
- 📧 **Email**: [flowextractapi@outlook.com](mailto:flowextractapi@outlook.com)
- 🙋 **Apify Profile**: [dz_omar](https://apify.com/dz_omar?fpr=smcx63)
- 💬 **GitHub Issues**: [FlowExtractAPI](https://github.com/FlowExtractAPI)

### Social Media

- 💼 **LinkedIn**: [flowextract-api](https://www.linkedin.com/in/flowextract-api/)
- 🐦 **Twitter**: [@FlowExtractAPI](https://x.com/@FlowExtractAPI)
- 📱 **Facebook**: [flowextractapi](https://www.facebook.com/flowextractapi)

---

## 🌟 Related Actors by [DZ_OMAR](https://apify.com/dz_omar?fpr=smcx63)

### 🎬 Video & Media Tools

**[YouTube Transcript & Metadata Extractor](https://apify.com/dz_omar/youtube-transcript-metadata?fpr=smcx63)**
Extract complete video transcripts with timestamps and comprehensive metadata. Perfect for content analysis, SEO, and subtitle generation.

**[YouTube Full Channel, Playlists, Shorts, Live](https://apify.com/dz_omar/Youtube-Scraper-Pro?fpr=smcx63)**
Extract complete playlist information with all video details from any YouTube playlist. Fast, reliable, and built for scale.

**[Zoom Scraper | 🎥 Downloader & 📄 Transcript](https://apify.com/dz_omar/zoom-scraper?fpr=smcx63)**
Extract Zoom meeting recordings, transcripts, and metadata. Ideal for meeting analysis and documentation.

**[Loom Scraper | 🎥 Downloader & 📄 Transcript](https://apify.com/dz_omar/loom-video-scraper?fpr=smcx63)**
Download Loom videos and extract transcripts. Perfect for training content and video documentation.

### 🏠 Real Estate Data

**[Idealista Scraper API](https://apify.com/dz_omar/idealista-scraper-api?fpr=smcx63)**
Advanced Idealista property data extraction with API access. Get listings, prices, and detailed property information.

**[Idealista Scraper](https://apify.com/dz_omar/idealista-scraper?fpr=smcx63)**
Extract Spanish real estate listings from Idealista. Perfect for market analysis and property research.

**[AI Contact Intelligence Extractor](https://apify.com/dz_omar/ai-contact-intelligence?fpr=smcx63)**
Extract emails, phones, contacts & custom data using AI. Free regex extraction or paid AI-powered dynamic extraction. Natural language instructions..

### 🛠️ Developer & Security Tools

**[Screenshot](https://apify.com/dz_omar/screenshot?fpr=smcx63)**
Fast, reliable webpage screenshots with customizable options. Essential for monitoring and documentation.

**[Ultimate Screenshot](https://apify.com/dz_omar/ultimate-screenshot?fpr=smcx63)**
Advanced screenshot tool with full-page capture, custom viewports, and quality controls.

**[Network Security Scanner](https://apify.com/dz_omar/network-security-scanner?fpr=smcx63)**
Scan websites for security vulnerabilities and get comprehensive security reports.

### 📱 Social Media Tools

**[Facebook Ads Scraper Pro](https://apify.com/dz_omar/facebook-ads-scraper-pro?fpr=smcx63)**
Extract Facebook ads data for competitor analysis and market research. Track ad campaigns and strategies.

---

**Ready to extract PropertyFinder data?** [Start using PropertyFinder Scraper now!](https://apify.com/dz_omar/propertyfinder-scraper?fpr=smcx63)