# Genkit Integration for Zodiac App

This project has been updated to include [Firebase Genkit](https://firebase.google.com/docs/genkit) for building AI features.

## Setup

1.  **API Key**: You need a Google AI API Key (Gemini).
    *   The project is configured to use the **Gemini 2.0 Flash** model.
    *   A `.env` file has been created with your API key.
    *   Ensure `GOOGLE_GENAI_API_KEY` is set in `.env`.

2.  **Running the Server**:
    ```bash
    npm start
    ```

## API Endpoints

### `POST /api/genkit/zodiac`

Generates a fun fact about a zodiac sign using Gemini.

**Request Body:**
```json
{
  "sign": "Dragon"
}
```

**Response:**
```json
{
  "result": "Did you know that in Chinese culture, the Dragon is the only mythical creature in the zodiac? ..."
}
```

## Code Structure

*   `server.js`: Converted to ES Modules (`import` syntax). Initializes Genkit and defines the `zodiacFlow`.
*   `package.json`: Added `"type": "module"`.

## Development

To add more flows, edit `server.js` and use `ai.defineFlow`.
