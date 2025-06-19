import React, { useState, useEffect } from 'react';
import {
  X, User, Mail, Phone, MapPin, Calendar, Check, Copy,
  ExternalLink, Smartphone, Download, FileText,
  CreditCard, Shield, Info, DollarSign, Wallet, MessageCircle
} from 'lucide-react';
import QRCode from 'qrcode';

interface RegistrationFormProps {
  isOpen: boolean;
  onClose: () => void;
  ticketInfo: {
    type: 'match' | 'package';
    title: string;
    price: number;
    cryptoPrice: number;
  };
}

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  confirmEmail: string;
  phone: string;
  dateOfBirth: string;
  nationality: string;
  address: string;
  city: string;
  country: string;
  postalCode: string;
  agreeTerms: boolean;
  agreeMarketing: boolean;
}

const countries = [
  'Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola', 'Antigua and Barbuda', 'Argentina', 'Armenia',
  'Australia', 'Austria', 'Azerbaijan', 'Bahamas', 'Bahrain', 'Bangladesh', 'Barbados', 'Belarus',
  'Belgium', 'Belize', 'Benin', 'Bhutan', 'Bolivia', 'Bosnia and Herzegovina', 'Botswana', 'Brazil',
  'Brunei', 'Bulgaria', 'Burkina Faso', 'Burundi', 'Cabo Verde', 'Cambodia', 'Cameroon', 'Canada',
  'Central African Republic', 'Chad', 'Chile', 'China', 'Colombia', 'Comoros', 'Congo', 'Costa Rica',
  'Croatia', 'Cuba', 'Cyprus', 'Czech Republic', 'Denmark', 'Djibouti', 'Dominica', 'Dominican Republic',
  'Ecuador', 'Egypt', 'El Salvador', 'Estonia', 'Eswatini', 'Ethiopia', 'Fiji', 'Finland', 'France',
  'Gabon', 'Gambia', 'Georgia', 'Germany', 'Ghana', 'Greece', 'Grenada', 'Guatemala', 'Guinea',
  'Guinea-Bissau', 'Guyana', 'Haiti', 'Honduras', 'Hungary', 'Iceland', 'India', 'Indonesia', 'Iran',
  'Iraq', 'Ireland', 'Israel', 'Italy', 'Ivory Coast', 'Jamaica', 'Japan', 'Jordan', 'Kazakhstan',
  'Kenya', 'Kiribati', 'Kuwait', 'Kyrgyzstan', 'Laos', 'Latvia', 'Lebanon', 'Lesotho', 'Liberia',
  'Libya', 'Liechtenstein', 'Lithuania', 'Luxembourg', 'Madagascar', 'Malawi', 'Malaysia', 'Maldives',
  'Mali', 'Malta', 'Mauritania', 'Mauritius', 'Mexico', 'Moldova', 'Monaco', 'Mongolia', 'Montenegro',
  'Morocco', 'Mozambique', 'Myanmar', 'Namibia', 'Nepal', 'Netherlands', 'New Zealand', 'Nicaragua',
  'Niger', 'Nigeria', 'North Korea', 'North Macedonia', 'Norway', 'Oman', 'Pakistan', 'Palestine',
  'Panama', 'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines', 'Poland', 'Portugal', 'Qatar',
  'Romania', 'Russia', 'Rwanda', 'Saint Kitts and Nevis', 'Saint Lucia', 'Saint Vincent and the Grenadines',
  'Samoa', 'San Marino', 'Saudi Arabia', 'Senegal', 'Serbia', 'Seychelles', 'Sierra Leone', 'Singapore',
  'Slovakia', 'Slovenia', 'Solomon Islands', 'Somalia', 'South Africa', 'South Korea', 'South Sudan',
  'Spain', 'Sri Lanka', 'Sudan', 'Suriname', 'Sweden', 'Switzerland', 'Syria', 'Taiwan', 'Tajikistan',
  'Tanzania', 'Thailand', 'Togo', 'Tonga', 'Trinidad and Tobago', 'Tunisia', 'Turkey', 'Turkmenistan',
  'Tuvalu', 'Uganda', 'Ukraine', 'United Arab Emirates', 'United Kingdom', 'United States', 'Uruguay',
  'Uzbekistan', 'Vanuatu', 'Vatican City', 'Venezuela', 'Vietnam', 'Yemen', 'Zambia', 'Zimbabwe'
];

