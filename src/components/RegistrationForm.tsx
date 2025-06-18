import React, { useState, useEffect } from 'react';
import {
  X, User, Mail, Phone, MapPin, Calendar, Check, Copy,
  ExternalLink, Smartphone, Download, FileText,
  CreditCard, Shield, Info, DollarSign, Wallet, MessageCircle
} from 'lucide-react';
import QRCode from 'qrcode';
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

// عنوان المحفظة الخاص بك
const WALLET_ADDRESS = '0x62468C025d2738eDB2662B9994F52Af0Afa17c9d';
const WHATSAPP_NUMBER = '+34632800363';

// العملات الرقمية المدعومة
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

  // إنشاء QR Code عند تحميل المكون
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
        console.error('خطأ في إنشاء QR Code:', error);
      }
    };

    if (isOpen) {
      generateQRCode();
      const newOrderId = `FIFA2026-${Date.now().toString().slice(-8)}`;
      setOrderId(newOrderId);
    }
  }, [isOpen]);

  // نسخ عنوان المحفظة
  const copyWalletAddress = async () => {
    try {
      await navigator.clipboard.writeText(WALLET_ADDRESS);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (error) {
      console.error('خطأ في النسخ:', error);
      // Fallback للمتصفحات القديمة
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

  // إرسال تأكيد عبر واتساب
  const sendWhatsAppConfirmation = () => {
    const message = `🎫 *تأكيد دفع تذاكر كأس العالم FIFA 2026*

📋 *تفاصيل الطلب:*
• رقم الطلب: ${orderId}
• الاسم: ${formData.firstName} ${formData.lastName}
• البريد الإلكتروني: ${formData.email}
• الهاتف: ${formData.phone}

🎟️ *تفاصيل التذكرة:*
• النوع: ${ticketInfo.title}
• السعر الأصلي: $${ticketInfo.price.toLocaleString()}
• السعر بالعملة الرقمية (خصم 30%): $${ticketInfo.cryptoPrice.toLocaleString()}

💰 *تفاصيل الدفع:*
• العملة المختارة: ${selectedCrypto.symbol} (${selectedCrypto.name})
• الشبكة: ${selectedCrypto.network}
• عنوان المحفظة: ${WALLET_ADDRESS}
• المبلغ المدفوع: $${ticketInfo.cryptoPrice.toLocaleString()}
${transactionId ? `• معرف المعاملة: ${transactionId}` : '• معرف المعاملة: سيتم إضافته'}

✅ *تم إرسال الدفع وأنتظر التأكيد*

📞 يرجى تأكيد استلام الدفع وإرسال التذاكر الرسمية.

شكراً لكم! 🙏`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappURL = `https://wa.me/${WHATSAPP_NUMBER.replace('+', '')}?text=${encodedMessage}`;
    
    window.open(whatsappURL, '_blank');
  };

  // إنتاج تذكرة PDF
  const generateFIFATicketPDF = () => {
    const securityCode = Math.random().toString(36).substring(2, 15).toUpperCase();
    const qrCode = `FIFA2026-${orderId}-${securityCode}`;

    const pdf = new jsPDF('p', 'mm', 'a4');
    
    pdf.setFont('helvetica');

    // صفحة أولى - معلومات التذكرة
    pdf.setFillColor(0, 51, 153);
    pdf.rect(0, 0, 210, 30, 'F');
    
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(24);
    pdf.text('FIFA WORLD CUP 2026™', 105, 15, { align: 'center' });
    pdf.setFontSize(12);
    pdf.text('OFFICIAL TICKET', 105, 22, { align: 'center' });

    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(16);
    pdf.text('TICKET INFORMATION', 20, 45);
    
    pdf.setFontSize(11);
    let yPos = 55;
    
    pdf.text(`Order ID: ${orderId}`, 20, yPos);
    yPos += 8;
    pdf.text(`Event: ${ticketInfo.title}`, 20, yPos);
    yPos += 8;
    pdf.text(`Type: ${ticketInfo.type === 'match' ? 'Single Match' : 'Package'}`, 20, yPos);
    yPos += 8;
    pdf.text(`Amount Paid: $${ticketInfo.cryptoPrice} USD`, 20, yPos);
    yPos += 8;
    pdf.text(`Payment Method: ${selectedCrypto.symbol} (${selectedCrypto.name})`, 20, yPos);
    yPos += 8;
    pdf.text(`Wallet Address: ${WALLET_ADDRESS}`, 20, yPos);
    yPos += 8;
    if (transactionId) {
      pdf.text(`Transaction ID: ${transactionId}`, 20, yPos);
      yPos += 8;
    }
    yPos += 15;

    // معلومات حامل التذكرة
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

    // عنوان الفوترة
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

    // معلومات الأمان
    pdf.setFillColor(255, 255, 0);
    pdf.rect(15, yPos - 5, 180, 25, 'F');
    
    pdf.setFontSize(14);
    pdf.text('SECURITY INFORMATION', 20, yPos + 5);
    pdf.setFontSize(10);
    pdf.text(`Security Code: ${securityCode}`, 20, yPos + 12);
    pdf.text(`QR Code: ${qrCode}`, 20, yPos + 18);
    yPos += 35;

    pdf.setFontSize(10);
    pdf.text(`Issue Date: ${new Date().toLocaleDateString()}`, 20, yPos);
    pdf.text(`Issue Time: ${new Date().toLocaleTimeString()}`, 120, yPos);

    // صفحة ثانية - الشروط والأحكام
    pdf.addPage();
    
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
      `• WhatsApp Support: ${WHATSAPP_NUMBER}`,
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

    const fileName = `FIFA_WorldCup_2026_Ticket_${formData.firstName}_${formData.lastName}_${orderId}.pdf`;
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
          alert('يرجى إدخال الاسم الأول');
          return false;
        }
        if (!formData.lastName.trim()) {
          alert('يرجى إدخال اسم العائلة');
          return false;
        }
        if (!formData.email.trim()) {
          alert('يرجى إدخال البريد الإلكتروني');
          return false;
        }
        if (!formData.confirmEmail.trim()) {
          alert('يرجى تأكيد البريد الإلكتروني');
          return false;
        }
        if (formData.email !== formData.confirmEmail) {
          alert('البريد الإلكتروني غير متطابق');
          return false;
        }
        if (!formData.phone.trim()) {
          alert('يرجى إدخال رقم الهاتف');
          return false;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
          alert('يرجى إدخال بريد إلكتروني صحيح');
          return false;
        }
        return true;
      case 2:
        if (!formData.address.trim()) {
          alert('يرجى إدخال العنوان');
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
          alert('يرجى الموافقة على الشروط والأحكام');
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
              {currentStep === 5 ? '🎉 جاهز للتحميل!' : 'إكمال التسجيل'}
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
                {currentStep === 4 && 'الدفع بالعملات الرقمية'}
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">الاسم الأول *</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="أدخل اسمك الأول"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">اسم العائلة *</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="أدخل اسم العائلة"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">البريد الإلكتروني *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="أدخل بريدك الإلكتروني"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">تأكيد البريد الإلكتروني *</label>
                <input
                  type="email"
                  name="confirmEmail"
                  value={formData.confirmEmail}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="أكد بريدك الإلكتروني"
                  required
                />
                {formData.confirmEmail && formData.email !== formData.confirmEmail && (
                  <p className="text-red-500 text-sm mt-1">البريد الإلكتروني غير متطابق</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">رقم الهاتف *</label>
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">تاريخ الميلاد</label>
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
                <label className="block text-sm font-medium text-gray-700 mb-2">الجنسية</label>
                <select
                  name="nationality"
                  value={formData.nationality}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                <label className="block text-sm font-medium text-gray-700 mb-2">عنوان الشارع *</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="أدخل عنوان الشارع"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">المدينة *</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="أدخل المدينة"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">الرمز البريدي</label>
                  <input
                    type="text"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="أدخل الرمز البريدي"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">البلد *</label>
                <select
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                    <span className="font-semibold">خصم الدفع بالعملة الرقمية (30%)</span>
                    <span className="font-bold">-${(ticketInfo.price - ticketInfo.cryptoPrice).toLocaleString()}</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-800">المبلغ النهائي</span>
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

          {/* Step 4: Crypto Payment */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <div className="text-4xl mb-2">💎</div>
                <h3 className="text-xl font-bold text-gray-800">الدفع بالعملات الرقمية</h3>
                <p className="text-gray-600">ادفع بأمان باستخدام العملات الرقمية</p>
              </div>

              {/* Customer Info Summary */}
              <div className="bg-blue-50 rounded-lg p-4 mb-6">
                <h4 className="font-semibold text-blue-800 mb-3">معلومات العميل</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                  <div><strong>الاسم:</strong> {formData.firstName} {formData.lastName}</div>
                  <div><strong>البريد:</strong> {formData.email}</div>
                  <div><strong>الهاتف:</strong> {formData.phone}</div>
                  <div><strong>البلد:</strong> {formData.country}</div>
                  <div><strong>رقم الطلب:</strong> {orderId}</div>
                </div>
              </div>

              {/* Payment Amount */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-6 text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  ${ticketInfo.cryptoPrice.toLocaleString()} USD
                </div>
                <div className="text-gray-600 mb-4">
                  (تم تطبيق خصم 30% للدفع بالعملة الرقمية)
                </div>
              </div>

              {/* Crypto Selection */}
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-800">اختر العملة الرقمية:</h4>
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
                <h4 className="font-semibold text-gray-800 mb-4 text-center">عنوان المحفظة للدفع</h4>
                
                {/* QR Code */}
                <div className="flex justify-center mb-4">
                  {qrCodeDataURL && (
                    <img 
                      src={qrCodeDataURL} 
                      alt="QR Code للدفع" 
                      className="w-48 h-48 border-2 border-gray-300 rounded-lg"
                    />
                  )}
                </div>

                {/* Wallet Address */}
                <div className="bg-white rounded-lg p-4 border">
                  <div className="text-sm text-gray-600 mb-2">عنوان المحفظة ({selectedCrypto.network}):</div>
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
                          <span className="text-sm">تم النسخ!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4" />
                          <span className="text-sm">نسخ</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Payment Instructions */}
                <div className="mt-4 text-sm text-gray-600">
                  <p className="font-semibold mb-2">تعليمات الدفع:</p>
                  <ol className="list-decimal list-inside space-y-1">
                    <li>انسخ عنوان المحفظة أعلاه أو امسح QR Code</li>
                    <li>افتح محفظتك الرقمية</li>
                    <li>أرسل ${ticketInfo.cryptoPrice.toLocaleString()} USD بعملة {selectedCrypto.symbol}</li>
                    <li>احفظ معرف المعاملة (Transaction ID)</li>
                    <li>اضغط على "تأكيد عبر واتساب" أدناه</li>
                  </ol>
                </div>
              </div>

              {/* Transaction ID Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  معرف المعاملة (Transaction ID) - اختياري
                </label>
                <input
                  type="text"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="أدخل معرف المعاملة إذا كان متوفراً"
                />
              </div>

              {/* WhatsApp Confirmation Button */}
              <button
                onClick={sendWhatsAppConfirmation}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-4 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-3"
              >
                <MessageCircle className="h-6 w-6" />
                <span>تأكيد عبر واتساب</span>
                <div className="text-xl">📱</div>
              </button>

              {/* Next Step Button */}
              <button
                onClick={() => setCurrentStep(5)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300"
              >
                متابعة لتحميل التذكرة
              </button>

              {/* Security Notice */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start space-x-2">
                  <Shield className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div className="text-sm text-yellow-800">
                    <p className="font-semibold mb-1">ملاحظة أمنية:</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>تأكد من إرسال المبلغ الصحيح بالعملة المحددة</li>
                      <li>احفظ معرف المعاملة للمراجعة</li>
                      <li>لا تشارك معلوماتك الشخصية مع أطراف أخرى</li>
                      <li>سيتم تأكيد الدفع خلال 24 ساعة</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Download Ticket */}
          {currentStep === 5 && (
            <div className="space-y-6 text-center">
              <div className="mb-6">
                <div className="text-6xl mb-4">🎉</div>
                <h3 className="text-2xl font-bold text-green-600 mb-2">جاهز للتحميل!</h3>
                <p className="text-gray-600">تذاكر كأس العالم FIFA 2026 جاهزة</p>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <div className="text-sm text-gray-600 space-y-1">
                  <div><strong>رقم الطلب:</strong> {orderId}</div>
                  <div><strong>الاسم:</strong> {formData.firstName} {formData.lastName}</div>
                  <div><strong>البريد الإلكتروني:</strong> {formData.email}</div>
                  <div><strong>المبلغ المدفوع:</strong> ${ticketInfo.cryptoPrice.toLocaleString()} USD</div>
                  <div><strong>العملة:</strong> {selectedCrypto.symbol} ({selectedCrypto.name})</div>
                  <div><strong>عنوان المحفظة:</strong> {WALLET_ADDRESS}</div>
                  {transactionId && <div><strong>معرف المعاملة:</strong> {transactionId}</div>}
                </div>
              </div>

              <button
                type="button"
                onClick={generateFIFATicketPDF}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white font-bold py-4 px-6 rounded-lg transition-all duration-300 flex items-center justify-center space-x-3"
              >
                <Download className="h-6 w-6" />
                <span>تحميل التذكرة الرسمية (PDF)</span>
                <FileText className="h-6 w-6" />
              </button>

              <p className="text-gray-600 text-sm">
                سيتم تحميل تذكرتك الرسمية كملف PDF. يرجى حفظها وإحضارها مع هوية صالحة يوم المباراة.
              </p>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center justify-center space-x-2 text-blue-700">
                  <Phone className="h-5 w-5" />
                  <span className="font-semibold">الدعم: {WHATSAPP_NUMBER}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg"
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
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  السابق
                </button>
              )}
              {currentStep < 4 ? (
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="ml-auto px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  التالي
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