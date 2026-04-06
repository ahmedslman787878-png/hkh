import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { Menu, MessageCircle, Shield, Zap, Users, Facebook, Instagram, Youtube, Home as HomeIcon, ClipboardList, User, Heart, Eye, Edit2, Check } from 'lucide-react';
import { collection, addDoc, onSnapshot, query, orderBy, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { db } from './firebase';

const TikTokIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.63 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.04-.1z"/>
  </svg>
);

const platforms = [
  { id: 'facebook', name: 'فيسبوك', icon: Facebook, iconBg: 'bg-gradient-to-b from-blue-400 to-blue-700', iconColor: 'text-white' },
  { id: 'instagram', name: 'إنستغرام', icon: Instagram, iconBg: 'bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600', iconColor: 'text-white' },
  { id: 'tiktok', name: 'تيك توك', icon: TikTokIcon, iconBg: 'bg-gray-900 border border-gray-700', iconColor: 'text-white drop-shadow-[0_0_8px_rgba(0,255,255,0.8)]' },
  { id: 'youtube', name: 'يوتيوب', icon: Youtube, iconBg: 'bg-gradient-to-br from-red-500 to-red-800', iconColor: 'text-white' },
];

const packages = [
  { id: 1, followers: 1000, price: 100, discount: '50.00', badge: 'new' },
  { id: 2, followers: 3000, price: 250, discount: '100.00', badge: 'new' },
  { id: 3, followers: 5000, price: 400, discount: '150.00', badge: 'best_seller' },
  { id: 4, followers: 10000, price: 750, discount: '300.00', badge: 'new' },
];

