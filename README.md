# Kiyan

## Project Overview

Kiyan is a weather intelligence platform designed to leverage WeatherXM's global network of weather stations, providing users with advanced weather insights and AI-powered analysis. Kiyan showcases the power of real-world weather data combined with AI technology to create engaging and useful weather exploration experiences.

The platform provides:

**Weather Intelligence Platform**: A comprehensive dashboard for exploring WeatherXM stations worldwide, saving favorites, and interacting with an AI assistant for real-time weather insights and historical data analysis.
## Key Features & Functionalities

### Weather Intelligence Platform (Frontend: [src/AuthenticatedApp.tsx](src/AuthenticatedApp.tsx) -> `/weather-intelligence/*`)

*   **Global Station Explorer**: Browse and search through thousands of WeatherXM stations globally. ([src/pages/StationsListPage.tsx](src/pages/StationsListPage.tsx))
*   **Personalized Station Management**: Users can save their favorite WeatherXM stations for quick access and personalized data. ([src/pages/MyStationsPage.tsx](src/pages/MyStationsPage.tsx))
*   **Real-time & Historical Data**: View the latest observations and historical weather data (temperature, humidity, wind, pressure, etc.) for any station. ([src/pages/StationDetailPage.tsx](src/pages/StationDetailPage.tsx))
*   **AI Weather Assistant**: Chat with an AI-powered assistant to get natural language insights, summaries, and forecasts based on live and historical WeatherXM data. ([src/components/weather/ChatInterface.tsx](src/components/weather/ChatInterface.tsx), [src/hooks/useWeatherChat.ts](src/hooks/useWeatherChat.ts))
*   **Data Synchronization**: Manually sync latest and historical data for individual stations or all saved stations. ([src/components/weather/MyStationsHeader.tsx](src/components/weather/MyStationsHeader.tsx), [src/components/weather/MyStationsList.tsx](src/components/weather/MyStationsList.tsx), [src/components/weather/StationDetailHeader.tsx](src/components/weather/StationDetailHeader.tsx))

### Core Platform Features

*   **Web3 Wallet Authentication**: Seamless login and interaction using popular EVM wallets via Tomo EVM Kit and Wagmi for enhanced user experience. ([src/WalletAuthProvider.tsx](src/WalletAuthProvider.tsx), [src/WalletConnection.tsx](src/WalletConnection.tsx), [src/TomoProvider.tsx](src/TomoProvider.tsx))
*   **Guest Mode**: Allows users to explore the Weather Intelligence Platform with sample data without connecting a wallet. ([src/WalletSignInForm.tsx](src/WalletSignInForm.tsx))
*   **Neobrutalism UI**: A distinct and engaging user interface with clean, bold design elements. ([src/index.css](src/index.css))

## WeatherXM Integration

Kiyan integrates with WeatherXM services to provide accurate and real-time weather data:

### 1. WeatherXM Pro API (Data Source)

The application directly consumes the WeatherXM Pro API to fetch comprehensive weather station data. This includes:

*   **Station Discovery**: Fetching lists of available weather stations, including their location, status, and quality of data.
    *   [convex/weatherxm/stationsApi.ts](convex/weatherxm/stationsApi.ts) (`fetchStations`)
    *   [src/hooks/useWeatherStations.ts](src/hooks/useWeatherStations.ts) (`loadStations`)
    *   [src/pages/StationsListPage.tsx](src/pages/StationsListPage.tsx)
*   **Station Details & Observations**: Retrieving detailed information and the latest observations (temperature, humidity, wind, pressure, etc.) for specific stations.
    *   [convex/weatherxm/stationDetails.ts](convex/weatherxm/stationDetails.ts) (`fetchStationDetails`)
    *   [convex/weatherxm/stationDataApi.ts](convex/weatherxm/stationDataApi.ts) (`fetchAndStoreLatestData`, `fetchAndStoreHistoryData`, `getLatestData`, `getHistoryData`)
    *   [src/pages/StationDetailPage.tsx](src/pages/StationDetailPage.tsx)
*   **Region Statistics**: Obtaining aggregated data on available regions and station counts.
    *   [convex/weatherxm/regionStats.ts](convex/weatherxm/regionStats.ts) (`getAvailableRegions`)
    *   [src/pages/StationsListPage.tsx](src/pages/StationsListPage.tsx)
*   **User Station Management**: Saving and retrieving user-specific stations, along with their associated WeatherXM data.
    *   [convex/weatherxm/userStations.ts](convex/weatherxm/userStations.ts) (`addStationToMyStations`, `removeStationFromMyStations`)
    *   [convex/weatherxm/userQueries.ts](convex/weatherxm/userQueries.ts) (`getMySavedStations`, `isStationSaved`)
    *   [src/pages/MyStationsPage.tsx](src/pages/MyStationsPage.tsx)
*   **Data Synchronization**: Implementing server-side actions to periodically fetch and store WeatherXM data in the Convex database, ensuring data freshness for AI analysis and display.
    *   [convex/weatherxm/stationSyncApi.ts](convex/weatherxm/stationSyncApi.ts) (`syncStationData`, `syncAllUserStations`)
    *   [src/pages/MyStationsPage.tsx](src/pages/MyStationsPage.tsx)
    *   [src/pages/StationDetailPage.tsx](src/pages/StationDetailPage.tsx)

