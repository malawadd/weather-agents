import { useState, useEffect } from 'react';
import { useReadContract, useWriteContract, useAccount } from 'wagmi';
import { parseEther, formatEther } from 'viem';

const TEMP_BID_MODULE_ADDRESS = '0x1234567890123456789012345678901234567890'; // Replace with actual address
const TEMP_BID_MODULE_ABI = [
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "drawId",
        "type": "uint256"
      }
    ],
    "name": "claim",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "cityId",
        "type": "bytes32"
      },
      {
        "internalType": "uint256",
        "name": "endTime",
        "type": "uint256"
      },
      {
        "internalType": "int256[]",
        "name": "thresholds",
        "type": "int256[]"
      }
    ],
    "name": "createDraw",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "drawId",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "fundPot",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "drawId",
        "type": "uint256"
      },
      {
        "internalType": "int256",
        "name": "threshold",
        "type": "int256"
      },
      {
        "internalType": "uint256",
        "name": "shareAmt",
        "type": "uint256"
      }
    ],
    "name": "placeBid",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "drawId",
        "type": "uint256"
      }
    ],
    "name": "settle",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getAllDrawIds",
    "outputs": [
      {
        "internalType": "uint256[]",
        "name": "",
        "type": "uint256[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "drawId",
        "type": "uint256"
      }
    ],
    "name": "getDraw",
    "outputs": [
      {
        "internalType": "bytes32",
        "name": "cityId",
        "type": "bytes32"
      },
      {
        "internalType": "uint256",
        "name": "endTime",
        "type": "uint256"
      },
      {
        "internalType": "bool",
        "name": "settled",
        "type": "bool"
      },
      {
        "internalType": "int256",
        "name": "actualTemp",
        "type": "int256"
      },
      {
        "internalType": "uint256",
        "name": "pot",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "drawId",
        "type": "uint256"
      }
    ],
    "name": "getThresholds",
    "outputs": [
      {
        "internalType": "int256[]",
        "name": "",
        "type": "int256[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "drawId",
        "type": "uint256"
      },
      {
        "internalType": "int256",
        "name": "th",
        "type": "int256"
      }
    ],
    "name": "getTotalShares",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "drawId",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "user",
        "type": "address"
      },
      {
        "internalType": "int256",
        "name": "th",
        "type": "int256"
      }
    ],
    "name": "getUserShares",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

export interface DrawData {
  id: number;
  cityId: string;
  endTime: number;
  settled: boolean;
  actualTemp: number;
  pot: bigint;
  thresholds: number[];
  totalVolume: bigint;
  isActive: boolean;
  timeRemaining: number;
}

export interface ThresholdData {
  threshold: number;
  totalShares: bigint;
  userShares: bigint;
  percentage: number;
}

