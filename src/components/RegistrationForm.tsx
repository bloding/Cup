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
  
  // 🔑 مفتاح API الخاص بك من NOWPayments
  const NOWPAYMENTS_API_KEY = '53564b07-5501-446c-a623-bbf5cfc439b8';

  // 💳 إنشاء دفعة عبر NOWPayments API
  const createCryptoPayment = async () => {
    try {
      setPaymentProcessing(true);
      const orderIdGenerated = `FIFA2026-${Date.now().toString().slice(-8)}`;
      setOrderId(orderIdGenerated);

      // 📋 بيانات الدفعة
      const paymentData = {
        price_amount: ticketInfo.cryptoPrice,
        price_currency: 'USD',
        pay_currency: '', // سيتم اختيار العملة المشفرة من قبل المستخدم
        order_id: orderIdGenerated,
        order_description: `FIFA World Cup 2026 - ${ticketInfo.title}`,
        ipn_callback_url: '', // يمكنك إضافة رابط webhook هنا
        success_url: window.location.origin + '?payment=success',
        cancel_url: window.location.origin + '?payment=cancel',
        customer_email: formData.email,
        is_fixed_rate: false,
        is_fee_paid_by_user: true
      };

      console.log('🚀 Creating payment with data:', paymentData);

      // 🌐 إرسال طلب إنشاء الدفعة
      const response = await fetch('https://api.nowpayments.io/v1/payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': NOWPAYMENTS_API_KEY
        },
        body: JSON.stringify(paymentData)
      });

      console.log('📡 Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ API Error:', errorText);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const result = await response.json();
      console.log('✅ Payment created successfully:', result);

      if (result.payment_id) {
        setPaymentId(result.payment_id);
        
        // 🔗 رابط صفحة الدفع
        const invoiceUrl = result.invoice_url || `https://nowpayments.io/payment/?iid=${result.payment_id}`;
        setPaymentUrl(invoiceUrl);

        // 🪟 فتح صفحة الدفع في نافذة جديدة
        const paymentWindow = window.open(
          invoiceUrl,
          '_blank',
          'width=800,height=700,scrollbars=yes,resizable=yes'
        );

        if (paymentWindow) {
          // ✅ بدء مراقبة حالة الدفع
          checkPaymentStatus(result.payment_id);
          alert('✅ تم إنشاء صفحة الدفع بنجاح! يمكنك الآن الدفع باستخدام محفظتك المشفرة.');
        } else {
          alert('⚠️ تم حظر النافذة المنبثقة. يرجى السماح بالنوافذ المنبثقة والمحاولة مرة أخرى.');
        }
      } else {
        throw new Error('فشل في إنشاء الدفعة - لم يتم إرجاع payment_id');
      }
    } catch (error) {
      console.error('❌ خطأ في إنشاء دفعة NOWPayments:', error);
      
      // 📞 في حالة الخطأ، عرض معلومات الاتصال
      alert(
        `⚠️ حدث خطأ في إنشاء صفحة الدفع.\n\n` +
        `رقم الطلب: ${orderId}\n` +
        `المبلغ: $${ticketInfo.cryptoPrice}\n\n` +
        `يرجى التواصل معنا عبر WhatsApp: ${whatsappNumber}\n` +
        `أو إرسال إيميل مع رقم الطلب.`
      );
      
      // الانتقال إلى صفحة التأكيد
      setCurrentStep(5);
    } finally {
      setPaymentProcessing(false);
    }
  };

  // 🔍 التحقق من حالة الدفع
  const checkPaymentStatus = async (paymentIdToCheck: string) => {
    try {
      console.log('🔍 Checking payment status for:', paymentIdToCheck);
      
      const response = await fetch(`https://api.nowpayments.io/v1/payment/${paymentIdToCheck}`, {
        method: 'GET',
        headers: {
          'x-api-key': NOWPAYMENTS_API_KEY
        }
      });

      if (response.ok) {
        const result = await response.json();
        console.log('📊 Payment status:', result.payment_status);

        // ✅ الدفع مكتمل
        if (['finished', 'confirmed'].includes(result.payment_status)) {
          setPaymentConfirmed(true);
          setCurrentStep(5);
          alert('🎉 تم تأكيد الدفع بنجاح!');
          return;
        }

        // ⏳ الدفع في الانتظار
        if (['waiting', 'confirming', 'sending'].includes(result.payment_status)) {
          console.log('⏳ Payment still processing, checking again in 10 seconds...');
          setTimeout(() => checkPaymentStatus(paymentIdToCheck), 10000);
        }

        // ❌ الدفع فاشل أو منتهي الصلاحية
        if (['failed', 'expired'].includes(result.payment_status)) {
          alert('❌ فشل الدفع أو انتهت صلاحيته. يرجى المحاولة مرة أخرى.');
        }
      } else {
        console.error('❌ Error checking payment status:', response.status);
        // إعادة المحاولة بعد 15 ثانية في حالة الخطأ
        setTimeout(() => checkPaymentStatus(paymentIdToCheck), 15000);
      }
    } catch (error) {
      console.error('❌ خطأ في التحقق من حالة الدفع:', error);
      // إعادة المحاولة بعد 15 ثانية
      setTimeout(() => checkPaymentStatus(paymentIdToCheck), 15000);
    }
  };

  // 📄 إنشاء تذكرة PDF
  const generateFIFATicketPDF = () => {
    const orderIdGenerated = orderId || `FIFA2026-${Date.now().toString().slice(-8)}`;
    const securityCode = Math.random().toString(36).substring(2, 15).toUpperCase();
    const qrCode = `FIFA2026-${orderIdGenerated}-${securityCode}`;

    const pdf = new jsPDF('p', 'mm', 'a4');
    
    // 🎨 إعداد الخط
    pdf.setFont('helvetica');

    // 📋 الصفحة الأولى - معلومات التذكرة
    // رأس FIFA
    pdf.setFillColor(0, 51, 153); // أزرق FIFA
    pdf.rect(0, 0, 210, 30, 'F');
    
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(24);
    pdf.text('FIFA WORLD CUP 2026™', 105, 15, { align: 'center' });
    pdf.setFontSize(12);
    pdf.text('OFFICIAL TICKET', 105, 22, { align: 'center' });

    // معلومات التذكرة
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
    pdf.setFillColor(255, 255, 0); // أصفر
    pdf.rect(15, yPos - 5, 180, 25, 'F');
    
    pdf.setFontSize(14);
    pdf.text('SECURITY INFORMATION', 20, yPos + 5);
    pdf.setFontSize(10);
    pdf.text(`Security Code: ${securityCode}`, 20, yPos + 12);
    pdf.text(`QR Code: ${qrCode}`, 20, yPos + 18);
    yPos += 35;

    // تاريخ الإصدار
    pdf.setFontSize(10);
    pdf.text(`Issue Date: ${new Date().toLocaleDateString()}`, 20, yPos);
    pdf.text(`Issue Time: ${new Date().toLocaleTimeString()}`, 120, yPos);

    // 📄 الصفحة الثانية - الشروط والأحكام
    pdf.addPage();
    
    // رأس الصفحة الثانية
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

    // حفظ الملف
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
          alert('البريد الإلكتروني غير صحيح');
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
              {currentStep === 5 ? '🎉 تم تأكيد الدفع!' : 'إكمال التسجيل'}
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
                    <span className="font-semibold">خصم العملة المشفرة (30%)</span>
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

          {/* Step 4: Crypto Wallet Payment */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <div className="text-4xl mb-2">💎</div>
                <h3 className="text-xl font-bold text-gray-800">الدفع بالمحفظة المشفرة</h3>
                <p className="text-gray-600">ادفع باستخدام MetaMask أو Trust Wallet أو أي محفظة مشفرة</p>
              </div>

              <div className="bg-blue-50 rounded-lg p-4 mb-6">
                <h4 className="font-semibold text-blue-800 mb-3">معلومات العميل</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                  <div><strong>الاسم:</strong> {formData.firstName} {formData.lastName}</div>
                  <div><strong>البريد:</strong> {formData.email}</div>
                  <div><strong>الهاتف:</strong> {formData.phone}</div>
                  <div><strong>البلد:</strong> {formData.country}</div>
                  {formData.nationality && <div><strong>الجنسية:</strong> {formData.nationality}</div>}
                  {formData.dateOfBirth && <div><strong>تاريخ الميلاد:</strong> {formData.dateOfBirth}</div>}
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    ${ticketInfo.cryptoPrice.toLocaleString()} USD
                  </div>
                  <div className="text-gray-600 mb-4">
                    (تم تطبيق خصم 30% للدفع بالعملة المشفرة)
                  </div>
                  <div className="text-sm text-green-700">
                    يدعم أكثر من 100 عملة مشفرة: BTC, ETH, USDT, USDC, LTC, BCH وأكثر
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
                      <span>جاري إنشاء صفحة الدفع...</span>
                    </>
                  ) : (
                    <>
                      <Wallet className="h-6 w-6" />
                      <span>ادفع بالمحفظة المشفرة - ${ticketInfo.cryptoPrice.toLocaleString()}</span>
                    </>
                  )}
                </button>

                {/* معلومات إضافية */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-start space-x-2">
                    <Info className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <div className="text-sm text-yellow-800">
                      <p className="font-semibold mb-1">معلومات مهمة:</p>
                      <ul className="list-disc list-inside space-y-1">
                        <li>ستفتح صفحة دفع جديدة في نافذة منفصلة</li>
                        <li>اختر العملة المشفرة المفضلة لديك</li>
                        <li>أكمل الدفع باستخدام محفظتك</li>
                        <li>سيتم تأكيد الدفع تلقائياً</li>
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
                <h3 className="text-2xl font-bold text-green-600 mb-2">تم تأكيد الدفع!</h3>
                <p className="text-gray-600">تم تأمين تذاكر كأس العالم FIFA 2026 الخاصة بك</p>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <div className="text-sm text-gray-600 space-y-1">
                  <div><strong>رقم الطلب:</strong> {orderId}</div>
                  <div><strong>رقم المعاملة:</strong> {paymentId || 'قيد المعالجة'}</div>
                  <div><strong>الاسم:</strong> {formData.firstName} {formData.lastName}</div>
                  <div><strong>البريد الإلكتروني:</strong> {formData.email}</div>
                  <div><strong>المبلغ المدفوع:</strong> ${ticketInfo.cryptoPrice.toLocaleString()} USD</div>
                </div>
              </div>

              <button
                type="button"
                onClick={generateFIFATicketPDF}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white font-bold py-4 px-6 rounded-lg transition-all duration-300 flex items-center justify-center space-x-3"
              >
                <Download className="h-6 w-6" />
                <span>تحميل التذكرة الرسمية FIFA (PDF)</span>
                <FileText className="h-6 w-6" />
              </button>

              <p className="text-gray-600 text-sm">
                سيتم تحميل تذكرتك الرسمية كملف PDF. يرجى حفظها وإحضارها مع هوية صالحة في يوم المباراة.
              </p>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center justify-center space-x-2 text-blue-700">
                  <Phone className="h-5 w-5" />
                  <span className="font-semibold">للدعم الفني: {whatsappNumber}</span>
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
              ) : (
                <div className="ml-auto">
                  <p className="text-sm text-gray-600">انقر على زر المحفظة المشفرة لإكمال عملية الشراء</p>
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