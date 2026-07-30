import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Lock, Unlock, X, Settings, Calendar, Eye, EyeOff, Search, Trash2, 
  User, Mail, Phone, Clock, FileText, Check, LogOut, Sparkles, Plus,
  Edit, Image, MapPin, Award, Trash, Heart, Layers, Globe, RefreshCcw
} from 'lucide-react';
import { Booking, Service, GalleryItem, Product } from '../types';
import { 
  getGeneralContent, saveGeneralContent, 
  getServicesContent, saveServicesContent, 
  getGalleryContent, saveGalleryContent, 
  getProductsContent, saveProductsContent,
  getBookings, deleteBookingFromFirestore,
  ClinicGeneralContent 
} from '../utils/content';

interface AdminPortalProps {
  isOpen: boolean;
  onClose: () => void;
  showPrices: boolean;
  setShowPrices: (show: boolean) => void;
}

type AdminTab = 'bookings' | 'general' | 'services' | 'gallery' | 'products';

export default function AdminPortal({ isOpen, onClose, showPrices, setShowPrices }: AdminPortalProps) {
  const [passkey, setPasskey] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(() => {
    return sessionStorage.getItem('acek_admin_unlocked') === 'true';
  });
  
  // Tab control
  const [activeTab, setActiveTab] = useState<AdminTab>('bookings');

  // Datasets
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [generalForm, setGeneralForm] = useState<ClinicGeneralContent>(getGeneralContent());
  const [services, setServices] = useState<Service[]>(getServicesContent());
  const [gallery, setGallery] = useState<GalleryItem[]>(getGalleryContent());
  const [products, setProducts] = useState<Product[]>(getProductsContent());

  // Edit / Add state for services
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [serviceForm, setServiceForm] = useState<Partial<Service>>({
    id: '', name: '', category: 'injectables', description: '', duration: 30, price: 300, benefits: [''], idealFor: ''
  });

  // Edit / Add state for gallery cases
  const [editingGalleryId, setEditingGalleryId] = useState<string | null>(null);
  const [galleryForm, setGalleryForm] = useState<Partial<GalleryItem>>({
    id: '', title: '', category: 'Injectable Contouring', beforeImage: '', afterImage: '', description: ''
  });

  // Edit / Add state for products
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [productForm, setProductForm] = useState<Partial<Product>>({
    id: '',
    category: 'serum',
    nameEn: '',
    nameKo: '',
    subEn: '',
    subKo: '',
    descEn: '',
    descKo: '',
    priceUsd: 0,
    priceKrw: 0,
    volume: '',
    activeEn: [''],
    activeKo: [''],
    usageEn: '',
    usageKo: '',
    imgUrl: ''
  });

  const [notification, setNotification] = useState<{ text: string; type: 'success' | 'info' } | null>(null);

  // Synchronize dynamic datasets when portal opens or updates occur
  useEffect(() => {
    const syncAll = () => {
      loadBookings();
      setGeneralForm(getGeneralContent());
      setServices(getServicesContent());
      setGallery(getGalleryContent());
      setProducts(getProductsContent());
    };

    if (isOpen) {
      syncAll();
      window.addEventListener('acek_content_update', syncAll);
      window.addEventListener('acek_bookings_update', syncAll);
      window.addEventListener('storage', syncAll);
    }
    return () => {
      window.removeEventListener('acek_content_update', syncAll);
      window.removeEventListener('acek_bookings_update', syncAll);
      window.removeEventListener('storage', syncAll);
    };
  }, [isOpen]);

  const triggerNotification = (text: string, type: 'success' | 'info' = 'success') => {
    setNotification({ text, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const loadBookings = () => {
    setBookings(getBookings());
  };

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (passkey.trim() === 'admin123') {
      setIsUnlocked(true);
      setErrorMsg('');
      setPasskey('');
      sessionStorage.setItem('acek_admin_unlocked', 'true');
      loadBookings();
      triggerNotification('Console Unlocked Successfully', 'success');
    } else {
      setErrorMsg('Invalid clinical passcode. Access denied.');
      setPasskey('');
    }
  };

  const handleLogout = () => {
    setIsUnlocked(false);
    sessionStorage.removeItem('acek_admin_unlocked');
  };

  const handleTogglePrice = () => {
    const nextVal = !showPrices;
    setShowPrices(nextVal);
    localStorage.setItem('acek_show_prices', String(nextVal));
    const currentGen = getGeneralContent();
    saveGeneralContent({ ...currentGen, showPrices: nextVal });
    setGeneralForm(prev => ({ ...prev, showPrices: nextVal }));
    triggerNotification(`Pricing display ${nextVal ? 'revealed' : 'hidden'} globally.`);
  };

  const handleDeleteBooking = (id: string) => {
    if (window.confirm(`Are you sure you want to delete/cancel appointment ${id}?`)) {
      deleteBookingFromFirestore(id);
      triggerNotification('Appointment canceled successfully', 'info');
    }
  };

  // General content save
  const handleSaveGeneral = (e: React.FormEvent) => {
    e.preventDefault();
    saveGeneralContent({ ...generalForm, showPrices });
    triggerNotification('Branding & general contents saved programmatically.');
  };

  const handleResetGeneral = () => {
    if (window.confirm('Reset all structural contents back to default factory aesthetics?')) {
      localStorage.removeItem('acek_general_content');
      setGeneralForm(getGeneralContent());
      window.dispatchEvent(new Event('acek_content_update'));
      triggerNotification('Contents reset to premium defaults', 'info');
    }
  };

  const [newHeroImageUrl, setNewHeroImageUrl] = useState('');

  const handleAddHeroImage = () => {
    if (!newHeroImageUrl.trim()) return;
    const currentList = generalForm.heroImages || [
      'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=1800',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1800',
      'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=1800'
    ];
    setGeneralForm({
      ...generalForm,
      heroImages: [...currentList, newHeroImageUrl.trim()]
    });
    setNewHeroImageUrl('');
    triggerNotification('Image URL added to slides draft. Click "Save All" to persist.', 'info');
  };

  const handleRemoveHeroImage = (indexToRemove: number) => {
    const currentList = generalForm.heroImages || [
      'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=1800',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1800',
      'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=1800'
    ];
    if (currentList.length <= 1) {
      alert("You must keep at least one background image inside your slideshow.");
      return;
    }
    const updated = currentList.filter((_, idx) => idx !== indexToRemove);
    setGeneralForm({
      ...generalForm,
      heroImages: updated
    });
    triggerNotification('Image index removed.', 'info');
  };

  const handleLogoFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 3 * 1024 * 1024) {
        alert("Image file size exceeds 3MB limit. Please upload a smaller image file or paste an image URL link.");
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result) {
          setGeneralForm(prev => ({ ...prev, logoUrl: result }));
          triggerNotification('Logo image uploaded! Click "Save All Branding Settings" below to persist changes.', 'info');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Treatment managers
  const handleStartEditService = (service: Service) => {
    setEditingServiceId(service.id);
    setServiceForm({ ...service });
  };

  const handleStartAddService = () => {
    setEditingServiceId('new');
    setServiceForm({
      id: 'treatment-' + Date.now(),
      name: '',
      category: 'injectables',
      description: '',
      duration: 45,
      price: 500,
      benefits: [''],
      idealFor: ''
    });
  };

  const handleSaveService = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedServices = [...services];
    const index = updatedServices.findIndex(s => s.id === serviceForm.id);
    const validatedService = {
      id: serviceForm.id || 'treatment-' + Date.now(),
      name: serviceForm.name || 'Untitled Procedure',
      category: serviceForm.category || 'injectables',
      description: serviceForm.description || '',
      duration: Number(serviceForm.duration) || 30,
      price: Number(serviceForm.price) || 0,
      benefits: (serviceForm.benefits || []).filter(b => b.trim() !== ''),
      idealFor: serviceForm.idealFor || 'All skins'
    } as Service;

    if (index > -1) {
      updatedServices[index] = validatedService;
    } else {
      updatedServices.push(validatedService);
    }

    saveServicesContent(updatedServices);
    setServices(updatedServices);
    setEditingServiceId(null);
    triggerNotification('Treatment protocol catalog saved successfully.');
  };

  const handleDeleteService = (id: string) => {
    if (window.confirm('Are you absolutely sure you want to remove this treatment from the live catalog?')) {
      const filtered = services.filter(s => s.id !== id);
      saveServicesContent(filtered);
      setServices(filtered);
      triggerNotification('Treatment successfully deleted from catalog.', 'info');
    }
  };

  // Gallery slider CMS operations
  const handleStartEditGallery = (item: GalleryItem) => {
    setEditingGalleryId(item.id);
    setGalleryForm({ ...item });
  };

  const handleStartAddGallery = () => {
    setEditingGalleryId('new');
    setGalleryForm({
      id: 'gallery-' + Date.now(),
      title: '',
      category: 'Injectable Contouring',
      beforeImage: 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?auto=format&fit=crop&q=80&w=600',
      afterImage: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&q=80&w=600',
      description: ''
    });
  };

  const handleSaveGallery = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedGallery = [...gallery];
    const index = updatedGallery.findIndex(g => g.id === galleryForm.id);
    const validatedCase = {
      id: galleryForm.id || 'gallery-' + Date.now(),
      title: galleryForm.title || 'Subtle Skin Transformation',
      category: galleryForm.category || 'Injectable Contouring',
      beforeImage: galleryForm.beforeImage || 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?auto=format&fit=crop&q=80&w=600',
      afterImage: galleryForm.afterImage || 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&q=80&w=600',
      description: galleryForm.description || ''
    } as GalleryItem;

    if (index > -1) {
      updatedGallery[index] = validatedCase;
    } else {
      updatedGallery.push(validatedCase);
    }

    saveGalleryContent(updatedGallery);
    setGallery(updatedGallery);
    setEditingGalleryId(null);
    triggerNotification('Before / After patient case file database updated.');
  };

  const handleDeleteGallery = (id: string) => {
    if (window.confirm('Delete this patient clinical case file from the visible catalog?')) {
      const filtered = gallery.filter(g => g.id !== id);
      saveGalleryContent(filtered);
      setGallery(filtered);
      triggerNotification('Clinical case registry removed.', 'info');
    }
  };

  // Product CMS operations
  const handleStartEditProduct = (product: Product) => {
    setEditingProductId(product.id);
    setProductForm({
      ...product,
      activeEn: Array.isArray(product.activeEn) ? product.activeEn.join('\n') : (product.activeEn || '') as any,
      activeKo: Array.isArray(product.activeKo) ? product.activeKo.join('\n') : (product.activeKo || '') as any,
    });
  };

  const handleStartAddProduct = () => {
    setEditingProductId('new');
    setProductForm({
      id: 'product-' + Date.now(),
      category: 'serum',
      nameEn: '',
      nameKo: '',
      subEn: '',
      subKo: '',
      descEn: '',
      descKo: '',
      priceUsd: 100,
      priceKrw: 130000,
      volume: '30 ml / 1.01 fl. oz.',
      activeEn: '' as any,
      activeKo: '' as any,
      usageEn: '',
      usageKo: '',
      imgUrl: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=600'
    });
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedProducts = [...products];
    const index = updatedProducts.findIndex(p => p.id === productForm.id);
    
    const activeEnArray = typeof productForm.activeEn === 'string'
      ? (productForm.activeEn as string).split('\n').map(x => x.trim()).filter(x => x !== '')
      : (Array.isArray(productForm.activeEn) ? productForm.activeEn : []);

    const activeKoArray = typeof productForm.activeKo === 'string'
      ? (productForm.activeKo as string).split('\n').map(x => x.trim()).filter(x => x !== '')
      : (Array.isArray(productForm.activeKo) ? productForm.activeKo : []);

    const validatedProduct = {
      id: productForm.id || 'product-' + Date.now(),
      category: productForm.category || 'serum',
      nameEn: productForm.nameEn || 'New Clinical Formula',
      nameKo: productForm.nameKo || '새로운 임상 제품',
      subEn: productForm.subEn || '',
      subKo: productForm.subKo || '',
      descEn: productForm.descEn || '',
      descKo: productForm.descKo || '',
      priceUsd: Number(productForm.priceUsd) || 0,
      priceKrw: Number(productForm.priceKrw) || 0,
      volume: productForm.volume || '',
      activeEn: activeEnArray,
      activeKo: activeKoArray,
      usageEn: productForm.usageEn || '',
      usageKo: productForm.usageKo || '',
      imgUrl: productForm.imgUrl || 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=600'
    } as Product;

    if (index > -1) {
      updatedProducts[index] = validatedProduct;
    } else {
      updatedProducts.push(validatedProduct);
    }

    saveProductsContent(updatedProducts);
    setProducts(updatedProducts);
    setEditingProductId(null);
    triggerNotification('Product formulation catalog saved successfully.');
  };

  const handleDeleteProduct = (id: string) => {
    if (window.confirm('Are you absolutely sure you want to remove this product from the live catalog?')) {
      const filtered = products.filter(p => p.id !== id);
      saveProductsContent(filtered);
      setProducts(filtered);
      triggerNotification('Product successfully deleted from catalog.', 'info');
    }
  };

  // Filter list results
  const filteredBookings = bookings.filter(b => {
    const query = searchQuery.toLowerCase();
    return (
      b.patientName.toLowerCase().includes(query) ||
      b.serviceName.toLowerCase().includes(query) ||
      b.specialistName.toLowerCase().includes(query) ||
      b.id.toLowerCase().includes(query)
    );
  });

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-2 sm:p-4">
          {/* Blur backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#121315]/80 backdrop-blur-sm"
          />

          {/* Admin Container Card */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="relative bg-white w-full max-w-5xl rounded-2xl shadow-2xl border border-gray-200 overflow-hidden z-10 flex flex-col h-[92vh] sm:h-[88vh]"
          >
            {/* Elegant Top Gold Line Decoration */}
            <div className="h-1 bg-gradient-to-r from-amber-600 via-[#D4AF37] to-amber-600"></div>

            {/* Close Button Pin */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 hover:bg-gray-100 p-1.5 rounded-full transition-all cursor-pointer z-20"
              title="Close Portal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* POPUP NOTIFICATION TRAY */}
            {notification && (
              <div className={`absolute top-4 left-1/2 transform -translate-x-1/2 z-30 px-4 py-2 font-mono text-xs rounded-full shadow-lg border animate-slideDown flex items-center gap-2 ${
                notification.type === 'success' 
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                  : 'bg-amber-50 text-amber-800 border-amber-200'
              }`}>
                <span className="w-2 h-2 bg-current rounded-full animate-pulse"></span>
                <span>{notification.text}</span>
              </div>
            )}

            {/* 1. SECURE UNLOCK SCREEN */}
            {!isUnlocked ? (
              <div className="p-6 sm:p-12 text-center max-w-md mx-auto my-auto flex flex-col justify-center items-center py-16">
                <div className="w-16 h-16 rounded-full bg-[#D4AF37]/10 flex items-center justify-center text-[#B8860B] border border-[#D4AF37]/35 mb-6 animate-pulse">
                  <Lock className="w-7 h-7" />
                </div>
                
                <h3 className="text-2xl font-serif text-gray-800 font-semibold mb-2">ACE K Clinic Console</h3>
                <p className="text-xs text-gray-500 font-sans leading-relaxed mb-6">
                  This system is restricted to verified clinical operators. Unlock to edit display values, update procedure lists, customize image galleries, and track patient reservations.
                </p>

                <form onSubmit={handleUnlock} className="w-full space-y-4">
                  <div>
                    <input
                      type="password"
                      required
                      value={passkey}
                      onChange={(e) => setPasskey(e.target.value)}
                      placeholder="Enter Administrator Passkey"
                      className="w-full text-center bg-[#F9F9F7] border border-gray-250 rounded-lg py-3 px-4 text-sm font-mono placeholder-gray-400 focus:outline-[#D4AF37] focus:bg-white text-gray-800"
                    />
                    {errorMsg && (
                      <p className="text-[11px] text-red-500 font-medium font-sans mt-2">
                        {errorMsg}
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#D4AF37] hover:bg-[#B8860B] text-white font-mono text-xs font-semibold uppercase tracking-widest py-3 rounded-lg transition-all cursor-pointer shadow-sm"
                  >
                    Authenticate Access
                  </button>
                </form>

                <div className="mt-6 border-t border-gray-150 pt-4 w-full">
                  <span className="text-[10px] font-mono text-[#B8860B] bg-amber-500/5 px-2.5 py-1 rounded">
                    Demonstration Passkey: <strong className="font-bold">admin123</strong>
                  </span>
                </div>
              </div>
            ) : (
              /* 2. ADMIN PORTAL CONTENT PANEL */
              <div className="flex flex-col h-full overflow-hidden">
                {/* Header Row */}
                <div className="p-4 sm:p-6 border-b border-gray-200 bg-[#F9F9F7] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center border border-emerald-500/20">
                      <Unlock className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-xl font-serif font-semibold text-gray-800 flex items-center gap-2">
                        {generalForm.clinicName} Console <span className="text-[9px] uppercase tracking-wider font-mono bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">Authorized</span>
                      </h3>
                      <p className="text-[10px] uppercase font-mono text-[#B8860B] tracking-wider font-semibold">Hospitality & Aesthetic Management System</p>
                    </div>
                  </div>

                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-red-200 text-red-650 hover:bg-red-50 text-xs font-mono font-medium transition-all cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Secure Logout</span>
                  </button>
                </div>

                {/* CMS Tab navigation bar */}
                <div className="flex border-b border-gray-200 bg-white px-4 sm:px-6 overflow-x-auto gap-4 font-mono text-xs uppercase tracking-wider">
                  <button
                    onClick={() => setActiveTab('bookings')}
                    className={`py-3.5 border-b-2 font-medium transition-all cursor-pointer whitespace-nowrap ${
                      activeTab === 'bookings' ? 'border-[#D4AF37] text-gray-900 font-bold' : 'border-transparent text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    Reservations Ledger
                  </button>
                  <button
                    onClick={() => setActiveTab('general')}
                    className={`py-3.5 border-b-2 font-medium transition-all cursor-pointer whitespace-nowrap ${
                      activeTab === 'general' ? 'border-[#D4AF37] text-gray-900 font-bold' : 'border-transparent text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    Branding & General Texts
                  </button>
                  <button
                    onClick={() => setActiveTab('services')}
                    className={`py-3.5 border-b-2 font-medium transition-all cursor-pointer whitespace-nowrap ${
                      activeTab === 'services' ? 'border-[#D4AF37] text-gray-900 font-bold' : 'border-transparent text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    Treatments Catalog
                  </button>
                  <button
                    onClick={() => setActiveTab('gallery')}
                    className={`py-3.5 border-b-2 font-medium transition-all cursor-pointer whitespace-nowrap ${
                      activeTab === 'gallery' ? 'border-[#D4AF37] text-gray-900 font-bold' : 'border-transparent text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    Before/After Cases
                  </button>
                  <button
                    onClick={() => setActiveTab('products')}
                    className={`py-3.5 border-b-2 font-medium transition-all cursor-pointer whitespace-nowrap ${
                      activeTab === 'products' ? 'border-[#D4AF37] text-gray-900 font-bold' : 'border-transparent text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    Clinic Products
                  </button>
                </div>

                {/* Sub-body (Scroller) */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#FAF9F5]/30">

                  {/* TAB 1: RESERVATIONS Ledger */}
                  {activeTab === 'bookings' && (
                    <div className="space-y-6">
                      {/* CONFIGURATIONS QUICK DISP */}
                      <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="space-y-0.5">
                            <span className="text-xs uppercase tracking-wider font-mono text-[#B8860B] font-semibold block mb-1">Global Preference Toggle</span>
                            <span className="block text-xs font-serif font-semibold text-gray-800">Switch Pricing Display Modes</span>
                          </div>

                          <button
                            onClick={handleTogglePrice}
                            className={`font-mono text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-lg flex items-center gap-2 transition-all cursor-pointer border ${
                              showPrices 
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100' 
                                : 'bg-red-50 text-red-800 border-red-200 hover:bg-red-100'
                            }`}
                          >
                            {showPrices ? (
                              <>
                                <Eye className="w-4 h-4 text-emerald-600" />
                                <span>Prices Exposed</span>
                              </>
                            ) : (
                              <>
                                <EyeOff className="w-4 h-4 text-red-600" />
                                <span>Prices Hidden</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                          <div>
                            <h4 className="font-serif text-sm text-gray-800 uppercase tracking-wider font-semibold flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-[#B8860B]" /> Hold Bookings Console ({filteredBookings.length})
                            </h4>
                            <p className="text-[11px] text-gray-500 font-sans mt-0.5">
                              Meticulous clinical hold request logbook. All data points remain persisted inside sandbox state.
                            </p>
                          </div>

                          {/* Search Database */}
                          <div className="relative w-full sm:w-64">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                              <Search className="w-4 h-4" />
                            </span>
                            <input
                              type="text"
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              placeholder="Search patient, doc, service..."
                              className="w-full bg-white border border-gray-200 rounded-lg py-2 pl-9 pr-4 text-xs placeholder-gray-400 focus:outline-[#D4AF37] text-gray-800"
                            />
                          </div>
                        </div>

                        {filteredBookings.length === 0 ? (
                          <div className="text-center py-12 border border-dashed border-gray-200 bg-white rounded-xl text-gray-400 space-y-2">
                            <FileText className="w-8 h-8 mx-auto stroke-1 text-gray-300" />
                            <p className="text-xs font-sans">No matching reservations registered.</p>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {filteredBookings.map((b) => (
                              <div 
                                key={b.id} 
                                className="bg-white border border-gray-200 rounded-xl p-4 sm:p-5 shadow-sm relative hover:shadow-md transition-all flex flex-col md:flex-row md:justify-between md:items-center gap-4"
                              >
                                <div className="space-y-2 flex-1">
                                  <div className="flex flex-wrap items-center gap-2">
                                    <span className="font-mono text-[9px] uppercase font-bold text-[#B8860B] bg-amber-500/5 px-2 py-0.5 rounded">
                                      HOLD ID: {b.id}
                                    </span>
                                    <span className="text-[10px] text-gray-400 font-mono">
                                      Registered: {new Date(b.createdAt).toLocaleDateString()}
                                    </span>
                                  </div>

                                  <div>
                                    <h5 className="font-serif text-sm font-semibold text-gray-800">{b.serviceName}</h5>
                                    <p className="text-xs text-gray-500 font-sans mt-0.5">
                                      Clinician Assignee: <span className="text-[#B8860B] font-serif font-semibold">{b.specialistName}</span>
                                    </p>
                                  </div>

                                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-2 text-xs font-mono text-gray-600 border-t border-gray-100">
                                    <span className="flex items-center gap-1.5 text-gray-700 font-semibold truncate">
                                      <User className="w-3.5 h-3.5 text-gray-400" /> {b.patientName}
                                    </span>
                                    <span className="flex items-center gap-1.5 text-gray-550 truncate">
                                      <Phone className="w-3.5 h-3.5 text-gray-400" /> {b.patientPhone}
                                    </span>
                                    <span className="flex items-center gap-1.5 truncate text-gray-550">
                                      <Mail className="w-3.5 h-3.5 text-gray-400" /> {b.patientEmail}
                                    </span>
                                  </div>

                                  {b.concerns && (
                                    <div className="bg-[#FAF9F5] border border-gray-150 p-2.5 rounded-lg text-[11px] text-gray-550 leading-relaxed font-sans italic">
                                      <strong>Aesthetic Priorities:</strong> "{b.concerns}"
                                    </div>
                                  )}
                                </div>

                                <div className="md:border-l border-gray-150 md:pl-6 flex flex-col items-start md:items-end justify-center gap-3 min-w-[190px]">
                                  <div className="text-left md:text-right space-y-1">
                                    <span className="block text-[10px] font-mono text-gray-400 uppercase tracking-widest leading-none">Schedule Details</span>
                                    <span className="block text-xs text-gray-800 font-serif font-semibold mt-0.5">{new Date(b.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                    <span className="block text-xs font-mono text-[#B8860B] font-semibold">{b.timeSlot}</span>
                                  </div>

                                  <div className="flex justify-between items-center w-full border-t border-dashed border-gray-200 pt-2 font-mono text-xs">
                                    <span className="text-gray-400 font-sans">Holding Cost:</span>
                                    <span className="text-gray-800 font-bold font-mono text-xs">
                                      {showPrices ? `$${b.totalPrice}` : 'By Consultation'}
                                    </span>
                                  </div>

                                  <button
                                    onClick={() => handleDeleteBooking(b.id)}
                                    className="w-full flex items-center justify-center gap-1 py-1.5 bg-red-50 hover:bg-red-100 border border-red-200 text-red-650 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                    <span>Cancel Placement</span>
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* TAB 2: GENERAL CMS BRANDING TEXTS */}
                  {activeTab === 'general' && (
                    <form onSubmit={handleSaveGeneral} className="space-y-6">
                      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-4">
                        <h4 className="font-serif text-sm text-[#B8860B] uppercase tracking-wider font-semibold border-b border-gray-150 pb-3 flex items-center gap-2">
                          <Globe className="w-4 h-4" /> Core Brand Details
                        </h4>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Custom Logo Upload & Link Card */}
                          <div className="space-y-2 md:col-span-2 bg-[#FAF9F6] p-4 rounded-xl border border-amber-500/25 relative">
                            <div className="flex justify-between items-center mb-1 flex-wrap gap-2">
                              <label className="block text-[11px] font-mono uppercase tracking-wider text-[#B8860B] font-bold flex items-center gap-1.5">
                                <Image className="w-3.5 h-3.5 text-[#B8860B]" />
                                Custom Clinic Logo (Image Upload or URL Link)
                              </label>
                              {generalForm.logoUrl && (
                                <button
                                  type="button"
                                  onClick={() => setGeneralForm({ ...generalForm, logoUrl: '' })}
                                  className="text-[10px] text-red-600 hover:text-red-800 font-mono underline font-medium cursor-pointer"
                                >
                                  Clear Custom Logo (Use Text Badge)
                                </button>
                              )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5 items-center">
                              {/* Preview Column */}
                              <div className="md:col-span-4 flex flex-col items-center justify-center p-3 bg-white rounded-lg border border-gray-200 shadow-2xs">
                                <span className="block text-[9px] font-mono uppercase tracking-widest text-gray-400 mb-1.5 font-bold">Logo Live Preview</span>
                                <div className="h-12 w-full flex items-center justify-center bg-gray-50 rounded border border-dashed border-gray-250 p-1 overflow-hidden">
                                  {generalForm.logoUrl ? (
                                    <img
                                      src={generalForm.logoUrl}
                                      alt="Clinic Logo Preview"
                                      className="max-h-10 max-w-full object-contain"
                                      referrerPolicy="no-referrer"
                                    />
                                  ) : (
                                    <div className="text-[10px] font-mono text-gray-400 italic">No custom logo (using default text)</div>
                                  )}
                                </div>
                              </div>

                              {/* Input Methods Column */}
                              <div className="md:col-span-8 space-y-2.5">
                                <div>
                                  <label className="block text-[10px] font-mono uppercase text-gray-500 mb-1">Option A: Paste Logo Image URL Link</label>
                                  <input
                                    type="text"
                                    placeholder="https://your-domain.com/logo.png or data:image/..."
                                    value={generalForm.logoUrl || ''}
                                    onChange={(e) => setGeneralForm({ ...generalForm, logoUrl: e.target.value })}
                                    className="w-full bg-white border border-gray-250 p-2 rounded-lg text-xs font-mono text-gray-800 focus:outline-[#D4AF37]"
                                  />
                                </div>

                                <div className="flex items-center gap-2">
                                  <span className="text-[10px] font-mono text-gray-400 uppercase font-semibold">Option B:</span>
                                  <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#D4AF37] hover:bg-[#B8860B] text-white rounded-lg text-xs font-mono font-medium shadow-2xs transition-all">
                                    <Plus className="w-3.5 h-3.5" />
                                    <span>Upload Image File from Device</span>
                                    <input
                                      type="file"
                                      accept="image/*"
                                      onChange={handleLogoFileUpload}
                                      className="hidden"
                                    />
                                  </label>
                                </div>
                              </div>
                            </div>

                            <p className="text-[10px] text-gray-500 font-sans mt-1 leading-relaxed">
                              Upload or paste a PNG, SVG, or JPG image link. For best results, use a transparent PNG or vector SVG with aspect ratio suitable for header display.
                            </p>
                          </div>

                          <div className="space-y-1">
                            <label className="block text-[11px] font-mono uppercase tracking-wider text-gray-500">Clinic Name Display</label>
                            <input
                              type="text"
                              value={generalForm.clinicName}
                              onChange={(e) => setGeneralForm({ ...generalForm, clinicName: e.target.value })}
                              className="w-full bg-[#F9F9F7] border border-gray-250 p-2.5 rounded-lg text-xs font-serif text-gray-800 focus:outline-[#D4AF37] focus:bg-white"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="block text-[11px] font-mono uppercase tracking-wider text-gray-500">Direct Contact Hot-line</label>
                            <input
                              type="text"
                              value={generalForm.phone}
                              onChange={(e) => setGeneralForm({ ...generalForm, phone: e.target.value })}
                              className="w-full bg-[#F9F9F7] border border-gray-250 p-2.5 rounded-lg text-xs font-mono text-gray-800 focus:outline-[#D4AF37] focus:bg-white"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="block text-[11px] font-mono uppercase tracking-wider text-gray-500">Public Concierge Email Address</label>
                            <input
                              type="email"
                              value={generalForm.email}
                              onChange={(e) => setGeneralForm({ ...generalForm, email: e.target.value })}
                              className="w-full bg-[#F9F9F7] border border-gray-250 p-2.5 rounded-lg text-xs font-mono text-gray-800 focus:outline-[#D4AF37] focus:bg-white"
                            />
                          </div>

                          <div className="space-y-1 md:col-span-2 bg-[#FAF9F5] p-4 rounded-xl border border-[#D4AF37]/35 relative">
                            <div className="flex justify-between items-center mb-1 flex-wrap gap-2">
                              <label className="block text-[11px] font-mono uppercase tracking-wider text-[#B8860B] font-bold">
                                Automated Email Dispatch Token (Web3Forms Key)
                              </label>
                              <a 
                                href="https://web3forms.com/#start" 
                                target="_blank" 
                                rel="noreferrer" 
                                className="text-[10px] text-[#B8860B] hover:underline font-mono font-semibold"
                              >
                                Get Free Access Key &rarr;
                              </a>
                            </div>
                            <input
                              type="text"
                              value={generalForm.web3formsKey || ''}
                              onChange={(e) => setGeneralForm({ ...generalForm, web3formsKey: e.target.value })}
                              placeholder="e.g. 1234abcd-12ab-34cd-56ef-1234567890ab"
                              className="w-full bg-white border border-gray-250 p-2.5 rounded-lg text-xs font-mono text-gray-800 focus:outline-[#D4AF37]"
                            />
                            <p className="text-[10px] text-gray-500 font-sans mt-1.5 leading-relaxed">
                              Configure a Web3Forms access key registered with <strong>{generalForm.email || 'acekservice.kh@gmail.com'}</strong> to instantly schedule automatic email notifications straight to your inbox whenever patients book an appointment. If left blank, patients will see an option to instantly draft the pre-filled appointment email with one click after booking.
                            </p>
                          </div>

                          <div className="space-y-3 md:col-span-2 bg-[#EEF7FF]/40 p-4 rounded-xl border border-sky-300/30 relative">
                            <div className="flex justify-between items-center mb-1 flex-wrap gap-2">
                              <label className="block text-[11px] font-mono uppercase tracking-wider text-sky-800 font-bold">
                                Telegram Group Alert System
                              </label>
                              <span className="text-[9px] font-mono uppercase bg-sky-100 text-sky-700 px-1.5 py-0.5 rounded-md font-semibold">
                                Live Integration
                              </span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                              <div className="space-y-1">
                                <label className="block text-[10px] font-mono uppercase tracking-wider text-gray-500">Telegram Bot Token (HTTP API)</label>
                                <input
                                  type="text"
                                  value={generalForm.telegramBotToken || ''}
                                  onChange={(e) => setGeneralForm({ ...generalForm, telegramBotToken: e.target.value })}
                                  placeholder="e.g. 123456789:ABCdefGhIJKlmNoPQRsT"
                                  className="w-full bg-white border border-gray-250 p-2.5 rounded-lg text-xs font-mono text-gray-800 focus:outline-[#D4AF37]"
                                />
                              </div>

                              <div className="space-y-1">
                                <label className="block text-[10px] font-mono uppercase tracking-wider text-gray-500">Telegram Group Chat ID</label>
                                <input
                                  type="text"
                                  value={generalForm.telegramChatId || ''}
                                  onChange={(e) => setGeneralForm({ ...generalForm, telegramChatId: e.target.value })}
                                  placeholder="e.g. -1001234567890"
                                  className="w-full bg-white border border-gray-250 p-2.5 rounded-lg text-xs font-mono text-gray-800 focus:outline-[#D4AF37]"
                                />
                              </div>
                            </div>

                            <p className="text-[10px] text-gray-500 font-sans mt-1 leading-relaxed">
                              Send instant alerts directly to your Telegram staff group whenever a clinical appointment is made. <strong>Configuration details:</strong> 1) Message <code>@BotFather</code> on Telegram to create a bot. 2) Add the bot to your Telegram Group as a member/administrator. 3) Invite <code>@MissRose_bot</code> to your group and type <code>/id</code> to retrieve your target Group Chat ID (it usually begins with <code>-100</code>).
                            </p>
                          </div>

                          <div className="space-y-1">
                            <label className="block text-[11px] font-mono uppercase tracking-wider text-gray-500">Physical Coordinates / Address</label>
                            <input
                              type="text"
                              value={generalForm.address}
                              onChange={(e) => setGeneralForm({ ...generalForm, address: e.target.value })}
                              className="w-full bg-[#F9F9F7] border border-gray-250 p-2.5 rounded-lg text-xs font-serif text-gray-800 focus:outline-[#D4AF37] focus:bg-white"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-4">
                        <h4 className="font-serif text-sm text-[#B8860B] uppercase tracking-wider font-semibold border-b border-gray-150 pb-3 flex items-center gap-2">
                          <Sparkles className="w-4 h-4" /> Hero Banner Presentation Texts
                        </h4>

                        <div className="space-y-4">
                          <div className="space-y-1">
                            <label className="block text-[11px] font-mono uppercase tracking-wider text-gray-500">Main Display Title</label>
                            <input
                              type="text"
                              value={generalForm.heroTitle}
                              onChange={(e) => setGeneralForm({ ...generalForm, heroTitle: e.target.value })}
                              className="w-full bg-[#F9F9F7] border border-gray-250 p-2.5 rounded-lg text-xs font-serif text-gray-800 focus:outline-[#D4AF37] focus:bg-white"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="block text-[11px] font-mono uppercase tracking-wider text-gray-500">Sub-title / Intro Statement</label>
                            <textarea
                              rows={3}
                              value={generalForm.heroSubTitle}
                              onChange={(e) => setGeneralForm({ ...generalForm, heroSubTitle: e.target.value })}
                              className="w-full bg-[#F9F9F7] border border-gray-250 p-2.5 rounded-lg text-xs font-sans text-gray-700 focus:outline-[#D4AF37] focus:bg-white leading-relaxed"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-4">
                        <h4 className="font-serif text-sm text-[#B8860B] uppercase tracking-wider font-semibold border-b border-gray-150 pb-3 flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-[#D4AF37]" /> Co-Founder & CEO Letter & Executive Message
                        </h4>

                        <div className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <label className="block text-[11px] font-mono uppercase tracking-wider text-gray-500">CEO Name & Letters</label>
                              <input
                                type="text"
                                value={generalForm.actualCeoName || ''}
                                onChange={(e) => setGeneralForm({ ...generalForm, actualCeoName: e.target.value })}
                                className="w-full bg-[#F9F9F7] border border-gray-250 p-2.5 rounded-lg text-xs font-serif text-gray-800 focus:outline-[#D4AF37] focus:bg-white"
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="block text-[11px] font-mono uppercase tracking-wider text-gray-500">CEO Motto / Tagline</label>
                              <input
                                type="text"
                                value={generalForm.actualCeoSubtitle || ''}
                                onChange={(e) => setGeneralForm({ ...generalForm, actualCeoSubtitle: e.target.value })}
                                className="w-full bg-[#F9F9F7] border border-gray-250 p-2.5 rounded-lg text-xs font-serif text-gray-800 focus:outline-[#D4AF37] focus:bg-white"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center bg-gray-50/70 p-4 rounded-xl border border-gray-150">
                            <div className="md:col-span-1 flex flex-col items-center justify-center">
                              <span className="block text-[10px] font-mono uppercase tracking-widest text-gray-400 mb-1.5 font-bold">Live Preview</span>
                              <div className="w-16 h-20 rounded-lg overflow-hidden border border-gray-200 bg-neutral-200 shadow-sm">
                                <img
                                  src={generalForm.actualCeoImage || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=800"}
                                  alt="CEO Thumbnail"
                                  className="w-full h-full object-cover object-top"
                                  referrerPolicy="no-referrer"
                                />
                              </div>
                            </div>
                            <div className="md:col-span-3 space-y-1.5">
                              <label className="block text-[11px] font-mono uppercase tracking-wider text-gray-500">CEO Portrait Image URL</label>
                              <div className="flex gap-2">
                                <input
                                  type="text"
                                  placeholder="https://images.unsplash.com/photo-..."
                                  value={generalForm.actualCeoImage || ''}
                                  onChange={(e) => setGeneralForm({ ...generalForm, actualCeoImage: e.target.value })}
                                  className="flex-1 bg-white border border-gray-250 p-2 py-1.5 rounded-lg text-[11px] font-mono text-gray-800 focus:outline-[#D4AF37]"
                                />
                                <button
                                  type="button"
                                  onClick={() => setGeneralForm({ ...generalForm, actualCeoImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=800' })}
                                  className="px-3 bg-gray-200 hover:bg-gray-350 text-gray-700 hover:text-black rounded-lg text-xs font-mono transition-all border border-gray-300 cursor-pointer"
                                  title="Reset portrait to original Unsplash photo"
                                >
                                  Reset
                                </button>
                              </div>
                              <p className="text-[10px] text-gray-400 font-sans leading-normal">Provide a secure high-resolution portrait URL (HTTPs). Absolute URLs from Unsplash, Imgur, or clinic hosting assets are fully supported.</p>
                            </div>
                          </div>

                          <div className="space-y-1">
                            <label className="block text-[11px] font-mono uppercase tracking-wider text-gray-500">CEO Message Paragraph 1</label>
                            <textarea
                              rows={3}
                              value={generalForm.actualCeoParagraph1 || ''}
                              onChange={(e) => setGeneralForm({ ...generalForm, actualCeoParagraph1: e.target.value })}
                              className="w-full bg-[#F9F9F7] border border-gray-250 p-2.5 rounded-lg text-xs font-sans text-gray-700 focus:outline-[#D4AF37] focus:bg-white leading-relaxed"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="block text-[11px] font-mono uppercase tracking-wider text-gray-500">CEO Message Paragraph 2</label>
                            <textarea
                              rows={3}
                              value={generalForm.actualCeoParagraph2 || ''}
                              onChange={(e) => setGeneralForm({ ...generalForm, actualCeoParagraph2: e.target.value })}
                              className="w-full bg-[#F9F9F7] border border-gray-250 p-2.5 rounded-lg text-xs font-sans text-gray-700 focus:outline-[#D4AF37] focus:bg-white leading-relaxed"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-4">
                        <h4 className="font-serif text-sm text-[#B8860B] uppercase tracking-wider font-semibold border-b border-gray-150 pb-3 flex items-center gap-2">
                          <Award className="w-4 h-4" /> Chief Medical Director Letter & Bio Message
                        </h4>

                        <div className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <label className="block text-[11px] font-mono uppercase tracking-wider text-gray-500">Director Name & MD Letters</label>
                              <input
                                type="text"
                                value={generalForm.ceoMessageTitle}
                                onChange={(e) => setGeneralForm({ ...generalForm, ceoMessageTitle: e.target.value })}
                                className="w-full bg-[#F9F9F7] border border-gray-250 p-2.5 rounded-lg text-xs font-serif text-gray-800 focus:outline-[#D4AF37] focus:bg-white"
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="block text-[11px] font-mono uppercase tracking-wider text-gray-500">Message Sign-off Banner Tagline</label>
                              <input
                                type="text"
                                value={generalForm.ceoMessageSubtitle}
                                onChange={(e) => setGeneralForm({ ...generalForm, ceoMessageSubtitle: e.target.value })}
                                className="w-full bg-[#F9F9F7] border border-gray-250 p-2.5 rounded-lg text-xs font-serif text-gray-800 focus:outline-[#D4AF37] focus:bg-white"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center bg-gray-50/70 p-4 rounded-xl border border-gray-150">
                            <div className="md:col-span-1 flex flex-col items-center justify-center">
                              <span className="block text-[10px] font-mono uppercase tracking-widest text-gray-400 mb-1.5 font-bold">Live Preview</span>
                              <div className="w-16 h-20 rounded-lg overflow-hidden border border-gray-200 bg-neutral-200 shadow-sm">
                                <img
                                  src={generalForm.ceoImage || "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=800"}
                                  alt="Director Thumbnail"
                                  className="w-full h-full object-cover object-top"
                                  referrerPolicy="no-referrer"
                                />
                              </div>
                            </div>
                            <div className="md:col-span-3 space-y-1.5">
                              <label className="block text-[11px] font-mono uppercase tracking-wider text-gray-500">Director Portrait Image URL</label>
                              <div className="flex gap-2">
                                <input
                                  type="text"
                                  placeholder="https://images.unsplash.com/photo-..."
                                  value={generalForm.ceoImage || ''}
                                  onChange={(e) => setGeneralForm({ ...generalForm, ceoImage: e.target.value })}
                                  className="flex-1 bg-white border border-gray-250 p-2 py-1.5 rounded-lg text-[11px] font-mono text-gray-800 focus:outline-[#D4AF37]"
                                />
                                <button
                                  type="button"
                                  onClick={() => setGeneralForm({ ...generalForm, ceoImage: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=800' })}
                                  className="px-3 bg-gray-200 hover:bg-gray-350 text-gray-700 hover:text-black rounded-lg text-xs font-mono transition-all border border-gray-300 cursor-pointer"
                                  title="Reset portrait to original Unsplash photo"
                                >
                                  Reset
                                </button>
                              </div>
                              <p className="text-[10px] text-gray-400 font-sans leading-normal">Provide a secure high-resolution portrait URL (HTTPs). Absolute URLs from Unsplash, Imgur, or clinic hosting assets are fully supported.</p>
                            </div>
                          </div>

                          <div className="space-y-1">
                            <label className="block text-[11px] font-mono uppercase tracking-wider text-gray-500">Message Content Block 1</label>
                            <textarea
                              rows={3}
                              value={generalForm.ceoParagraph1}
                              onChange={(e) => setGeneralForm({ ...generalForm, ceoParagraph1: e.target.value })}
                              className="w-full bg-[#F9F9F7] border border-gray-250 p-2.5 rounded-lg text-xs font-sans text-gray-700 focus:outline-[#D4AF37] focus:bg-white leading-relaxed"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="block text-[11px] font-mono uppercase tracking-wider text-gray-500">Message Content Block 2</label>
                            <textarea
                              rows={3}
                              value={generalForm.ceoParagraph2}
                              onChange={(e) => setGeneralForm({ ...generalForm, ceoParagraph2: e.target.value })}
                              className="w-full bg-[#F9F9F7] border border-gray-250 p-2.5 rounded-lg text-xs font-sans text-gray-700 focus:outline-[#D4AF37] focus:bg-white leading-relaxed"
                            />
                          </div>
                        </div>
                      </div>

                      {/* HERO BANNER SLIDESHOW MANAGER */}
                      <div className="bg-white border border-[#D4AF37]/35 rounded-xl p-5 shadow-sm space-y-4">
                        <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
                          <Image className="w-4.5 h-4.5 text-[#B8860B]" />
                          <div>
                            <h5 className="font-serif text-sm text-gray-800 uppercase tracking-wider font-semibold">Hero Banner Image Slideshow Manager</h5>
                            <p className="text-[11px] text-gray-500 font-sans">Delete or add hosted image URLs. The background banner on the home screen automatically slides through these photos in real-time.</p>
                          </div>
                        </div>

                        {/* Active Slides Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          {(generalForm.heroImages || [
                            'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=1800',
                            'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1800',
                            'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=1800'
                          ]).map((imgUrl, idx) => (
                            <div key={idx} className="group relative rounded-lg border border-gray-250 overflow-hidden bg-gray-50 pt-[56.25%] shadow-sm">
                              {/* Image Thumbnail Preview */}
                              <img 
                                src={imgUrl} 
                                alt={`Hero Slide ${idx + 1}`} 
                                className="absolute inset-0 w-full h-full object-cover"
                                referrerPolicy="no-referrer"
                                onError={(e) => {
                                  // Fallback indicator if link is broken
                                  e.currentTarget.src = "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&q=80&w=600";
                                }}
                              />
                              {/* Badge Identifier */}
                              <div className="absolute top-1.5 left-1.5 bg-black/60 backdrop-blur-md text-[9px] font-mono text-white px-2 py-0.5 rounded uppercase tracking-wider">
                                Slide {idx + 1}
                              </div>
                              {/* Hover Overlay Delete Trigger */}
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 backdrop-blur-[1px]">
                                <button
                                  type="button"
                                  onClick={() => handleRemoveHeroImage(idx)}
                                  className="p-1.5 rounded-full bg-red-650 hover:bg-red-750 text-white shadow-md transition-transform scale-90 hover:scale-105 cursor-pointer"
                                  title="Remove from slideshow"
                                >
                                  <Trash className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Add New Slide URL Trigger */}
                        <div className="pt-2">
                          <label className="block text-[10px] font-mono uppercase tracking-wider text-gray-500 mb-1">Add Image By URL</label>
                          <div className="flex gap-2">
                            <input
                              type="url"
                              placeholder="Paste any hosted photo URL (e.g., https://images.unsplash.com/...)"
                              value={newHeroImageUrl}
                              onChange={(e) => setNewHeroImageUrl(e.target.value)}
                              className="flex-1 bg-[#F9F9F7] border border-gray-250 p-2.5 rounded-lg text-xs font-sans text-gray-700 focus:outline-[#D4AF37] focus:bg-white"
                            />
                            <button
                              type="button"
                              onClick={handleAddHeroImage}
                              className="px-4 py-2.5 bg-[#D4AF37] hover:bg-[#B8860B] text-white rounded-lg text-xs font-mono font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer flex-shrink-0"
                            >
                              <Plus className="w-3.5 h-3.5" /> Add Slide
                            </button>
                          </div>
                          <p className="text-[9px] text-gray-400 font-sans mt-2 leading-relaxed">
                            💡 <strong>How to use your custom photos:</strong> Host your image on a site like PostImages.org or Imgur.com, copy the direct raw link (ending with .png, .jpg or .webp), and paste it here.
                          </p>
                        </div>
                      </div>

                      <div className="flex justify-between items-center bg-gray-50 border border-gray-200 rounded-xl p-4 gap-4">
                        <button
                          type="button"
                          onClick={handleResetGeneral}
                          className="px-4 py-2 border border-gray-300 rounded-lg text-xs font-mono hover:bg-gray-150 transition-colors uppercase tracking-wider cursor-pointer"
                        >
                          Reset to Factory Defaults
                        </button>
                        <button
                          type="submit"
                          className="px-6 py-3 bg-[#D4AF37] hover:bg-[#B8860B] border border-[#D4AF37] text-white rounded-lg text-xs font-mono uppercase font-bold tracking-widest cursor-pointer shadow-sm"
                        >
                          Save All Contents &rarr;
                        </button>
                      </div>
                    </form>
                  )}

                  {/* TAB 3: SERVICES CATALOG CMS */}
                  {activeTab === 'services' && (
                    <div className="space-y-6">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-serif text-sm text-gray-800 uppercase tracking-wider font-semibold">Live Procedure Matrix</h4>
                          <p className="text-[11px] text-gray-500">Configure therapy items displayed on active filters, prices, and bookings.</p>
                        </div>
                        {editingServiceId === null && (
                          <button
                            onClick={handleStartAddService}
                            className="bg-[#D4AF37] hover:bg-[#B8860B] text-white font-mono text-xs font-semibold uppercase tracking-wider px-4 py-2 rounded-lg flex items-center gap-1 cursor-pointer transition-all shadow-sm"
                          >
                            <Plus className="w-3.5 h-3.5" /> Add New Treatment
                          </button>
                        )}
                      </div>

                      {/* Editing panel context overlay */}
                      {editingServiceId !== null && (
                        <form onSubmit={handleSaveService} className="bg-white border-2 border-[#D4AF37] rounded-xl p-5 shadow-lg space-y-4 animate-fadeIn">
                          <div className="flex justify-between items-center border-b border-gray-150 pb-3">
                            <span className="font-mono text-xs text-[#B8860B] font-bold uppercase tracking-widest">
                              {editingServiceId === 'new' ? 'Create New Dermal Treatment' : 'Modify Treatment Protocol'}
                            </span>
                            <button
                              type="button"
                              onClick={() => setEditingServiceId(null)}
                              className="text-gray-400 hover:text-gray-700 font-mono text-xs"
                            >
                              Discard &times;
                            </button>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <label className="block text-[11px] font-mono uppercase tracking-wider text-gray-500">Treatment Id (Unique Key)</label>
                              <input
                                type="text"
                                required
                                disabled={editingServiceId !== 'new'}
                                value={serviceForm.id}
                                onChange={(e) => setServiceForm({ ...serviceForm, id: e.target.value })}
                                className="w-full bg-gray-50 border border-gray-250 p-2.5 rounded-lg text-xs font-mono text-gray-800 disabled:opacity-60"
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="block text-[11px] font-mono uppercase tracking-wider text-gray-500">Aesthetic Category Column</label>
                              <select
                                value={serviceForm.category}
                                onChange={(e: any) => setServiceForm({ ...serviceForm, category: e.target.value })}
                                className="w-full bg-[#F9F9F7] border border-gray-250 p-2.5 rounded-lg text-xs text-gray-800 focus:outline-[#D4AF37]"
                              >
                                <option value="injectables">Injectable Contouring</option>
                                <option value="skin">Advanced Dermal Rejuvenation</option>
                                <option value="laser">Precision Laser Technology</option>
                                <option value="body">Body Reshaping aesthetics</option>
                              </select>
                            </div>

                            <div className="space-y-1 md:col-span-2">
                              <label className="block text-[11px] font-mono uppercase tracking-wider text-gray-500">Treatment Procedure Name</label>
                              <input
                                type="text"
                                required
                                value={serviceForm.name}
                                onChange={(e) => setServiceForm({ ...serviceForm, name: e.target.value })}
                                className="w-full bg-[#F9F9F7] border border-gray-250 p-2.5 rounded-lg text-xs font-serif text-gray-800 focus:outline-[#D4AF37]"
                                placeholder="e.g. Signature Lip Sculpting & Hydration"
                              />
                            </div>

                            <div className="space-y-1 md:col-span-2">
                              <label className="block text-[11px] font-mono uppercase tracking-wider text-gray-500">Short Public Description</label>
                              <textarea
                                value={serviceForm.description}
                                onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })}
                                className="w-full bg-[#F9F9F7] border border-gray-250 p-2.5 rounded-lg text-xs font-sans text-gray-700 focus:outline-[#D4AF37]"
                                rows={2}
                                placeholder="A balanced, detailed brief describing clinical goals..."
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="block text-[11px] font-mono uppercase tracking-wider text-gray-500">Duration (Minutes)</label>
                              <input
                                type="number"
                                required
                                value={serviceForm.duration}
                                onChange={(e) => setServiceForm({ ...serviceForm, duration: Number(e.target.value) })}
                                className="w-full bg-[#F9F9F7] border border-gray-250 p-2.5 rounded-lg text-xs font-mono text-gray-800 focus:outline-[#D4AF37]"
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="block text-[11px] font-mono uppercase tracking-wider text-gray-500">Holding Session Cost Price ($)</label>
                              <input
                                type="number"
                                required
                                value={serviceForm.price}
                                onChange={(e) => setServiceForm({ ...serviceForm, price: Number(e.target.value) })}
                                className="w-full bg-[#F9F9F7] border border-gray-250 p-2.5 rounded-lg text-xs font-mono text-gray-800 focus:outline-[#D4AF37]"
                              />
                            </div>

                            <div className="space-y-1 md:col-span-2">
                              <label className="block text-[11px] font-mono uppercase tracking-wider text-gray-500">Ideal Patient Skin Criteria Profile</label>
                              <input
                                type="text"
                                value={serviceForm.idealFor}
                                onChange={(e) => setServiceForm({ ...serviceForm, idealFor: e.target.value })}
                                className="w-full bg-[#F9F9F7] border border-gray-250 p-2.5 rounded-lg text-xs font-serif text-gray-700 italic placeholder-gray-400 focus:outline-[#D4AF37]"
                                placeholder="e.g. Volume loss, dull complexion profiles..."
                              />
                            </div>

                            <div className="space-y-2 md:col-span-2">
                              <label className="block text-[11px] font-mono uppercase tracking-wider text-gray-500 flex justify-between items-center">
                                <span>Core Benefits Bullet points List</span>
                                <button
                                  type="button"
                                  onClick={() => setServiceForm({ ...serviceForm, benefits: [...(serviceForm.benefits || []), ''] })}
                                  className="text-[10px] text-[#B8860B] hover:underline"
                                >
                                  + Add Bullet Point
                                </button>
                              </label>

                              <div className="space-y-2">
                                {(serviceForm.benefits || []).map((benefit, idx) => (
                                  <div key={idx} className="flex gap-2 items-center">
                                    <input
                                      type="text"
                                      value={benefit}
                                      onChange={(e) => {
                                        const updatedBullets = [...(serviceForm.benefits || [])];
                                        updatedBullets[idx] = e.target.value;
                                        setServiceForm({ ...serviceForm, benefits: updatedBullets });
                                      }}
                                      className="flex-1 bg-[#F9F9F7] border border-gray-250 p-2 rounded-lg text-xs font-sans text-gray-800"
                                      placeholder={`Benefit statement #${idx + 1}`}
                                    />
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const updatedBullets = (serviceForm.benefits || []).filter((_, bIdx) => bIdx !== idx);
                                        setServiceForm({ ...serviceForm, benefits: updatedBullets });
                                      }}
                                      className="text-red-500 text-xs p-1 hover:bg-red-50 rounded"
                                    >
                                      Delete
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>

                          <div className="flex justify-end gap-2.5 border-t border-gray-150 pt-3">
                            <button
                              type="button"
                              onClick={() => setEditingServiceId(null)}
                              className="px-4 py-2 border border-gray-300 rounded-lg text-xs font-mono hover:bg-gray-100 transition-all cursor-pointer"
                            >
                              Discard Changes
                            </button>
                            <button
                              type="submit"
                              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-mono font-bold tracking-wider cursor-pointer transition-all"
                            >
                              Publish New Protocol
                            </button>
                          </div>
                        </form>
                      )}

                      {/* Display table catalog listing */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {services.map((s) => (
                          <div key={s.id} className="bg-white border border-gray-200 rounded-xl p-4 sm:p-5 shadow-sm hover:shadow-inner hover:bg-gray-50 flex flex-col justify-between gap-3 transition-all">
                            <div>
                              <div className="flex justify-between items-start">
                                <span className="text-[10px] uppercase font-mono bg-amber-500/5 text-[#B8860B] px-2 py-0.5 rounded">
                                  {s.category}
                                </span>
                                <span className="text-sm font-mono text-[#B8860B] font-semibold">
                                  ${s.price}{!showPrices && <span className="text-[9px] uppercase tracking-wider text-red-650 bg-red-50 border border-red-100 px-1.5 py-0.5 rounded ml-1.5 inline-block font-mono font-bold">Hidden</span>}
                                </span>
                              </div>

                              <h5 className="font-serif text-sm font-bold text-gray-800 mt-2">{s.name}</h5>
                              <p className="text-xs text-gray-500 font-sans mt-1 line-clamp-2 leading-relaxed">{s.description}</p>
                              <div className="text-[10px] text-gray-400 mt-2 font-mono flex gap-3">
                                <span>Duration: {s.duration} Mins</span>
                                <span>•</span>
                                <span>Benefits: {s.benefits.length} points</span>
                              </div>
                            </div>

                            <div className="border-t border-gray-100 pt-2 flex justify-end gap-2">
                              <button
                                type="button"
                                onClick={() => handleStartEditService(s)}
                                className="px-2.5 py-1 text-xs border border-gray-250 hover:border-[#D4AF37] hover:text-[#B8860B] text-gray-650 rounded duration-300 font-mono flex items-center gap-1 cursor-pointer"
                              >
                                <Edit className="w-3 h-3" /> Edit Profile
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteService(s.id)}
                                className="px-2.5 py-1 text-xs border border-red-200 text-red-650 hover:bg-red-50 hover:text-red-700 rounded duration-300 font-mono flex items-center gap-1 cursor-pointer"
                              >
                                <Trash className="w-3 h-3" /> Remove
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* TAB 4: BEFORE / AFTER CASES CLINIC GALLERY */}
                  {activeTab === 'gallery' && (
                    <div className="space-y-6">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-serif text-sm text-gray-800 uppercase tracking-wider font-semibold">Medical Case Imagery Vault</h4>
                          <p className="text-[11px] text-gray-500 font-sans">Upload or edit dynamic before-after imagery slides for client review.</p>
                        </div>
                        {editingGalleryId === null && (
                          <button
                            onClick={handleStartAddGallery}
                            className="bg-[#D4AF37] hover:bg-[#B8860B] text-white font-mono text-xs font-semibold uppercase tracking-wider px-4 py-2 rounded-lg flex items-center gap-1 cursor-pointer transition-all shadow-sm"
                          >
                            <Plus className="w-3.5 h-3.5" /> Register New Case File
                          </button>
                        )}
                      </div>

                      {/* Image Edit Section Form */}
                      {editingGalleryId !== null && (
                        <form onSubmit={handleSaveGallery} className="bg-white border-2 border-[#D4AF37] rounded-xl p-5 shadow-lg space-y-4 animate-fadeIn">
                          <div className="flex justify-between items-center border-b border-gray-150 pb-3">
                            <span className="font-mono text-xs text-[#B8860B] font-bold uppercase tracking-widest">{editingGalleryId === 'new' ? 'Create Patient Case Case-file' : 'Modify Patient Case Case-file'}</span>
                            <button
                              type="button"
                              onClick={() => setEditingGalleryId(null)}
                              className="text-gray-400 hover:text-gray-700 font-mono text-xs"
                            >
                              Discard &times;
                            </button>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <label className="block text-[11px] font-mono uppercase tracking-wider text-gray-500">Case ID / Tag Key</label>
                              <input
                                type="text"
                                required
                                disabled={editingGalleryId !== 'new'}
                                value={galleryForm.id}
                                onChange={(e) => setGalleryForm({ ...galleryForm, id: e.target.value })}
                                className="w-full bg-gray-50 border border-gray-250 p-2.5 rounded-lg text-xs font-mono text-gray-800 disabled:opacity-60"
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="block text-[11px] font-mono uppercase tracking-wider text-gray-500">Scientific category title</label>
                              <input
                                type="text"
                                required
                                value={galleryForm.category}
                                onChange={(e) => setGalleryForm({ ...galleryForm, category: e.target.value })}
                                className="w-full bg-[#F9F9F7] border border-gray-250 p-2.5 rounded-lg text-xs font-serif text-gray-800"
                                placeholder="e.g. Injectable Contouring"
                              />
                            </div>

                            <div className="space-y-1 md:col-span-2">
                              <label className="block text-[11px] font-mono uppercase tracking-wider text-gray-500">Transformation Case Title</label>
                              <input
                                type="text"
                                required
                                value={galleryForm.title}
                                onChange={(e) => setGalleryForm({ ...galleryForm, title: e.target.value })}
                                className="w-full bg-[#F9F9F7] border border-gray-250 p-2.5 rounded-lg text-xs font-serif text-gray-800"
                                placeholder="e.g. Signature Lip Sculpting"
                              />
                            </div>

                            <div className="space-y-1 mt-1 font-mono text-xs bg-[#FAF9F5] p-3 rounded-lg border border-gray-150 md:col-span-2">
                              <strong className="text-gray-700 text-[10px] uppercase block mb-1">Image Sourcing Strategy Guidelines:</strong>
                              <span className="text-[10px] text-gray-500 leading-normal block">
                                You can enter absolute custom Unsplash photo URLs or clinic image repository links in the boxes below to display custom high-resolution patient cases. For immediate mockups, paste any valid web image link with secure HTTPS protocol.
                              </span>
                            </div>

                            <div className="space-y-1">
                              <label className="block text-[11px] font-mono uppercase tracking-wider text-gray-500">Before Treatment Image URL</label>
                              <input
                                type="url"
                                required
                                value={galleryForm.beforeImage}
                                onChange={(e) => setGalleryForm({ ...galleryForm, beforeImage: e.target.value })}
                                className="w-full bg-[#F9F9F7] border border-gray-250 p-2.5 rounded-lg text-xs font-sans text-gray-605"
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="block text-[11px] font-mono uppercase tracking-wider text-gray-500">After Treatment Image URL</label>
                              <input
                                type="url"
                                required
                                value={galleryForm.afterImage}
                                onChange={(e) => setGalleryForm({ ...galleryForm, afterImage: e.target.value })}
                                className="w-full bg-[#F9F9F7] border border-gray-250 p-2.5 rounded-lg text-xs font-sans text-gray-605"
                              />
                            </div>

                            <div className="space-y-1 md:col-span-2">
                              <label className="block text-[11px] font-mono uppercase tracking-wider text-gray-500">Case Study Clinical Description</label>
                              <textarea
                                value={galleryForm.description}
                                onChange={(e) => setGalleryForm({ ...galleryForm, description: e.target.value })}
                                className="w-full bg-[#F9F9F7] border border-gray-250 p-2.5 rounded-lg text-xs font-sans text-gray-700 focus:outline-[#D4AF37]"
                                rows={2}
                                placeholder="Micro restoration detail study log..."
                              />
                            </div>
                          </div>

                          <div className="flex justify-end gap-2.5 border-t border-gray-150 pt-3">
                            <button
                              type="button"
                              onClick={() => setEditingGalleryId(null)}
                              className="px-4 py-2 border border-gray-300 rounded-lg text-xs font-mono hover:bg-gray-100 transition-all cursor-pointer"
                            >
                              Discard Changes
                            </button>
                            <button
                              type="submit"
                              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-mono font-bold tracking-wider cursor-pointer"
                            >
                              Save Case Image File
                            </button>
                          </div>
                        </form>
                      )}

                      {/* Displaying Case cards */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {gallery.map((g) => (
                          <div key={g.id} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex flex-col justify-between gap-4">
                            <div>
                              <div className="grid grid-cols-2 gap-2 h-28 overflow-hidden rounded-lg bg-gray-50 border relative select-none">
                                <img src={g.beforeImage} alt="Before preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                <img src={g.afterImage} alt="After preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                <span className="absolute top-1 left-1 bg-white/90 text-gray-650 font-mono text-[8px] uppercase tracking-wide px-1.5 py-0.5 rounded shadow-sm">Before / After</span>
                              </div>

                              <div className="mt-3">
                                <span className="text-[9px] uppercase font-mono tracking-wider text-[#B8860B] bg-amber-500/5 px-2 py-0.5 rounded">
                                  {g.category}
                                </span>
                                <h5 className="font-serif text-sm font-semibold text-gray-800 mt-2">{g.title}</h5>
                                <p className="text-xs text-gray-500 font-sans mt-0.5 line-clamp-2 leading-relaxed">{g.description}</p>
                              </div>
                            </div>

                            <div className="border-t border-gray-100 pt-2 flex justify-end gap-2">
                              <button
                                type="button"
                                onClick={() => handleStartEditGallery(g)}
                                className="px-2.5 py-1 text-xs border border-gray-250 hover:border-[#D4AF37] hover:text-[#B8860B] text-gray-650 rounded duration-300 font-mono flex items-center gap-1 cursor-pointer"
                              >
                                <Edit className="w-3 h-3" /> Edit Case File
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteGallery(g.id)}
                                className="px-2.5 py-1 text-xs border border-red-200 text-red-650 hover:bg-red-50 hover:text-red-700 rounded duration-300 font-mono flex items-center gap-1 cursor-pointer"
                              >
                                <Trash className="w-3 h-3" /> Delete
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* TAB 5: CLINIC PRODUCTS CATALOG */}
                  {activeTab === 'products' && (
                    <div className="space-y-6">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-serif text-sm text-gray-800 uppercase tracking-wider font-semibold">Clinic Products Catalog</h4>
                          <p className="text-[11px] text-gray-500 font-sans">Manage live, prescription-grade formulas displayed in the products catalog.</p>
                        </div>
                        {editingProductId === null && (
                          <button
                            onClick={handleStartAddProduct}
                            className="bg-[#D4AF37] hover:bg-[#B8860B] text-white font-mono text-xs font-semibold uppercase tracking-wider px-4 py-2 rounded-lg flex items-center gap-1 cursor-pointer transition-all shadow-sm"
                          >
                            <Plus className="w-3.5 h-3.5" /> Register New Product
                          </button>
                        )}
                      </div>

                      {/* Product Edit / Add Section Form */}
                      {editingProductId !== null && (
                        <form onSubmit={handleSaveProduct} className="bg-white border-2 border-[#D4AF37] rounded-xl p-5 shadow-lg space-y-4 animate-fadeIn">
                          <div className="flex justify-between items-center border-b border-gray-150 pb-3">
                            <span className="font-mono text-xs text-[#B8860B] font-bold uppercase tracking-widest">
                              {editingProductId === 'new' ? 'Create Skincare Product Formulation' : 'Modify Product Profile'}
                            </span>
                            <button
                              type="button"
                              onClick={() => setEditingProductId(null)}
                              className="text-gray-400 hover:text-gray-700 font-mono text-xs cursor-pointer"
                            >
                              Discard &times;
                            </button>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <label className="block text-[11px] font-mono uppercase tracking-wider text-gray-500">Product Identifier (ID)</label>
                              <input
                                type="text"
                                required
                                disabled={editingProductId !== 'new'}
                                value={productForm.id}
                                onChange={(e) => setProductForm({ ...productForm, id: e.target.value })}
                                className="w-full bg-gray-50 border border-gray-250 p-2.5 rounded-lg text-xs font-mono text-gray-800 disabled:opacity-60"
                                placeholder="e.g. cellular-exosome-serum"
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="block text-[11px] font-mono uppercase tracking-wider text-gray-500">Category</label>
                              <select
                                value={productForm.category}
                                onChange={(e) => setProductForm({ ...productForm, category: e.target.value as any })}
                                className="w-full bg-[#F9F9F7] border border-gray-250 p-2.5 rounded-lg text-xs font-serif text-gray-800 focus:outline-[#D4AF37]"
                              >
                                <option value="serum">Serum (세럼)</option>
                                <option value="cream">Cream (크림)</option>
                                <option value="protection">Protection / UV (자외선 차단/보호)</option>
                              </select>
                            </div>

                            <div className="space-y-1">
                              <label className="block text-[11px] font-mono uppercase tracking-wider text-gray-500">Product Name (English)</label>
                              <input
                                type="text"
                                required
                                value={productForm.nameEn}
                                onChange={(e) => setProductForm({ ...productForm, nameEn: e.target.value })}
                                className="w-full bg-[#F9F9F7] border border-gray-250 p-2.5 rounded-lg text-xs font-serif text-gray-800"
                                placeholder="e.g. ACE K Cellular Regen Exosome Serum"
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="block text-[11px] font-mono uppercase tracking-wider text-gray-500">Product Name (Korean / 한국어)</label>
                              <input
                                type="text"
                                required
                                value={productForm.nameKo}
                                onChange={(e) => setProductForm({ ...productForm, nameKo: e.target.value })}
                                className="w-full bg-[#F9F9F7] border border-gray-250 p-2.5 rounded-lg text-xs font-serif text-gray-800"
                                placeholder="예: ACE K 셀룰러 리젠 엑소좀 세럼"
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="block text-[11px] font-mono uppercase tracking-wider text-gray-500">Subtitle tagline (English)</label>
                              <input
                                type="text"
                                value={productForm.subEn}
                                onChange={(e) => setProductForm({ ...productForm, subEn: e.target.value })}
                                className="w-full bg-[#F9F9F7] border border-gray-250 p-2.5 rounded-lg text-xs font-sans text-gray-850"
                                placeholder="e.g. Stem Cell Stemmed Exosomes & Bio-peptides"
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="block text-[11px] font-mono uppercase tracking-wider text-gray-500">Subtitle tagline (Korean / 한국어)</label>
                              <input
                                type="text"
                                value={productForm.subKo}
                                onChange={(e) => setProductForm({ ...productForm, subKo: e.target.value })}
                                className="w-full bg-[#F9F9F7] border border-gray-250 p-2.5 rounded-lg text-xs font-sans text-gray-850"
                                placeholder="예: 고이동성 줄기세포 유래 엑소좀 배합"
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="block text-[11px] font-mono uppercase tracking-wider text-gray-500">Volume Capacity</label>
                              <input
                                type="text"
                                required
                                value={productForm.volume}
                                onChange={(e) => setProductForm({ ...productForm, volume: e.target.value })}
                                className="w-full bg-[#F9F9F7] border border-gray-250 p-2.5 rounded-lg text-xs font-mono text-gray-800"
                                placeholder="e.g. 30 ml / 1.01 fl. oz."
                              />
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                              <div className="space-y-1">
                                <label className="block text-[11px] font-mono uppercase tracking-wider text-gray-500">Price (USD)</label>
                                <input
                                  type="number"
                                  required
                                  value={productForm.priceUsd}
                                  onChange={(e) => setProductForm({ ...productForm, priceUsd: Number(e.target.value) })}
                                  className="w-full bg-[#F9F9F7] border border-gray-250 p-2.5 rounded-lg text-xs font-mono text-gray-800"
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="block text-[11px] font-mono uppercase tracking-wider text-gray-500">Price (KRW / 원화)</label>
                                <input
                                  type="number"
                                  required
                                  value={productForm.priceKrw}
                                  onChange={(e) => setProductForm({ ...productForm, priceKrw: Number(e.target.value) })}
                                  className="w-full bg-[#F9F9F7] border border-gray-250 p-2.5 rounded-lg text-xs font-mono text-gray-800"
                                />
                              </div>
                            </div>

                            <div className="space-y-1">
                              <label className="block text-[11px] font-mono uppercase tracking-wider text-gray-500">Description (English)</label>
                              <textarea
                                required
                                value={productForm.descEn}
                                onChange={(e) => setProductForm({ ...productForm, descEn: e.target.value })}
                                className="w-full bg-[#F9F9F7] border border-gray-250 p-2.5 rounded-lg text-xs font-sans text-gray-750 focus:outline-[#D4AF37]"
                                rows={3}
                                placeholder="Clinical English description..."
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="block text-[11px] font-mono uppercase tracking-wider text-gray-500">Description (Korean / 한국어)</label>
                              <textarea
                                required
                                value={productForm.descKo}
                                onChange={(e) => setProductForm({ ...productForm, descKo: e.target.value })}
                                className="w-full bg-[#F9F9F7] border border-gray-250 p-2.5 rounded-lg text-xs font-sans text-gray-750 focus:outline-[#D4AF37]"
                                rows={3}
                                placeholder="한국어 임상 설명글..."
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="block text-[11px] font-mono uppercase tracking-wider text-gray-500">
                                Active Bio-Ingredients (English - <span className="text-[#B8860B] font-bold">One per line</span>)
                              </label>
                              <textarea
                                value={productForm.activeEn as any}
                                onChange={(e) => setProductForm({ ...productForm, activeEn: e.target.value as any })}
                                className="w-full bg-[#F9F9F7] border border-gray-250 p-2.5 rounded-lg text-xs font-mono text-gray-750 focus:outline-[#D4AF37]"
                                rows={3}
                                placeholder="15% Exosomes&#13;1.5% Copper Tripeptide-1"
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="block text-[11px] font-mono uppercase tracking-wider text-gray-500">
                                Active Bio-Ingredients (Korean - <span className="text-[#B8860B] font-bold">One per line</span>)
                              </label>
                              <textarea
                                value={productForm.activeKo as any}
                                onChange={(e) => setProductForm({ ...productForm, activeKo: e.target.value as any })}
                                className="w-full bg-[#F9F9F7] border border-gray-250 p-2.5 rounded-lg text-xs font-mono text-gray-750 focus:outline-[#D4AF37]"
                                rows={3}
                                placeholder="정제 엑소좀 15%&#13;카퍼 트라이펩타이드-1 1.5%"
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="block text-[11px] font-mono uppercase tracking-wider text-gray-500">Skincare Guidance Usage (English)</label>
                              <textarea
                                value={productForm.usageEn}
                                onChange={(e) => setProductForm({ ...productForm, usageEn: e.target.value })}
                                className="w-full bg-[#F9F9F7] border border-gray-250 p-2.5 rounded-lg text-xs font-sans text-gray-755 focus:outline-[#D4AF37]"
                                rows={2}
                                placeholder="Apply 3-4 drops morning and evening..."
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="block text-[11px] font-mono uppercase tracking-wider text-gray-500">Skincare Guidance Usage (Korean / 한국어)</label>
                              <textarea
                                value={productForm.usageKo}
                                onChange={(e) => setProductForm({ ...productForm, usageKo: e.target.value })}
                                className="w-full bg-[#F9F9F7] border border-gray-250 p-2.5 rounded-lg text-xs font-sans text-gray-755 focus:outline-[#D4AF37]"
                                rows={2}
                                placeholder="아침 저녁 세안 후 고르게 펴 발라줍니다..."
                              />
                            </div>

                            <div className="space-y-1 md:col-span-2">
                              <label className="block text-[11px] font-mono uppercase tracking-wider text-gray-500">Product Representation Image URL</label>
                              <input
                                type="url"
                                required
                                value={productForm.imgUrl}
                                onChange={(e) => setProductForm({ ...productForm, imgUrl: e.target.value })}
                                className="w-full bg-[#F9F9F7] border border-[#D4AF37]/45 p-2.5 rounded-lg text-xs font-sans text-gray-700"
                              />
                            </div>
                          </div>

                          <div className="flex justify-end gap-2.5 border-t border-gray-150 pt-3">
                            <button
                              type="button"
                              onClick={() => setEditingProductId(null)}
                              className="px-4 py-2 border border-gray-300 rounded-lg text-xs font-mono hover:bg-gray-100 transition-all cursor-pointer text-gray-700"
                            >
                              Discard Changes
                            </button>
                            <button
                              type="submit"
                              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-mono font-bold tracking-wider cursor-pointer transition-colors"
                            >
                              Save Product Formula
                            </button>
                          </div>
                        </form>
                      )}

                      {/* Displaying Product cards */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {products.map((p) => (
                          <div key={p.id} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex gap-4">
                            <div className="w-24 h-24 rounded-lg overflow-hidden bg-gray-50 border flex-shrink-0">
                              <img src={p.imgUrl} alt={p.nameEn} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                            </div>
                            <div className="flex-1 flex flex-col justify-between">
                              <div>
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <span className="text-[9px] uppercase font-mono tracking-wider text-[#B8860B] bg-amber-500/5 px-2 py-0.5 rounded leading-none">
                                    {p.category}
                                  </span>
                                  <span className="text-[9px] font-mono text-gray-400 font-bold">{p.volume}</span>
                                </div>
                                <h5 className="font-serif text-sm font-semibold text-gray-800 mt-1">{p.nameEn}</h5>
                                <p className="text-[10px] text-[#B8860B] font-serif font-medium leading-none">{p.nameKo}</p>
                                <p className="text-xs font-mono font-bold text-gray-500 mt-1.5">${p.priceUsd} / ₩{p.priceKrw?.toLocaleString()}</p>
                              </div>

                              <div className="border-t border-gray-100 pt-2 mt-2 flex justify-end gap-2">
                                <button
                                  type="button"
                                  onClick={() => handleStartEditProduct(p)}
                                  className="px-2 py-1 text-[10px] border border-gray-250 hover:border-[#D4AF37] hover:text-[#B8860B] text-gray-650 rounded duration-300 font-mono flex items-center gap-1 cursor-pointer"
                                >
                                  <Edit className="w-2.5 h-2.5" /> Edit
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteProduct(p.id)}
                                  className="px-2 py-1 text-[10px] border border-red-200 text-red-650 hover:bg-red-50 hover:text-red-700 rounded duration-300 font-mono flex items-center gap-1 cursor-pointer"
                                >
                                  <Trash className="w-2.5 h-2.5" /> Delete
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                </div>

                {/* Secure bottom tray */}
                <div className="p-4 bg-gray-50 border-t border-gray-200 text-[#B8860B] font-mono text-[9px] uppercase tracking-widest text-center">
                  ACE K Clinic Systems Integrity Protected by SSL & AES-256
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
