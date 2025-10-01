import React from 'react';
import { Link } from 'react-router-dom';

export function WeatherInsuranceFooter() {
  return (
    <footer className="nb-betting-panel-white p-6 m-4 mt-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div>
            <h3 className="font-bold text-lg mb-3">☔ Kiyan Insurance</h3>
            <p className="text-sm text-gray-600">
              Parametric weather insurance powered by real weather data and blockchain technology. Protect yourself against natural disasters.
            </p>
          </div>
          
          <div>
            <h4 className="font-bold mb-3">Insurance</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/weather-insurance" className="hover:underline">Active Policies</Link></li>
              <li><Link to="/weather-insurance/my-policies" className="hover:underline">My Policies</Link></li>
              <li><Link to="/weather-insurance/claims" className="hover:underline">Claims Center</Link></li>
              <li><Link to="/weather-insurance/history" className="hover:underline">Policy History</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold mb-3">Support</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/weather-insurance/policy-terms" className="hover:underline">Policy Terms</Link></li>
              <li><Link to="/weather-insurance/help" className="hover:underline">Help Center</Link></li>
              <li><Link to="/weather-insurance/faq" className="hover:underline">FAQ</Link></li>
              <li><Link to="/weather-insurance/contact" className="hover:underline">Contact</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold mb-3">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/weather-insurance/terms" className="hover:underline">Terms of Service</Link></li>
              <li><Link to="/weather-insurance/privacy" className="hover:underline">Privacy Policy</Link></li>
              <li><Link to="/weather-insurance/responsible" className="hover:underline">Responsible Insurance</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t-4 border-black mt-6 pt-6 text-center">
          <p className="text-sm text-gray-600">
            © 2025 Kiyan Weather Insurance Platform. All rights reserved. 
            <span className="font-bold"> Insure responsibly.</span>
          </p>
        </div>
      </div>
    </footer>
  );
}