// Your wallet address
const WALLET_ADDRESS = '0x62468C025d2738eDB2662B9994F52Af0Afa17c9d';
const WHATSAPP_NUMBER = '+34632800363';

// Supported cryptocurrencies
const SUPPORTED_CRYPTOS = [
  { symbol: 'ETH', name: 'Ethereum', network: 'Ethereum' },
  { symbol: 'USDT', name: 'Tether (ERC-20)', network: 'Ethereum' },
  { symbol: 'USDC', name: 'USD Coin (ERC-20)', network: 'Ethereum' },
  { symbol: 'BNB', name: 'BNB (BEP-20)', network: 'BSC' },
  { symbol: 'MATIC', name: 'Polygon', network: 'Polygon' }
];

const RegistrationForm: React.FC<RegistrationFormProps> = ({ isOpen, onClose, ticketInfo }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [orderId, setOrderId] = useState('');
  const [qrCodeDataURL, setQrCodeDataURL] = useState('');
  const [selectedCrypto, setSelectedCrypto] = useState(SUPPORTED_CRYPTOS[0]);
  const [transactionId, setTransactionId] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    confirmEmail: '',
    phone: '',
    dateOfBirth: '',
    nationality: '',
    address: '',
    city: '',
    country: '',
    postalCode: '',
    agreeTerms: false,
    agreeMarketing: false
  });

  // Generate QR Code when component loads
  useEffect(() => {
    const generateQRCode = async () => {
      try {
        const qrData = WALLET_ADDRESS;
        const qrCodeURL = await QRCode.toDataURL(qrData, {
          width: 256,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#FFFFFF'
          }
        });
        setQrCodeDataURL(qrCodeURL);
      } catch (error) {
        console.error('Error generating QR Code:', error);
      }
    };

    if (isOpen) {
      generateQRCode();
      const newOrderId = `FIFA2026-${Date.now().toString().slice(-8)}`;
      setOrderId(newOrderId);
    }
  }, [isOpen]);

  // Copy wallet address
  const copyWalletAddress = async () => {
    try {
      await navigator.clipboard.writeText(WALLET_ADDRESS);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (error) {
      console.error('Copy error:', error);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = WALLET_ADDRESS;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  // Send WhatsApp confirmation
  const sendWhatsAppConfirmation = () => {
    const message = `🎫 *FIFA World Cup 2026 Ticket Payment Confirmation*

📋 *Order Details:*
• Order ID: ${orderId}
• Name: ${formData.firstName} ${formData.lastName}
• Email: ${formData.email}
• Phone: ${formData.phone}

🎟️ *Ticket Details:*
• Type: ${ticketInfo.title}
• Original Price: $${ticketInfo.price.toLocaleString()}
• Crypto Price (30% OFF): $${ticketInfo.cryptoPrice.toLocaleString()}

💰 *Payment Details:*
• Selected Currency: ${selectedCrypto.symbol} (${selectedCrypto.name})
• Network: ${selectedCrypto.network}
• Wallet Address: ${WALLET_ADDRESS}
• Amount Paid: $${ticketInfo.cryptoPrice.toLocaleString()}
${transactionId ? `• Transaction ID: ${transactionId}` : '• Transaction ID: Will be added'}

✅ *Payment has been sent and awaiting confirmation*

📞 Please confirm payment receipt and send official tickets.

Thank you! 🙏`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappURL = `https://wa.me/${WHATSAPP_NUMBER.replace('+', '')}?text=${encodedMessage}`;
    
    window.open(whatsappURL, '_blank');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        if (!formData.firstName.trim()) {
          alert('Please enter your first name');
          return false;
        }
        if (!formData.lastName.trim()) {
          alert('Please enter your last name');
          return false;
        }
        if (!formData.email.trim()) {
          alert('Please enter your email address');
          return false;
        }
        if (!formData.confirmEmail.trim()) {
          alert('Please confirm your email address');
          return false;
        }
        if (formData.email !== formData.confirmEmail) {
          alert('Email addresses do not match');
          return false;
        }
        if (!formData.phone.trim()) {
          alert('Please enter your phone number');
          return false;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
          alert('Please enter a valid email address');
          return false;
        }
        return true;
      case 2:
        if (!formData.address.trim()) {
          alert('Please enter your address');
          return false;
        }
        if (!formData.city.trim()) {
          alert('Please enter your city');
          return false;
        }
        if (!formData.country.trim()) {
          alert('Please select your country');
          return false;
        }
        return true;
      case 3:
        if (!formData.agreeTerms) {
          alert('Please agree to the terms and conditions');
          return false;
        }
        return true;
      default:
        return true;
    }
  };

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-t-2xl">
          <div>
            <h2 className="text-2xl font-bold">
              {currentStep === 5 ? '🎉 Payment Confirmation Required!' : 'Complete Registration'}
            </h2>
            <p className="text-blue-200 text-sm">{ticketInfo.title}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-blue-700 rounded-full transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Progress Bar */}
        {currentStep < 5 && (
          <div className="px-6 py-4 bg-gray-50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Step {currentStep} of 4</span>
              <span className="text-sm text-gray-500">
                {currentStep === 1 && 'Personal Information'}
                {currentStep === 2 && 'Address Details'}
                {currentStep === 3 && 'Terms & Conditions'}
                {currentStep === 4 && 'Cryptocurrency Payment'}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / 4) * 100}%` }}
              ></div>
            </div>
          </div>
        )}

        <div className="p-6">
          {/* Step 1: Personal Information */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <User className="h-12 w-12 text-blue-600 mx-auto mb-2" />
                <h3 className="text-xl font-bold text-gray-800">Personal Information</h3>
                <p className="text-gray-600">Please provide your personal details</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter your first name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter your last name"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your email address"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Email Address *</label>
                <input
                  type="email"
                  name="confirmEmail"
                  value={formData.confirmEmail}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Confirm your email address"
                  required
                />
                {formData.confirmEmail && formData.email !== formData.confirmEmail && (
                  <p className="text-red-500 text-sm mt-1">Email addresses do not match</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="+1234567890"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nationality</label>
                <select
                  name="nationality"
                  value={formData.nationality}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select nationality</option>
                  {countries.map((country) => (
                    <option key={country} value={country}>{country}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Step 2: Address Information */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <MapPin className="h-12 w-12 text-blue-600 mx-auto mb-2" />
                <h3 className="text-xl font-bold text-gray-800">Address Information</h3>
                <p className="text-gray-600">Please provide your address details</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Street Address *</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your street address"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter your city"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Postal Code</label>
                  <input
                    type="text"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter your postal code"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Country *</label>
                <select
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Select country</option>
                  {countries.map((country) => (
                    <option key={country} value={country}>{country}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Step 3: Terms and Conditions */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <Check className="h-12 w-12 text-blue-600 mx-auto mb-2" />
                <h3 className="text-xl font-bold text-gray-800">Terms & Conditions</h3>
                <p className="text-gray-600">Please review and accept our terms</p>
              </div>

              {/* Order Summary */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h4 className="font-semibold text-gray-800 mb-2">Order Summary</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">{ticketInfo.title}</span>
                    <span className="font-bold text-gray-800">${ticketInfo.price.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center text-green-600">
                    <span className="font-semibold">Crypto Payment Discount (30%)</span>
                    <span className="font-bold">-${(ticketInfo.price - ticketInfo.cryptoPrice).toLocaleString()}</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-800">Final Amount</span>
                    <span className="text-xl font-bold text-green-600">${ticketInfo.cryptoPrice.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Terms and Conditions Checkboxes */}
              <div className="space-y-4">
                <label className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="agreeTerms"
                    checked={formData.agreeTerms}
                    onChange={handleInputChange}
                    className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    required
                  />
                  <span className="text-sm text-gray-700">
                    I agree to the <a href="#" className="text-blue-600 hover:underline">Terms & Conditions</a> and <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a> *
                  </span>
                </label>
                <label className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="agreeMarketing"
                    checked={formData.agreeMarketing}
                    onChange={handleInputChange}
                    className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-700">
                    I would like to receive marketing communications about FIFA World Cup 2026
                  </span>
                </label>
              </div>
            </div>
          )}

          {/* Step 4: Crypto Payment */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <div className="text-4xl mb-2">💎</div>
                <h3 className="text-xl font-bold text-gray-800">Cryptocurrency Payment</h3>
                <p className="text-gray-600">Pay securely using cryptocurrency</p>
              </div>

              {/* Customer Info Summary */}
              <div className="bg-blue-50 rounded-lg p-4 mb-6">
                <h4 className="font-semibold text-blue-800 mb-3">Customer Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                  <div><strong>Name:</strong> {formData.firstName} {formData.lastName}</div>
                  <div><strong>Email:</strong> {formData.email}</div>
                  <div><strong>Phone:</strong> {formData.phone}</div>
                  <div><strong>Country:</strong> {formData.country}</div>
                  <div><strong>Order ID:</strong> {orderId}</div>
                </div>
              </div>

              {/* Payment Amount */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-6 text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  ${ticketInfo.cryptoPrice.toLocaleString()} USD
                </div>
                <div className="text-gray-600 mb-4">
                  (30% crypto payment discount applied)
                </div>
              </div>

              {/* Crypto Selection */}
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-800">Select Cryptocurrency:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {SUPPORTED_CRYPTOS.map((crypto) => (
                    <button
                      key={crypto.symbol}
                      onClick={() => setSelectedCrypto(crypto)}
                      className={`p-3 rounded-lg border text-left transition-all duration-200 ${
                        selectedCrypto.symbol === crypto.symbol
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="font-bold">{crypto.symbol}</div>
                      <div className="text-sm text-gray-600">{crypto.name}</div>
                      <div className="text-xs text-gray-500">{crypto.network}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Wallet Address & QR Code */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="font-semibold text-gray-800 mb-4 text-center">Payment Wallet Address</h4>
                
                {/* QR Code */}
                <div className="flex justify-center mb-4">
                  {qrCodeDataURL && (
                    <img 
                      src={qrCodeDataURL} 
                      alt="Payment QR Code" 
                      className="w-48 h-48 border-2 border-gray-300 rounded-lg"
                    />
                  )}
                </div>

                {/* Wallet Address */}
                <div className="bg-white rounded-lg p-4 border">
                  <div className="text-sm text-gray-600 mb-2">Wallet Address ({selectedCrypto.network}):</div>
                  <div className="flex items-center space-x-2">
                    <code className="flex-1 bg-gray-100 p-2 rounded text-sm font-mono break-all">
                      {WALLET_ADDRESS}
                    </code>
                    <button
                      onClick={copyWalletAddress}
                      className={`px-3 py-2 rounded-lg transition-all duration-200 flex items-center space-x-1 ${
                        copySuccess 
                          ? 'bg-green-500 text-white' 
                          : 'bg-blue-500 hover:bg-blue-600 text-white'
                      }`}
                    >
                      {copySuccess ? (
                        <>
                          <Check className="h-4 w-4" />
                          <span className="text-sm">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4" />
                          <span className="text-sm">Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Payment Instructions */}
                <div className="mt-4 text-sm text-gray-600">
                  <p className="font-semibold mb-2">Payment Instructions:</p>
                  <ol className="list-decimal list-inside space-y-1">
                    <li>Copy the wallet address above or scan the QR code</li>
                    <li>Open your crypto wallet</li>
                    <li>Send ${ticketInfo.cryptoPrice.toLocaleString()} USD worth of {selectedCrypto.symbol}</li>
                    <li>Save the transaction ID</li>
                    <li>Click "Confirm via WhatsApp" below</li>
                  </ol>
                </div>
              </div>

              {/* Transaction ID Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Transaction ID (Optional)
                </label>
                <input
                  type="text"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter transaction ID if available"
                />
              </div>

              {/* WhatsApp Confirmation Button */}
              <button
                onClick={sendWhatsAppConfirmation}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-4 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-3"
              >
                <MessageCircle className="h-6 w-6" />
                <span>Confirm via WhatsApp</span>
                <div className="text-xl">📱</div>
              </button>

              {/* Next Step Button */}
              <button
                onClick={() => setCurrentStep(5)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300"
              >
                Continue to Confirmation
              </button>

              {/* Security Notice */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start space-x-2">
                  <Shield className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div className="text-sm text-yellow-800">
                    <p className="font-semibold mb-1">Security Notice:</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Ensure you send the correct amount in the specified currency</li>
                      <li>Save your transaction ID for reference</li>
                      <li>Do not share your personal information with third parties</li>
                      <li>Payment confirmation will be processed within 24 hours</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Payment Confirmation Required */}
          {currentStep === 5 && (
            <div className="space-y-6 text-center">
              <div className="mb-6">
                <div className="text-6xl mb-4">⏳</div>
                <h3 className="text-2xl font-bold text-orange-600 mb-2">Payment Confirmation Required</h3>
                <p className="text-gray-600">Your order is pending payment confirmation</p>
              </div>

              <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
                <div className="text-sm text-gray-600 space-y-1">
                  <div><strong>Order ID:</strong> {orderId}</div>
                  <div><strong>Name:</strong> {formData.firstName} {formData.lastName}</div>
                  <div><strong>Email:</strong> {formData.email}</div>
                  <div><strong>Amount to Pay:</strong> ${ticketInfo.cryptoPrice.toLocaleString()} USD</div>
                  <div><strong>Currency:</strong> {selectedCrypto.symbol} ({selectedCrypto.name})</div>
                  <div><strong>Wallet Address:</strong> {WALLET_ADDRESS}</div>
                  {transactionId && <div><strong>Transaction ID:</strong> {transactionId}</div>}
                </div>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <div className="flex items-center justify-center space-x-2 text-red-700 mb-4">
                  <Info className="h-6 w-6" />
                  <span className="font-bold text-lg">Important Notice</span>
                </div>
                <div className="text-red-800 space-y-2">
                  <p className="font-semibold">To download your tickets, you must:</p>
                  <ol className="list-decimal list-inside space-y-1 text-left">
                    <li>Complete the cryptocurrency payment to our wallet address</li>
                    <li>Send payment confirmation via WhatsApp</li>
                    <li>Wait for our team to verify the payment (usually within 24 hours)</li>
                    <li>Receive your official FIFA World Cup 2026 tickets via email</li>
                  </ol>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center justify-center space-x-2 text-blue-700">
                  <Phone className="h-5 w-5" />
                  <span className="font-semibold">Support: {WHATSAPP_NUMBER}</span>
                </div>
                <p className="text-blue-600 text-sm mt-2">
                  Contact us via WhatsApp for immediate assistance with your payment
                </p>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg"
              >
                Close
              </button>
            </div>
          )}

          {/* Navigation Buttons */}
          {currentStep < 5 && (
            <div className="flex justify-between mt-8 pt-6 border-t">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Previous
                </button>
              )}
              {currentStep < 4 ? (
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="ml-auto px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Next
                </button>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RegistrationForm;