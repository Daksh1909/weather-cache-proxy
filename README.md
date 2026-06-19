#  Weather Cache Proxy

A lightweight Node.js/Express application that acts as a caching proxy (basically the express application) in front of a weather API. It looks up a city's coordinates via a geocoding endpoint, fetches the current weather for those coordinates, and serves the result to a simple HTML/CSS/JS frontend and all while keeping API keys safely on the server and protecting the upstream API (openweather) with response caching and rate limiting.

## Features

-  **Secure key handling** — API keys live in environment variables and are never exposed to the client.
-  **Two-step lookup** — resolves a city name to latitude/longitude (geocoding), then fetches weather for those coordinates.
-  **Response caching** — successful responses are cached for 2 minutes using `apicache`, reducing redundant upstream calls.
-  **Rate limiting** — `express-rate-limit` caps clients at 5 requests per 10-minute window (cache hits are excluded from the limit).
-  **CORS enabled** for cross-origin requests.
-  **Simple static frontend** to search for a city and view temperature, conditions, humidity, and wind speed.
-  **Configurable port** via CLI flag or environment variable using `commander`.

## Tech Stack

| Layer    | Technology |
|----------|------------|
| Server   | Node.js, Express 5 |
| HTTP Client | needle |
| Caching  | apicache |
| Rate Limiting | express-rate-limit |
| CLI Parsing | commander |
| Frontend | HTML, CSS, vanilla JavaScript |
| Dev Tooling | nodemon |

## Project Structure

```
weather-cache-proxy/
├── public/
│   ├── index.html      # Frontend markup
│   ├── script.js        # Frontend logic (fetches /api)
│   └── style.css        # Frontend styling
├── routes/
│   └── index.js          # Express router: geocoding + weather lookup, caching, rate limiting
├── .env                  # Environment variables (not committed)
├── .gitignore
├── package.json
├── package-lock.json
├── server.js             # App entry point
└── README.md
```

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Daksh1909/weather-cache-proxy.git
   cd weather-cache-proxy
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

## Environment Variables

Create a `.env` file in the project root with the following variables:

```env
PORT=3000

# Query parameter name your provider expects for the API key (e.g. "appid")
API_KEY_NAME=appid

# Your actual API key value
API_KEY_VALUE=your_api_key_here

# Geocoding endpoint (city name -> lat/lon)
API_BASE_URL=https://api.example.com/geo/1.0/direct

# Weather endpoint (lat/lon -> current weather)
API_BASE_URL_2=https://api.example.com/data/2.5/weather

```

## Running the App

**Development** (nodemon):
```bash
npm run dev
```

**Production:**
```bash
npm start
```

By default the server runs on the port set in `.env`/CLI, falling back to `3000`. You can also override the port directly:
```bash
node server.js --port 4000
```

Once running, open `http://localhost:<PORT>` in your browser to use the frontend.

## API Reference

### `GET /api`

Looks up weather data for a given city.

**Query Parameters**

| Param | Required | Description |
|-------|----------|--------------|
| `q`   | Yes      | City name to search for |

**Example Request**
```
GET /api?q=London
```

**Example Response**
```json
{
  "name": "London",
  "main": {
    "temp": 289.5,
    "humidity": 72
  },
  "weather": [
    { "description": "light rain" }
  ],
  "wind": {
    "speed": 4.1
  }
}
```

**Notes**
- Responses are cached for **2 minutes** per identical request.
- Requests are rate-limited to **5 requests per 10-minute window** per client; cached responses do not count against this limit.
- Returns `500` with an error payload if the city cannot be resolved or the upstream API call fails.

## How It Works

The client side script sends request to the API, thne the route first calls the geocoding API which converts the city name to their respectice latitude and longitude. Then it calls the weather API using those coordinates to get the current weather conditions. Then it is returned to the frontend.

