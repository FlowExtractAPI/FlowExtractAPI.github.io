# 🏘️ Idealista Bulk Property Scraper

Extract high-quality real estate data from **multiple Idealista property listings** across **Spain**, **Portugal**, and **Italy** in a single run.

This actor is designed for bulk property data extraction, processing search result pages and individual property listings efficiently. Perfect for real estate analysts, investors, agencies, and developers who need to scrape dozens or hundreds of properties at once.

---

## 🔎 What This Actor Does

This bulk scraper processes **Idealista search result pages** and extracts detailed information from each property listing, including:

* 📌 Title, description, and address
* 💰 Price information
* 📏 Area, number of rooms and bathrooms
* 🖼️ Complete image galleries
* 🏢 Agency details and contact information
* 📍 GPS coordinates and maps
* 🔧 Property features (terrace, elevator, AC, etc.)
* ⚡ Energy performance ratings
* 🏗️ Building characteristics

**Key Features:**
- **Bulk Processing**: Handle multiple search URLs simultaneously
- **Unlimited Extraction**: Bypass Idealista's 1,800-property pagination limit
- **Resume Capability**: Automatically resumes from where it left off if interrupted
- **Rate Limiting**: Built-in delays to respect server resources
- **Error Handling**: Robust retry mechanisms for failed requests

---

## 🛠️ How It Works

