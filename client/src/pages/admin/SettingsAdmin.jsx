import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import Loader from '../../components/common/Loader';
import { useSettings } from '../../context/SettingsContext';
import { Save, Building, Phone, Mail, MapPin, Globe, Share2 } from 'lucide-react';

const SettingsAdmin = () => {
  const { refreshSettings } = useSettings();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [settings, setSettings] = useState({
    company_name: '',
    tagline: '',
    contact_email: '',
    support_email: '',
    phone_primary: '',
    phone_secondary: '',
    whatsapp_number: '',
    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India',
    facebook_url: '',
    twitter_url: '',
    instagram_url: '',
    linkedin_url: '',
    youtube_url: '',
    about_short: '',
    meta_title: '',
    meta_description: ''
  });

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await api.get('/settings');
      if (res.data.success) {
        setSettings((prev) => ({ ...prev, ...res.data.data }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put('/settings', settings);
      setToast({ type: 'success', text: 'Settings updated successfully!' });
      refreshSettings();
    } catch (err) {
      setToast({ type: 'error', text: err.response?.data?.message || 'Failed to save settings' });
    } finally {
      setSaving(false);
      setTimeout(() => setToast(null), 3000);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="space-y-6 max-w-5xl">
      {toast && (
        <div className={`p-4 rounded-lg text-sm ${toast.type === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
          {toast.text}
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Website & Business Settings</h1>
          <p className="text-slate-400 text-sm">Configure company profile, contact details, social links, and SEO defaults</p>
        </div>
        <button
          onClick={handleSubmit}
          disabled={saving}
          className="flex items-center space-x-2 bg-primary hover:bg-primary-dark text-slate-950 font-semibold px-5 py-2.5 rounded-lg transition disabled:opacity-50"
        >
          <Save className="w-5 h-5" />
          <span>{saving ? 'Saving...' : 'Save Settings'}</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Company Info */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <div className="flex items-center space-x-2 mb-4 text-primary font-bold">
            <Building className="w-5 h-5" />
            <h2 className="text-white text-lg">General Brand Identity</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-slate-400 mb-1">Company Name</label>
              <input
                type="text"
                name="company_name"
                value={settings.company_name || ''}
                onChange={handleChange}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Tagline</label>
              <input
                type="text"
                name="tagline"
                value={settings.tagline || ''}
                onChange={handleChange}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-primary"
              />
            </div>
            <div className="col-span-1 md:col-span-2">
              <label className="block text-xs text-slate-400 mb-1">Short Description (Footer / Bio)</label>
              <textarea
                rows="2"
                name="about_short"
                value={settings.about_short || ''}
                onChange={handleChange}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-primary"
              />
            </div>
          </div>
        </div>

        {/* Contact Numbers & Channels */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <div className="flex items-center space-x-2 mb-4 text-primary font-bold">
            <Phone className="w-5 h-5" />
            <h2 className="text-white text-lg">Communication & WhatsApp</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs text-slate-400 mb-1">Primary Phone</label>
              <input
                type="text"
                name="phone_primary"
                value={settings.phone_primary || ''}
                onChange={handleChange}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Secondary Phone</label>
              <input
                type="text"
                name="phone_secondary"
                value={settings.phone_secondary || ''}
                onChange={handleChange}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">WhatsApp Floating Number (with country code)</label>
              <input
                type="text"
                name="whatsapp_number"
                value={settings.whatsapp_number || ''}
                onChange={handleChange}
                placeholder="919876543210"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-primary font-mono"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Contact Email</label>
              <input
                type="email"
                name="contact_email"
                value={settings.contact_email || ''}
                onChange={handleChange}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-primary"
              />
            </div>
            <div className="col-span-1 md:col-span-2">
              <label className="block text-xs text-slate-400 mb-1">Support / Sales Email</label>
              <input
                type="email"
                name="support_email"
                value={settings.support_email || ''}
                onChange={handleChange}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-primary"
              />
            </div>
          </div>
        </div>

        {/* Physical Address */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <div className="flex items-center space-x-2 mb-4 text-primary font-bold">
            <MapPin className="w-5 h-5" />
            <h2 className="text-white text-lg">Office & Warehouse Address</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-slate-400 mb-1">Address Line 1</label>
              <input
                type="text"
                name="address_line1"
                value={settings.address_line1 || ''}
                onChange={handleChange}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Address Line 2</label>
              <input
                type="text"
                name="address_line2"
                value={settings.address_line2 || ''}
                onChange={handleChange}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-primary"
              />
            </div>
            <div className="grid grid-cols-3 gap-3 col-span-1 md:col-span-2">
              <div>
                <label className="block text-xs text-slate-400 mb-1">City</label>
                <input
                  type="text"
                  name="city"
                  value={settings.city || ''}
                  onChange={handleChange}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">State</label>
                <input
                  type="text"
                  name="state"
                  value={settings.state || ''}
                  onChange={handleChange}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Pincode</label>
                <input
                  type="text"
                  name="pincode"
                  value={settings.pincode || ''}
                  onChange={handleChange}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-primary"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Social Media Links */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <div className="flex items-center space-x-2 mb-4 text-primary font-bold">
            <Share2 className="w-5 h-5" />
            <h2 className="text-white text-lg">Social Media Links</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-slate-400 mb-1">Facebook URL</label>
              <input
                type="url"
                name="facebook_url"
                value={settings.facebook_url || ''}
                onChange={handleChange}
                placeholder="https://facebook.com/gsvision"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Instagram URL</label>
              <input
                type="url"
                name="instagram_url"
                value={settings.instagram_url || ''}
                onChange={handleChange}
                placeholder="https://instagram.com/gsvision"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">LinkedIn URL</label>
              <input
                type="url"
                name="linkedin_url"
                value={settings.linkedin_url || ''}
                onChange={handleChange}
                placeholder="https://linkedin.com/company/gsvision"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">YouTube URL</label>
              <input
                type="url"
                name="youtube_url"
                value={settings.youtube_url || ''}
                onChange={handleChange}
                placeholder="https://youtube.com/@gsvision"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-primary"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center space-x-2 bg-primary hover:bg-primary-dark text-slate-950 font-semibold px-8 py-3 rounded-lg transition disabled:opacity-50"
          >
            <Save className="w-5 h-5" />
            <span>{saving ? 'Saving...' : 'Save All Settings'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default SettingsAdmin;
