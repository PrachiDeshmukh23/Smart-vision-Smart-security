import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const SettingsContext = createContext();

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState({
    company_name: 'GS Vision',
    tagline: 'Smart Vision.. Smart Security',
    phone: '+91 98765 43210',
    secondary_phone: '+91 98765 43211',
    email: 'sales@gsvision.com',
    support_email: 'support@gsvision.com',
    whatsapp_number: '919876543210',
    address: 'Plot No. 45, Industrial Area, Electronic City, Phase II, New Delhi - 110020, India',
    business_hours: 'Monday - Saturday: 9:30 AM - 7:00 PM',
    map_embed_url: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3502.562063836371!2d77.2189912!3d28.6128492!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjjCsDM2JzQ2LjMiTiA3N8KwMTMnMDguNCJF!5e0!3m2!1sen!2sin!4v1600000000000!5m2!1sen!2sin',
    about_short: 'GS Vision is a pioneering manufacturer and provider of premier CCTV surveillance systems, smart cameras, networking infrastructure, and security accessories.'
  });
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      const res = await api.get('/settings');
      if (res.data.success && res.data.settings) {
        setSettings(res.data.settings);
      }
    } catch (err) {
      console.warn('Could not load dynamic settings, using defaults');
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
