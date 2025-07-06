# Kiyan

## Project Overview

Kiyan is a multi-faceted decentralized application designed to leverage WeatherXM's global network of weather stations, providing users with advanced weather intelligence and innovative betting opportunities. Kiyan aims to showcase the power of real-world weather data combined with AI and blockchain technology to create engaging and useful Web3 experiences.

The platform is divided into two main modules:

1.  **Weather Intelligence Platform**: A dashboard for exploring WeatherXM stations worldwide, saving favorites, and interacting with an AI assistant for real-time weather insights and historical data analysis.
2.  **Weather Betting Platform**: A decentralized market where users can place bets on future temperature outcomes, powered by WeatherXM oracle data and smart contracts on the Filecoin Calibration testnet.

## Key Features & Functionalities

### 1. Weather Intelligence Platform (Frontend: [src/AuthenticatedApp.tsx](src/AuthenticatedApp.tsx) -> `/weather-intelligence/*`)

*   **Global Station Explorer**: Browse and search through thousands of WeatherXM stations globally. ([src/pages/StationsListPage.tsx](src/pages/StationsListPage.tsx))
*   **Personalized Station Management**: Users can save their favorite WeatherXM stations for quick access and personalized data. ([src/pages/MyStationsPage.tsx](src/pages/MyStationsPage.tsx))
*   **Real-time & Historical Data**: View the latest observations and historical weather data (temperature, humidity, wind, pressure, etc.) for any station. ([src/pages/StationDetailPage.tsx](src/pages/StationDetailPage.tsx))
*   **AI Weather Assistant**: Chat with an AI-powered assistant to get natural language insights, summaries, and forecasts based on live and historical WeatherXM data. ([src/components/weather/ChatInterface.tsx](src/components/weather/ChatInterface.tsx), [src/hooks/useWeatherChat.ts](src/hooks/useWeatherChat.ts))
*   **Data Synchronization**: Manually sync latest and historical data for individual stations or all saved stations. ([src/components/weather/MyStationsHeader.tsx](src/components/weather/MyStationsHeader.tsx), [src/components/weather/MyStationsList.tsx](src/components/weather/MyStationsList.tsx), [src/components/weather/StationDetailHeader.tsx](src/components/weather/StationDetailHeader.tsx))

### 2. Weather Betting Platform (Frontend: [src/App.tsx](src/App.tsx) -> `/weather-betting/*`)

*   **Decentralized Temperature Markets**: Participate in prediction markets based on specific city temperatures. ([src/pages/betting/ActiveBidsPage.tsx](src/pages/betting/ActiveBidsPage.tsx))
*   **Place Bids**: Users can place bets on predefined temperature thresholds using Kiyan Tickets (KITX) from the prize vault. ([src/components/betting/PlaceBetPanel.tsx](src/components/betting/PlaceBetPanel.tsx))
*   **Prize Vault**: A secure ERC-4626 vault for managing KITX tokens, allowing users to deposit, mint, redeem, and donate to the prize pool. ([src/pages/betting/VaultPage.tsx](src/pages/betting/VaultPage.tsx))
*   **Claim Winnings**: After a draw settles, winners can claim their proportional share of the prize pool. ([src/components/betting/ClaimWinningsPanel.tsx](src/components/betting/ClaimWinningsPanel.tsx))
*   **Admin Functionality**: Contract owner can create new betting draws and settle them using oracle data. ([src/pages/betting/CreateBidPage.tsx](src/pages/betting/CreateBidPage.tsx))

### 3. Core Platform Features

*   **Web3 Wallet Authentication**: Seamless login and interaction using popular EVM wallets via Tomo EVM Kit and Wagmi. ([src/WalletAuthProvider.tsx](src/WalletAuthProvider.tsx), [src/WalletConnection.tsx](src/WalletConnection.tsx), [src/TomoProvider.tsx](src/TomoProvider.tsx))
*   **Guest Mode**: Allows users to explore the Weather Intelligence Platform with sample data without connecting a wallet. ([src/WalletSignInForm.tsx](src/WalletSignInForm.tsx))
*   **Neobrutalism UI**: A distinct and engaging user interface with animated backgrounds for platform selection. ([src/index.css](src/index.css), [src/pages/PlatformSelectionPage.tsx](src/pages/PlatformSelectionPage.tsx))

## WeatherXM Integration

Kiyan deeply integrates with WeatherXM services at multiple layers to provide accurate and real-time weather data:

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

### 2. WeatherXM Oracle (On-chain Data Verification)

A custom Solidity `WeatherOracle` contract is deployed on the Filecoin Calibration testnet, acting as an on-chain source of truth for WeatherXM temperature data.