This actor uses the **[Idealista Property Scraper API](https://apify.com/dz_omar/idealista-scraper-api)** internally to extract individual property data. While the API actor processes one property at a time, this bulk scraper:

1. **Processes search URLs** containing multiple property listings
2. **Navigates through properties** automatically using smart navigation
3. **Calls the Idealista Property Scraper API** for detailed data extraction
4. **Aggregates results** into a comprehensive dataset

> 💡 **Cost Efficiency**: Instead of manually running the single-property scraper hundreds of times, this actor automates the entire workflow.

---

## 🌐 Supported Input URLs

You can use this actor with **Idealista search result URLs** such as:

* `https://www.idealista.com/en/geo/venta-obranueva/andalucia/con-2-dormitorios,3-dormitorios,4-dormitorios/pagina-4?ordenado-por=precios-asc`
* `https://www.idealista.pt/comprar-casas/porto/`
* `https://www.idealista.it/vendita-case/roma/`

The actor will automatically detect the first property on the page and navigate through subsequent listings.

---

## ⚙️ Input Configuration

```json
{
  "Url": [
    "https://www.idealista.com/en/geo/venta-obranueva/andalucia/con-2-dormitorios,3-dormitorios,4-dormitorios/pagina-4?ordenado-por=precios-asc"
  ],
  "desiredResults": 50,
  "proxyConfig": {
    "useApifyProxy": true,
    "apifyProxyGroups": ["RESIDENTIAL"]
  }
}
```

### Input Parameters

| Parameter | Type | Description | Default |
|-----------|------|-------------|---------|
| `Url` | Array | List of Idealista search URLs to scrape | Required |
| `desiredResults` | Integer | Maximum properties to scrape | 10 |
| `proxyConfig` | Object | Proxy configuration (required) | RESIDENTIAL |

---

## 📊 Sample Output

Each property in your dataset will contain comprehensive information:

```json
{
  "propertyCode": "34406643",
  "thumbnail": "https://img4.idealista.pt/blur/480_360_mq/0/id.pro.pt.image.master/00/21/9e/292889917.webp",
  "externalReference": "VCM14500",
  "numPhotos": 37,
  "price": 890000,
  "priceInfo": {
    "price": {
      "amount": 890000,
      "currencySuffix": "€"
    }
  },
  "propertyType": "chalet",
  "operation": "sale",
  "size": 970,
  ....
  "sourceUrl": "https://www.idealista.pt/en/comprar-casas/viana-do-castelo-distrito/com-apartamentos,moradias/?ordem=precos-asc",
  "scrapedAt": "2026-02-06T10:15:19.019Z"
}
```

---

## 💰 Pricing Model - Monthly Subscription + Idealista Property Scraper API Costs

**🎯 Monthly Subscription: $4.99/month + Idealista Property Scraper API costs per property**

This actor operates with a **monthly rental subscription** plus charges for the internal **[Idealista Property Scraper API](https://apify.com/dz_omar/idealista-scraper-api)** calls.

### **Pricing Structure:**
- **Monthly Rental**: $4.99/month (auto-renewing subscription)
- **Idealista Property Scraper API Costs**: Variable pricing based on your Apify subscription tier
- **3-Day Free Trial**: Test the actor before committing to subscription

### **Cost Formula:**
```
Monthly Total = $4.99 + (Number of Properties × API Cost per Property)
```
## 🚀 Use Cases

* **🏢 Real Estate Agencies**: Bulk market analysis and competitor research
* **📈 Property Investors**: Track market trends across multiple regions
* **🔍 SEO & Content Teams**: Gather property data for content creation
* **🤖 Developers**: Build automated property monitoring systems
* **📊 Market Analysts**: Extract insights from large property datasets
* **🏗️ Construction Companies**: Identify development opportunities

---

## ⚡ Key Features

### **Unlimited Extraction Capability**
- **Breaks Through Idealista's 60-Page Limit**: While Idealista typically limits users to 60 pages (≈1,800 properties) and shows the message *"Have you seen 1,800 homes and still can't find what you're looking for?"*, this actor can extract **ALL available properties**
- **No Artificial Limits**: Extract thousands of properties from a single search URL
- **Continuous Navigation**: Uses internal property navigation to bypass page limitations
- **Only Limited by Your Subscription**: Extract properties with active subscription (API costs apply per property)

> 🚀 **Breakthrough Feature**: Most scrapers hit Idealista's 1,800-property wall, but this actor navigates property-by-property, completely bypassing pagination limits!

### **Resume Capability**
- Automatically saves progress during execution
- Resumes from the last processed property if interrupted
- Perfect for large-scale scraping operations

### **Smart Error Handling**
- Exponential backoff for failed requests
- Skips invalid properties automatically
- Comprehensive logging for debugging

### **Rate Limiting**
- Configurable delays between requests
- Respects server resources
- Reduces risk of being blocked

### **Multi-Domain Support**
- Spain: `idealista.com`
- Portugal: `idealista.pt`
- Italy: `idealista.it`

---

### **Input Validation**
- Only Idealista domains are accepted
- URLs must be properly formatted search result pages
- Invalid URLs are automatically skipped

---

## 🎯 Getting Started

1. **Start Free Trial**: Activate the 3-day free trial
2. **Consider Apify Subscription**: Upgrade to Silver/Gold for 88% API cost savings
3. **Test the Actor**: Run small extractions to verify functionality
4. **Subscribe**: Convert to monthly subscription for unlimited access
5. **Scale Up**: Extract thousands of properties with confidence

### **Subscription Management**
- **Auto-Renewal**: Monthly subscription automatically renews
- **Cancel Anytime**: Cancel subscription in Apify Console
- **Immediate Access**: Start extracting immediately after subscription

---

## 🤝 Support & Resources

## 📞 Support

### Get Help

- 🌐 **Website**: [flowextractapi.com](https://flowextractapi.com)
- 📧 **Email**: [flowextractapi@outlook.com](mailto:flowextractapi@outlook.com)
- 🙋 **Apify Profile**: [dz_omar](https://apify.com/dz_omar?fpr=smcx63)
- 💬 **GitHub Issues**: [FlowExtractAPI](https://github.com/FlowExtractAPI)

### Social Media

- 💼 **LinkedIn**: [flowextract-api](https://www.linkedin.com/in/flowextract-api/)
- 🐦 **Twitter**: [@FlowExtractAPI](https://x.com/@FlowExtractAPI)
- 📱 **Facebook**: [flowextractapi](https://www.facebook.com/flowextractapi)

## 🌟 Related Actors by FlowExtract API

### 🎬 Video & Media
- **[YouTube Transcript Extractor](https://apify.com/dz_omar/youtube-transcript-metadata-extractor?fpr=smcx63)** - Extract transcripts with timestamps
- **[YouTube Scraper Pro](https://apify.com/dz_omar/Youtube-Scraper-Pro?fpr=smcx63)** - Complete channel and playlist extraction
- **[Zoom Scraper](https://apify.com/dz_omar/zoom-scraper?fpr=smcx63)** - Download recordings and transcripts
- **[Loom Scraper](https://apify.com/dz_omar/loom-video-scraper?fpr=smcx63)** - Loom video and transcript extraction

### 🏠 Real Estate
- **[Idealista Scraper API](https://apify.com/dz_omar/idealista-scraper-api?fpr=smcx63)** - Spanish property data with API
- **[Idealista Scraper](https://apify.com/dz_omar/idealista-scraper?fpr=smcx63)** - Real estate listings extractor

### 🛠️ Developer Tools
- **[Screenshot](https://apify.com/dz_omar/screenshot?fpr=smcx63)** - Fast webpage screenshots
- **[Ultimate Screenshot](https://apify.com/dz_omar/ultimate-screenshot?fpr=smcx63)** - Advanced screenshot tool
- **[Network Security Scanner](https://apify.com/dz_omar/network-security-scanner?fpr=smcx63)** - Security vulnerability scanner

### 📱 Social Media
- **[Facebook Ads Scraper Pro](https://apify.com/dz_omar/facebook-ads-scraper-pro?fpr=smcx63)** - Extract Facebook ads data

---

### **⚖️ Legal & Compliance**
- **Public Data Access**: Only processes publicly available Facebook Ad Library data
- **Rate Limiting**: Respects Facebook's service limits and terms of use
- **Data Protection**: No storage of personal information or unauthorized data collection
- **Commercial Use**: Suitable for business intelligence and research applications

---