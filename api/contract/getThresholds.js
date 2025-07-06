import { createPublicClient, http } from 'viem';
import { filecoinCalibration } from 'viem/chains';

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
  }
];

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { drawId } = req.query;

  if (!drawId) {
    return res.status(400).json({ error: 'drawId is required' });
  }

  try {
    const client = createPublicClient({
      chain: filecoinCalibration,
      transport: http(),
    });

    const result = await client.readContract({
      address: TEMP_BID_MODULE_ADDRESS,
      abi: TEMP_BID_MODULE_ABI,
      functionName: 'getThresholds',
      args: [BigInt(drawId)],
    });

    // Convert BigInt array to number array
    const thresholds = result.map(threshold => threshold.toString());

    res.status(200).json(thresholds);
  } catch (error) {
    console.error('Error fetching thresholds:', error);
    res.status(500).json({ error: 'Failed to fetch thresholds' });
  }
}