*   **Data Push Mechanism**: A Convex cron job ([convex/crons.ts](convex/crons.ts)) is configured to run daily, fetching the latest temperature data for a specific city (London) from the WeatherXM Pro API and pushing it to the `WeatherOracle` smart contract.
    *   [convex/crons.ts](convex/crons.ts)
    *   [convex/weatherOracle.ts](convex/weatherOracle.ts) (uses `process.env.WEATHERXM_API_KEY` and `process.env.WEATHER_STATION_ID`)
*   **Decentralized Betting Settlement**: The `TempBidModule` smart contract ([smart-contracts/TempBidModule.sol](smart-contracts/TempBidModule.sol)) relies on this `WeatherOracle` ([smart-contracts/WeatherOracle.sol](smart-contracts/WeatherOracle.sol)) to retrieve the actual temperature for a given city when settling a betting draw, ensuring transparent and verifiable outcomes.
    *   [smart-contracts/TempBidModule.sol](smart-contracts/TempBidModule.sol) (interacts with `IWeatherOracle`)
    *   [src/pages/betting/BidDetailPage.tsx](src/pages/betting/BidDetailPage.tsx) (reads `actualTemp` from `getDraw` after settlement)

### 3. AI Integration (OpenAI)

The AI Weather Assistant leverages OpenAI's GPT models, providing context-aware responses based on WeatherXM data. The Convex backend acts as an intermediary, feeding real-time WeatherXM station details and observations to the OpenAI API.

*   [convex/aiChat.ts](convex/aiChat.ts) (`chatWithStationAI` action fetches WeatherXM data and sends to OpenAI service)
*   [convex/openaiService.ts](convex/openaiService.ts) (handles OpenAI API calls, constructs system prompts with WeatherXM data)
*   [src/hooks/useWeatherChat.ts](src/hooks/useWeatherChat.ts) (frontend hook for AI chat)

## Project Architecture

Kiyan employs a modern full-stack architecture, combining Web2 and Web3 technologies:

*   **Frontend**: Built with React and Vite, providing a responsive and interactive user interface. It uses Wagmi for direct smart contract interactions and Tomo EVM Kit for enhanced wallet connection.
*   **Backend (Convex)**: A real-time, serverless backend that handles:
    *   Database operations (users, sessions, agents, weather data, chat history).
    *   API integrations (WeatherXM Pro API, OpenAI API).
    *   Business logic for user-specific data and AI interactions.
    *   Scheduled tasks (cron jobs for oracle updates).
*   **Smart Contracts (Filecoin Calibration Testnet)**:
    *   **`TempBidModule.sol`**: The core contract for the weather betting markets. It manages the lifecycle of prediction draws, handles user bids, and facilitates prize distribution. It relies on the `WeatherOracle` for verifiable temperature data.
    *   **`WeatherOracle.sol`**: An on-chain oracle that stores weather data pushed from the Convex backend. It serves as the single source of truth for temperature readings used in betting settlements.
    *   **`PrizeVault.sol`**: An ERC-4626 compliant vault that tokenizes deposits. Users deposit a mock ERC20 token (USDC equivalent) and receive "Kiyan Tickets" (KITX) as shares, which are then used for betting. This standard ensures interoperability with other DeFi protocols. ([smart-contracts/PrizeVault.sol](smart-contracts/PrizeVault.sol))
    *   **`ERC20Mock.sol`**: A simple mock ERC20 token used as the underlying asset for the `PrizeVault` and as the betting currency (KITX). ([smart-contracts/ERC20Mock.sol](smart-contracts/ERC20Mock.sol))
*   **Web3 Libraries**:
    *   **Wagmi**: React Hooks for Ethereum, simplifying smart contract interactions (reading, writing, events).
    *   **Tomo EVM Kit**: Provides a unified solution for Web3 authentication, integrating social login options and supporting major EVM wallets, enhancing user onboarding.
*   **Cron Jobs (Convex)**: Automated tasks scheduled to run at specific intervals, crucial for pushing off-chain WeatherXM data onto the blockchain oracle.

## Smart Contracts Details

All smart contracts are deployed on the **Filecoin Calibration Testnet**.

*   **`TempBidModule.sol`**
    *   **Address**: `0x45347D26863DB2bd23E821f0ed12C321509C1DCD`
    *   **Purpose**: Manages the temperature prediction draws.
    *   **Key Functions**: `createDraw` (owner-only), `placeBid`, `fundPot`, `settle` (owner-only, uses oracle), `claim`.
    *   **Access Control**: Uses OpenZeppelin's `Ownable` for administrative functions. ([smart-contracts/TempBidModule.sol](smart-contracts/TempBidModule.sol))