function Home({ onSelectPackage }: { onSelectPackage: (pkg: any) => void }) {
  const [selectedPlatform, setSelectedPlatform] = useState('tiktok');
  const [selectedService, setSelectedService] = useState('followers');

  const currentPlatform = platforms.find(p => p.id === selectedPlatform) || platforms[2];
  const PlatformIcon = currentPlatform.icon;

  const services = [
    { id: 'followers', name: 'متابعين', icon: Users },
    { id: 'likes', name: 'لايكات', icon: Heart },
    { id: 'views', name: 'مشاهدات', icon: Eye },
  ];
  const currentService = services.find(s => s.id === selectedService) || services[0];
  const ServiceIcon = currentService.icon;

  return (
    <main className="max-w-md mx-auto p-4 pb-28">
      {/* Platforms - Single Row */}
      <div className="flex justify-between items-center gap-2 mb-6">
        {platforms.map((p) => {
          const isSelected = selectedPlatform === p.id;
          const Icon = p.icon;
          return (
            <button
              key={p.id}
              onClick={() => setSelectedPlatform(p.id)}
              className={`flex flex-col items-center gap-2 p-2 rounded-2xl transition-all duration-300 flex-1 ${
                isSelected ? 'ring-2 ring-[#ffb800] shadow-[0_0_20px_rgba(255,184,0,0.15)] bg-white/5 scale-105' : 'opacity-70 hover:opacity-100'
              }`}
            >
              <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center ${p.iconBg} shadow-lg relative overflow-hidden`}>
                <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent opacity-50"></div>
                <Icon className={`w-6 h-6 sm:w-7 sm:h-7 ${p.iconColor} relative z-10`} />
              </div>
              <span className={`text-[11px] sm:text-xs font-semibold whitespace-nowrap ${isSelected ? 'text-[#ffb800]' : 'text-gray-400'}`}>{p.name}</span>
            </button>
          );
        })}
      </div>

      {/* Services Sub-bar */}
      <div className="flex justify-center gap-1 sm:gap-2 mb-8 bg-[#1a1a24] p-1.5 rounded-2xl border border-gray-800 w-full max-w-[320px] mx-auto">
        {services.map(s => (
          <button
            key={s.id}
            onClick={() => setSelectedService(s.id)}
            className={`flex-1 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              selectedService === s.id 
                ? 'bg-[#ffb800] text-black shadow-md' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            {s.name}
          </button>
        ))}
      </div>

      <h2 className="text-xl font-bold text-center text-[#ffb800] mb-4">اختر باقتك</h2>

      <div className="grid grid-cols-2 gap-3">
        {packages.map((pkg) => (
          <div key={pkg.id} className="bg-[#1a1a24] border border-gray-800 rounded-xl p-3 flex flex-col relative overflow-hidden">
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-1.5">
                <PlatformIcon className="w-3.5 h-3.5 text-white" />
                <span className="text-gray-300 text-xs font-medium">{currentPlatform.name}</span>
              </div>
              {pkg.badge === 'new' && (
                <span className="bg-blue-500/20 text-blue-400 text-[9px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-1 border border-blue-500/30">
                  <span className="text-xs leading-none">✨</span> جديد
                </span>
              )}
              {pkg.badge === 'best_seller' && (
                <span className="bg-emerald-500/20 text-emerald-400 text-[9px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-1 border border-emerald-500/30">
                  <span className="text-xs leading-none">📈</span> الأكثر مبيعاً
                </span>
              )}
            </div>

            <div className="flex items-center gap-1.5 mb-1.5">
              <ServiceIcon className="w-4 h-4 text-[#ffb800]" />
              <span className="text-xl font-bold text-white">{pkg.followers.toLocaleString('en-US')}</span>
            </div>

            <div className="flex items-center gap-2 mb-4">
              <span className="text-xl font-bold text-[#ffb800] whitespace-nowrap">{pkg.price} جنيه</span>
              <span className="bg-emerald-500/10 text-emerald-500 text-[10px] font-bold px-1.5 py-0.5 rounded border border-emerald-500/20 whitespace-nowrap">
                -{pkg.discount}
              </span>
            </div>

            <div className="space-y-2 mb-4 mt-auto">
              <div className="flex items-center gap-1.5 text-gray-400 text-[10px] font-medium">
                <Shield className="w-3.5 h-3.5 text-emerald-500" />
                <span>ضمان مدى الحياة</span>
              </div>
              <div className="flex items-center gap-1.5 text-gray-400 text-[10px] font-medium">
                <Zap className="w-3.5 h-3.5 text-[#ffb800]" />
                <span>0-48 ساعة</span>
              </div>
            </div>

            <button 
              onClick={() => onSelectPackage({ 
                ...pkg, 
                platformName: currentPlatform.name, 
                serviceName: currentService.name 
              })}
              className="w-full bg-[#ffb800] hover:bg-[#e5a600] text-black font-bold py-2 text-sm rounded-lg transition-colors active:scale-95">
              اختيار
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}

function Orders({ orders }: { orders: any[] }) {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="max-w-md mx-auto p-4 pb-28">
      <h2 className="text-2xl font-bold text-[#ffb800] mb-6 text-center">طلباتي</h2>
      {orders.length === 0 ? (
        <div className="bg-[#1a1a24] border border-gray-800 rounded-xl p-8 text-center">
          <ClipboardList className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400">لا توجد طلبات حالياً.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order, idx) => {
            const isAccepted = order.status.includes('مقبول');
            const isPending = order.status === 'بانتظار الموافقة';
            
            const totalTime = 3 * 60 * 60 * 1000; // 3 hours
            let progressPercent = 0;
            let timeString = "03:00:00";

            if (isAccepted && order.acceptedAt) {
              const elapsed = now - order.acceptedAt;
              const left = Math.max(0, totalTime - elapsed);
              progressPercent = Math.min(100, (elapsed / totalTime) * 100);
              
              const h = Math.floor(left / (1000 * 60 * 60));
              const m = Math.floor((left % (1000 * 60 * 60)) / (1000 * 60));
              const s = Math.floor((left % (1000 * 60)) / 1000);
              timeString = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
            }

            return (
              <div key={idx} className="bg-[#1a1a24] border border-gray-800 rounded-xl p-4">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-gray-300 font-mono text-sm">طلب #{order.id}</span>
                  <span className="text-gray-400 text-xs">{order.date}</span>
                </div>
                <p className="text-white font-bold mb-1">{order.amount.toLocaleString('en-US')} {order.serviceName} {order.platformName}</p>
                <p className="text-gray-400 text-xs mb-2 whitespace-nowrap">المبلغ: {order.price} جنيه</p>
                <p className="text-gray-500 text-[10px] truncate mb-4" dir="ltr">{order.link}</p>
                
                {/* Progress Bar Section */}
                <div className="mt-2 bg-[#0d0d12] rounded-lg p-3 border border-gray-800/50">
                  <div className="flex justify-between text-xs mb-2">
                    <span className={isAccepted ? "text-emerald-400 font-bold" : "text-yellow-400 font-bold"}>
                      {isAccepted ? "مقبول - جاري التنفيذ" : "جاري المراجعة"}
                    </span>
                    {isAccepted && <span className="text-emerald-400 font-mono font-bold" dir="ltr">{timeString}</span>}
                  </div>
                  <div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-1000 ${isAccepted ? 'bg-emerald-500' : 'bg-yellow-500 w-full animate-pulse'}`}
                      style={{ width: isAccepted ? `${progressPercent}%` : '100%' }}
                    ></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}

function Checkout({ orderDraft, onConfirmOrder }: { orderDraft: any, onConfirmOrder: (order: any) => void }) {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [link, setLink] = useState('');
  const [transferPhone, setTransferPhone] = useState('');
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText('01080379299');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!orderDraft) {
    return (
      <div className="max-w-md mx-auto p-4 pt-20 text-center">
        <p className="text-white mb-4">لم تقم باختيار باقة.</p>
        <button onClick={() => navigate('/')} className="bg-[#ffb800] text-black px-6 py-2 rounded-xl font-bold">العودة للرئيسية</button>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      if (!link) return alert('يرجى إدخال الرابط');
      setStep(2);
    } else {
      if (!transferPhone) return alert('يرجى إدخال الرقم المحول منه');
      const newOrder = {
        id: Math.floor(1000 + Math.random() * 9000).toString(),
        ...orderDraft,
        link,
        transferPhone,
        status: 'بانتظار الموافقة',
        date: new Date().toLocaleDateString('ar-EG', { day: 'numeric', month: 'long', year: 'numeric' }),
        createdAt: Date.now()
      };
      onConfirmOrder(newOrder);
      navigate('/orders');
    }
  };

  return (
    <main className="max-w-md mx-auto p-4 pb-28">
      <h2 className="text-2xl font-bold text-[#ffb800] mb-6 text-center">
        {step === 1 ? 'تفاصيل الطلب' : 'الدفع (كاش)'}
      </h2>
      
      <div className="bg-[#1a1a24] border border-gray-800 rounded-xl p-5 mb-6">
        <h3 className="text-white font-bold mb-2">ملخص الباقة:</h3>
        <p className="text-gray-300 text-sm mb-1">{orderDraft.amount.toLocaleString('en-US')} {orderDraft.serviceName} {orderDraft.platformName}</p>
        <p className="text-[#ffb800] font-bold text-lg whitespace-nowrap">المبلغ المطلوب: {orderDraft.price} جنيه</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {step === 1 ? (
          <div>
            <label className="block text-gray-300 text-sm font-bold mb-2">رابط الحساب أو الفيديو:</label>
            <input 
              type="url" 
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="https://..."
              className="w-full bg-[#0d0d12] border border-gray-700 focus:border-[#ffb800] focus:ring-1 focus:ring-[#ffb800] outline-none rounded-xl p-3 text-white text-left"
              dir="ltr"
              required
            />
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 text-center">
              <p className="text-gray-300 text-sm mb-2">قم بتحويل مبلغ <span className="text-[#ffb800] font-bold whitespace-nowrap">{orderDraft.price} جنيه</span> إلى الرقم التالي:</p>
              <div className="flex items-center justify-center gap-3 mb-2">
                <p className="text-3xl font-bold text-white tracking-wider">01080379299</p>
                <button 
                  type="button" 
                  onClick={handleCopy} 
                  className="bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-bold py-1.5 px-3 rounded-lg border border-gray-600 transition-colors"
                >
                  {copied ? 'تم النسخ' : 'نسخ'}
                </button>
              </div>
              <p className="text-emerald-500 text-xs font-bold">فودافون كاش / اتصالات كاش / وي باي</p>
            </div>
            
            <div>
              <label className="block text-gray-300 text-sm font-bold mb-2">رقم الهاتف المحول منه:</label>
              <input 
                type="tel" 
                value={transferPhone}
                onChange={(e) => setTransferPhone(e.target.value)}
                placeholder="01xxxxxxxxx"
                className="w-full bg-[#0d0d12] border border-gray-700 focus:border-[#ffb800] focus:ring-1 focus:ring-[#ffb800] outline-none rounded-xl p-3 text-white text-left"
                dir="ltr"
                required
              />
            </div>
          </div>
        )}

        <button type="submit" className="w-full bg-[#ffb800] hover:bg-[#e5a600] text-black font-bold py-3 rounded-xl transition-colors mt-4">
          {step === 1 ? 'متابعة للدفع' : 'تأكيد الطلب'}
        </button>
        {step === 2 && (
          <button type="button" onClick={() => setStep(1)} className="w-full bg-transparent border border-gray-700 text-gray-300 hover:bg-gray-800 font-bold py-3 rounded-xl transition-colors mt-2">
            رجوع
          </button>
        )}
      </form>
    </main>
  );
}

function Profile() {
  const [userName, setUserName] = useState(() => localStorage.getItem('userName') || '');
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(userName);

  const handleSave = () => {
    if (inputValue.trim()) {
      setUserName(inputValue.trim());
      localStorage.setItem('userName', inputValue.trim());
    }
    setIsEditing(false);
  };

  return (
    <main className="max-w-md mx-auto p-4 pb-28 text-center">
      <h2 className="text-2xl font-bold text-[#ffb800] mb-8">حسابي</h2>
      <div className="w-24 h-24 bg-[#1a1a24] border-2 border-[#ffb800] rounded-full mx-auto mb-6 flex items-center justify-center shadow-[0_0_15px_rgba(255,184,0,0.2)]">
        <User size={40} className="text-[#ffb800]" />
      </div>
      
      <div className="bg-[#1a1a24] border border-gray-800 rounded-xl p-6 flex flex-col items-center justify-center">
        {isEditing ? (
          <div className="flex items-center gap-2 w-full">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="أدخل اسمك هنا..."
              className="flex-1 bg-[#0d0d12] border border-gray-700 focus:border-[#ffb800] focus:ring-1 focus:ring-[#ffb800] outline-none rounded-xl p-3 text-white text-center"
              autoFocus
              onKeyDown={(e) => e.key === 'Enter' && handleSave()}
            />
            <button
              onClick={handleSave}
              className="bg-[#ffb800] text-black p-3 rounded-xl hover:bg-[#e5a600] transition-colors"
            >
              <Check size={20} />
            </button>
          </div>
        ) : (
          <button
            onClick={() => {
              setInputValue(userName);
              setIsEditing(true);
            }}
            className="flex items-center justify-center gap-3 text-white hover:text-[#ffb800] transition-colors group"
          >
            <span className="text-xl font-bold">
              {userName ? userName : 'سجل اسمك معنا'}
            </span>
            <Edit2 size={18} className="text-gray-400 group-hover:text-[#ffb800] transition-colors" />
          </button>
        )}
      </div>
    </main>
  );
}

function Admin({ orders, onUpdateOrderStatus, onDeleteOrder }: { orders: any[], onUpdateOrderStatus: (id: string, status: string) => void, onDeleteOrder: (id: string) => void }) {
  return (
    <main className="max-w-md mx-auto p-4 pb-28">
      <h2 className="text-2xl font-bold text-red-500 mb-6 text-center">لوحة الإدارة</h2>
      
      {orders.length === 0 ? (
        <div className="bg-[#1a1a24] border border-red-500/30 rounded-xl p-6 text-center">
          <Shield className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <p className="text-white font-bold mb-2">لا توجد طلبات حالياً</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order, idx) => (
            <div key={idx} className="bg-[#1a1a24] border border-gray-800 rounded-xl p-4">
              <div className="flex justify-between items-center mb-3">
                <span className="text-gray-300 font-mono text-sm">طلب #{order.id}</span>
                <span className="bg-yellow-500/20 text-yellow-400 text-[10px] font-bold px-2 py-1 rounded-full border border-yellow-500/30">{order.status}</span>
              </div>
              <p className="text-white font-bold mb-1">{order.amount.toLocaleString('en-US')} {order.serviceName} {order.platformName}</p>
              <p className="text-gray-400 text-xs mb-1 whitespace-nowrap">المبلغ: {order.price} جنيه</p>
              <p className="text-gray-400 text-xs mb-1">الرقم المحول منه: <span className="text-white font-mono">{order.transferPhone}</span></p>
              <p className="text-gray-500 text-[10px] truncate mb-3" dir="ltr">{order.link}</p>
              
              {order.status === 'بانتظار الموافقة' && (
                <button 
                  onClick={() => onUpdateOrderStatus(order.id, 'مقبول - جاري التنفيذ')}
                  className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2 rounded-lg transition-colors text-sm mt-2"
                >
                  تأكيد التحويل (قبول)
                </button>
              )}
              <button 
                onClick={() => {
                  if(window.confirm('هل أنت متأكد من حذف هذا الطلب؟')) {
                    onDeleteOrder(order.id);
                  }
                }}
                className="w-full bg-red-500/10 hover:bg-red-500/20 text-red-500 font-bold py-2 rounded-lg transition-colors text-sm mt-2"
              >
                حذف الطلب
              </button>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [adminError, setAdminError] = useState('');

  const [orders, setOrders] = useState<any[]>([]);
  const [orderDraft, setOrderDraft] = useState<any>(null);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  const [deviceId] = useState(() => {
    let id = localStorage.getItem('deviceId');
    if (!id) {
      id = Math.random().toString(36).substring(2, 15);
      localStorage.setItem('deviceId', id);
    }
    return id;
  });

  useEffect(() => {
    const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ordersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      if (isAdminLoggedIn) {
        setOrders(ordersData);
      } else {
        setOrders(ordersData.filter((o: any) => o.userId === deviceId));
      }
    }, (error) => {
      console.error("Error fetching orders:", error);
    });

    return () => unsubscribe();
  }, [isAdminLoggedIn, deviceId]);

  const handleSelectPackage = (pkg: any) => {
    setOrderDraft({
      amount: pkg.followers,
      price: pkg.price,
      platformName: pkg.platformName,
      serviceName: pkg.serviceName
    });
    navigate('/checkout');
  };

  const handleConfirmOrder = async (order: any) => {
    try {
      const orderData = {
        amount: order.amount,
        price: order.price,
        platformName: order.platformName,
        serviceName: order.serviceName,
        link: order.link,
        transferPhone: order.transferPhone,
        status: order.status,
        date: order.date,
        createdAt: order.createdAt,
        userId: deviceId
      };
      await addDoc(collection(db, 'orders'), orderData);
    } catch (error) {
      console.error("Error adding order:", error);
      alert("حدث خطأ أثناء إضافة الطلب");
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const orderRef = doc(db, 'orders', orderId);
      await updateDoc(orderRef, {
        status: newStatus,
        acceptedAt: Date.now()
      });
    } catch (error) {
      console.error("Error updating order:", error);
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    try {
      await deleteDoc(doc(db, 'orders', orderId));
    } catch (error) {
      console.error("Error deleting order:", error);
    }
  };

  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPassword === 'ahmed787878') {
      setIsAdminLoggedIn(true);
      setShowAdminModal(false);
      setAdminPassword('');
      setAdminError('');
      navigate('/admin');
    } else {
      setAdminError('كلمة المرور غير صحيحة');
    }
  };

  const NavItem = ({ icon: Icon, label, path }: { icon: any, label: string, path: string }) => {
    const isActive = location.pathname === path;
    return (
      <button 
        onClick={() => navigate(path)}
        className={`flex flex-col items-center gap-1 p-2 w-16 transition-colors ${isActive ? 'text-[#ffb800]' : 'text-gray-500 hover:text-gray-300'}`}
      >
        <Icon size={24} className={isActive ? 'drop-shadow-[0_0_8px_rgba(255,184,0,0.5)]' : ''} />
        <span className="text-[10px] font-bold">{label}</span>
      </button>
    );
  };

  return (
    <div dir="rtl" className="min-h-screen bg-[#0d0d12] text-white font-sans selection:bg-[#ffb800]/30 relative">
      {/* Header */}
      <header className="flex items-center justify-between p-4 bg-[#0d0d12]/90 backdrop-blur-md sticky top-0 z-10 border-b border-gray-800/50">
        <button className="p-2 text-[#ffb800] hover:bg-[#ffb800]/10 rounded-lg transition-colors">
          <Menu size={28} />
        </button>
        
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-700 flex items-center justify-center shadow-[0_0_15px_rgba(255,184,0,0.2)]">
            <span className="text-[9px] font-black text-black leading-none text-center">الدعم<br/>العربي</span>
          </div>
          <h1 className="text-2xl font-bold text-[#ffb800] tracking-wide">الدعم العربي</h1>
        </div>

        <a 
          href="https://wa.me/201080379299"
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center p-1.5 text-emerald-500 hover:bg-emerald-500/10 rounded-lg transition-colors"
        >
          <MessageCircle size={24} />
          <span className="text-[8px] font-bold mt-1">للتواصل مع الإدارة</span>
        </a>
      </header>

      <Routes>
        <Route path="/" element={<Home onSelectPackage={handleSelectPackage} />} />
        <Route path="/checkout" element={<Checkout orderDraft={orderDraft} onConfirmOrder={handleConfirmOrder} />} />
        <Route path="/orders" element={<Orders orders={orders} />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/admin" element={<Admin orders={orders} onUpdateOrderStatus={handleUpdateOrderStatus} onDeleteOrder={handleDeleteOrder} />} />
      </Routes>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-[#1a1a24]/95 backdrop-blur-lg border-t border-gray-800 flex justify-around items-center p-2 z-40 pb-4">
        <NavItem icon={HomeIcon} label="الرئيسية" path="/" />
        <NavItem icon={ClipboardList} label="طلباتي" path="/orders" />
        <NavItem icon={User} label="أنا" path="/profile" />
        <button 
          onClick={() => setShowAdminModal(true)}
          className={`flex flex-col items-center gap-1 p-2 w-16 transition-colors ${location.pathname === '/admin' ? 'text-red-500' : 'text-gray-500 hover:text-gray-300'}`}
        >
          <Shield size={24} className={location.pathname === '/admin' ? 'drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]' : ''} />
          <span className="text-[10px] font-bold">الإدارة</span>
        </button>
      </nav>

      {/* Admin Password Modal */}
      {showAdminModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-[#1a1a24] p-6 rounded-2xl w-full max-w-sm border border-gray-800 shadow-2xl transform transition-all">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center">
                <Shield className="w-6 h-6 text-red-500" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-center text-white mb-2">تسجيل دخول الإدارة</h3>
            <p className="text-gray-400 text-sm text-center mb-6">يرجى إدخال كلمة المرور للوصول إلى لوحة التحكم</p>
            
            <form onSubmit={handleAdminSubmit}>
              <input 
                type="password" 
                value={adminPassword} 
                onChange={e => setAdminPassword(e.target.value)} 
                placeholder="كلمة المرور..."
                className="w-full bg-[#0d0d12] border border-gray-700 focus:border-[#ffb800] focus:ring-1 focus:ring-[#ffb800] outline-none rounded-xl p-3 text-white mb-2 transition-all text-center"
                autoFocus
              />
              {adminError && <p className="text-red-500 text-xs text-center mb-4">{adminError}</p>}
              {!adminError && <div className="h-4 mb-4"></div>}
              
              <div className="flex gap-3">
                <button type="submit" className="flex-1 bg-[#ffb800] hover:bg-[#e5a600] text-black font-bold py-3 rounded-xl transition-colors">
                  دخول
                </button>
                <button type="button" onClick={() => {setShowAdminModal(false); setAdminError(''); setAdminPassword('');}} className="flex-1 bg-gray-800 hover:bg-gray-700 text-white font-bold py-3 rounded-xl transition-colors">
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
