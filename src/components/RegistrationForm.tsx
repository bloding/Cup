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

  // Create NOWPayments payment
  const createNOWPayment = async () => {
    try {
      setPaymentProcessing(true);
      
      // Generate order ID
      const orderIdGenerated = `FIFA2026-${Date.now().toString().slice(-8)}`;
      setOrderId(orderIdGenerated);

      // Simulate NOWPayments API call
      // In production, this would be a real API call to NOWPayments
      const paymentData = {
        price_amount: ticketInfo.cryptoPrice,
        price_currency: 'USD',
        pay_currency: '', // Let user choose
        order_id: orderIdGenerated,
        order_description: ticketInfo.title,
        success_url: window.location.origin + '/payment-success',
        cancel_url: window.location.origin + '/payment-cancel',
        customer_email: formData.email,
      };

      // Simulate API response
      setTimeout(() => {
        // In production, this would be the actual payment URL from NOWPayments
        const mockPaymentUrl = `https://nowpayments.io/payment/?iid=${orderIdGenerated}&amount=${ticketInfo.cryptoPrice}&currency=USD`;
        setPaymentUrl(mockPaymentUrl);
        setPaymentProcessing(false);
        
        // Open payment in new window
        window.open(mockPaymentUrl, '_blank', 'width=800,height=600');
        
        // Simulate payment confirmation after 10 seconds
        setTimeout(() => {
          setPaymentConfirmed(true);
          setCurrentStep(5);
        }, 10000);
        
      }, 2000);

    } catch (error) {
      setPaymentProcessing(false);
      console.error('Error creating payment:', error);
      alert('❌ خطأ في إنشاء الدفعة. يرجى المحاولة مرة أخرى أو الاتصال بالدعم.');
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
Payment Method: NOWPayments Gateway
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
          alert('يرجى إدخال الاسم الأول');
          return false;
        }
        if (!formData.lastName.trim()) {
          alert('يرجى إدخال اسم العائلة');
          return false;
        }
        if (!formData.email.trim()) {
          alert('يرجى إدخال عنوان البريد الإلكتروني');
          return false;
        }
        if (!formData.confirmEmail.trim()) {
          alert('يرجى تأكيد عنوان البريد الإلكتروني');
          return false;
        }
        if (formData.email !== formData.confirmEmail) {
          alert('عناوين البريد الإلكتروني غير متطابقة');
          return false;
        }
        if (!formData.phone.trim()) {
          alert('يرجى إدخال رقم الهاتف');
          return false;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
          alert('يرجى إدخال عنوان بريد إلكتروني صحيح');
          return false;
        }
        return true;
      
      case 2:
        if (!formData.address.trim()) {
          alert('يرجى إدخال عنوان الشارع');
          return false;
        }
        if (!formData.city.trim()) {
          alert('يرجى إدخال المدينة');
          return false;
        }
        if (!formData.country.trim()) {
          alert('يرجى اختيار البلد');
          return false;
        }
        return true;
      
      case 3:
        if (!formData.agreeTerms) {
          alert('يرجى الموافقة على الشروط والأحكام للمتابعة');
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
              {currentStep === 5 ? '🎉 تم تأكيد الدفع!' : 'أكمل التسجيل'}
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
              <span className="text-sm font-medium text-gray-600">الخطوة {currentStep} من 4</span>
              <span className="text-sm text-gray-500">
                {currentStep === 1 && 'المعلومات الشخصية'}
                {currentStep === 2 && 'تفاصيل العنوان'}
                {currentStep === 3 && 'الشروط والأحكام'}
                {currentStep === 4 && 'الدفع بالعملة المشفرة'}
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
                <h3 className="text-xl font-bold text-gray-800">المعلومات الشخصية</h3>
                <p className="text-gray-600">يرجى تقديم بياناتك الشخصية</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    الاسم الأول *
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="أدخل اسمك الأول"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    اسم العائلة *
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="أدخل اسم العائلة"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  عنوان البريد الإلكتروني *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="أدخل عنوان بريدك الإلكتروني"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  تأكيد عنوان البريد الإلكتروني *
                </label>
                <input
                  type="email"
                  name="confirmEmail"
                  value={formData.confirmEmail}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="أكد عنوان بريدك الإلكتروني"
                  required
                />
                {formData.confirmEmail && formData.email !== formData.confirmEmail && (
                  <p className="text-red-500 text-sm mt-1">عناوين البريد الإلكتروني غير متطابقة</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    رقم الهاتف *
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
                    تاريخ الميلاد
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
                  الجنسية
                </label>
                <select
                  name="nationality"
                  value={formData.nationality}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">اختر الجنسية</option>
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
                <h3 className="text-xl font-bold text-gray-800">معلومات العنوان</h3>
                <p className="text-gray-600">يرجى تقديم تفاصيل عنوانك</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  عنوان الشارع *
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="أدخل عنوان الشارع"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    المدينة *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="أدخل مدينتك"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    الرمز البريدي
                  </label>
                  <input
                    type="text"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="أدخل الرمز البريدي"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  البلد *
                </label>
                <select
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">اختر البلد</option>
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
                <h3 className="text-xl font-bold text-gray-800">الشروط والأحكام</h3>
                <p className="text-gray-600">يرجى مراجعة وقبول شروطنا</p>
              </div>

              {/* Order Summary */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h4 className="font-semibold text-gray-800 mb-2">ملخص الطلب</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">{ticketInfo.title}</span>
                    <span className="font-bold text-gray-800">${ticketInfo.price.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center text-green-600">
                    <span className="font-semibold">خصم العملة المشفرة (30%)</span>
                    <span className="font-bold">-${(ticketInfo.price - ticketInfo.cryptoPrice).toLocaleString()}</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-800">المبلغ النهائي</span>
                    <span className="text-xl font-bold text-green-600">${ticketInfo.cryptoPrice.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Payment Method Info */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="text-2xl">💎</div>
                  <h4 className="font-semibold text-green-800">الدفع بالعملة المشفرة عبر NOWPayments</h4>
                </div>
                <p className="text-green-700 text-sm">
                  دفع آمن ومضمون عبر بوابة NOWPayments مع دعم أكثر من 100 عملة مشفرة مختلفة!
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
                    أوافق على <a href="#" className="text-blue-600 hover:underline">الشروط والأحكام</a> و <a href="#" className="text-blue-600 hover:underline">سياسة الخصوصية</a> *
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
                    أرغب في تلقي رسائل تسويقية حول كأس العالم FIFA 2026
                  </span>
                </label>
              </div>
            </div>
          )}

          {/* Step 4: NOWPayments Crypto Payment */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <div className="text-4xl mb-2">💎</div>
                <h3 className="text-xl font-bold text-gray-800">الدفع بالعملة المشفرة</h3>
                <p className="text-gray-600">دفع آمن عبر بوابة NOWPayments</p>
              </div>

              {/* Customer Summary */}
              <div className="bg-blue-50 rounded-lg p-4 mb-6">
                <h4 className="font-semibold text-blue-800 mb-3">معلومات العميل</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                  <div><strong>الاسم:</strong> {formData.firstName} {formData.lastName}</div>
                  <div><strong>البريد الإلكتروني:</strong> {formData.email}</div>
                  <div><strong>الهاتف:</strong> {formData.phone}</div>
                  <div><strong>البلد:</strong> {formData.country}</div>
                  {formData.nationality && <div><strong>الجنسية:</strong> {formData.nationality}</div>}
                  {formData.dateOfBirth && <div><strong>تاريخ الميلاد:</strong> {formData.dateOfBirth}</div>}
                </div>
              </div>

              {/* Payment Amount Display */}
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">
                    ${ticketInfo.cryptoPrice.toLocaleString()} USD
                  </div>
                  <div className="text-gray-600 mb-4">
                    (خصم 30% مطبق للدفع بالعملة المشفرة)
                  </div>
                  <div className="text-sm text-purple-700">
                    يدعم أكثر من 100 عملة مشفرة: BTC, ETH, USDT, USDC, LTC, BCH وغيرها
                  </div>
                </div>
              </div>

              {/* NOWPayments Payment Button */}
              <div className="space-y-4">
                <button
                  onClick={createNOWPayment}
                  disabled={paymentProcessing}
                  className={`w-full font-bold py-4 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-3 ${
                    paymentProcessing 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-green-600 to-green-800 hover:from-green-700 hover:to-green-900 text-white'
                  }`}
                >
                  {paymentProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                      <span>جاري إنشاء الدفعة...</span>
                    </>
                  ) : (
                    <>
                      <div className="text-xl">💎</div>
                      <span>ادفع بالعملة المشفرة - ${ticketInfo.cryptoPrice.toLocaleString()}</span>
                    </>
                  )}
                </button>

                {/* Payment Instructions */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h5 className="font-semibold text-blue-800 mb-2">كيف يعمل الدفع:</h5>
                  <ol className="text-blue-700 text-sm space-y-1">
                    <li>1. اضغط على زر "ادفع بالعملة المشفرة"</li>
                    <li>2. ستفتح نافذة جديدة لبوابة NOWPayments</li>
                    <li>3. اختر العملة المشفرة المفضلة لديك</li>
                    <li>4. أرسل المبلغ المطلوب إلى العنوان المعروض</li>
                    <li>5. سيتم تأكيد الدفع تلقائياً</li>
                    <li>6. ستحصل على تذكرتك فوراً بعد التأكيد</li>
                  </ol>
                </div>

                {/* Security Notice */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Shield className="h-5 w-5 text-green-600" />
                    <h5 className="font-semibold text-green-800">دفع آمن ومضمون</h5>
                  </div>
                  <p className="text-green-700 text-sm">
                    جميع المعاملات محمية بتشفير SSL وتتم معالجتها عبر بوابة NOWPayments الآمنة. 
                    لا نحتفظ بأي معلومات حساسة خاصة بمحفظتك.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Payment Confirmed & Ticket Download */}
          {currentStep === 5 && (
            <div className="space-y-6 text-center">
              <div className="mb-6">
                <div className="text-6xl mb-4">🎉</div>
                <h3 className="text-2xl font-bold text-green-600 mb-2">تم تأكيد الدفع!</h3>
                <p className="text-gray-600">تم تأمين تذاكر كأس العالم FIFA 2026 الخاصة بك</p>
              </div>

              {/* Success Message */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <div className="flex items-center justify-center space-x-2 mb-3">
                  <Check className="h-6 w-6 text-green-600" />
                  <h4 className="font-semibold text-green-800">تمت معالجة الطلب بنجاح</h4>
                </div>
                <p className="text-green-700 text-sm mb-4">
                  شكراً لك على الشراء! تم تأكيد دفعتك بالعملة المشفرة وتذكرة FIFA الرسمية جاهزة للتحميل.
                </p>
                
                <div className="bg-white rounded-lg p-4 mb-4">
                  <div className="text-sm text-gray-600 space-y-1">
                    <div><strong>رقم الطلب:</strong> {orderId || `FIFA2026-${Date.now().toString().slice(-8)}`}</div>
                    <div><strong>العميل:</strong> {formData.firstName} {formData.lastName}</div>
                    <div><strong>البريد الإلكتروني:</strong> {formData.email}</div>
                    <div><strong>المبلغ:</strong> ${ticketInfo.cryptoPrice.toLocaleString()} (خصم 30% للعملة المشفرة مطبق)</div>
                    <div><strong>طريقة الدفع:</strong> NOWPayments Gateway</div>
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
                  <span>تحميل تذكرة FIFA الرسمية</span>
                  <FileText className="h-6 w-6" />
                </button>
                
                <p className="text-gray-600 text-sm">
                  سيتم تحميل تذكرة كأس العالم FIFA 2026™ الرسمية كملف نصي. 
                  يرجى الاحتفاظ بها بأمان وتقديمها مع هوية صالحة عند مدخل الملعب.
                </p>
              </div>

              {/* Additional Information */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-800 mb-2">معلومات مهمة:</h4>
                <ul className="text-blue-700 text-sm space-y-1 text-right">
                  <li>• تم إرسال تأكيد التذكرة إلى عنوان بريدك الإلكتروني</li>
                  <li>• احضر إلى الملعب قبل ساعتين على الأقل من بداية المباراة</li>
                  <li>• أحضر هوية صالحة تطابق اسم حامل التذكرة تماماً</li>
                  <li>• التذاكر غير قابلة للتحويل وغير قابلة للاسترداد</li>
                  <li>• هذه تذكرة FIFA رسمية مع التحقق من البلوك تشين</li>
                </ul>
              </div>

              {/* Contact Support */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-800 mb-2">تحتاج مساعدة؟</h4>
                <div className="text-sm text-gray-600 space-y-1">
                  <div>📞 الهاتف: +1 (555) 123-4567</div>
                  <div>📱 واتساب: {whatsappNumber}</div>
                  <div>📧 البريد الإلكتروني: support@worldcup2026tickets.com</div>
                  <div>🌐 FIFA الرسمي: www.fifa.com/worldcup</div>
                </div>
              </div>

              {/* Close Button */}
              <button
                type="button"
                onClick={onClose}
                className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300"
              >
                إغلاق
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
                  السابق
                </button>
              )}
              {currentStep < 4 ? (
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="ml-auto px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  التالي
                </button>
              ) : (
                <div className="ml-auto">
                  <p className="text-sm text-gray-600">اضغط على زر الدفع لإكمال عملية الشراء</p>
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