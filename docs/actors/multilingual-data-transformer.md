# 🌍 Multilingual Data Transformer

**Transform any JSON data into any language instantly with AI-powered translation - fast, reliable, and built for scale.**

This powerful Apify actor provides professional-grade translation of structured data. Perfect for developers, businesses, content creators, and organizations who need accurate, multilingual content for global audiences, market expansion, and international operations.

![Multilingual Transformer](https://raw.githubusercontent.com/your-repo/multilingual-transformer.jpg)

---

## ✨ Key Features

### 🎯 Complete Data Translation
- **Full JSON Support** - Translate any JSON structure while preserving data organization
- **Recursive Translation** - Automatically handles nested objects and arrays
- **Text-Only Processing** - Intelligently extracts and translates only text values
- **Multiple Languages** - Support for 20+ languages with automatic provider fallback
- **Format Preservation** - Original structure and data types remain intact

### ⚡ Performance & Reliability
- **Lightning Fast** - Optimized processing for instant results
- **Dual-Provider Fallback** - Seamless switching between Lingo.dev and Anthropic APIs
- **Batch Processing** - Handle multiple translation requests simultaneously
- **Smart Caching** - Avoid re-processing identical content
- **API & Batch Modes** - Choose standby mode for real-time API access or batch processing

### 🛠️ Developer-Friendly
- **Clean JSON Output** - Ready for any data pipeline or application
- **Multiple Tiers** - FREE, BRONZE, SILVER, and GOLD pricing for different needs
- **Real-time API** - Standby mode provides instant translation via HTTP endpoints
- **Comprehensive Logging** - Debug information available for troubleshooting
- **Well-Documented** - Clear examples and API documentation included

---

## 📖 How It Works

1. **Input JSON Data** - Provide one or more JSON objects or arrays
2. **Select Language** - Choose target language from 20+ supported options
3. **Configure Tier** - Select your pricing tier (FREE, BRONZE, SILVER, GOLD)
4. **Run Translation** - Fast, automated translation begins
5. **Get Results** - Receive translated JSON with identical structure

### Processing Flow

```
Input JSON Data
    ↓
Text Extraction (words only)
    ↓
Provider Selection (Lingo.dev or Anthropic)
    ↓
Translation Processing
    ↓
Word Count Calculation
    ↓
PPE Billing & Charging
    ↓
Output Translated JSON
```

---

## 📥 Input Configuration

### Simple Example

```json
{
  "data": [
    {
      "title": "Hello World",
      "description": "This is a test"
    }
  ],
  "targetLanguage": "es"
}
```

### Advanced Example

```json
{
  "data": [
    {
      "title": "Hello World",
      "description": "This is a test",
      "content": {
        "main": "Welcome to our service",
        "subtitle": "Professional translation made easy"
      }
    },
    {
      "title": "Good Morning",
      "description": "Have a nice day"
    }
  ],
  "targetLanguage": "fr"
}
```

### Input Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `data` | `array or object` | Required | Your JSON data to translate (single object or array of objects) |
| `targetLanguage` | `string` | Required | ISO language code for translation target |
| `userTier` | `string` | `FREE` | Pricing tier: `FREE`, `BRONZE`, `SILVER`, or `GOLD` |

### Supported Languages

| Code | Language | Code | Language |
|------|----------|------|----------|
| `es` | Spanish | `tr` | Turkish |
| `fr` | French | `hi` | Hindi |
| `de` | German | `th` | Thai |
| `it` | Italian | `vi` | Vietnamese |
| `pt` | Portuguese | `nl` | Dutch |
| `pl` | Polish | `sv` | Swedish |
| `ru` | Russian | `da` | Danish |
| `ar` | Arabic | `fi` | Finnish |
| `zh` | Chinese (Simplified) | `el` | Greek |
| `ja` | Japanese | - | - |
| `ko` | Korean | - | - |

---

## 📤 Output Structure

Each translation produces a comprehensive JSON result:

```json
[{
  "original": {
    "title": "Hello World",
    "description": "This is a test"
  },
  "translated": {
    "title": "Bonjour le monde",
    "description": "Ceci est un test"
  },
  "language": "fr"
},
{
  "original": {
    " YouTube Transcript": "Hey, it’s Theo. Today, I’ll show you how to scrape Instagram ..."
  },
  "translated": {
    " YouTube Transcript": "Salut, c'est Theo. Aujourd'hui, je vais vous montrer comment scraper Instagram ..."
  },
  "language": "fr"
}]
```

### Output Fields Explained

#### Translation Results
- `original` - Your original JSON data structure
- `translated` - Translated JSON with identical structure
- `language` - Target language code used

## 💰 Pricing Model

### Pay-Per-Word Pricing

Charges are based on exact word counts with no minimum charge. You pay only for what you translate.

### Tier Pricing

| Tier | Input Price | Output Price | Description |
|------|-------------|--------------|-------------|
| FREE | $0.00035/word | $0.00035/word | Standard rate |
| BRONZE | $0.00020/word | $0.00020/word | 43% discount |
| SILVER | $0.00015/word | $0.00015/word | 57% discount |
| GOLD | $0.00010/word | $0.00010/word | 71% discount |

### Example Costs

#### Small Translation (FREE tier)
```
Input: 8 words × $0.00035 = $0.0028
Output: 7 words × $0.00035 = $0.0025
Total: $0.0053
```

#### Medium Translation (BRONZE tier)
```
Input: 250 words × $0.00020 = $0.0500
Output: 280 words × $0.00020 = $0.0560
Total: $0.1060
```

#### Large Translation (GOLD tier)
```
Input: 5,000 words × $0.00010 = $0.5000
Output: 5,500 words × $0.00010 = $0.5500
Total: $1.0000
```

### Word Counting

- Words are counted from text values only (not JSON structure)
- Spaces and punctuation are handled intelligently
- Minimum charge: **None** - Pay only for actual words translated
- Overage: No additional fees, just standard per-word rate

---

## 🚀 Two Operation Modes

### Batch Mode
- Submit multiple translations in one request
- Ideal for bulk content processing
- Results saved to Apify dataset
- Flexible scheduling and monitoring

**Use when:**
- Processing large volumes of content
- Batch workflows or scheduled tasks
- Data pipeline integration
- Cost optimization for bulk operations

### Standby Mode (Real-time API)
- Always-running HTTP API endpoint
- Instant translation responses
- No startup delays
- Perfect for real-time applications

**Use when:**
- Building real-time translation features
- Integrating into web applications
- Creating translation APIs for end users
- Need instant responses (<2 seconds)

**API Endpoint:**
```
POST /?token=YOUR_APIFY_TOKEN
Host: https://your-actor-url.apify.actor
```

---

## 📚 Professional Use Cases

### Content Localization
- **Global Expansion** - Prepare content for international markets
- **Product Launches** - Translate product information for multiple regions
- **Marketing Materials** - Convert marketing copy for different languages
- **Documentation** - Translate technical docs, guides, and manuals

### Data Processing & Integration
- **API Integration** - Translate API responses before serving to users
- **Database Updates** - Bulk translate content in databases
- **Multi-language Support** - Power multi-language applications
- **Data Migration** - Localize data during system migrations

### Business & Operations
- **Customer Support** - Translate support tickets and responses
- **Email Campaigns** - Localize email content for subscribers
- **Mobile Apps** - Translate app content and strings
- **Web Applications** - Provide multi-language user experiences

### Content Creation
- **Blog Posts** - Translate articles for international audiences
- **Social Media** - Adapt content for different language communities
- **E-learning** - Translate course materials and educational content
- **News & Publishing** - Quick translation of breaking content

---

## ⚙️ Technical Advantages

### Built for Performance
- **Optimized Translation** - Uses professional translation APIs (Lingo.dev & Anthropic)
- **Automatic Fallback** - Seamlessly switches providers if one fails
- **Concurrent Processing** - Handle multiple translations simultaneously
- **Efficient Data Handling** - Preserves original JSON structure perfectly

### Reliable & Robust
- **Error Handling** - Graceful handling of translation failures
- **Retry Logic** - Automatic retry on temporary failures
- **Provider Redundancy** - Dual API support ensures reliability
- **Detailed Logging** - Debug information for troubleshooting

### Universal Compatibility
- **Any JSON Structure** - Works with any valid JSON format
- **Nested Objects** - Handles arrays and deeply nested structures
- **All Languages** - 20+ language support with consistent quality
- **Platform Integration** - Seamless Apify ecosystem integration

---

## 📊 Performance Metrics

- **Speed:** 1-5 seconds per translation in standby mode; scalable in batch mode
- **Accuracy:** Professional-grade translation with provider redundancy
- **Reliability:** 99.5%+ successful translation rate with fallback support
- **Scalability:** Handle from single items to thousands of translations
- **Cost:** Lowest per-word pricing starting at $0.00010/word with GOLD tier

---

## 🔄 Data Processing Features

### Intelligent Text Extraction
- Automatically identifies text values in JSON
- Skips non-text data types (numbers, booleans, dates)
- Preserves original data types in output
- Handles null and undefined values gracefully

### Structure Preservation
- Input and output JSON structures are identical
- Array and object relationships maintained
- Nested hierarchies fully supported
- Data integrity guaranteed

### Cleaning & Formatting
- Consistent text handling
- Proper spacing and punctuation
- Language-specific formatting preserved
- HTML/special characters handled correctly

---

## 🛡️ Legal & Compliance

This actor provides translation of your own data using professional translation APIs.

**Important:** Please ensure your use complies with:
- Your data ownership and rights
- Applicable copyright laws
- Data protection regulations (GDPR, CCPA, etc.)
- Your specific jurisdiction's laws
- Terms of service of underlying translation providers

---

## Why Choose This Translator?

✅ **Accurate Translation** - Professional-grade quality with provider redundancy
✅ **Flexible Pricing** - Pay only for what you use, no hidden minimums
✅ **Easy Integration** - Clean JSON in/out, REST API available
✅ **Global Support** - 20+ languages ready to use
✅ **Reliable** - 99.5%+ uptime with automatic fallback
✅ **Well-Maintained** - Regular updates and responsive support
✅ **Apify Platform** - Leverage enterprise infrastructure

---

## 🚀 Getting Started

### Step 1: Prepare Your Data
```json
{
  "data": [{"text": "Hello World"}],
  "targetLanguage": "es"
}
```

### Step 2: Run the Actor
- Visit Apify Console
- Find this actor
- Click "Run" and configure input
- Select your pricing tier

### Step 3: Get Results
- Wait for completion (seconds to minutes)
- Download JSON dataset
- Integrate translated data into your system

**No complex setup, no hidden fees, just reliable translation.**

---

## 💬 Support & Contact

Need help or have questions? We're here for you:

### Contact Information
- 🌐 **Website:** [flowextractapi.com](https://flowextractapi.com)
- 📧 **Email:** [flowextractapi@outlook.com](mailto:flowextractapi@outlook.com)
- 👤 **Apify Profile:** [FlowExtract API](https://apify.com/dz_omar?fpr=smcx63)
- 🐙 **GitHub:** [FlowExtractAPI](https://github.com/FlowExtractAPI)
- 💼 **LinkedIn:** [flowextract-api](https://www.linkedin.com/in/flowextract-api/)
- 𝕏 **Twitter:** [@FlowExtractAPI](https://x.com/@FlowExtractAPI)
- 👍 **Facebook:** [flowextractapi](https://www.facebook.com/flowextractapi)

---

## 🌟 Related Actors by [FlowExtract API](https://apify.com/dz_omar?fpr=smcx63)

### 🎬 Video & Media Tools

**[📹 YouTube Transcript Extractor](https://apify.com/dz_omar/youtube-transcript-extractor?fpr=smcx63)**
Extract complete transcripts with timestamps and comprehensive video metadata. Perfect for content analysis, SEO, and subtitle generation.

**[🎯 YouTube Full Channel Extractor](https://apify.com/dz_omar/Youtube-Scraper-Pro?fpr=smcx63)**
Extract playlists, videos, shorts, and live streams. Get complete channel data with video lists, durations, and thumbnails.

**[🎥 Zoom Scraper](https://apify.com/dz_omar/zoom-scraper?fpr=smcx63)**
Extract Zoom meeting recordings, transcripts, and metadata. Ideal for meeting analysis and documentation.

**[📺 Loom Video Scraper](https://apify.com/dz_omar/loom-video-scraper?fpr=smcx63)**
Download Loom videos and extract transcripts. Perfect for training content and video documentation.

### 🏠 Real Estate Data

**[🏡 Idealista Scraper API](https://apify.com/dz_omar/idealista-scraper-api?fpr=smcx63)**
Advanced property data extraction with API access. Get listings, prices, and detailed property information.

**[🔑 Idealista Scraper](https://apify.com/dz_omar/idealista-scraper?fpr=smcx63)**
Extract Spanish real estate listings. Perfect for market analysis and property research.

### 🛠️ Developer & Security Tools

**[📸 Screenshot](https://apify.com/dz_omar/screenshot?fpr=smcx63)**
Fast, reliable webpage screenshots with customizable options. Essential for monitoring and documentation.

**[🔒 Network Security Scanner](https://apify.com/dz_omar/network-security-scanner?fpr=smcx63)**
Scan websites for security vulnerabilities and get comprehensive security reports.

### 📱 Social Media Tools

**[📢 Facebook Ads Scraper Pro](https://apify.com/dz_omar/facebook-ads-scraper-pro?fpr=smcx63)**
Extract Facebook ads data for competitor analysis and market research. Track campaigns and strategies.

---

**Ready to translate your data?** [Start using Multilingual Data Transformer now!](https://apify.com/dz_omar/multilingual-data-transformer?fpr=smcx63)
