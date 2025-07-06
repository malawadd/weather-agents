// Filtered ABI for bidding contract - only essential functions
export const BIDDING_ABI = [
  // Write functions
  {
    "inputs": [
      {"internalType": "uint256", "name": "drawId", "type": "uint256"}
    ],
    "name": "claim",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "uint256", "name": "drawId", "type": "uint256"},
      {"internalType": "bytes32", "name": "cityId", "type": "bytes32"},
      {"internalType": "uint256", "name": "endTime", "type": "uint256"},
      {"internalType": "int256[]", "name": "thresholds", "type": "int256[]"}
    ],
    "name": "createDraw",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "uint256", "name": "drawId", "type": "uint256"},
      {"internalType": "uint256", "name": "amount", "type": "uint256"}
    ],
    "name": "fundPot",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "uint256", "name": "drawId", "type": "uint256"},
      {"internalType": "int256", "name": "threshold", "type": "int256"},
      {"internalType": "uint256", "name": "shareAmt", "type": "uint256"}
    ],
    "name": "placeBid",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "uint256", "name": "drawId", "type": "uint256"}
    ],
    "name": "settle",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },

  // Read functions
  {
    "inputs": [],
    "name": "asset",
    "outputs": [{"internalType": "contract IERC20", "name": "", "type": "address"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "uint256", "name": "", "type": "uint256"},
      {"internalType": "address", "name": "", "type": "address"}
    ],
    "name": "claimed",
    "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "name": "draws",
    "outputs": [
      {"internalType": "bytes32", "name": "cityId", "type": "bytes32"},
      {"internalType": "uint256", "name": "endTime", "type": "uint256"},
      {"internalType": "bool", "name": "settled", "type": "bool"},
      {"internalType": "int256", "name": "actualTemp", "type": "int256"},
      {"internalType": "uint256", "name": "pot", "type": "uint256"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "drawId", "type": "uint256"}],
    "name": "getThresholds",
    "outputs": [{"internalType": "int256[]", "name": "", "type": "int256[]"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "oracle",
    "outputs": [{"internalType": "contract IWeatherOracle", "name": "", "type": "address"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [{"internalType": "address", "name": "", "type": "address"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "tickets",
    "outputs": [{"internalType": "contract IERC20", "name": "", "type": "address"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "uint256", "name": "", "type": "uint256"},
      {"internalType": "int256", "name": "", "type": "int256"}
    ],
    "name": "totalShares",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "uint256", "name": "", "type": "uint256"},
      {"internalType": "address", "name": "", "type": "address"},
      {"internalType": "int256", "name": "", "type": "int256"}
    ],
    "name": "userShares",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  }
] as const;