### 2. AI Integration (OpenAI)

The AI Weather Assistant leverages OpenAI's GPT models, providing context-aware responses based on WeatherXM data. The Convex backend acts as an intermediary, feeding real-time WeatherXM station details and observations to the OpenAI API.

*   [convex/aiChat.ts](convex/aiChat.ts) (`chatWithStationAI` action fetches WeatherXM data and sends to OpenAI service)
*   [convex/openaiService.ts](convex/openaiService.ts) (handles OpenAI API calls, constructs system prompts with WeatherXM data)
*   [src/hooks/useWeatherChat.ts](src/hooks/useWeatherChat.ts) (frontend hook for AI chat)

## Project Architecture

Kiyan employs a modern full-stack architecture:

*   **Frontend**: Built with React and Vite, providing a responsive and interactive user interface. It uses Wagmi for direct smart contract interactions and Tomo EVM Kit for enhanced wallet connection.
*   **Backend (Convex)**: A real-time, serverless backend that handles:
    *   Database operations (users, sessions, weather data, chat history).
    *   API integrations (WeatherXM Pro API, OpenAI API).
    *   Business logic for weather data management and AI interactions.
*   **Web3 Libraries**:
    *   **Wagmi**: React Hooks for Ethereum, simplifying smart contract interactions (reading, writing, events).
    *   **Tomo EVM Kit**: Provides a unified solution for Web3 authentication, integrating social login options and supporting major EVM wallets, enhancing user onboarding.


## How to Run

1.  **Install dependencies:**
    ```bash
    npm install
    ```

2.  **Set up environment variables:**
    ```bash
    cp .env.local.example .env.local
    ```
    Then edit `.env.local` and add your API keys:
    *   `WEATHERXM_API_KEY`: Get from https://developers.weatherxm.com/
    *   `OPENAI_API_KEY`: Get from https://platform.openai.com/api-keys

3.  **Run the development server:**
    ```bash
    npm run dev
    ```
    The app will be available at http://localhost:5173

4.  **Run Convex locally:**
    *   Install the Convex CLI if you haven't:
        ```bash
        npm install -g convex@latest
        ```
    *   Start the Convex dev server:
        ```bash
        npx convex dev
        ```
    *   Make sure your `.env.local` is set up with all required API keys.

---

## Key Integrations

*   **WeatherXM API Integration**:
    *   [convex/weatherxm/](convex/weatherxm/) directory (all files)
    *   [convex/aiChat.ts](convex/aiChat.ts)
    *   [convex/weatherxmApi.ts](convex/weatherxmApi.ts)
    *   [src/hooks/useWeatherStations.ts](src/hooks/useWeatherStations.ts)
    *   [src/pages/StationsListPage.tsx](src/pages/StationsListPage.tsx)
    *   [src/pages/MyStationsPage.tsx](src/pages/MyStationsPage.tsx)
    *   [src/pages/StationDetailPage.tsx](src/pages/StationDetailPage.tsx)
    *   [src/components/dashboard/MyWeatherStations.tsx](src/components/dashboard/MyWeatherStations.tsx)
    *   [src/components/dashboard/WeatherAIChat.tsx](src/components/dashboard/WeatherAIChat.tsx)
    *   [src/components/weather/ChatInterface.tsx](src/components/weather/ChatInterface.tsx)
    *   [src/components/weather/HistoricalDataPanel.tsx](src/components/weather/HistoricalDataPanel.tsx)
    *   [src/components/weather/LatestObservations.tsx](src/components/weather/LatestObservations.tsx)
    *   [src/components/weather/StationCard.tsx](src/components/weather/StationCard.tsx)
    *   [src/components/weather/StationDetailCard.tsx](src/components/weather/StationDetailCard.tsx)
    *   [src/components/weather/StationHealthPanel.tsx](src/components/weather/StationHealthPanel.tsx)
*   **OpenAI Integration**:
    *   [convex/openaiService.ts](convex/openaiService.ts)
    *   [convex/aiChat.ts](convex/aiChat.ts)
    *   [src/hooks/useWeatherChat.ts](src/hooks/useWeatherChat.ts)

---

## Advantages of Kiyan Weather Intelligence Platform

Kiyan offers several compelling advantages as a weather intelligence platform:

1.  **Comprehensive WeatherXM Utilization**: The project demonstrates deep integration with WeatherXM, utilizing its API for a comprehensive weather intelligence platform. This showcases the versatility and potential of the WeatherXM network for building user-facing applications.
2.  **Modern Web Architecture**: Kiyan is built on a solid tech stack, combining a responsive React frontend with a powerful Convex backend for data management and API orchestration. This approach highlights a complete and functional weather intelligence application.
4.  **AI-Powered User Experience**: The integration of an AI Weather Assistant enhances user engagement by transforming raw weather data into easily digestible insights through natural language interaction. This makes complex weather information accessible and valuable to a broader audience.
5.  **Engaging User Interface**: The distinct Neobrutalism design, coupled with intuitive navigation and clear presentation of data, offers a unique and memorable user experience that stands out.
6.  **Scalability and Extensibility**: The modular design of the Convex backend allows for easy expansion and the integration of new features. This architecture supports future growth and adaptation to evolving user needs and technological advancements.
