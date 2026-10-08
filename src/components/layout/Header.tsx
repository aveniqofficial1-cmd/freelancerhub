import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Search,
  Bell,
  Sparkles,
  ExternalLink,
  CheckCircle2,
  Plus,
  ChevronDown,
  Globe,
  Sliders,
  LogOut,
  User,
  ShieldCheck,
  Zap,
  Check,
  Users
} from 'lucide-react';
import { AvailabilityStatus } from '../../types';

export const Header: React.FC = () => {
  const {
    profile,
    setAvailability,
    notifications,
    markNotificationRead,
    clearAllNotifications,
    setIsSearchOpen,
    setActiveView,
    setIsCreateProjectOpen,
    isWalkthroughActive,
    setIsWalkthroughActive,
    logout,
    resetToDemoData,
    setSelectedProjectId
  } = useApp();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setIsNotifOpen(false);
      if (statusRef.current && !statusRef.current.contains(e.target as Node)) setIsStatusOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setIsProfileMenuOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getStatusBadge = (status: AvailabilityStatus) => {
    switch (status) {
      case 'available':
        return {
          dot: 'bg-emerald-500',
          text: 'Available for Work',
          border: 'border-emerald-200 text-emerald-800 bg-emerald-50'
        };
      case 'busy':
        return {
          dot: 'bg-amber-500',
          text: 'Busy with Projects',
          border: 'border-amber-200 text-amber-800 bg-amber-50'
        };
      case 'unavailable':
        return {
          dot: 'bg-rose-500',
          text: 'Not Available',
          border: 'border-rose-200 text-rose-800 bg-rose-50'
        };
    }
  };

  const currentStatus = getStatusBadge(profile.availability);

  return (
    <header className="h-16 border-b border-slate-200 bg-white/95 backdrop-blur-md sticky top-0 z-30 px-4 sm:px-6 flex items-center justify-between gap-3 shadow-sm">
      {/* Left section: Compact Search Bar */}
      <div className="flex items-center gap-2.5">
        <button
          onClick={() => setIsSearchOpen(true)}
          className="w-48 sm:w-60 flex items-center justify-between px-3 py-1.5 rounded-xl bg-slate-100/90 hover:bg-slate-200/70 border border-slate-200 text-slate-500 hover:text-slate-900 transition-all text-xs group shadow-none"
        >
          <div className="flex items-center gap-2 truncate">
            <Search className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600 transition-colors shrink-0" />
            <span className="truncate">Search clients, projects...</span>
          </div>
          <kbd className="hidden sm:inline-flex text-[10px] font-mono bg-white border border-slate-300 text-slate-500 px-1.5 py-0.5 rounded shadow-2xs">
            ⌘K
          </kbd>
        </button>

        {/* Quick Find Clients button */}
        <button
          onClick={() => setActiveView('clients')}
          className="hidden xl:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 border border-slate-200 transition-colors"
          title="Direct Client Search & Directory"
        >
          <Users className="w-3.5 h-3.5 text-emerald-600" />
          <span>Find Clients</span>
        </button>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Availability Switcher */}
        <div className="relative" ref={statusRef}>
          <button
            onClick={() => setIsStatusOpen(!isStatusOpen)}
            className={`hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold transition-all ${currentStatus.border}`}
          >
            <span className={`w-2 h-2 rounded-full ${currentStatus.dot} animate-pulse`} />
            <span>{currentStatus.text}</span>
            <ChevronDown className="w-3.5 h-3.5 opacity-60" />
          </button>

          {isStatusOpen && (
            <div className="absolute right-0 mt-2 w-52 bg-white border border-slate-200 rounded-2xl shadow-xl py-1.5 z-50 animate-slide-up">
              <div className="px-3.5 py-1.5 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Freelancer Status
              </div>
              <button
                onClick={() => { setAvailability('available'); setIsStatusOpen(false); }}
                className="w-full text-left px-3.5 py-2 text-xs flex items-center justify-between hover:bg-slate-50 text-slate-800"
              >
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="font-medium">Available for Work</span>
                </div>
                {profile.availability === 'available' && <Check className="w-4 h-4 text-emerald-600" />}
              </button>
              <button
                onClick={() => { setAvailability('busy'); setIsStatusOpen(false); }}
                className="w-full text-left px-3.5 py-2 text-xs flex items-center justify-between hover:bg-slate-50 text-slate-800"
              >
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  <span className="font-medium">Busy with Projects</span>
                </div>
                {profile.availability === 'busy' && <Check className="w-4 h-4 text-amber-600" />}
              </button>
              <button
                onClick={() => { setAvailability('unavailable'); setIsStatusOpen(false); }}
                className="w-full text-left px-3.5 py-2 text-xs flex items-center justify-between hover:bg-slate-50 text-slate-800"
              >
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-rose-500" />
                  <span className="font-medium">Not Available</span>
                </div>
                {profile.availability === 'unavailable' && <Check className="w-4 h-4 text-rose-600" />}
              </button>
            </div>
          )}
        </div>

        {/* Walkthrough CTA Button */}
        <button
          onClick={() => setIsWalkthroughActive(!isWalkthroughActive)}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>Demo Guide</span>
        </button>

        {/* Public Portfolio Link */}
        <button
          onClick={() => setActiveView('public_profile')}
          className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 text-xs font-semibold transition-colors"
          title="View public portfolio"
        >
          <Globe className="w-3.5 h-3.5 text-blue-600" />
          <span>Public Profile</span>
          <ExternalLink className="w-3 h-3 text-slate-400" />
        </button>

        {/* Create Project Quick Button */}
        <button
          onClick={() => setIsCreateProjectOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition-transform active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">New Project</span>
        </button>

        {/* Notifications Dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors relative"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white" />
            )}
          </button>

          {isNotifOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden z-50 animate-slide-up">
              <div className="p-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-slate-900">Notifications</h4>
                  {unreadCount > 0 && (
                    <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-full">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                <button
                  onClick={clearAllNotifications}
                  className="text-xs text-slate-500 hover:text-slate-800"
                >
                  Clear all
                </button>
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 p-1">
                {notifications.length === 0 ? (
                  <div className="py-8 text-center text-xs text-slate-400">
                    No new notifications
                  </div>
                ) : (
                  notifications.map(notif => (
                    <div
                      key={notif.id}
                      onClick={() => {
                        markNotificationRead(notif.id);
                        if (notif.linkTo?.view) {
                          setActiveView(notif.linkTo.view);
                          if (notif.linkTo.projectId) setSelectedProjectId(notif.linkTo.projectId);
                          setIsNotifOpen(false);
                        }
                      }}
                      className={`p-3 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer flex gap-3 items-start ${
                        !notif.read ? 'bg-emerald-50/40' : ''
                      }`}
                    >
                      <div className="mt-0.5">
                        {notif.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                        {notif.type === 'info' && <Zap className="w-4 h-4 text-blue-600" />}
                        {notif.type === 'warning' && <ShieldCheck className="w-4 h-4 text-amber-600" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-900">{notif.title}</span>
                          <span className="text-[10px] text-slate-400">{notif.timestamp}</span>
                        </div>
                        <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{notif.message}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Profile Avatar & Menu */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
            className="flex items-center gap-2 p-1 rounded-xl hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200"
          >
            <img
              src={profile.avatarUrl}
              alt={profile.name}
              className="w-8 h-8 rounded-xl object-cover border border-slate-200 shadow-2xs"
            />
            <div className="hidden xl:block text-left">
              <div className="text-xs font-bold text-slate-900">{profile.name}</div>
              <div className="text-[10px] text-emerald-700 font-semibold">Verified Pro</div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {isProfileMenuOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-2xl shadow-xl py-1.5 z-50 animate-slide-up divide-y divide-slate-100">
              <div className="px-3.5 py-2.5">
                <p className="text-xs font-bold text-slate-900">{profile.name}</p>
                <p className="text-[11px] text-slate-500 truncate">{profile.email}</p>
              </div>

              <div className="py-1">
                <button
                  onClick={() => { setActiveView('landing'); setIsProfileMenuOpen(false); }}
                  className="w-full text-left px-3.5 py-2 text-xs flex items-center gap-2.5 text-slate-700 hover:bg-slate-50"
                >
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <span>FreelancerHub Homepage</span>
                </button>
                <button
                  onClick={() => { setActiveView('profile'); setIsProfileMenuOpen(false); }}
                  className="w-full text-left px-3.5 py-2 text-xs flex items-center gap-2.5 text-slate-700 hover:bg-slate-50"
                >
                  <User className="w-4 h-4 text-slate-400" />
                  <span>Edit Profile</span>
                </button>
                <button
                  onClick={() => { setActiveView('public_profile'); setIsProfileMenuOpen(false); }}
                  className="w-full text-left px-3.5 py-2 text-xs flex items-center gap-2.5 text-slate-700 hover:bg-slate-50"
                >
                  <Globe className="w-4 h-4 text-slate-400" />
                  <span>Public Portfolio Website</span>
                </button>
                <button
                  onClick={() => { setActiveView('settings'); setIsProfileMenuOpen(false); }}
                  className="w-full text-left px-3.5 py-2 text-xs flex items-center gap-2.5 text-slate-700 hover:bg-slate-50"
                >
                  <Sliders className="w-4 h-4 text-slate-400" />
                  <span>Settings & Preferences</span>
                </button>
              </div>

              <div className="py-1">
                <button
                  onClick={() => { resetToDemoData(); setIsProfileMenuOpen(false); }}
                  className="w-full text-left px-3.5 py-2 text-xs flex items-center gap-2.5 text-amber-700 hover:bg-amber-50"
                >
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span>Reset Demo Data</span>
                </button>
                <button
                  onClick={() => { logout(); setIsProfileMenuOpen(false); }}
                  className="w-full text-left px-3.5 py-2 text-xs flex items-center gap-2.5 text-rose-700 hover:bg-rose-50"
                >
                  <LogOut className="w-4 h-4 text-rose-600" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
