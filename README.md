# Kiyan

## How to Run

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.local.example .env.local
   ```
   Then edit `.env.local` and add your API keys:
   - `WEATHERXM_API_KEY`: Get from https://developers.weatherxm.com/
   - `OPENAI_API_KEY`: Get from https://platform.openai.com/api-keys

3. **Run the development server:**
   ```bash
   npm run dev
   ```
   The app will be available at http://localhost:5173

4. **Run Convex locally:**
   - Install the Convex CLI if you haven't:
     ```bash
     npm install -g convex@latest
     ```
   - Start the Convex dev server:
     ```bash
     npx convex dev
     ```
   - Make sure your `.env.local` is set up with all required API keys.

---

## Hackathon Submission: Key Integrations

- **Fleek Implementation:**
  - [`convex/fleekAgents.ts`](https://github.com/malawadd/kiyan/blob/main/convex/fleekAgents.ts)
  - [`src/components/StartStopAgentButton.tsx`](https://github.com/malawadd/kiyan/blob/main/src/components/StartStopAgentButton.tsx)
  - [`src/pages/MyAgentsPage.tsx`](https://github.com/malawadd/kiyan/blob/main/src/pages/MyAgentsPage.tsx)
  - [`src/TradingDashboard.tsx`](https://github.com/malawadd/kiyan/blob/main/src/TradingDashboard.tsx)

- **Tomo Implementation:**
  - [`src/TomoProvider.tsx`](https://github.com/malawadd/kiyan/blob/main/src/TomoProvider.tsx)
  - [`src/WalletConnection.tsx`](https://github.com/malawadd/kiyan/blob/main/src/WalletConnection.tsx)
  - [`src/WalletStatusPanel.tsx`](https://github.com/malawadd/kiyan/blob/main/src/WalletStatusPanel.tsx)

- **Story Protocol Implementation:**
  - [`src/components/RegisterOnStoryProtocolPanel.tsx`](https://github.com/malawadd/kiyan/blob/main/src/components/RegisterOnStoryProtocolPanel.tsx)
  - [`src/components/FundAgentModal.tsx`](https://github.com/malawadd/kiyan/blob/main/src/components/FundAgentModal.tsx)
  - [`src/components/MintLicenseTokensPanel.tsx`](https://github.com/malawadd/kiyan/blob/main/src/components/MintLicenseTokensPanel.tsx)
  - [`src/pages/AgentDetailPage.tsx`](https://github.com/malawadd/kiyan/blob/main/src/pages/AgentDetailPage.tsx)
  - [`convex/fleekAgents.ts`](https://github.com/malawadd/kiyan/blob/main/convex/fleekAgents.ts)

---

