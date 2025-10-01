import React from 'react';
import { Link } from 'react-router-dom';
import { useReadContract } from 'wagmi';
import { formatUnits } from 'viem';
import { VAULT_CONTRACT_ADDRESS } from '../../constants/contractAddresses';
import { VAULT_ABI } from '../../constants/vaultAbi';
import { ActivePoliciesOverview } from '../../components/weather-insurance/ActivePoliciesOverview';

export function InsuranceLandingPage() {
  // Fetch vault data for metrics
  const { data: totalAssets = 0n } = useReadContract({
    address: VAULT_CONTRACT_ADDRESS,
    abi: VAULT_ABI,
    functionName: 'totalAssets',
  });

  const { data: vaultSymbol = 'KITX' } = useReadContract({
    address: VAULT_CONTRACT_ADDRESS,
    abi: VAULT_ABI,
    functionName: 'symbol',
  });

  const { data: vaultDecimals = 18 } = useReadContract({
    address: VAULT_CONTRACT_ADDRESS,
    abi: VAULT_ABI,
    functionName: 'decimals',
  });

  const formatAmount = (amount: bigint) => {
    const formatted = formatUnits(amount, vaultDecimals);
    const num = parseFloat(formatted);
    if (num >= 1000000) {
      return `$${(num / 1000000).toFixed(2)} Million`;
    } else if (num >= 1000) {
      return `$${(num / 1000).toFixed(2)}K`;
    }
    return `$${num.toFixed(2)}`;
  };

  return (
    <div className="w-full space-y-8">
      {/* Hero Section */}
      <div className="nb-insurance-panel-white p-8 mx-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <div className="nb-insurance-panel-accent px-4 py-2 inline-block mb-4">
                <span className="font-bold text-sm">PARAMETRIC INSURANCE</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Weather Insurance
                <br />
                <span className="text-blue-600">On-Chain</span>
              </h1>
              <p className="text-lg text-gray-600 mb-6 font-medium">
                Secure smart contracts protect financial assets for 
                institutional and retail clients against weather risks.
              </p>
              <div className="flex gap-4">
                <Link to="/weather-insurance/policies" className="nb-insurance-button-accent px-8 py-4 text-lg font-bold">
                  View Policies
                </Link>
                <Link to="/weather-insurance/premium-vault" className="nb-insurance-button px-8 py-4 text-lg font-bold">
                  Premium Vault
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="nb-insurance-panel-success p-8 text-center">
                <div className="text-6xl mb-4">☔</div>
                <h3 className="text-2xl font-bold mb-2">Weather Protection</h3>
                <p className="text-gray-600">
                  Automated payouts when weather conditions trigger your policy
                </p>
              </div>
              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-16 h-16 nb-insurance-panel-warning rounded-full flex items-center justify-center">
                <span className="text-2xl">🌡️</span>
              </div>
              <div className="absolute -bottom-4 -left-4 w-12 h-12 nb-insurance-panel-accent rounded-full flex items-center justify-center">
                <span className="text-xl">💧</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics Section */}
      <div className="mx-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2">{formatAmount(totalAssets)}</h2>
            <p className="text-gray-600 font-medium">Total Value Locked in Insurance Vault</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="nb-insurance-panel-white p-4 text-center">
              <div className="text-2xl mb-2">🏦</div>
              <p className="font-bold text-sm">Vault</p>
            </div>
            <div className="nb-insurance-panel-white p-4 text-center">
              <div className="text-2xl mb-2">🌍</div>
              <p className="font-bold text-sm">Global</p>
            </div>
            <div className="nb-insurance-panel-white p-4 text-center">
              <div className="text-2xl mb-2">⚡</div>
              <p className="font-bold text-sm">Instant</p>
            </div>
            <div className="nb-insurance-panel-white p-4 text-center">
              <div className="text-2xl mb-2">🔒</div>
              <p className="font-bold text-sm">Secure</p>
            </div>
            <div className="nb-insurance-panel-white p-4 text-center">
              <div className="text-2xl mb-2">🤖</div>
              <p className="font-bold text-sm">AI-Powered</p>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Product Section */}
      <div className="mx-4">
        <div className="max-w-6xl mx-auto">
          <div className="nb-insurance-panel-accent p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl font-bold mb-4">Liquid Weather Protection</h3>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-4xl font-bold">6.9%</span>
                  <span className="text-lg font-bold text-green-600">APY Available</span>
                </div>
                <p className="text-gray-700 mb-6">
                  Institutional-grade weather risk management with automated payouts based on real weather data.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    <span className="font-medium">Government-backed weather data</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    <span className="font-medium">Smart contract automation</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    <span className="font-medium">Instant claim processing</span>
                  </div>
                </div>
              </div>
              <div className="nb-insurance-panel-white p-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="font-bold">Current TVL</span>
                  <Link to="/weather-insurance/premium-vault" className="nb-insurance-button px-4 py-2 text-sm font-bold">
                    Deposit
                  </Link>
                </div>
                <div className="text-3xl font-bold mb-2">{formatAmount(totalAssets)}</div>
                <div className="text-sm text-gray-600 mb-4">Available for weather protection</div>
                
                {/* Progress visualization */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span>Capacity</span>
                    <span>68%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 border-2 border-black">
                    <div className="bg-gradient-to-r from-green-400 to-blue-500 h-full rounded-full" style={{ width: '68%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Active Policies Overview */}
      <div className="mx-4">
        <div className="max-w-6xl mx-auto">
          <ActivePoliciesOverview />
        </div>
      </div>

      {/* Curated Opportunities Section */}
      <div className="mx-4">
        <div className="max-w-6xl mx-auto">
          <div className="nb-insurance-panel-white p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Curated Opportunities</h2>
              <Link to="/weather-insurance/policies" className="nb-insurance-button px-4 py-2 font-bold">
                View All
              </Link>
            </div>
            <p className="text-gray-600 mb-6">Professionally managed policies for sophisticated investors.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="nb-insurance-panel p-6 text-center">
                <div className="text-3xl mb-3">🌊</div>
                <h3 className="font-bold mb-2">Flood Guard</h3>
                <div className="text-2xl font-bold mb-2">10%</div>
                <p className="text-sm text-gray-600 mb-4">Premium rate for flood protection</p>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span>Coverage Ratio:</span>
                    <span className="font-bold">200%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Min Investment:</span>
                    <span className="font-bold">$1,000</span>
                  </div>
                </div>
              </div>

              <div className="nb-insurance-panel p-6 text-center">
                <div className="text-3xl mb-3">🌡️</div>
                <h3 className="font-bold mb-2">Heat Cap</h3>
                <div className="text-2xl font-bold mb-2">6.8%</div>
                <p className="text-sm text-gray-600 mb-4">Premium rate for heat protection</p>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span>Coverage Ratio:</span>
                    <span className="font-bold">150%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Min Investment:</span>
                    <span className="font-bold">$500</span>
                  </div>
                </div>
              </div>

              <div className="nb-insurance-panel p-6 text-center">
                <div className="text-3xl mb-3">❄️</div>
                <h3 className="font-bold mb-2">Freeze Shield</h3>
                <div className="text-2xl font-bold mb-2">4.5%</div>
                <p className="text-sm text-gray-600 mb-4">Premium rate for freeze protection</p>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span>Coverage Ratio:</span>
                    <span className="font-bold">180%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Min Investment:</span>
                    <span className="font-bold">$750</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Platform Stats Section */}
      <div className="mx-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="nb-insurance-panel-success p-6 text-center">
              <div className="text-3xl font-bold mb-2">$9.79</div>
              <p className="font-bold text-sm">Billion Protected</p>
            </div>
            <div className="nb-insurance-panel-warning p-6 text-center">
              <div className="text-3xl font-bold mb-2">100+</div>
              <p className="font-bold text-sm">Active Policies</p>
            </div>
            <div className="nb-insurance-panel-accent p-6 text-center">
              <div className="text-3xl font-bold mb-2">400+</div>
              <p className="font-bold text-sm">Protected Clients</p>
            </div>
            <div className="nb-insurance-panel-white p-6 text-center">
              <div className="text-3xl font-bold mb-2">24h</div>
              <p className="font-bold text-sm">Claim Processing</p>
            </div>
          </div>
        </div>
      </div>

      {/* The Kiyan Advantage Section */}
      <div className="mx-4">
        <div className="max-w-6xl mx-auto">
          <div className="nb-insurance-panel-white p-8">
            <h2 className="text-2xl font-bold mb-6 text-center">The Kiyan Advantage</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="nb-insurance-panel-accent p-4">
                  <h3 className="font-bold mb-2">🏭 Industry Defining Transparency</h3>
                  <div className="w-full bg-gray-200 rounded-full h-3 border-2 border-black mb-2">
                    <div className="bg-yellow-400 h-full rounded-full" style={{ width: '95%' }}></div>
                  </div>
                  <p className="text-sm">Real-time policy performance and claim data</p>
                </div>
                
                <div className="nb-insurance-panel-success p-4">
                  <h3 className="font-bold mb-2">🤖 Solutions for All</h3>
                  <div className="w-full bg-gray-200 rounded-full h-3 border-2 border-black mb-2">
                    <div className="bg-green-400 h-full rounded-full" style={{ width: '88%' }}></div>
                  </div>
                  <p className="text-sm">From individual farmers to large corporations</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="nb-insurance-panel-warning p-4">
                  <h3 className="font-bold mb-2">🛡️ Robust Risk Management</h3>
                  <div className="w-full bg-gray-200 rounded-full h-3 border-2 border-black mb-2">
                    <div className="bg-orange-400 h-full rounded-full" style={{ width: '92%' }}></div>
                  </div>
                  <p className="text-sm">Advanced weather modeling and risk assessment</p>
                </div>
                
                <div className="nb-insurance-panel p-4">
                  <h3 className="font-bold mb-2">📞 Global Claim Support</h3>
                  <div className="w-full bg-gray-200 rounded-full h-3 border-2 border-black mb-2">
                    <div className="bg-blue-400 h-full rounded-full" style={{ width: '96%' }}></div>
                  </div>
                  <p className="text-sm">24/7 automated claim processing worldwide</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="mx-4">
        <div className="max-w-6xl mx-auto">
          <div className="nb-insurance-panel-accent p-8">
            <h2 className="text-2xl font-bold mb-6 text-center">How Weather Insurance Works</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="nb-insurance-panel-white p-6 text-center">
                <div className="text-4xl mb-4">1️⃣</div>
                <h3 className="font-bold mb-3">Choose Protection</h3>
                <p className="text-sm text-gray-600">
                  Select from drought, flood, temperature, or storm protection policies based on your risk exposure.
                </p>
              </div>
              
              <div className="nb-insurance-panel-white p-6 text-center">
                <div className="text-4xl mb-4">2️⃣</div>
                <h3 className="font-bold mb-3">Pay Premium</h3>
                <p className="text-sm text-gray-600">
                  Deposit tokens to purchase coverage. Premiums are held securely in smart contracts.
                </p>
              </div>
              
              <div className="nb-insurance-panel-white p-6 text-center">
                <div className="text-4xl mb-4">3️⃣</div>
                <h3 className="font-bold mb-3">Automatic Payout</h3>
                <p className="text-sm text-gray-600">
                  When weather conditions trigger your policy, payouts are automatically sent to your wallet.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action Section */}
      <div className="mx-4">
        <div className="max-w-6xl mx-auto">
          <div className="nb-insurance-panel-white p-8 text-center">
            <h2 className="text-3xl font-bold mb-4">Get in Touch</h2>
            <p className="text-lg text-gray-600 mb-6">
              Ready to protect your assets against weather risks? Our team is here to help you find the right coverage.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="nb-insurance-panel-accent p-6">
                <h3 className="font-bold mb-3">📧 Contact Sales</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Speak with our insurance specialists about custom weather protection solutions.
                </p>
                <button className="nb-insurance-button-accent px-6 py-3 font-bold">
                  Schedule Call
                </button>
              </div>
              
              <div className="nb-insurance-panel-success p-6">
                <h3 className="font-bold mb-3">📚 Learn More</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Explore our documentation and learn how parametric insurance can protect your business.
                </p>
                <button className="nb-insurance-button-success px-6 py-3 font-bold">
                  Read Docs
                </button>
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/weather-insurance/policies" className="nb-insurance-button-accent px-8 py-4 text-lg font-bold">
                Browse All Policies
              </Link>
              <Link to="/weather-insurance/premium-vault" className="nb-insurance-button px-8 py-4 text-lg font-bold">
                Access Premium Vault
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Client Testimonials Section */}
      <div className="mx-4">
        <div className="max-w-6xl mx-auto">
          <div className="nb-insurance-panel-white p-8">
            <h2 className="text-2xl font-bold mb-6 text-center">Client Testimonials</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="nb-insurance-panel p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gray-300 rounded-full mr-4 flex items-center justify-center">
                    <span className="font-bold">👨‍🌾</span>
                  </div>
                  <div>
                    <h4 className="font-bold">AgriCorp</h4>
                    <p className="text-xs text-gray-600">Agricultural Company</p>
                  </div>
                </div>
                <p className="text-sm text-gray-700">
                  "Kiyan's drought protection saved our harvest when rainfall dropped 40% below normal. 
                  The automated payout covered our irrigation costs completely."
                </p>
              </div>
              
              <div className="nb-insurance-panel p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gray-300 rounded-full mr-4 flex items-center justify-center">
                    <span className="font-bold">🏢</span>
                  </div>
                  <div>
                    <h4 className="font-bold">Miami Properties</h4>
                    <p className="text-xs text-gray-600">Real Estate Fund</p>
                  </div>
                </div>
                <p className="text-sm text-gray-700">
                  "Hurricane season protection through Kiyan gave us peace of mind. 
                  When Category 3 winds hit, our payout was processed within hours."
                </p>
              </div>
              
              <div className="nb-insurance-panel p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gray-300 rounded-full mr-4 flex items-center justify-center">
                    <span className="font-bold">⚡</span>
                  </div>
                  <div>
                    <h4 className="font-bold">Energy Solutions</h4>
                    <p className="text-xs text-gray-600">Renewable Energy</p>
                  </div>
                </div>
                <p className="text-sm text-gray-700">
                  "Temperature insurance for our solar farms has been game-changing. 
                  Kiyan's smart contracts ensure we're protected against extreme heat events."
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Latest from Blog Section */}
      <div className="mx-4 mb-8">
        <div className="max-w-6xl mx-auto">
          <div className="nb-insurance-panel-white p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Latest from our Blog</h2>
              <button className="nb-insurance-button px-4 py-2 font-bold">
                View All
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="nb-insurance-panel p-4">
                <div className="w-full h-32 bg-gray-200 rounded mb-4 flex items-center justify-center">
                  <span className="text-4xl">📊</span>
                </div>
                <h3 className="font-bold mb-2">Plasma market live: claiming 90% returns</h3>
                <p className="text-xs text-gray-600 mb-3">
                  How our latest weather derivatives are delivering exceptional returns for institutional clients.
                </p>
                <button className="nb-insurance-button px-4 py-2 text-sm font-bold">
                  Read More
                </button>
              </div>
              
              <div className="nb-insurance-panel p-4">
                <div className="w-full h-32 bg-gray-200 rounded mb-4 flex items-center justify-center">
                  <span className="text-4xl">🌍</span>
                </div>
                <h3 className="font-bold mb-2">Maple brings around 507 to Arbitrum</h3>
                <p className="text-xs text-gray-600 mb-3">
                  Expanding our weather insurance coverage to new blockchain networks for global accessibility.
                </p>
                <button className="nb-insurance-button px-4 py-2 text-sm font-bold">
                  Read More
                </button>
              </div>
              
              <div className="nb-insurance-panel p-4">
                <div className="w-full h-32 bg-gray-200 rounded mb-4 flex items-center justify-center">
                  <span className="text-4xl">💡</span>
                </div>
                <h3 className="font-bold mb-2">syrup USDC Expands to Arbitrum</h3>
                <p className="text-xs text-gray-600 mb-3">
                  New stablecoin integration makes weather insurance more accessible to retail investors.
                </p>
                <button className="nb-insurance-button px-4 py-2 text-sm font-bold">
                  Read More
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}