import React, { useState } from 'react';
import {
  X, User, Mail, Phone, MapPin, Calendar, Check, Copy,
  ExternalLink, Smartphone, Download, FileText,
  CreditCard, Shield, Info, DollarSign, Wallet
} from 'lucide-react';
import jsPDF from 'jspdf';

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

const RegistrationForm: React.FC<RegistrationFormProps> = ({ isOpen, onClose, ticketInfo }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState('');
  const [paymentId, setPaymentId] = useState('');
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

  const whatsappNumber = '+34632800363';
  
  // NOWPayments API Key
  const NOWPAYMENTS_API_KEY = 'W86THVT-1PCM8V2-MGDQTN0-B3WPJA2';
  
  // Webhook URL for payment notifications
  const WEBHOOK_URL = 'https://www.tixcup.com/api/nowpayments-webhook';

  // Create crypto payment via NOWPayments API
  const createCryptoPayment = async () => {
    try {
      setPaymentProcessing(true);
      const orderIdGenerated = `FIFA2026-${Date.now().toString().slice(-8)}`;
      setOrderId(orderIdGenerated);

      const paymentData = {
        price_amount: ticketInfo.cryptoPrice,
        price_currency: 'USD',
        pay_currency: '', // user selects crypto
        order_id: orderIdGenerated,
        order_description: `FIFA World Cup 2026 - ${ticketInfo.title}`,
        success_url: window.location.origin + '?payment=success',
        cancel_url: window.location.origin + '?payment=cancel',
        ipn_callback_url: WEBHOOK_URL, // Added webhook URL
        customer_email: formData.email,
        is_fixed_rate: false,
        is_fee_paid_by_user: true
      };

      console.log('Creating payment with data:', paymentData);

      const response = await fetch('https://api.nowpayments.io/v1/payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': NOWPAYMENTS_API_KEY
        },
        body: JSON.stringify(paymentData)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const result = await response.json();
      console.log('Payment created successfully:', result);

      if (result.payment_id) {
        setPaymentId(result.payment_id);
        const invoiceUrl = result.invoice_url || `https://nowpayments.io/payment/?iid=${result.payment_id}`;
        setPaymentUrl(invoiceUrl);

        const paymentWindow = window.open(
          invoiceUrl,
          '_blank',
          'width=800,height=700,scrollbars=yes,resizable=yes'
        );

        if (paymentWindow) {
          checkPaymentStatus(result.payment_id);
          alert('Payment page created successfully! Please complete the payment.');
        } else {
          alert('Pop-up blocked. Please allow pop-ups and try again.');
        }
      } else {
        throw new Error('No payment_id returned');
      }

    } catch (error) {
      console.error('Error creating payment:', error);
      alert(
        `Error creating payment page.\n\n` +
        `Order ID: ${orderId}\n` +
        `Amount: $${ticketInfo.cryptoPrice}\n\n` +
        `Please contact us via WhatsApp: ${whatsappNumber}\n` +
        `or send an email with your order ID.`
      );
      setCurrentStep(5);
    } finally {
      setPaymentProcessing(false);
    }
  };

  // Check payment status
  const checkPaymentStatus = async (paymentIdToCheck: string) => {
    try {
      console.log('Checking payment status for:', paymentIdToCheck);
      
      const response = await fetch(`https://api.nowpayments.io/v1/payment/${paymentIdToCheck}`, {
        method: 'GET',
        headers: {
          'x-api-key': NOWPAYMENTS_API_KEY
        }
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Payment status:', result.payment_status);

        // Payment completed
        if (['finished', 'confirmed'].includes(result.payment_status)) {
          setPaymentConfirmed(true);
          setCurrentStep(5);
          alert('Payment confirmed successfully!');
          return;
        }

        // Payment pending
        if (['waiting', 'confirming', 'sending'].includes(result.payment_status)) {
          console.log('Payment still processing, checking again in 10 seconds...');
          setTimeout(() => checkPaymentStatus(paymentIdToCheck), 10000);
        }

        // Payment failed or expired
        if (['failed', 'expired'].includes(result.payment_status)) {
          alert('Payment failed or expired. Please try again.');
        }
      } else {
        console.error('Error checking payment status:', response.status);
        // Retry after 15 seconds on error
        setTimeout(() => checkPaymentStatus(paymentIdToCheck), 15000);
      }
    } catch (error) {
      console.error('Error checking payment status:', error);
      // Retry after 15 seconds
      setTimeout(() => checkPaymentStatus(paymentIdToCheck), 15000);
    }
  };

  // Generate FIFA ticket PDF
  const generateFIFATicketPDF = () => {
    const orderIdGenerated = orderId || `FIFA2026-${Date.now().toString().slice(-8)}`;
    const securityCode = Math.random().toString(36).substring(2, 15).toUpperCase();
    const qrCode = `FIFA2026-${orderIdGenerated}-${securityCode}`;

    const pdf = new jsPDF('p', 'mm', 'a4');
    
    // Font setup
    pdf.setFont('helvetica');

    // First page - Ticket information
    // FIFA header
    pdf.setFillColor(0, 51, 153); // FIFA blue
    pdf.rect(0, 0, 210, 30, 'F');
    
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(24);
    pdf.text('FIFA WORLD CUP 2026™', 105, 15, { align: 'center' });
    pdf.setFontSize(12);
    pdf.text('OFFICIAL TICKET', 105, 22, { align: 'center' });

    // Ticket information
    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(16);
    pdf.text('TICKET INFORMATION', 20, 45);
    
    pdf.setFontSize(11);
    let yPos = 55;
    
    pdf.text(`Order ID: ${orderIdGenerated}`, 20, yPos);
    yPos += 8;
    pdf.text(`Event: ${ticketInfo.title}`, 20, yPos);
    yPos += 8;
    pdf.text(`Type: ${ticketInfo.type === 'match' ? 'Single Match' : 'Package'}`, 20, yPos);
    yPos += 8;
    pdf.text(`Amount Paid: $${ticketInfo.cryptoPrice} USD`, 20, yPos);
    yPos += 8;
    pdf.text(`Payment Method: Cryptocurrency`, 20, yPos);
    yPos += 8;
    pdf.text(`Transaction ID: ${paymentId || 'Processing'}`, 20, yPos);
    yPos += 15;

    // Ticket holder information
    pdf.setFontSize(16);
    pdf.text('TICKET HOLDER INFORMATION', 20, yPos);
    yPos += 10;
    
    pdf.setFontSize(11);
    pdf.text(`Name: ${formData.firstName} ${formData.lastName}`, 20, yPos);
    yPos += 8;
    pdf.text(`Email: ${formData.email}`, 20, yPos);
    yPos += 8;
    pdf.text(`Phone: ${formData.phone}`, 20, yPos);
    yPos += 8;
    if (formData.nationality) {
      pdf.text(`Nationality: ${formData.nationality}`, 20, yPos);
      yPos += 8;
    }
    if (formData.dateOfBirth) {
      pdf.text(`Date of Birth: ${formData.dateOfBirth}`, 20, yPos);
      yPos += 8;
    }
    yPos += 10;

    // Billing address
    pdf.setFontSize(16);
    pdf.text('BILLING ADDRESS', 20, yPos);
    yPos += 10;
    
    pdf.setFontSize(11);
    pdf.text(`Address: ${formData.address}`, 20, yPos);
    yPos += 8;
    pdf.text(`City: ${formData.city}`, 20, yPos);
    yPos += 8;
    pdf.text(`Country: ${formData.country}`, 20, yPos);
    yPos += 8;
    if (formData.postalCode) {
      pdf.text(`Postal Code: ${formData.postalCode}`, 20, yPos);
      yPos += 8;
    }
    yPos += 15;

    // Security information
    pdf.setFillColor(255, 255, 0); // Yellow
    pdf.rect(15, yPos - 5, 180, 25, 'F');
    
    pdf.setFontSize(14);
    pdf.text('SECURITY INFORMATION', 20, yPos + 5);
    pdf.setFontSize(10);
    pdf.text(`Security Code: ${securityCode}`, 20, yPos + 12);
    pdf.text(`QR Code: ${qrCode}`, 20, yPos + 18);
    yPos += 35;

    // Issue date
    pdf.setFontSize(10);
    pdf.text(`Issue Date: ${new Date().toLocaleDateString()}`, 20, yPos);
    pdf.text(`Issue Time: ${new Date().toLocaleTimeString()}`, 120, yPos);

    // Second page - Terms and conditions
    pdf.addPage();
    
    // Second page header
    pdf.setFillColor(0, 51, 153);
    pdf.rect(0, 0, 210, 25, 'F');
    
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(18);
    pdf.text('TERMS & CONDITIONS', 105, 15, { align: 'center' });

    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(12);
    yPos = 35;

    const terms = [
      'IMPORTANT INFORMATION:',
      '',
      '• This ticket is non-transferable and non-refundable',
      '• Valid photo ID required for entry',
      '• Arrive at venue 2 hours before kick-off',
      '• Security screening mandatory for all attendees',
      '• No outside food or beverages allowed',
      '• Professional cameras and recording devices prohibited',
      '• Ticket holder assumes all risks',
      '',
      'PROHIBITED ITEMS:',
      '• Weapons of any kind',
      '• Illegal substances',
      '• Large bags (over 35cm x 25cm x 16cm)',
      '• Glass containers',
      '• Professional photography equipment',
      '• Laser pointers',
      '• Political banners or flags',
      '',
      'CONTACT INFORMATION:',
      `• WhatsApp Support: ${whatsappNumber}`,
      '• Email: tickets@worldcup2026.com',
      '• Website: www.fifa.com/worldcup2026',
      '',
      'This ticket is issued subject to FIFA regulations and local laws.',
      'Unauthorized reproduction is strictly prohibited.',
      '',
      '© FIFA World Cup 2026™ - All Rights Reserved'
    ];

    terms.forEach(term => {
      if (yPos > 270) {
        pdf.addPage();
        yPos = 20;
      }
      
      if (term.startsWith('•')) {
        pdf.setFontSize(10);
      } else if (term.includes(':')) {
        pdf.setFontSize(11);
        pdf.setFont('helvetica', 'bold');
      } else {
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
      }
      
      pdf.text(term, 20, yPos);
      yPos += 6;
    });

    // Save file
    const fileName = `FIFA_WorldCup_2026_Ticket_${formData.firstName}_${formData.lastName}_${orderIdGenerated}.pdf`;
    pdf.save(fileName);
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
              {currentStep === 5 ? '🎉 Payment Confirmed!' : 'Complete Registration'}
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
                {currentStep === 4 && 'Crypto Payment'}
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

          {/* Step 4: Crypto Wallet Payment */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <div className="text-4xl mb-2">💎</div>
                <h3 className="text-xl font-bold text-gray-800">Crypto Wallet Payment</h3>
                <p className="text-gray-600">Pay using MetaMask, Trust Wallet, or any crypto wallet</p>
              </div>

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

              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    ${ticketInfo.cryptoPrice.toLocaleString()} USD
                  </div>
                  <div className="text-gray-600 mb-4">
                    (30% crypto payment discount applied)
                  </div>
                  <div className="text-sm text-green-700">
                    Supports 100+ cryptocurrencies: BTC, ETH, USDT, USDC, LTC, BCH and more
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <button
                  onClick={createCryptoPayment}
                  disabled={paymentProcessing}
                  className={`w-full font-bold py-4 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-3 ${
                    paymentProcessing 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white'
                  }`}
                >
                  {paymentProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                      <span>Creating payment page...</span>
                    </>
                  ) : (
                    <>
                      <Wallet className="h-6 w-6" />
                      <span>Pay with Crypto Wallet - ${ticketInfo.cryptoPrice.toLocaleString()}</span>
                    </>
                  )}
                </button>

                {/* Additional information */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-start space-x-2">
                    <Info className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <div className="text-sm text-yellow-800">
                      <p className="font-semibold mb-1">Important Information:</p>
                      <ul className="list-disc list-inside space-y-1">
                        <li>A new payment page will open in a separate window</li>
                        <li>Choose your preferred cryptocurrency</li>
                        <li>Complete payment using your wallet</li>
                        <li>Payment confirmation is automatic via webhook</li>
                      </ul>
                    </div>
                  </div>
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

              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <div className="text-sm text-gray-600 space-y-1">
                  <div><strong>Order ID:</strong> {orderId}</div>
                  <div><strong>Transaction ID:</strong> {paymentId || 'Processing'}</div>
                  <div><strong>Name:</strong> {formData.firstName} {formData.lastName}</div>
                  <div><strong>Email:</strong> {formData.email}</div>
                  <div><strong>Amount Paid:</strong> ${ticketInfo.cryptoPrice.toLocaleString()} USD</div>
                </div>
              </div>

              <button
                type="button"
                onClick={generateFIFATicketPDF}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white font-bold py-4 px-6 rounded-lg transition-all duration-300 flex items-center justify-center space-x-3"
              >
                <Download className="h-6 w-6" />
                <span>Download Official FIFA Ticket (PDF)</span>
                <FileText className="h-6 w-6" />
              </button>

              <p className="text-gray-600 text-sm">
                Your official ticket will be downloaded as a PDF file. Please save it and bring it with valid ID on match day.
              </p>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center justify-center space-x-2 text-blue-700">
                  <Phone className="h-5 w-5" />
                  <span className="font-semibold">Support: {whatsappNumber}</span>
                </div>
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
              ) : (
                <div className="ml-auto">
                  <p className="text-sm text-gray-600">Click the crypto wallet button to complete your purchase</p>
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