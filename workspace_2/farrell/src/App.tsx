/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  MapPin,
  Bed,
  Bath,
  Maximize,
  Phone,
  Mail,
  Instagram,
  Linkedin,
  Award,
  ShieldCheck,
  TrendingUp,
  Menu,
  X,
  ArrowRight,
  Plus,
  Settings,
  Upload,
  Image as ImageIcon,
  Lock,
  User,
  LogOut
} from 'lucide-react';

interface Property {
  id: string;
  title: string;
  location: string;
  price: string;
  beds: number;
  baths: number;
  sqm: number;
  image: string;
  category: string;
}

interface LeadData {
  name: string;
  email: string;
  phone: string;
  interest: string;
  message?: string;
}

// --- Components ---

const Navbar = ({ onOpenAdmin, onContact }: { onOpenAdmin: () => void, onContact: () => void }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed w-full z-50 transition-all duration-500 ${isScrolled ? 'bg-navy/95 backdrop-blur-md py-3 shadow-xl' : 'bg-transparent py-4'}`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="w-24 h-24 bg-gold overflow-hidden rounded-sm shadow-lg border-2 border-gold/20">
            <img
              src="https://assets.cdn.filesafe.space/MQ9wVnkeJKRCZTRLBC8M/media/69a947c0618c8dda54ec207e.png"
              alt="Farrell Perling"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="flex flex-col">
            <span className={`font-sans font-bold text-2xl leading-none ${isScrolled ? 'text-white' : 'text-white'}`}>Farrell Perling</span>
            <span className="text-xs uppercase tracking-[0.3em] text-gold font-bold mt-1">ClareMart Group</span>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-10">
          {['Portfolio', 'About', 'Valuation'].map((item) => (
            <a key={item} href={`#${item.toLowerCase()}`} className="text-white/80 hover:text-gold transition-colors text-xs uppercase tracking-widest font-bold">
              {item}
            </a>
          ))}
          <button
            onClick={onOpenAdmin}
            className="flex items-center gap-2 text-white/50 hover:text-gold transition-colors text-[10px] uppercase tracking-widest font-bold"
          >
            <Settings size={14} /> Management
          </button>
          <button
            onClick={onContact}
            className="bg-gold hover:bg-gold-light text-navy px-8 py-2.5 rounded-sm text-xs font-bold uppercase tracking-widest transition-all glow-on-hover"
          >
            Contact
          </button>
        </div>

        <button className="md:hidden text-white" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-navy border-t border-white/10 overflow-hidden"
          >
            <div className="flex flex-col p-8 gap-6">
              {['Portfolio', 'About', 'Valuation'].map((item) => (
                <a key={item} href={`#${item.toLowerCase()}`} className="text-white text-xl font-bold uppercase tracking-widest">
                  {item}
                </a>
              ))}
              <button
                onClick={() => {
                  onOpenAdmin();
                  setIsMobileMenuOpen(false);
                }}
                className="text-white/50 text-left text-sm font-bold uppercase tracking-widest"
              >
                Management
              </button>
              <button className="bg-gold text-navy py-4 rounded-sm font-bold uppercase tracking-widest">
                Contact Farrell
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const LoginModal = ({ onClose, onLogin }: { onClose: () => void, onLogin: () => void }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });

      if (res.ok) {
        onLogin();
        onClose();
      } else {
        setError('Invalid credentials. Please attempt again.');
      }
    } catch (err) {
      setError('Connection failed. Please check your network.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-navy/95 backdrop-blur-2xl"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="bg-white/5 border border-white/10 w-full max-w-md rounded-2xl overflow-hidden shadow-2xl p-10 relative"
      >
        <button onClick={onClose} className="absolute top-6 right-6 text-white/40 hover:text-white transition-colors">
          <X size={20} />
        </button>

        <div className="text-center mb-10">
          <div className="inline-flex p-4 bg-gold/10 rounded-full mb-6 text-gold">
            <Lock size={32} />
          </div>
          <h2 className="text-3xl font-bold text-white tracking-tight mb-2">Management Access</h2>
          <p className="text-white/40 text-sm">Enter your credentials to manage the elite portfolio.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest font-bold text-gold">Vault Key</label>
            <div className="relative">
              <input
                autoFocus
                type="password"
                className="w-full bg-white/5 border border-white/10 p-4 pl-12 rounded-xl text-white focus:border-gold outline-none transition-all"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
            </div>
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-red-400 text-xs font-bold text-center"
            >
              {error}
            </motion.p>
          )}

          <button
            disabled={isSubmitting}
            className="w-full bg-gold text-navy py-4 rounded-xl font-bold uppercase tracking-[0.2em] text-xs hover:bg-white transition-all duration-500 disabled:opacity-50 glow-on-hover mt-4"
          >
            {isSubmitting ? 'Verifying...' : 'Unlock Management'}
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
};