*   **`WeatherOracle.sol`**
    *   **Address**: `0x5EB5F1c600ccb1729B1034d2147D4B6678021b88`
    *   **Purpose**: Stores the latest weather measurements (temperature, humidity, wind, rain, pressure) for specific city IDs.
    *   **Key Functions**: `updateWeather` (owner-only), `getTemperature`, `latestWeather`.
    *   **Access Control**: `Ownable` contract, ensuring only authorized entities (our Convex cron job) can update data. ([smart-contracts/WeatherOracle.sol](smart-contracts/WeatherOracle.sol))
*   **`PrizeVault.sol`**
    *   **Address**: `0x356db81C1000612B8a27C2d82dEB4aD00B5D96Bd`
    *   **Purpose**: An ERC-4626 compliant vault for managing the betting token (KITX). Users deposit an underlying asset (MockToken) and receive "Kiyan Tickets" (KITX) as shares, which are then used for betting. This standard ensures interoperability with other DeFi protocols. ([smart-contracts/PrizeVault.sol](smart-contracts/PrizeVault.sol))
*   **`ERC20Mock.sol`**
    *   **Address**: `0xB11011307e0F3c805387c10aa69F874244b1bec3`
    *   **Purpose**: A simple mock ERC20 token used as the underlying asset for the `PrizeVault` and as the betting currency (`KITX`). It includes a `mint` function for easy testing. ([smart-contracts/ERC20Mock.sol](smart-contracts/ERC20Mock.sol))

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
    *   `PRIVATE_KEY`: The private key of the wallet that will own and update the `WeatherOracle` contract (for cron job).

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

## Hackathon Submission: Key Integrations

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
*   **WeatherXM Oracle & Betting Contracts**:
    *   [smart-contracts/TempBidModule.sol](smart-contracts/TempBidModule.sol)
    *   [smart-contracts/WeatherOracle.sol](smart-contracts/WeatherOracle.sol)
    *   [smart-contracts/PrizeVault.sol](smart-contracts/PrizeVault.sol)
    *   [smart-contracts/ERC20Mock.sol](smart-contracts/ERC20Mock.sol)
    *   [convex/weatherOracle.ts](convex/weatherOracle.ts)
    *   [convex/crons.ts](convex/crons.ts)
    *   [convex/lib/WeatherOracleAbi.ts](convex/lib/WeatherOracleAbi.ts)
    *   [src/constants/contractAddresses.ts](src/constants/contractAddresses.ts)
    *   [src/constants/biddingAbi.ts](src/constants/biddingAbi.ts)
    *   [src/constants/vaultAbi.ts](src/constants/vaultAbi.ts)
    *   [src/constants/mtokenAbi.ts](src/constants/mtokenAbi.ts)
    *   [src/hooks/useBiddingContract.ts](src/hooks/useBiddingContract.ts)
    *   [src/components/betting/](src/components/betting/) directory (all files)
    *   [src/pages/betting/](src/pages/betting/) directory (all files)
*   **OpenAI Integration**:
    *   [convex/openaiService.ts](convex/openaiService.ts)
    *   [convex/aiChat.ts](convex/aiChat.ts)
    *   [src/hooks/useWeatherChat.ts](src/hooks/useWeatherChat.ts)

---

## Advantages of Kiyan

Kiyan offers several compelling advantages as a project for the WeatherXM Hackathon:

1.  **Comprehensive WeatherXM Utilization**: The project demonstrates a deep and varied integration with WeatherXM, utilizing its API for both a user-facing intelligence platform and as the foundational data source for a novel decentralized betting market. This showcases the versatility and potential of the WeatherXM network.
2.  **Robust Web3 Architecture**: Kiyan is built on a solid Web3 stack, combining a responsive React frontend, a powerful Convex backend for data management and API orchestration, and custom Solidity smart contracts on the Filecoin Calibration testnet. This full-stack approach highlights a complete and functional decentralized application.
3.  **Innovative Oracle Solution**: The implementation of a custom `WeatherOracle` smart contract, fed by a Convex cron job pulling data directly from the WeatherXM API, provides a transparent and verifiable on-chain data source. This is crucial for building trust and enabling fair outcomes in decentralized applications like the betting platform.
4.  **AI-Powered User Experience**: The integration of an AI Weather Assistant enhances user engagement by transforming raw weather data into easily digestible insights through natural language interaction. This makes complex weather information accessible and valuable to a broader audience.
5.  **Engaging User Interface**: The distinct Neobrutalism design, coupled with intuitive navigation and clear presentation of data, offers a unique and memorable user experience that stands out.
6.  **Scalability and Extensibility**: The modular design of the Convex backend and the separation of smart contracts allow for easy expansion and the integration of new features. This architecture supports future growth and adaptation to evolving user needs and technological advancements.
