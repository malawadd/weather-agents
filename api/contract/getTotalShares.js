import { createPublicClient, http } from 'viem';
import { filecoinCalibration } from 'viem/chains';

const TEMP_BID_MODULE_ADDRESS = '0x45347D26863DB2bd23E821f0ed12C321509C1DCD'; // Replace with actual address
const TEMP_BID_MODULE_ABI = [
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
  }
];

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { drawId, threshold } = req.query;

  if (!drawId || !threshold) {
    return res.status(400).json({ error: 'drawId and threshold are required' });
  }

  try {
    const client = createPublicClient({
      chain: filecoinCalibration,
      transport: http(),
    });

    const result = await client.readContract({
      address: TEMP_BID_MODULE_ADDRESS,
      abi: TEMP_BID_MODULE_ABI,
      functionName: 'getTotalShares',
      args: [BigInt(drawId), BigInt(threshold)],
    });

    res.status(200).json(result.toString());
  } catch (error) {
    console.error('Error fetching total shares:', error);
    res.status(500).json({ error: 'Failed to fetch total shares' });
  }
}