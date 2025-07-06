// convex/lib/WeatherOracleAbi.ts
export default [
    {
      inputs: [
        { internalType: 'bytes32', name: 'cityId',     type: 'bytes32' },
        { internalType: 'int256',  name: 'temperature', type: 'int256'  },
        { internalType: 'uint256', name: 'humidity',   type: 'uint256' },
        { internalType: 'uint256', name: 'windSpeed',  type: 'uint256' },
        { internalType: 'bool',    name: 'rain',       type: 'bool'    },
        { internalType: 'uint256', name: 'pressure',   type: 'uint256' }
      ],
      name: 'updateWeather',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function'
    }
  ] as const;
  