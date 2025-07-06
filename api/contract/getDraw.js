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
      functionName: 'getDraw',
      args: [BigInt(drawId)],
    });

    const [cityId, endTime, settled, actualTemp, pot] = result;

    res.status(200).json({
      cityId: cityId.toString(),
      endTime: endTime.toString(),
      settled,
      actualTemp: actualTemp.toString(),
      pot: pot.toString(),
    });
  } catch (error) {
    console.error('Error fetching draw:', error);
    res.status(500).json({ error: 'Failed to fetch draw data' });
  }
}