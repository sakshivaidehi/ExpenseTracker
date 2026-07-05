import React, { useState } from "react";
import API from "../services/api";

export default function EditProfileModal({ user, onClose, onUpdated }) {
  const [form, setForm] = useState({ name: user?.name || "", avatar: user?.avatar || "" });
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = async () => {
    try {
      setSaving(true);
      const { data } = await API.patch('/auth/me', form);
      if (data?.user) onUpdated(data.user);
      onClose();
    } catch (err) {
      console.error('Update failed', err);
      alert('Update failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-[#1E293B] p-5 rounded-2xl w-[340px]">
        <h3 className="text-lg font-semibold mb-3">Edit Profile</h3>
        <input name="name" value={form.name} onChange={handleChange} placeholder="Name" className="w-full p-2 rounded bg-gray-800 mb-2" />
        <input name="avatar" value={form.avatar} onChange={handleChange} placeholder="Avatar URL" className="w-full p-2 rounded bg-gray-800 mb-3" />
        <div className="flex gap-2">
          <button onClick={onClose} className="flex-1 bg-red-600 rounded-xl p-2">Cancel</button>
          <button onClick={handleSave} disabled={saving} className="flex-1 bg-green-600 rounded-xl p-2">{saving ? 'Saving...' : 'Save'}</button>
        </div>
      </div>
    </div>
  );
}
