import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  User,
  Sparkles,
  Globe,
  Mail,
  Phone,
  MapPin,
  IndianRupee,
  Plus,
  Trash2,
  Edit2,
  Copy,
  ExternalLink,
  Save,
  CheckCircle2,
  Tag,
  Clock,
  Layers,
  X
} from 'lucide-react';
import { ServicePackage, AvailabilityStatus } from '../types';

export const ProfileView: React.FC = () => {
  const { profile, updateProfile, setAvailability, setActiveView, addToast } = useApp();

  const [name, setName] = useState(profile.name);
  const [title, setTitle] = useState(profile.title);
  const [bio, setBio] = useState(profile.bio);
  const [location, setLocation] = useState(profile.location);
  const [email, setEmail] = useState(profile.email);
  const [phone, setPhone] = useState(profile.phone);
  const [website, setWebsite] = useState(profile.website);
  const [avatarUrl, setAvatarUrl] = useState(profile.avatarUrl);
  const [startingPrice, setStartingPrice] = useState(profile.startingPrice);
  const [hourlyRate, setHourlyRate] = useState(profile.hourlyRate);
  const [skillsText, setSkillsText] = useState(profile.skills.join(', '));

  // Service Modal State
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [serviceName, setServiceName] = useState('');
  const [serviceDesc, setServiceDesc] = useState('');
  const [servicePrice, setServicePrice] = useState(5000);
  const [serviceDelivery, setServiceDelivery] = useState('3-5 Days');
  const [serviceFeaturesText, setServiceFeaturesText] = useState('');

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedSkills = skillsText.split(',').map(s => s.trim()).filter(Boolean);
    updateProfile({
      name,
      title,
      bio,
      location,
      email,
      phone,
      website,
      avatarUrl,
      startingPrice: Number(startingPrice),
      hourlyRate: Number(hourlyRate),
      skills: parsedSkills
    });
  };

  const openNewServiceModal = () => {
    setEditingServiceId(null);
    setServiceName('');
    setServiceDesc('');
    setServicePrice(5000);
    setServiceDelivery('3-5 Days');
    setServiceFeaturesText('Custom Responsive UI/UX\nSpeed Optimization\nSEO Setup');
    setIsServiceModalOpen(true);
  };

  const openEditServiceModal = (srv: ServicePackage) => {
    setEditingServiceId(srv.id);
    setServiceName(srv.name);
    setServiceDesc(srv.description);
    setServicePrice(srv.startingPrice);
    setServiceDelivery(srv.deliveryTime);
    setServiceFeaturesText(srv.features.join('\n'));
    setIsServiceModalOpen(true);
  };

  const handleSaveService = (e: React.FormEvent) => {
    e.preventDefault();
    const features = serviceFeaturesText.split('\n').map(f => f.trim()).filter(Boolean);

    if (editingServiceId) {
      const updated = profile.services.map(s => {
        if (s.id === editingServiceId) {
          return {
            ...s,
            name: serviceName,
            description: serviceDesc,
            startingPrice: Number(servicePrice),
            deliveryTime: serviceDelivery,
            features
          };
        }
        return s;
      });
      updateProfile({ services: updated });
      addToast('Service package updated', 'success');
    } else {
      const newSrv: ServicePackage = {
        id: 'srv-' + Date.now(),
        name: serviceName,
        description: serviceDesc,
        startingPrice: Number(servicePrice),
        deliveryTime: serviceDelivery,
        features
      };
      updateProfile({ services: [...profile.services, newSrv] });
      addToast('New service package created', 'success');
    }
    setIsServiceModalOpen(false);
  };

  const handleDeleteService = (id: string) => {
    const updated = profile.services.filter(s => s.id !== id);
    updateProfile({ services: updated });
    addToast('Service package removed', 'info');
  };

  const handleDuplicateService = (srv: ServicePackage) => {
    const duplicated: ServicePackage = {
      ...srv,
      id: 'srv-' + Date.now(),
      name: `${srv.name} (Copy)`
    };
    updateProfile({ services: [...profile.services, duplicated] });
    addToast(`Duplicated "${srv.name}"`, 'success');
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-8 animate-fade-in text-slate-900">
      {/* Top Header & Preview CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Freelancer Profile Editor</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage your professional identity, service packages, and public portfolio presentation.
          </p>
        </div>

        <button
          onClick={() => setActiveView('public_profile')}
          className="px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md flex items-center justify-center gap-2 transition-all hover:scale-105"
        >
          <Globe className="w-4 h-4" />
          <span>Preview Public Profile</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </button>
      </div>

      <form onSubmit={handleSaveProfile} className="space-y-8">
        {/* Basic Information Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <User className="w-4 h-4 text-emerald-600" />
            <span>Identity & Bio</span>
          </h2>

          <div className="flex flex-col sm:flex-row items-start gap-6">
            <div className="space-y-2 text-center sm:text-left">
              <img
                src={avatarUrl}
                alt={name}
                className="w-24 h-24 rounded-3xl object-cover border-2 border-emerald-500/40 shadow-sm"
              />
              <input
                type="text"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                placeholder="Image URL"
                className="w-full sm:w-48 text-[11px] px-2.5 py-1.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-700 font-mono"
              />
            </div>

            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:border-emerald-600 focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Professional Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:border-emerald-600 focus:bg-white focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Professional Bio</label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:border-emerald-600 focus:bg-white focus:outline-none leading-relaxed"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Location</label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:border-emerald-600 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:border-emerald-600 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Website</label>
              <div className="relative">
                <Globe className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:border-emerald-600 focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Skills & Availability Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Tag className="w-4 h-4 text-emerald-600" />
            <span>Skills & Rates</span>
          </h2>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Core Skills (comma separated)
            </label>
            <input
              type="text"
              value={skillsText}
              onChange={(e) => setSkillsText(e.target.value)}
              placeholder="React, Next.js, TypeScript, Tailwind CSS, UI/UX"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:border-emerald-600 focus:outline-none font-medium"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Starting Project Price (₹)</label>
              <input
                type="number"
                value={startingPrice}
                onChange={(e) => setStartingPrice(Number(e.target.value))}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:border-emerald-600 focus:outline-none font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Hourly Rate (₹ / hr)</label>
              <input
                type="number"
                value={hourlyRate}
                onChange={(e) => setHourlyRate(Number(e.target.value))}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:border-emerald-600 focus:outline-none font-bold"
              />
            </div>
          </div>
        </div>

        {/* Save Profile Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md flex items-center gap-2"
          >
            <Save className="w-4 h-4" /> Save Profile Details
          </button>
        </div>
      </form>

      {/* Services Packages Manager Section */}
      <div className="space-y-4 pt-4 border-t border-slate-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-600" />
              <span>Service Packages & Pricing</span>
            </h2>
            <p className="text-xs text-slate-500">Define standardized service offerings for prospective clients</p>
          </div>
          <button
            onClick={openNewServiceModal}
            className="px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Service Package
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {profile.services.map((srv) => (
            <div
              key={srv.id}
              className="p-6 rounded-3xl bg-white border border-slate-200 flex flex-col justify-between hover:border-emerald-300 transition-colors shadow-sm"
            >
              <div>
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-sm font-bold text-slate-900">{srv.name}</h3>
                  <span className="text-xs font-black text-emerald-700">
                    ₹{srv.startingPrice.toLocaleString()}+
                  </span>
                </div>
                <p className="text-xs text-slate-500 mb-3 leading-relaxed">{srv.description}</p>
                <div className="text-[11px] text-slate-500 font-mono mb-3 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" /> Delivery: {srv.deliveryTime}
                </div>

                <ul className="space-y-1.5 text-xs text-slate-600 mb-4 font-medium">
                  {srv.features.map((f, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEditServiceModal(srv)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                    title="Edit"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDuplicateService(srv)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                    title="Duplicate"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
                <button
                  onClick={() => handleDeleteService(srv.id)}
                  className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50"
                  title="Delete"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Service Package Modal */}
      {isServiceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in text-slate-900">
          <div className="w-full max-w-lg bg-white border border-slate-200 rounded-3xl p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-slate-900">
              {editingServiceId ? 'Edit Service Package' : 'Create New Service Package'}
            </h3>

            <form onSubmit={handleSaveService} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Package Name</label>
                <input
                  type="text"
                  required
                  value={serviceName}
                  onChange={(e) => setServiceName(e.target.value)}
                  placeholder="e.g. Landing Page Design & Build"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:border-emerald-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={serviceDesc}
                  onChange={(e) => setServiceDesc(e.target.value)}
                  placeholder="What is included in this package?"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:border-emerald-600 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Starting Price (₹)</label>
                  <input
                    type="number"
                    value={servicePrice}
                    onChange={(e) => setServicePrice(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:border-emerald-600 focus:outline-none font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Delivery Time</label>
                  <input
                    type="text"
                    value={serviceDelivery}
                    onChange={(e) => setServiceDelivery(e.target.value)}
                    placeholder="e.g. 5-7 Days"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:border-emerald-600 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Features (one per line)
                </label>
                <textarea
                  rows={4}
                  value={serviceFeaturesText}
                  onChange={(e) => setServiceFeaturesText(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:border-emerald-600 focus:outline-none font-mono"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsServiceModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg text-xs text-slate-500 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs"
                >
                  Save Package
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