const PropertyDetailsModal = ({ property, onClose, onInquire }: { property: Property, onClose: () => void, onInquire: () => void }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[250] flex items-center justify-center p-6 bg-navy/95 backdrop-blur-2xl"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="bg-white w-full max-w-5xl rounded-sm overflow-hidden shadow-2xl relative flex flex-col md:flex-row max-h-[90vh]"
      >
        <button onClick={onClose} className="absolute top-6 right-6 z-10 text-white md:text-navy bg-navy/20 md:bg-white/50 p-2 rounded-full backdrop-blur-md hover:scale-110 transition-all">
          <X size={24} />
        </button>

        <div className="w-full md:w-2/3 h-[40vh] md:h-auto bg-black">
          <img
            src={property.image}
            alt={property.title}
            className="w-full h-full object-contain"
            referrerPolicy="no-referrer"
          />
        </div>

        <div className="w-full md:w-1/3 p-8 md:p-12 overflow-y-auto bg-white flex flex-col justify-between">
          <div>
            <div className="text-gold text-[10px] uppercase tracking-[0.3em] font-bold mb-4">{property.category}</div>
            <h2 className="text-3xl md:text-4xl font-bold text-navy tracking-tight mb-2">{property.title}</h2>
            <div className="text-gold text-2xl font-bold mb-8">{property.price}</div>

            <div className="flex items-center text-slate mb-10 pb-10 border-b border-slate/10">
              <MapPin size={18} className="mr-2 text-gold" />
              <span className="text-lg">{property.location}</span>
            </div>

            <div className="grid grid-cols-3 gap-8 mb-10">
              <div className="text-center">
                <Bed size={24} className="mx-auto text-gold mb-2" />
                <div className="text-navy font-bold">{property.beds}</div>
                <div className="text-[10px] uppercase text-slate tracking-widest">Beds</div>
              </div>
              <div className="text-center">
                <Bath size={24} className="mx-auto text-gold mb-2" />
                <div className="text-navy font-bold">{property.baths}</div>
                <div className="text-[10px] uppercase text-slate tracking-widest">Baths</div>
              </div>
              <div className="text-center">
                <Maximize size={24} className="mx-auto text-gold mb-2" />
                <div className="text-navy font-bold">{property.sqm}</div>
                <div className="text-[10px] uppercase text-slate tracking-widest">sqm</div>
              </div>
            </div>

            <p className="text-slate leading-relaxed mb-10">
              An exquisite {property.category.toLowerCase()} residence offering unparalleled luxury and design.
              Located in the prestigious {property.location.split(',')[0]} area, this property represents the pinnacle
              of elite real estate.
            </p>
          </div>

          <button
            onClick={onInquire}
            className="w-full bg-navy text-white py-5 font-bold uppercase tracking-[0.2em] text-xs hover:bg-gold hover:text-navy transition-all duration-500 shadow-xl"
          >
            Request Private Viewing
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

const LeadModal = ({ type, onClose }: { type: string, onClose: () => void }) => {
  const [formData, setFormData] = useState<LeadData>({
    name: '',
    email: '',
    phone: '',
    interest: type,
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setIsSuccess(true);
        setTimeout(onClose, 3000);
      }
    } catch (error) {
      console.error('Lead submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[300] flex items-center justify-center p-6 bg-navy/95 backdrop-blur-2xl"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="bg-white w-full max-w-lg rounded-sm overflow-hidden shadow-2xl p-10 relative"
      >
        <button onClick={onClose} className="absolute top-6 right-6 text-slate hover:text-navy transition-colors">
          <X size={24} />
        </button>

        {isSuccess ? (
          <div className="text-center py-10">
            <div className="inline-flex p-4 bg-gold/10 rounded-full mb-6 text-gold">
              <ShieldCheck size={48} />
            </div>
            <h2 className="text-3xl font-bold text-navy mb-4">Transmission Received</h2>
            <p className="text-slate leading-relaxed">
              Thank you for providing your details. Farrell Perling will contact you shortly to discuss your elite acquisition.
            </p>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <span className="text-gold text-[10px] uppercase tracking-[0.3em] font-bold mb-2 block">{type} Inquiry</span>
              <h2 className="text-3xl font-bold text-navy tracking-tight">Secure Private Consultation</h2>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-slate">Full Name</label>
                <input
                  required
                  className="w-full border border-slate/20 p-4 focus:border-gold outline-none transition-all"
                  placeholder="e.g. Jonathan Levin"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-slate">Email</label>
                  <input
                    required
                    type="email"
                    className="w-full border border-slate/20 p-4 focus:border-gold outline-none transition-all"
                    placeholder="name@email.com"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-slate">Phone</label>
                  <input
                    required
                    type="tel"
                    className="w-full border border-slate/20 p-4 focus:border-gold outline-none transition-all"
                    placeholder="+27..."
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-slate">Interest Detail (Optional)</label>
                <textarea
                  className="w-full border border-slate/20 p-4 focus:border-gold outline-none transition-all h-24"
                  placeholder="Tell us about your requirements..."
                  value={formData.message}
                  onChange={e => setFormData({ ...formData, message: e.target.value })}
                />
              </div>
              <button
                disabled={isSubmitting}
                className="w-full bg-navy text-white py-5 font-bold uppercase tracking-[0.2em] text-xs hover:bg-gold hover:text-navy transition-all duration-500 disabled:opacity-50 shadow-xl"
              >
                {isSubmitting ? 'Transmitting...' : 'Submit Inquiry'}
              </button>
            </form>
          </>
        )}
      </motion.div>
    </motion.div>
  );
};

const ListingForm = ({ onClose, onPropertyAdded }: { onClose: () => void, onPropertyAdded: (p: Property) => void }) => {
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    price: '',
    beds: 0,
    baths: 0,
    sqm: 0,
    image: '',
    category: 'Coastal'
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value.toString());
    });

    if (selectedFile) {
      data.append('imageFile', selectedFile);
    }

    try {
      const res = await fetch('/api/properties', {
        method: 'POST',
        body: data
      });
      if (res.ok) {
        const newProperty = await res.json();
        onPropertyAdded(newProperty);
        onClose();
      }
    } catch (error) {
      console.error("Error adding property:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-navy/90 backdrop-blur-xl"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="bg-white w-full max-w-2xl rounded-sm overflow-hidden shadow-2xl"
      >
        <div className="p-8 border-b border-slate/10 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-navy tracking-tight">New Elite Listing</h2>
          <button onClick={onClose} className="text-slate hover:text-navy transition-colors">
            <X size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Image Upload Area */}
          <div className="space-y-4">
            <label className="text-[10px] uppercase tracking-widest font-bold text-slate block">Property Image</label>
            <div className="grid md:grid-cols-2 gap-6">
              <div
                className={`relative aspect-video border-2 border-dashed rounded-sm flex flex-col items-center justify-center transition-colors ${previewUrl ? 'border-gold bg-gold/5' : 'border-slate/20 hover:border-gold'}`}
              >
                {previewUrl ? (
                  <>
                    <img src={previewUrl} className="w-full h-full object-cover" alt="Preview" />
                    <button
                      type="button"
                      onClick={() => { setSelectedFile(null); setPreviewUrl(null); }}
                      className="absolute top-2 right-2 bg-navy/80 text-white p-1 rounded-full hover:bg-navy"
                    >
                      <X size={16} />
                    </button>
                  </>
                ) : (
                  <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer p-4 text-center">
                    <Upload className="text-gold mb-2" size={32} />
                    <span className="text-xs font-bold text-navy uppercase tracking-widest">Upload from Phone/Gallery</span>
                    <span className="text-[10px] text-slate mt-1">Tap to select or take photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </label>
                )}
              </div>

              <div className="flex flex-col justify-center space-y-4">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-slate/10"></span></div>
                  <div className="relative flex justify-center text-[10px] uppercase tracking-widest font-bold"><span className="bg-white px-2 text-slate/40">OR</span></div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-slate">Image URL</label>
                  <input
                    type="url"
                    className="w-full border border-slate/20 p-3 focus:border-gold outline-none transition-colors text-sm"
                    placeholder="https://..."
                    value={formData.image}
                    onChange={e => setFormData({ ...formData, image: e.target.value })}
                    disabled={!!selectedFile}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-bold text-slate">Property Title</label>
              <input
                required
                type="text"
                className="w-full border border-slate/20 p-3 focus:border-gold outline-none transition-colors"
                placeholder="e.g. Clifton Modern Masterpiece"
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-bold text-slate">Location</label>
              <input
                required
                type="text"
                className="w-full border border-slate/20 p-3 focus:border-gold outline-none transition-colors"
                placeholder="e.g. Clifton, Cape Town"
                value={formData.location}
                onChange={e => setFormData({ ...formData, location: e.target.value })}
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-bold text-slate">Price</label>
              <input
                required
                type="text"
                className="w-full border border-slate/20 p-3 focus:border-gold outline-none transition-colors"
                placeholder="e.g. R15,000,000"
                value={formData.price}
                onChange={e => setFormData({ ...formData, price: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-bold text-slate">Category</label>
              <select
                className="w-full border border-slate/20 p-3 focus:border-gold outline-none transition-colors bg-white"
                value={formData.category}
                onChange={e => setFormData({ ...formData, category: e.target.value })}
              >
                <option>Coastal</option>
                <option>Heritage</option>
                <option>Urban</option>
                <option>Investment</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-bold text-slate">Beds</label>
              <input
                required
                type="number"
                className="w-full border border-slate/20 p-3 focus:border-gold outline-none transition-colors"
                value={formData.beds}
                onChange={e => setFormData({ ...formData, beds: parseInt(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-bold text-slate">Baths</label>
              <input
                required
                type="number"
                className="w-full border border-slate/20 p-3 focus:border-gold outline-none transition-colors"
                value={formData.baths}
                onChange={e => setFormData({ ...formData, baths: parseInt(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-bold text-slate">SQM</label>
              <input
                required
                type="number"
                className="w-full border border-slate/20 p-3 focus:border-gold outline-none transition-colors"
                value={formData.sqm}
                onChange={e => setFormData({ ...formData, sqm: parseInt(e.target.value) })}
              />
            </div>
          </div>

          <button
            disabled={isSubmitting}
            className="w-full bg-navy text-white py-4 font-bold uppercase tracking-[0.2em] text-xs hover:bg-gold hover:text-navy transition-all duration-500 disabled:opacity-50"
          >
            {isSubmitting ? 'Publishing...' : 'Publish Listing'}
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
};

const PropertyCard = ({ property, onSelectListing }: { property: Property, onSelectListing: (p: Property) => void }) => {
  return (
    <motion.div
      whileHover={{ y: -10 }}
      className="group bg-white border border-slate/10 overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500"
    >
      <div className="relative h-80 overflow-hidden">
        <img
          src={property.image}
          alt={property.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          referrerPolicy="no-referrer"
        />
        <div className="absolute top-4 left-4 bg-navy/80 backdrop-blur-sm text-white text-[10px] uppercase tracking-widest px-3 py-1 font-bold">
          {property.category}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-navy/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6">
          <button
            onClick={() => onSelectListing(property)}
            className="w-full bg-gold text-navy py-3 font-bold text-sm uppercase tracking-widest glow-on-hover scale-95 group-hover:scale-100 transition-transform"
          >
            View Listing
          </button>
        </div>
      </div>
      <div className="p-8">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold text-navy group-hover:text-gold transition-colors tracking-tight">{property.title}</h3>
          <span className="text-gold font-bold">{property.price}</span>
        </div>
        <div className="flex items-center text-slate text-sm mb-6">
          <MapPin size={14} className="mr-1" />
          {property.location}
        </div>
        <div className="flex justify-between border-t border-slate/10 pt-6 text-slate text-[10px] uppercase tracking-widest font-bold">
          <div className="flex items-center gap-1.5">
            <Bed size={14} /> {property.beds} Beds
          </div>
          <div className="flex items-center gap-1.5">
            <Bath size={14} /> {property.baths} Baths
          </div>
          <div className="flex items-center gap-1.5">
            <Maximize size={14} /> {property.sqm} sqm
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default function App() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [leadModal, setLeadModal] = useState<{ open: boolean, type: string }>({ open: false, type: '' });

  useEffect(() => {
    fetchProperties();
    // Check if previously logged in (simplified for this demo)
    const auth = localStorage.getItem('farrell_auth');
    if (auth === 'true') setIsLoggedIn(true);
  }, []);

  const openLeadModal = (type: string) => setLeadModal({ open: true, type });
  const closeLeadModal = () => setLeadModal({ open: false, type: '' });

  const handleLogin = () => {
    setIsLoggedIn(true);
    localStorage.setItem('farrell_auth', 'true');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('farrell_auth');
  };

  const fetchProperties = async () => {
    try {
      const res = await fetch('/api/properties');
      const data = await res.json();
      setProperties(data);
    } catch (error) {
      console.error("Error fetching properties:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePropertyAdded = (newProperty: Property) => {
    setProperties([newProperty, ...properties]);
  };

  return (
    <div className="min-h-screen font-sans selection:bg-gold selection:text-navy">
      <Navbar
        onOpenAdmin={() => isLoggedIn ? setIsAdminOpen(true) : setIsLoginOpen(true)}
        onContact={() => openLeadModal('Contact')}
      />

      <AnimatePresence>
        {isLoginOpen && (
          <LoginModal
            onClose={() => setIsLoginOpen(false)}
            onLogin={handleLogin}
          />
        )}
        {isAdminOpen && isLoggedIn && (
          <ListingForm
            onClose={() => setIsAdminOpen(false)}
            onPropertyAdded={handlePropertyAdded}
          />
        )}
        {selectedProperty && (
          <PropertyDetailsModal
            property={selectedProperty}
            onClose={() => setSelectedProperty(null)}
            onInquire={() => {
              const p = selectedProperty;
              setSelectedProperty(null);
              openLeadModal(`Viewing: ${p.title}`);
            }}
          />
        )}
        {leadModal.open && (
          <LeadModal
            type={leadModal.type}
            onClose={closeLeadModal}
          />
        )}
      </AnimatePresence>

      {/* Hero Section - Reduced Height & Minimalist */}
      <section className="relative h-[75vh] flex items-center justify-center pt-48 pb-20 overflow-hidden bg-navy">
        <div className="absolute inset-0 z-0">
          <img
            src="https://picsum.photos/seed/capetown/1920/1080"
            alt="Cape Town Luxury"
            className="w-full h-full object-cover opacity-30"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-navy/40 via-transparent to-navy"></div>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-6xl lg:text-7xl text-white font-bold mb-8 leading-tight tracking-tighter"
          >
            The Gold Standard in <br />
            <span className="text-gold">Property Acquisitions</span>
          </motion.h1>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <a href="#portfolio" className="bg-gold hover:bg-gold-light text-navy px-12 py-4 rounded-sm font-bold text-xs uppercase tracking-[0.2em] transition-all glow-on-hover inline-block">
              View Portfolio
            </a>
          </motion.div>
        </div>
      </section>

      {/* Elite Portfolio Section - Primary Focus */}
      <section id="portfolio" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-16 flex justify-between items-end">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-navy tracking-tight mb-4">Elite Portfolio</h2>
              <div className="w-16 h-1 bg-gold"></div>
            </div>
            <button
              onClick={() => setIsAdminOpen(true)}
              className="hidden md:flex items-center gap-2 text-gold hover:text-navy transition-colors text-[10px] uppercase tracking-widest font-bold"
            >
              <Plus size={14} /> Add Listing
            </button>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-20">
              <div className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
              {properties.map((property, index) => (
                <motion.div
                  key={property.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <PropertyCard
                    property={property}
                    onSelectListing={setSelectedProperty}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Agent Profile Section - Pulled Up & High Impact */}
      <section id="about" className="py-32 bg-navy text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-24 items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative aspect-square max-w-sm mx-auto bg-white/5 overflow-hidden rounded-t-full"
            >
              <img
                src="https://assets.cdn.filesafe.space/MQ9wVnkeJKRCZTRLBC8M/media/69a947c0618c8dda54ec207e.png"
                alt="Farrell Perling"
                className="w-full h-full object-cover grayscale-0 opacity-100 hover:scale-105 transition-all duration-1000"
                referrerPolicy="no-referrer"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-gold uppercase tracking-[0.4em] text-xs font-bold mb-8 block">Personal Concierge</span>
              <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-10 leading-tight tracking-tighter">
                Farrell Perling: <br />
                A Legacy of Trust
              </h2>
              <div className="space-y-10 text-white/80 leading-relaxed text-2xl md:text-3xl font-light tracking-tight">
                <p>
                  With over a decade of high-stakes negotiation experience within the prestigious ClareMart Group, Farrell Perling has redefined the luxury real estate experience in Cape Town.
                </p>
                <p className="text-white font-medium italic">
                  "My mission is simple: to protect your equity while securing your legacy."
                </p>
              </div>

              <div className="mt-16">
                <button className="bg-gold text-navy px-12 py-5 rounded-sm font-bold text-xs uppercase tracking-[0.2em] glow-on-hover">
                  Our Story
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Maximize Asset Value Section - Simplified Focus */}
      <section id="valuation" className="py-32 bg-white">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <div className="inline-flex p-5 bg-gold/10 rounded-full mb-10">
            <TrendingUp className="text-gold" size={48} />
          </div>
          <h2 className="text-4xl md:text-6xl font-bold text-navy mb-8 tracking-tighter leading-tight">Maximize Your Asset Value</h2>
          <p className="text-slate text-2xl md:text-3xl font-light mb-12 leading-relaxed tracking-tight max-w-3xl mx-auto">
            Leverage ClareMart's global reach and Farrell's strategic marketing to achieve the record-breaking sale price your property deserves.
          </p>
          <button
            onClick={() => openLeadModal('Valuation')}
            className="bg-navy text-white px-16 py-6 rounded-sm font-bold uppercase tracking-[0.2em] text-xs hover:bg-gold hover:text-navy transition-all duration-500 glow-on-hover shadow-2xl"
          >
            Request Private Valuation
          </button>
        </div>
      </section>

      {/* VIP Form Section - Minimalist */}
      <section className="py-32 bg-slate-50 border-t border-slate/10">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold text-navy mb-6 tracking-tight">VIP Insider</h2>
            <p className="text-slate text-xl font-light">Exclusive access to off-market estates and market intelligence.</p>
          </div>

          <form
            onSubmit={async (e) => {
              e.preventDefault();
              const form = e.currentTarget;
              const formData = {
                name: (form.elements[0] as HTMLInputElement).value,
                email: (form.elements[1] as HTMLInputElement).value,
                phone: (form.elements[2] as HTMLInputElement).value,
                interest: (form.elements[3] as HTMLSelectElement).value,
                message: 'VIP Insider Application'
              };
              try {
                const res = await fetch('/api/leads', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(formData)
                });
                if (res.ok) {
                  openLeadModal('VIP Insider'); // Show success via modal
                }
              } catch (err) {
                console.error(err);
              }
            }}
            className="space-y-10 bg-white p-10 md:p-16 shadow-sm border border-slate/10"
          >
            <div className="grid md:grid-cols-2 gap-10">
              <input required type="text" className="w-full border-b border-slate/20 py-5 focus:border-gold outline-none transition-colors font-light text-xl" placeholder="Full Name" />
              <input required type="email" className="w-full border-b border-slate/20 py-5 focus:border-gold outline-none transition-colors font-light text-xl" placeholder="Email Address" />
            </div>
            <div className="grid md:grid-cols-2 gap-10">
              <input required type="tel" className="w-full border-b border-slate/20 py-5 focus:border-gold outline-none transition-colors font-light text-xl" placeholder="Phone Number" />
              <select className="w-full border-b border-slate/20 py-5 focus:border-gold outline-none transition-colors font-light text-xl bg-transparent">
                <option>Interested in: Selling</option>
                <option>Interested in: Buying</option>
                <option>Interested in: Investment</option>
              </select>
            </div>
            <button className="w-full bg-navy text-white py-6 font-bold uppercase tracking-[0.3em] text-xs hover:bg-gold hover:text-navy transition-all duration-500">
              Request Access
            </button>
          </form>
        </div>
      </section>

      {/* Footer - Minimalist */}
      <footer className="bg-navy py-24 text-white/40">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-16 mb-20">
            <div className="flex flex-col items-center md:items-start text-center md:text-left">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-24 h-24 bg-gold overflow-hidden rounded-sm shadow-xl">
                  <img
                    src="https://assets.cdn.filesafe.space/MQ9wVnkeJKRCZTRLBC8M/media/69a947c0618c8dda54ec207e.png"
                    alt="Farrell Perling"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-2xl text-white leading-none">Farrell Perling</span>
                  <span className="text-xs uppercase tracking-[0.3em] text-gold font-bold mt-1">ClareMart Group</span>
                </div>
              </div>
              <p className="text-sm max-w-xs leading-relaxed">
                Bespoke real estate expertise for Cape Town's most discerning clientele.
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-12 text-center md:text-left">
              <div>
                <h4 className="text-white font-bold text-[10px] uppercase tracking-[0.3em] mb-6">Contact</h4>
                <ul className="space-y-3 text-sm">
                  <li>+27 (0) 21 425 8822</li>
                  <li>farrell@claremart.com</li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-bold text-[10px] uppercase tracking-[0.3em] mb-6">Social</h4>
                <ul className="space-y-3 text-sm">
                  <li><a href="#" className="hover:text-gold transition-colors">Instagram</a></li>
                  <li><a href="#" className="hover:text-gold transition-colors">LinkedIn</a></li>
                </ul>
              </div>
            </div>
          </div>

          <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] uppercase tracking-[0.4em]">
            <p>© 2024 Farrell Perling</p>
            <p className="text-white/20">Cape Town, South Africa</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