export function useBiddingContract() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const [draws, setDraws] = useState<DrawData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get all draw IDs
  const { data: drawIds, refetch: refetchDrawIds } = useReadContract({
    address: TEMP_BID_MODULE_ADDRESS,
    abi: TEMP_BID_MODULE_ABI,
    functionName: 'getAllDrawIds',
  });

  // Fetch draw data when drawIds change
  useEffect(() => {
    if (drawIds && Array.isArray(drawIds)) {
      fetchAllDraws(drawIds as bigint[]);
    }
  }, [drawIds]);

  const fetchAllDraws = async (drawIdList: bigint[]) => {
    setLoading(true);
    setError(null);
    
    try {
      const drawPromises = drawIdList.map(async (drawId) => {
        const drawData = await fetchDrawData(Number(drawId));
        return drawData;
      });

      const allDraws = await Promise.all(drawPromises);
      const validDraws = allDraws.filter(draw => draw !== null) as DrawData[];
      
      // Sort by end time (active first, then by time)
      validDraws.sort((a, b) => {
        if (a.isActive && !b.isActive) return -1;
        if (!a.isActive && b.isActive) return 1;
        return a.endTime - b.endTime;
      });

      setDraws(validDraws);
    } catch (err) {
      console.error('Error fetching draws:', err);
      setError('Failed to fetch draws from contract');
    } finally {
      setLoading(false);
    }
  };

  const fetchDrawData = async (drawId: number): Promise<DrawData | null> => {
    try {
      // Fetch basic draw info
      const drawInfo = await fetch(`/api/contract/getDraw?drawId=${drawId}`);
      if (!drawInfo.ok) return null;
      
      const { cityId, endTime, settled, actualTemp, pot } = await drawInfo.json();

      // Fetch thresholds
      const thresholdsResponse = await fetch(`/api/contract/getThresholds?drawId=${drawId}`);
      if (!thresholdsResponse.ok) return null;
      
      const thresholds = await thresholdsResponse.json();

      // Calculate total volume across all thresholds
      let totalVolume = BigInt(0);
      for (const threshold of thresholds) {
        const sharesResponse = await fetch(`/api/contract/getTotalShares?drawId=${drawId}&threshold=${threshold}`);
        if (sharesResponse.ok) {
          const shares = await sharesResponse.json();
          totalVolume += BigInt(shares);
        }
      }

      const now = Math.floor(Date.now() / 1000);
      const isActive = !settled && endTime > now;
      const timeRemaining = Math.max(0, endTime - now);

      return {
        id: drawId,
        cityId: cityId.toString(),
        endTime: Number(endTime),
        settled: Boolean(settled),
        actualTemp: Number(actualTemp),
        pot: BigInt(pot),
        thresholds: thresholds.map((t: any) => Number(t)),
        totalVolume,
        isActive,
        timeRemaining,
      };
    } catch (error) {
      console.error(`Error fetching draw ${drawId}:`, error);
      return null;
    }
  };

  const getDrawById = (drawId: number): DrawData | undefined => {
    return draws.find(draw => draw.id === drawId);
  };

  const getThresholdData = async (drawId: number): Promise<ThresholdData[]> => {
    const draw = getDrawById(drawId);
    if (!draw) return [];

    const thresholdDataPromises = draw.thresholds.map(async (threshold) => {
      try {
        // Get total shares for this threshold
        const totalSharesResponse = await fetch(`/api/contract/getTotalShares?drawId=${drawId}&threshold=${threshold}`);
        const totalShares = totalSharesResponse.ok ? BigInt(await totalSharesResponse.json()) : BigInt(0);

        // Get user shares for this threshold
        let userShares = BigInt(0);
        if (address) {
          const userSharesResponse = await fetch(`/api/contract/getUserShares?drawId=${drawId}&user=${address}&threshold=${threshold}`);
          userShares = userSharesResponse.ok ? BigInt(await userSharesResponse.json()) : BigInt(0);
        }

        // Calculate percentage of total volume
        const percentage = draw.totalVolume > 0 ? Number(totalShares * BigInt(100) / draw.totalVolume) : 0;

        return {
          threshold,
          totalShares,
          userShares,
          percentage,
        };
      } catch (error) {
        console.error(`Error fetching threshold data for ${threshold}:`, error);
        return {
          threshold,
          totalShares: BigInt(0),
          userShares: BigInt(0),
          percentage: 0,
        };
      }
    });

    return Promise.all(thresholdDataPromises);
  };

  const placeBid = async (drawId: number, threshold: number, amount: string) => {
    if (!address) throw new Error('Wallet not connected');

    try {
      const shareAmt = parseEther(amount);
      
      await writeContract({
        address: TEMP_BID_MODULE_ADDRESS,
        abi: TEMP_BID_MODULE_ABI,
        functionName: 'placeBid',
        args: [BigInt(drawId), BigInt(threshold), shareAmt],
      });

      // Refresh data after successful bid
      setTimeout(() => {
        refetchDrawIds();
      }, 2000);

      return true;
    } catch (error) {
      console.error('Error placing bid:', error);
      throw error;
    }
  };

  const createDraw = async (cityId: string, endTime: number, thresholds: number[]) => {
    if (!address) throw new Error('Wallet not connected');

    try {
      // Convert city name to bytes32
      const cityIdBytes = new TextEncoder().encode(cityId.padEnd(32, '\0')).slice(0, 32);
      const cityIdHex = '0x' + Array.from(cityIdBytes).map(b => b.toString(16).padStart(2, '0')).join('');

      await writeContract({
        address: TEMP_BID_MODULE_ADDRESS,
        abi: TEMP_BID_MODULE_ABI,
        functionName: 'createDraw',
        args: [cityIdHex, BigInt(endTime), thresholds.map(t => BigInt(t))],
      });

      // Refresh data after successful creation
      setTimeout(() => {
        refetchDrawIds();
      }, 2000);

      return true;
    } catch (error) {
      console.error('Error creating draw:', error);
      throw error;
    }
  };

  const fundPot = async (drawId: number, amount: string) => {
    if (!address) throw new Error('Wallet not connected');

    try {
      const fundAmount = parseEther(amount);
      
      await writeContract({
        address: TEMP_BID_MODULE_ADDRESS,
        abi: TEMP_BID_MODULE_ABI,
        functionName: 'fundPot',
        args: [BigInt(drawId), fundAmount],
      });

      // Refresh data after successful funding
      setTimeout(() => {
        refetchDrawIds();
      }, 2000);

      return true;
    } catch (error) {
      console.error('Error funding pot:', error);
      throw error;
    }
  };

  const claimRewards = async (drawId: number) => {
    if (!address) throw new Error('Wallet not connected');

    try {
      await writeContract({
        address: TEMP_BID_MODULE_ADDRESS,
        abi: TEMP_BID_MODULE_ABI,
        functionName: 'claim',
        args: [BigInt(drawId)],
      });

      return true;
    } catch (error) {
      console.error('Error claiming rewards:', error);
      throw error;
    }
  };

  const settleDraw = async (drawId: number) => {
    if (!address) throw new Error('Wallet not connected');

    try {
      await writeContract({
        address: TEMP_BID_MODULE_ADDRESS,
        abi: TEMP_BID_MODULE_ABI,
        functionName: 'settle',
        args: [BigInt(drawId)],
      });

      // Refresh data after settlement
      setTimeout(() => {
        refetchDrawIds();
      }, 2000);

      return true;
    } catch (error) {
      console.error('Error settling draw:', error);
      throw error;
    }
  };

  return {
    draws,
    loading,
    error,
    getDrawById,
    getThresholdData,
    placeBid,
    createDraw,
    fundPot,
    claimRewards,
    settleDraw,
    refetch: refetchDrawIds,
  };
}