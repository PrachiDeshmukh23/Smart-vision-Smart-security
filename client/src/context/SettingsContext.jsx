import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const SettingsContext = createContext();

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState({
    company_name: 'GS Vision',
    tagline: 'Commercial CCTV Project Specialists | Installation & Support Across Maharashtra',
    owner_name: 'Sagar Gupta',
    phone: '+91 83082 09470',
    secondary_phone: '+91 83082 09470',
    email: 'sales@gsvision.com',
    support_email: 'contact@gsvision.com',
    whatsapp_number: '918308209470',
    address: 'Orange Corner, Sangamner, Dist. Ahilyanagar, Maharashtra - 422605',
    city: 'Sangamner',
    state: 'Maharashtra',
    pincode: '422605',
    instagram_url: 'https://www.instagram.com/gs_enterprises_security',
    business_hours: 'Monday - Saturday: 9:30 AM - 7:30 PM',
    logo_url: '/assets/logo.png',
    about_short: 'GS Vision (GS Enterprises) is a premier CCTV surveillance, security camera manufacturer & accessories wholesaler located at Orange Corner, Sangamner (Ahilyanagar, Maharashtra). Specialists in commercial CCTV projects, wholesale accessories with NO MOQ, and pan-India express dispatch.'
  });
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      const res = await api.get('/settings');
      if (res.data.success && res.data.settings) {
        setSettings(prev => ({ ...prev, ...res.data.settings }));
      }
    } catch (err) {
      console.warn('Using default GS Vision actual business settings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, reloadSettings: fetchSettings, loading }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  return useContext(SettingsContext);
}
