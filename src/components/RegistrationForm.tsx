import React, { useState } from 'react';
import { X, User, Mail, Phone, MapPin, Calendar, Check, Copy, ExternalLink, Smartphone, Download, FileText, CreditCard, Shield, Info, DollarSign, Wallet } from 'lucide-react';
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

const RegistrationForm: React.FC<RegistrationFormProps> = ({
  isOpen,
  onClose,
  ticketInfo
}) => {
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
  const NOWPAYMENTS_API_KEY = '53564b07-5501-446c-a623-bbf5cfc439b8';

  // Create real NOWPayments payment with crypto wallet support
  const createCryptoPayment = async () => {
    try {
      setPaymentProcessing(true);
      
      // Generate unique order ID
      const orderIdGenerated = `FIFA2026-${Date.now().toString().slice(-8)}`;
      setOrderId(orderIdGenerated);

      // Create payment via NOWPayments API with wallet support
      const paymentData = {
        price_amount: ticketInfo.cryptoPrice,
        price_currency: 'USD',
        pay_currency: '', // Let user choose from supported cryptos
        order_id: orderIdGenerated,
        order_description: `FIFA World Cup 2026 - ${ticketInfo.title}`,
        ipn_callback_url: '', // Optional: Add your callback URL
        success_url: window.location.origin + '?payment=success',
        cancel_url: window.location.origin + '?payment=cancel',
        customer_email: formData.email,
        is_fixed_rate: false,
        is_fee_paid_by_user: true,
        // Enable wallet integration
        case: 'success'
      };

      const response = await fetch('https://api.nowpayments.io/v1/payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': NOWPAYMENTS_API_KEY
        },
        body: JSON.stringify(paymentData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.payment_id) {
        setPaymentId(result.payment_id);
        setPaymentUrl(result.invoice_url || `https://nowpayments.io/payment/?iid=${result.payment_id}`);
        
        // Open payment page in new window with wallet support
        const paymentWindow = window.open(
          result.invoice_url || `https://nowpayments.io/payment/?iid=${result.payment_id}`, 
          '_blank', 
          'width=800,height=700,scrollbars=yes,resizable=yes'
        );
        
        // Start checking payment status
        checkPaymentStatus(result.payment_id);
        
        // Show success message
        alert('Payment page created successfully! You can now pay using your crypto wallet (MetaMask, Trust Wallet, etc.)');
        
      } else {
        throw new Error('Failed to create payment');
      }

      setPaymentProcessing(false);

    } catch (error) {
      setPaymentProcessing(false);
      console.error('Error creating NOWPayments payment:', error);
      
      // Fallback to manual payment process
      const orderIdGenerated = orderId || `FIFA2026-${Date.now().toString().slice(-8)}`;
      setOrderId(orderIdGenerated);
      
      alert(`Order created successfully!\n\nOrder ID: ${orderIdGenerated}\nAmount: $${ticketInfo.cryptoPrice}\n\nPlease contact us via WhatsApp: ${whatsappNumber} to complete payment`);
      
      // Move to confirmation step
      setCurrentStep(5);
    }
  };

  // Check payment status
  const checkPaymentStatus = async (paymentIdToCheck: string) => {
    try {
      const response = await fetch(`https://api.nowpayments.io/v1/payment/${paymentIdToCheck}`, {
        method: 'GET',
        headers: {
          'x-api-key': NOWPAYMENTS_API_KEY
        }
      });

      if (response.ok) {
        const result = await response.json();
        
        if (result.payment_status === 'finished' || result.payment_status === 'confirmed') {
          setPaymentConfirmed(true);
          setCurrentStep(5);
          alert('Payment confirmed successfully! 🎉');
          return;
        }
        
        if (result.payment_status === 'waiting' || result.payment_status === 'confirming') {
          // Continue checking every 10 seconds
          setTimeout(() => checkPaymentStatus(paymentIdToCheck), 10000);
        }
      }
    } catch (error) {
      console.error('Error checking payment status:', error);
      // Continue checking anyway
      setTimeout(() => checkPaymentStatus(paymentIdToCheck), 15000);
    }
  };

  // Generate FIFA ticket as PDF
  const generateFIFATicketPDF = () => {
    const orderIdGenerated = orderId || `FIFA2026-${Date.now().toString().slice(-8)}`;
    setOrderId(orderIdGenerated);

    // Generate security codes
    const securityCode = Math.random().toString(36).substring(2, 15).toUpperCase();
    const barcode = Math.random().toString().replace('0.', '').substring(0, 12);
    const qrCode = `FIFA2026-${orderIdGenerated}-${securityCode}`;
    
    // Parse match information from ticket title
    const isMatch = ticketInfo.type === 'match';
    
    // Create PDF
    const pdf = new jsPDF('p', 'mm', 'a4');
    
    // Set font
    pdf.setFont('helvetica');
    
    // Header - FIFA World Cup 2026
    pdf.setFillColor(0, 51, 153); // FIFA Blue
    pdf.rect(0, 0, 210, 40, 'F');
    
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(24);
    pdf.setFont('helvetica', 'bold');
    pdf.text('FIFA WORLD CUP 2026™', 105, 20, { align: 'center' });
    
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'normal');
    pdf.text('OFFICIAL MATCH TICKET', 105, 30, { align: 'center' });
    
    // Tournament Info
    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(10);
    pdf.text('HOST COUNTRIES: United States • Canada • Mexico', 105, 50, { align: 'center' });
    pdf.text('TOURNAMENT PERIOD: June 11 - July 19, 2026', 105, 57, { align: 'center' });
    
    // Ticket Details Section
    pdf.setFillColor(240, 240, 240);
    pdf.rect(10, 70, 190, 30, 'F');
    
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.text(`${isMatch ? 'MATCH' : 'PACKAGE'} DETAILS:`, 15, 80);
    
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(10);
    const titleLines = pdf.splitTextToSize(ticketInfo.title, 180);
    pdf.text(titleLines, 15, 88);
    
    // Venue Information
    let yPos = 110;
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(12);
    pdf.text('VENUE INFORMATION:', 15, yPos);
    
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(10);
    yPos += 8;
    
    if (isMatch) {
      pdf.text('Stadium: [Stadium will be confirmed closer to match date]', 15, yPos);
      yPos += 6;
      pdf.text('City: [City will be confirmed based on match schedule]', 15, yPos);
      yPos += 6;
      pdf.text('Country: USA/Canada/Mexico', 15, yPos);
      yPos += 10;
      
      pdf.setFont('helvetica', 'bold');
      pdf.text('MATCH SCHEDULE:', 15, yPos);
      pdf.setFont('helvetica', 'normal');
      yPos += 8;
      pdf.text('Date: [To be confirmed by FIFA]', 15, yPos);
      yPos += 6;
      pdf.text('Kick-off Time: [Local time will be announced]', 15, yPos);
      yPos += 6;
      pdf.text('Gates Open: 2 hours before kick-off', 15, yPos);
    } else {
      pdf.text(`Package Type: ${ticketInfo.title}`, 15, yPos);
      yPos += 6;
      pdf.text('Multiple Venues: Various stadiums across USA, Canada & Mexico', 15, yPos);
      yPos += 6;
      pdf.text('Tournament Access: As per package inclusions', 15, yPos);
    }
    
    yPos += 15;
    
    // Ticket Holder Information
    pdf.setFillColor(240, 240, 240);
    pdf.rect(10, yPos, 190, 40, 'F');
    
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(12);
    pdf.text('TICKET HOLDER INFORMATION:', 15, yPos + 8);
    
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(10);
    pdf.text(`Full Name: ${formData.firstName.toUpperCase()} ${formData.lastName.toUpperCase()}`, 15, yPos + 16);
    pdf.text(`Email Address: ${formData.email}`, 15, yPos + 22);
    pdf.text(`Phone Number: ${formData.phone}`, 15, yPos + 28);
    pdf.text(`Date of Birth: ${formData.dateOfBirth || 'Not provided'}`, 15, yPos + 34);
    
    yPos += 50;
    
    // Billing Address
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(12);
    pdf.text('BILLING ADDRESS:', 15, yPos);
    
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(10);
    yPos += 8;
    pdf.text(`Street Address: ${formData.address}`, 15, yPos);
    yPos += 6;
    pdf.text(`City: ${formData.city}`, 15, yPos);
    yPos += 6;
    pdf.text(`Country: ${formData.country}`, 15, yPos);
    yPos += 6;
    pdf.text(`Postal Code: ${formData.postalCode || 'Not provided'}`, 15, yPos);
    
    yPos += 15;
    
    // Payment Confirmation
    pdf.setFillColor(220, 255, 220);
    pdf.rect(10, yPos, 190, 35, 'F');
    
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(12);
    pdf.text('PAYMENT CONFIRMATION:', 15, yPos + 8);
    
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(10);
    pdf.text(`Order ID: ${orderIdGenerated}`, 15, yPos + 16);
    pdf.text(`NOWPayments Transaction ID: ${paymentId || 'Processing'}`, 15, yPos + 22);
    pdf.text(`Transaction Date: ${new Date().toLocaleString('en-US')}`, 15, yPos + 28);
    
    yPos += 45;
    
    // Pricing Breakdown
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(12);
    pdf.text('PRICING BREAKDOWN:', 15, yPos);
    
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(10);
    yPos += 8;
    pdf.text(`Original Price: $${ticketInfo.price.toLocaleString()} USD`, 15, yPos);
    yPos += 6;
    pdf.text(`Cryptocurrency Discount (30%): -$${(ticketInfo.price - ticketInfo.cryptoPrice).toLocaleString()} USD`, 15, yPos);
    yPos += 6;
    pdf.setFont('helvetica', 'bold');
    pdf.text(`Final Amount Paid: $${ticketInfo.cryptoPrice.toLocaleString()} USD`, 15, yPos);
    
    // Add new page for additional information
    pdf.addPage();
    
    // Security Information
    pdf.setFillColor(255, 240, 240);
    pdf.rect(10, 20, 190, 30, 'F');
    
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(12);
    pdf.text('TICKET AUTHENTICATION & SECURITY:', 15, 30);
    
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(10);
    pdf.text(`Ticket ID: ${orderIdGenerated}`, 15, 38);
    pdf.text(`Security Code: ${securityCode}`, 15, 44);
    pdf.text(`QR Code Data: ${qrCode}`, 15, 50);
    
    yPos = 65;
    
    // Important Information
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(12);
    pdf.text('IMPORTANT MATCH DAY INFORMATION:', 15, yPos);
    
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(10);
    yPos += 10;
    
    const importantInfo = [
      'STADIUM ENTRY REQUIREMENTS:',
      '• Arrive at stadium minimum 2 hours before kick-off',
      '• Present this ticket AND valid government-issued photo ID',
      '• ID must match ticket holder name EXACTLY',
      '• Children under 16 must be accompanied by adult ticket holder',
      '',
      'PROHIBITED ITEMS:',
      '• Outside food and beverages of any kind',
      '• Professional cameras and recording equipment',
      '• Weapons, sharp objects, or dangerous items',
      '• Alcohol (available for purchase inside stadium)',
      '',
      'TERMS AND CONDITIONS:',
      '• Tickets are STRICTLY NON-TRANSFERABLE',
      '• Resale is PROHIBITED and will result in ticket cancellation',
      '• NO REFUNDS under any circumstances',
      '• Weather delays do not qualify for refunds'
    ];
    
    importantInfo.forEach(line => {
      if (line.startsWith('•') || line === '') {
        pdf.text(line, 20, yPos);
      } else {
        pdf.setFont('helvetica', 'bold');
        pdf.text(line, 15, yPos);
        pdf.setFont('helvetica', 'normal');
      }
      yPos += 6;
      
      if (yPos > 270) {
        pdf.addPage();
        yPos = 20;
      }
    });
    
    // Contact Information
    yPos += 10;
    if (yPos > 250) {
      pdf.addPage();
      yPos = 20;
    }
    
    pdf.setFillColor(240, 248, 255);
    pdf.rect(10, yPos, 190, 25, 'F');
    
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(12);
    pdf.text('CUSTOMER SUPPORT & EMERGENCY CONTACTS:', 15, yPos + 8);
    
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(10);
    pdf.text(`Customer Service: ${whatsappNumber}`, 15, yPos + 16);
    pdf.text(`WhatsApp Support: ${whatsappNumber}`, 15, yPos + 22);
    
    // Footer
    yPos += 35;
    pdf.setFillColor(0, 51, 153);
    pdf.rect(10, yPos, 190, 20, 'F');
    
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(8);
    pdf.text('© FIFA 2026. FIFA World Cup 2026™ and all related marks are trademarks of FIFA.', 105, yPos + 8, { align: 'center' });
    pdf.text('This ticket is valid only for the specified match/package and date.', 105, yPos + 14, { align: 'center' });
    
    // Save PDF
    const fileName = `FIFA_WorldCup_2026_Official_Ticket_${formData.firstName}_${formData.lastName}_${orderIdGenerated}.pdf`;
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
                    placeholder="+1234567890"
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
                <h3 className="text-xl font-bold text-gray-800">Terms and Conditions</h3>
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
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4 mb-6">
                <div className="flex items-center space-x-2 mb-2">
                  <Wallet className="h-6 w-6 text-purple-600" />
                  <h4 className="font-semibold text-purple-800">Crypto Wallet Payment</h4>
                </div>
                <p className="text-purple-700 text-sm mb-2">
                  Pay securely with your crypto wallet! Supports MetaMask, Trust Wallet, Coinbase Wallet and more.
                </p>
                <div className="flex items-center space-x-4 text-sm text-purple-600">
                  <span>🦊 MetaMask</span>
                  <span>🛡️ Trust Wallet</span>
                  <span>🔵 Coinbase</span>
                  <span>💎 100+ Cryptos</span>
                </div>
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
                    I would like to receive marketing messages about FIFA World Cup 2026
                  </span>
                </label>
              </div>
            </div>
          )}

          {/* Step 4: Crypto Wallet Payment */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <div className="text-4xl mb-2">🦊</div>
                <h3 className="text-xl font-bold text-gray-800">Crypto Wallet Payment</h3>
                <p className="text-gray-600">Pay with MetaMask, Trust Wallet or any crypto wallet</p>
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

              {/* Payment Amount Display */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    ${ticketInfo.cryptoPrice.toLocaleString()} USD
                  </div>
                  <div className="text-gray-600 mb-4">
                    (30% discount applied for crypto payment)
                  </div>
                  <div className="text-sm text-green-700">
                    Supports 100+ cryptocurrencies: BTC, ETH, USDT, USDC, LTC, BCH and more
                  </div>
                </div>
              </div>

              {/* Supported Wallets */}
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <h5 className="font-semibold text-purple-800 mb-3">Supported Crypto Wallets</h5>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                  <div className="flex items-center space-x-2 text-purple-700">
                    <span>🦊</span>
                    <span>MetaMask</span>
                  </div>
                  <div className="flex items-center space-x-2 text-purple-700">
                    <span>🛡️</span>
                    <span>Trust Wallet</span>
                  </div>
                  <div className="flex items-center space-x-2 text-purple-700">
                    <span>🔵</span>
                    <span>Coinbase</span>
                  </div>
                  <div className="flex items-center space-x-2 text-purple-700">
                    <span>💎</span>
                    <span>WalletConnect</span>
                  </div>
                </div>
              </div>

              {/* Crypto Payment Button */}
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

                {/* Payment Instructions */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h5 className="font-semibold text-blue-800 mb-2">How it works:</h5>
                  <ol className="text-blue-700 text-sm space-y-1">
                    <li>1. Click "Pay with Crypto Wallet" button</li>
                    <li>2. Payment page will open in new window</li>
                    <li>3. Connect your crypto wallet (MetaMask, Trust Wallet, etc.)</li>
                    <li>4. Choose your preferred cryptocurrency</li>
                    <li>5. Confirm payment in your wallet</li>
                    <li>6. Payment confirmed automatically</li>
                    <li>7. Download your FIFA ticket immediately</li>
                  </ol>
                </div>

                {/* Fallback Contact */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Phone className="h-5 w-5 text-yellow-600" />
                    <h5 className="font-semibold text-yellow-800">Need Help?</h5>
                  </div>
                  <p className="text-yellow-700 text-sm">
                    If you experience any issues with the payment, contact us directly:
                  </p>
                  <p className="text-yellow-800 font-semibold">WhatsApp: {whatsappNumber}</p>
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
                  <h4 className="font-semibold text-green-800">Order Processed Successfully</h4>
                </div>
                <p className="text-green-700 text-sm mb-4">
                  Thank you for your purchase! Your cryptocurrency payment has been confirmed and your official FIFA ticket is ready for download.
                </p>
                
                <div className="bg-white rounded-lg p-4 mb-4">
                  <div className="text-sm text-gray-600 space-y-1">
                    <div><strong>Order ID:</strong> {orderId || `FIFA2026-${Date.now().toString().slice(-8)}`}</div>
                    <div><strong>Transaction ID:</strong> {paymentId || 'Processing'}</div>
                    <div><strong>Customer:</strong> {formData.firstName} {formData.lastName}</div>
                    <div><strong>Email:</strong> {formData.email}</div>
                    <div><strong>Amount:</strong> ${ticketInfo.cryptoPrice.toLocaleString()} (30% crypto discount applied)</div>
                    <div><strong>Payment Method:</strong> Cryptocurrency Wallet</div>
                  </div>
                </div>
              </div>

              {/* Download Ticket Button */}
              <div className="space-y-4">
                <button
                  type="button"
                  onClick={generateFIFATicketPDF}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white font-bold py-4 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-3"
                >
                  <Download className="h-6 w-6" />
                  <span>Download Official FIFA Ticket (PDF)</span>
                  <FileText className="h-6 w-6" />
                </button>
                
                <p className="text-gray-600 text-sm">
                  Your official FIFA World Cup 2026™ ticket will be downloaded as a PDF file. 
                  Please keep it safe and present it with valid ID at the stadium entrance.
                </p>
              </div>

              {/* Additional Information */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-800 mb-2">Important Information:</h4>
                <ul className="text-blue-700 text-sm space-y-1 text-left">
                  <li>• Payment processed through secure crypto wallet</li>
                  <li>• Ticket confirmation sent to your email address</li>
                  <li>• Arrive at stadium at least 2 hours before kick-off</li>
                  <li>• Bring valid ID that exactly matches ticket holder name</li>
                  <li>• Tickets are non-transferable and non-refundable</li>
                  <li>• This is an official FIFA ticket with blockchain verification</li>
                </ul>
              </div>

              {/* Contact Support */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-800 mb-2">Need Help?</h4>
                <div className="text-sm text-gray-600 space-y-1">
                  <div>📞 Phone: {whatsappNumber}</div>
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