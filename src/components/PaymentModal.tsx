import React, { useState } from 'react';
import { X, CreditCard, Smartphone, Copy, Check, ExternalLink } from 'lucide-react';
import { Match } from '../data/matches';
import { Package } from '../data/packages';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  match?: Match;
  package?: Package;
  selectedCategory?: keyof Match['prices'];
  price: number;
}

const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  match,
  package: pkg,
  selectedCategory,
  price
}) => {
  const [paymentMethod, setPaymentMethod] = useState<'crypto' | 'card'>('crypto');
  const [copied, setCopied] = useState(false);

  const walletAddress = '0x62468C025d2738eDB2662B9994F52Af0Afa17c9d';
  const whatsappNumber = '+15551234567';
  const cryptoPrice = Math.round(price * 0.5);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(walletAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const openWhatsApp = () => {
    const message = encodeURIComponent(
      `Hello! I want to confirm payment for ${match ? `${match.homeTeam} vs ${match.awayTeam}` : pkg?.name} ticket(s). Payment method: ${paymentMethod === 'crypto' ? 'Cryptocurrency' : 'Credit Card'}. Amount: $${paymentMethod === 'crypto' ? cryptoPrice : price}`
    );
    window.open(`https://wa.me/${whatsappNumber.replace('+', '')}?text=${message}`, '_blank');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-800">Complete Your Purchase</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          {/* Order Summary */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-gray-800 mb-2">Order Summary</h3>
            {match ? (
              <div>
                <p className="text-gray-700">{match.homeTeam} vs {match.awayTeam}</p>
                <p className="text-sm text-gray-600">{match.date} at {match.venue}</p>
                {selectedCategory && (
                  <p className="text-sm text-gray-600">Category: {selectedCategory}</p>
                )}
              </div>
            ) : pkg ? (
              <div>
                <p className="text-gray-700">{pkg.name}</p>
                <p className="text-sm text-gray-600">{pkg.matches} matches included</p>
              </div>
            ) : null}
          </div>

          {/* Payment Method Selection */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-800 mb-3">Payment Method</h3>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setPaymentMethod('crypto')}
                className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                  paymentMethod === 'crypto'
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-center">
                  <div className="text-2xl mb-2">💎</div>
                  <div className="font-semibold">Crypto</div>
                  <div className="text-xs text-green-600 font-bold">50% OFF!</div>
                  <div className="text-lg font-bold">${cryptoPrice}</div>
                </div>
              </button>
              <button
                onClick={() => setPaymentMethod('card')}
                className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                  paymentMethod === 'card'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-center">
                  <CreditCard className="h-8 w-8 mx-auto mb-2" />
                  <div className="font-semibold">Credit Card</div>
                  <div className="text-xs text-gray-500">Regular Price</div>
                  <div className="text-lg font-bold">${price}</div>
                </div>
              </button>
            </div>
          </div>

          {/* Payment Details */}
          {paymentMethod === 'crypto' ? (
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-semibold text-green-800 mb-2">
                  💰 Cryptocurrency Payment - 50% Discount Applied!
                </h4>
                <p className="text-green-700 text-sm mb-3">
                  Send exactly <strong>${cryptoPrice}</strong> worth of ETH, BTC, or USDT to the address below:
                </p>
                
                <div className="bg-white border rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <div className="font-mono text-sm break-all mr-2">{walletAddress}</div>
                    <button
                      onClick={copyToClipboard}
                      className="flex items-center space-x-1 bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition-colors"
                    >
                      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      <span>{copied ? 'Copied!' : 'Copy'}</span>
                    </button>
                  </div>
                </div>
                
                <p className="text-green-600 text-xs mt-2">
                  ⚠️ After payment, click the WhatsApp button below to confirm your transaction
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-800 mb-2">Credit Card Payment</h4>
              <p className="text-blue-700 text-sm mb-3">
                Contact us via WhatsApp to process your credit card payment securely.
              </p>
              <div className="text-xl font-bold text-blue-800">Total: ${price}</div>
            </div>
          )}

          {/* WhatsApp Confirmation */}
          <div className="mt-6">
            <button
              onClick={openWhatsApp}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 flex items-center justify-center space-x-2"
            >
              <Smartphone className="h-5 w-5" />
              <span>Confirm Payment via WhatsApp</span>
              <ExternalLink className="h-4 w-4" />
            </button>
            <p className="text-gray-600 text-xs text-center mt-2">
              Our team will verify your payment and send you the tickets within 24 hours
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;