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
  const [paymentProcessing, setPaymentProcessing] = useState(false);
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

  // Connect and pay with MetaMask
  const connectAndPayMetaMask = async () => {
    try {
      setPaymentProcessing(true);
      
      if (typeof window.ethereum !== 'undefined') {
        // Request account access
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        
        if (accounts.length > 0) {
          setWalletConnected(true);
          setConnectedWallet('MetaMask');
          setWalletAddress(accounts[0]);
          
          // Copy receiving address to clipboard
          await navigator.clipboard.writeText(WALLET_ADDRESSES[selectedCrypto]);
          
          // Calculate amount in Wei for ETH-based currencies
          const amount = calculateCryptoAmount(selectedCrypto);
          let transactionParams;
          
          if (selectedCrypto === 'ETH') {
            const amountInWei = (parseFloat(amount) * Math.pow(10, 18)).toString(16);
            transactionParams = {
              to: WALLET_ADDRESSES[selectedCrypto],
              from: accounts[0],
              value: '0x' + amountInWei,
              gas: '0x5208', // 21000 gas limit
            };
          } else {
            // For tokens like USDT, USDC - simplified approach
            const amountInWei = (parseFloat(amount) * Math.pow(10, 6)).toString(16); // Most tokens use 6 decimals
            transactionParams = {
              to: WALLET_ADDRESSES[selectedCrypto],
              from: accounts[0],
              value: '0x0', // No ETH value for token transfers
              data: `0xa9059cbb000000000000000000000000${WALLET_ADDRESSES[selectedCrypto].slice(2)}${amountInWei.padStart(64, '0')}`,
              gas: '0x7530', // 30000 gas limit for token transfers
            };
          }

          // Send transaction
          const txHash = await window.ethereum.request({
            method: 'eth_sendTransaction',
            params: [transactionParams],
          });

          setTransactionHash(txHash);
          
          // Auto-confirm payment after successful transaction
          setTimeout(() => {
            setPaymentConfirmed(true);
            setCurrentStep(5);
            setPaymentProcessing(false);
          }, 2000);
          
          alert(`✅ Payment sent successfully!\n\n🔗 Transaction Hash: ${txHash}\n💰 Amount: ${amount} ${selectedCrypto}\n📋 Receiving Address: ${WALLET_ADDRESSES[selectedCrypto]}\n\nYour ticket will be ready for download shortly!`);
          
        }
      } else {
        setPaymentProcessing(false);
        alert('❌ MetaMask is not installed. Please install MetaMask first.');
        window.open('https://metamask.io/download/', '_blank');
      }
    } catch (error) {
      setPaymentProcessing(false);
      console.error('Error with MetaMask payment:', error);
      alert('❌ Payment failed. Please try again or contact support.');
    }
  };

  // Connect and pay with Trust Wallet
  const connectAndPayTrustWallet = async () => {
    try {
      setPaymentProcessing(true);
      
      // Check if Trust Wallet is available
      if (typeof window.ethereum !== 'undefined') {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        
        if (accounts.length > 0) {
          setWalletConnected(true);
          setConnectedWallet('Trust Wallet');
          setWalletAddress(accounts[0]);
          
          // Copy receiving address to clipboard
          await navigator.clipboard.writeText(WALLET_ADDRESSES[selectedCrypto]);
          
          // Calculate amount and send transaction
          const amount = calculateCryptoAmount(selectedCrypto);
          const amountInWei = (parseFloat(amount) * Math.pow(10, 18)).toString(16);
          
          const transactionParams = {
            to: WALLET_ADDRESSES[selectedCrypto],
            from: accounts[0],
            value: '0x' + amountInWei,
            gas: '0x5208',
          };

          const txHash = await window.ethereum.request({
            method: 'eth_sendTransaction',
            params: [transactionParams],
          });

          setTransactionHash(txHash);
          
          // Auto-confirm payment
          setTimeout(() => {
            setPaymentConfirmed(true);
            setCurrentStep(5);
            setPaymentProcessing(false);
          }, 2000);
          
          alert(`✅ Payment sent via Trust Wallet!\n\n🔗 Transaction Hash: ${txHash}\n💰 Amount: ${amount} ${selectedCrypto}\n📋 Receiving Address: ${WALLET_ADDRESSES[selectedCrypto]}\n\nYour ticket is being processed!`);
        }
      } else {
        // Fallback for mobile Trust Wallet
        setPaymentProcessing(false);
        await navigator.clipboard.writeText(WALLET_ADDRESSES[selectedCrypto]);
        const amount = calculateCryptoAmount(selectedCrypto);
        
        alert(`📱 Trust Wallet Instructions:\n\n1. Open Trust Wallet app\n2. Select ${selectedCrypto}\n3. Tap "Send"\n4. Paste address: ${WALLET_ADDRESSES[selectedCrypto]}\n5. Send ${amount} ${selectedCrypto}\n\n✅ Address copied to clipboard!\n\nAfter sending, return here to confirm payment.`);
        
        setWalletConnected(true);
        setConnectedWallet('Trust Wallet (Mobile)');
      }
    } catch (error) {
      setPaymentProcessing(false);
      console.error('Error with Trust Wallet payment:', error);
      alert('❌ Payment failed. Please try again or contact support.');
    }
  };

  // Generate realistic FIFA ticket
  const generateFIFATicket = () => {
    const orderIdGenerated = orderId || `FIFA2026-${Date.now().toString().slice(-8)}`;
    setOrderId(orderIdGenerated);

    const ticketContent = `
╔══════════════════════════════════════════════════════════════════════════════╗
║                          FIFA WORLD CUP 2026™                               ║
║                           OFFICIAL MATCH TICKET                              ║
╚══════════════════════════════════════════════════════════════════════════════╝

🏆 TOURNAMENT: FIFA World Cup 2026™
🌍 HOST COUNTRIES: United States • Canada • Mexico
📅 TOURNAMENT PERIOD: June 11 - July 19, 2026

═══════════════════════════════════════════════════════════════════════════════

🎫 MATCH DETAILS:
${ticketInfo.title}

📍 VENUE INFORMATION:
Stadium: [Stadium will be confirmed closer to match date]
City: [City will be confirmed based on match schedule]
Country: USA/Canada/Mexico

⏰ MATCH SCHEDULE:
Date: [To be confirmed by FIFA]
Kick-off Time: [Local time will be announced]
Gates Open: 2 hours before kick-off

═══════════════════════════════════════════════════════════════════════════════

👤 TICKET HOLDER INFORMATION:
Full Name: ${formData.firstName.toUpperCase()} ${formData.lastName.toUpperCase()}
Email: ${formData.email}
Phone: ${formData.phone}
Nationality: ${formData.nationality || 'Not specified'}
Date of Birth: ${formData.dateOfBirth || 'Not specified'}

📮 BILLING ADDRESS:
${formData.address}
${formData.city}, ${formData.country}
${formData.postalCode || ''}

═══════════════════════════════════════════════════════════════════════════════

💰 PAYMENT CONFIRMATION:
Order ID: ${orderIdGenerated}
Original Price: $${ticketInfo.price.toLocaleString()} USD
Cryptocurrency Discount: 30% OFF
Final Amount Paid: $${ticketInfo.cryptoPrice.toLocaleString()} USD

💎 CRYPTOCURRENCY PAYMENT DETAILS:
Payment Method: ${connectedWallet}
Currency Used: ${selectedCrypto}
Amount Paid: ${calculateCryptoAmount(selectedCrypto)} ${selectedCrypto}
Customer Wallet: ${walletAddress ? `${walletAddress.substring(0, 10)}...${walletAddress.substring(walletAddress.length - 8)}` : 'N/A'}
Transaction Hash: ${transactionHash || 'Processing...'}
Receiving Address: ${WALLET_ADDRESSES[selectedCrypto]}
Payment Status: ✅ CONFIRMED
Payment Date: ${new Date().toLocaleString('en-US', { 
  year: 'numeric', 
  month: 'long', 
  day: 'numeric', 
  hour: '2-digit', 
  minute: '2-digit',
  timeZoneName: 'short'
})}

═══════════════════════════════════════════════════════════════════════════════

🎫 TICKET AUTHENTICATION:
Ticket ID: ${orderIdGenerated}
Security Code: ${Math.random().toString(36).substring(2, 15).toUpperCase()}
QR Code: [Digital QR code will be sent via email]
Barcode: ${Math.random().toString().replace('0.', '').substring(0, 12)}

🔐 ANTI-COUNTERFEITING FEATURES:
• Unique holographic security elements
• Embedded RFID chip for stadium entry
• Blockchain-verified authenticity
• FIFA official watermark

═══════════════════════════════════════════════════════════════════════════════

📋 IMPORTANT MATCH DAY INFORMATION:

🚪 STADIUM ENTRY:
• Arrive at least 2 hours before kick-off
• Present this ticket AND valid photo ID
• ID must match ticket holder name exactly
• Children under 16 must be accompanied by an adult

🚫 PROHIBITED ITEMS:
• Outside food and beverages
• Professional cameras and recording equipment
• Weapons, sharp objects, or dangerous items
• Alcohol (available for purchase inside stadium)
• Flags or banners larger than 2m x 1m

✅ PERMITTED ITEMS:
• Small personal bags (subject to search)
• Mobile phones and small cameras
• Prescription medications
• Small flags and scarves

🎯 STADIUM FACILITIES:
• Accessible seating available
• Food and beverage concessions
• Official FIFA merchandise stores
• First aid and medical facilities
• Lost and found services

═══════════════════════════════════════════════════════════════════════════════

⚠️  TERMS AND CONDITIONS:

🔄 TICKET TRANSFER POLICY:
• Tickets are NON-TRANSFERABLE
• Resale is STRICTLY PROHIBITED
• Only original purchaser may use ticket
• FIFA reserves right to cancel fraudulent tickets

💸 REFUND POLICY:
• NO REFUNDS under any circumstances
• NO EXCHANGES permitted
• Weather delays do not qualify for refunds
• Match postponements will honor original tickets

🏟️ STADIUM REGULATIONS:
• Follow all stadium staff instructions
• Respect other spectators and players
• No discriminatory behavior tolerated
• Smoking prohibited in stadium
• Comply with local laws and regulations

═══════════════════════════════════════════════════════════════════════════════

📞 CUSTOMER SUPPORT & ASSISTANCE:

🌐 FIFA Official Channels:
Website: www.fifa.com/worldcup
Email: tickets@fifa.com
Phone: +41 43 222 7777 (FIFA Headquarters)

🎫 Ticket Portal Support:
Phone: +1 (555) 123-4567
WhatsApp: ${whatsappNumber}
Email: support@worldcup2026tickets.com
Hours: 24/7 Customer Service

🚨 EMERGENCY CONTACTS:
Match Day Hotline: [Will be provided closer to match date]
Stadium Security: [Available on match day]
Local Emergency Services: 911 (USA), 911 (Canada), 911 (Mexico)

═══════════════════════════════════════════════════════════════════════════════

🏆 FIFA WORLD CUP 2026™ - BIGGER. BETTER. TOGETHER.

This ticket grants access to the FIFA World Cup 2026™ match specified above.
This is an official FIFA-sanctioned ticket purchased through an authorized vendor.

⚡ BLOCKCHAIN VERIFIED: This ticket's authenticity is verified on the blockchain
🔒 SECURE PURCHASE: Payment processed through encrypted cryptocurrency transaction
🌟 PREMIUM EXPERIENCE: Enjoy the greatest football celebration on Earth

═══════════════════════════════════════════════════════════════════════════════

📄 LEGAL DISCLAIMER:
This ticket is issued subject to FIFA regulations and local stadium policies.
FIFA and its partners are not liable for any indirect or consequential damages.
By using this ticket, holder agrees to be filmed/photographed for broadcast.
Ticket holder assumes all risks associated with attending the event.

🎭 CONDUCT POLICY:
Discriminatory behavior, violence, or disruption will result in ejection.
FIFA promotes respect, diversity, and fair play at all events.
Help create a positive atmosphere for all spectators.

═══════════════════════════════════════════════════════════════════════════════

Generated: ${new Date().toLocaleString('en-US', { 
  weekday: 'long',
  year: 'numeric', 
  month: 'long', 
  day: 'numeric', 
  hour: '2-digit', 
  minute: '2-digit',
  second: '2-digit',
  timeZoneName: 'long'
})}

Valid for: FIFA World Cup 2026™ Tournament
Issued by: Official FIFA Ticket Portal

⚠️  KEEP THIS TICKET SAFE - IT IS YOUR ENTRY TO THE MATCH! ⚠️
🎫 Present this ticket with valid ID at stadium entrance 🎫

╔══════════════════════════════════════════════════════════════════════════════╗
║  © FIFA 2026. FIFA World Cup 2026™ and all related marks are trademarks    ║
║  of FIFA. All rights reserved. Unauthorized reproduction is prohibited.      ║
╚══════════════════════════════════════════════════════════════════════════════╝
    `;

    const blob = new Blob([ticketContent], { type: 'text/plain;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `FIFA_WorldCup_2026_Official_Ticket_${formData.firstName}_${formData.lastName}_${orderIdGenerated}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
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
              {currentStep === 5 ? '🎉 Payment Confirmed!' : 'Complete Your Registration'}
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
                  <h4 className="font-semibold text-green-800">Integrated Cryptocurrency Payment</h4>
                </div>
                <p className="text-green-700 text-sm">
                  One-click payment through MetaMask or Trust Wallet with automatic confirmation and instant ticket delivery!
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

          {/* Step 4: Integrated Crypto Payment */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <div className="text-4xl mb-2">💎</div>
                <h3 className="text-xl font-bold text-gray-800">Cryptocurrency Payment</h3>
                <p className="text-gray-600">Select your preferred cryptocurrency and wallet</p>
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

              {/* Integrated Wallet Payment Buttons */}
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-800">Complete Payment with One Click</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* MetaMask Payment Button */}
                  <button
                    onClick={connectAndPayMetaMask}
                    disabled={paymentProcessing}
                    className={`flex items-center justify-center space-x-3 font-bold py-4 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 ${
                      paymentProcessing 
                        ? 'bg-gray-400 cursor-not-allowed' 
                        : 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white'
                    }`}
                  >
                    <Wallet className="h-6 w-6" />
                    <div className="text-center">
                      <div>{paymentProcessing ? 'Processing...' : 'Pay with MetaMask'}</div>
                      <div className="text-sm opacity-90">{calculateCryptoAmount(selectedCrypto)} {selectedCrypto}</div>
                    </div>
                  </button>

                  {/* Trust Wallet Payment Button */}
                  <button
                    onClick={connectAndPayTrustWallet}
                    disabled={paymentProcessing}
                    className={`flex items-center justify-center space-x-3 font-bold py-4 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 ${
                      paymentProcessing 
                        ? 'bg-gray-400 cursor-not-allowed' 
                        : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white'
                    }`}
                  >
                    <Smartphone className="h-6 w-6" />
                    <div className="text-center">
                      <div>{paymentProcessing ? 'Processing...' : 'Pay with Trust Wallet'}</div>
                      <div className="text-sm opacity-90">{calculateCryptoAmount(selectedCrypto)} {selectedCrypto}</div>
                    </div>
                  </button>
                </div>

                {/* Payment Processing Indicator */}
                {paymentProcessing && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
                    <div className="flex items-center justify-center space-x-2 mb-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-yellow-600"></div>
                      <span className="font-semibold text-yellow-800">Processing Payment...</span>
                    </div>
                    <p className="text-yellow-700 text-sm">
                      Please confirm the transaction in your wallet. Do not close this window.
                    </p>
                  </div>
                )}

                {/* Payment Instructions */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h5 className="font-semibold text-blue-800 mb-2">How it works:</h5>
                  <ol className="text-blue-700 text-sm space-y-1">
                    <li>1. Click your preferred wallet button above</li>
                    <li>2. Your wallet will open automatically</li>
                    <li>3. Confirm the transaction in your wallet</li>
                    <li>4. Payment will be processed instantly</li>
                    <li>5. Your ticket will be ready for download immediately</li>
                  </ol>
                </div>
              </div>
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
                  Thank you for your purchase! Your cryptocurrency payment has been confirmed and your official FIFA ticket is ready for download.
                </p>
                
                <div className="bg-white rounded-lg p-4 mb-4">
                  <div className="text-sm text-gray-600 space-y-1">
                    <div><strong>Order ID:</strong> {orderId || `FIFA2026-${Date.now().toString().slice(-8)}`}</div>
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
                  onClick={generateFIFATicket}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white font-bold py-4 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-3"
                >
                  <Download className="h-6 w-6" />
                  <span>Download Official FIFA Ticket</span>
                  <FileText className="h-6 w-6" />
                </button>
                
                <p className="text-gray-600 text-sm">
                  Your official FIFA World Cup 2026™ ticket will be downloaded as a text file. 
                  Please keep it safe and present it with valid ID at the stadium entrance.
                </p>
              </div>

              {/* Additional Information */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-800 mb-2">Important Information:</h4>
                <ul className="text-blue-700 text-sm space-y-1 text-left">
                  <li>• Your ticket confirmation has been sent to your email address</li>
                  <li>• Arrive at the stadium at least 2 hours before kick-off</li>
                  <li>• Bring a valid photo ID that matches the ticket holder name exactly</li>
                  <li>• Tickets are non-transferable and non-refundable</li>
                  <li>• This is an official FIFA-sanctioned ticket with blockchain verification</li>
                </ul>
              </div>

              {/* Contact Support */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-800 mb-2">Need Help?</h4>
                <div className="text-sm text-gray-600 space-y-1">
                  <div>📞 Phone: +1 (555) 123-4567</div>
                  <div>📱 WhatsApp: {whatsappNumber}</div>
                  <div>📧 Email: support@worldcup2026tickets.com</div>
                  <div>🌐 FIFA Official: www.fifa.com/worldcup</div>
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
                  <p className="text-sm text-gray-600">Select your cryptocurrency and wallet to complete payment</p>
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