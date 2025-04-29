"use client";
import React, { useState } from "react";
import { toast } from "react-hot-toast";
import axiosInstance from "@/lib/utils/axiosInstance";

export default function ProfileForm({ user, onUpdate }: { user: any, onUpdate: (user: any) => void }) {
  const [form, setForm] = useState({
    firstName: user?.profile?.firstName || "",
    lastName: user?.profile?.lastName || "",
    address: user?.profile?.address || "",
    phoneNumber: user?.profile?.phoneNumber || "",
    idCard: user?.profile?.idCard || "",
    dob: user?.profile?.dob ? user.profile.dob.slice(0, 10) : "",
    gender: user?.profile?.gender || "",
    profilePicture: user?.profile?.profilePicture || "",
    bio: user?.profile?.bio || "",
    nationality: user?.profile?.nationality || "",
    NIN: user?.profile?.NIN || "",
    occupation: user?.profile?.occupation || "",
    maritalStatus: user?.profile?.maritalStatus || "single",
    twitter: user?.profile?.socialLinks?.twitter || "",
    linkedin: user?.profile?.socialLinks?.linkedin || "",
    facebook: user?.profile?.socialLinks?.facebook || "",
    instagram: user?.profile?.socialLinks?.instagram || "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axiosInstance.patch("/api/users/me", {
        profile: {
          ...form,
          socialLinks: {
            twitter: form.twitter,
            linkedin: form.linkedin,
            facebook: form.facebook,
            instagram: form.instagram,
          },
        },
      });
      toast.success("Profile updated successfully");
      onUpdate(res.data.user);
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 border border-gray-200 rounded-2xl bg-white/80 p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">First Name</label>
          <input name="firstName" value={form.firstName} onChange={handleChange} className="input input-bordered border border-gray-300 w-full text-gray-800 placeholder-gray-400" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Last Name</label>
          <input name="lastName" value={form.lastName} onChange={handleChange} className="input input-bordered border border-gray-300 w-full text-gray-800 placeholder-gray-400" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Phone Number</label>
          <input name="phoneNumber" value={form.phoneNumber} onChange={handleChange} className="input input-bordered border border-gray-300 w-full text-gray-800 placeholder-gray-400" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
          <input name="dob" type="date" value={form.dob} onChange={handleChange} className="input input-bordered border border-gray-300 w-full text-gray-800 placeholder-gray-400" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Gender</label>
          <select name="gender" value={form.gender} onChange={handleChange} className="input input-bordered border border-gray-300 w-full text-gray-800 placeholder-gray-400">
            <option value="">Select</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Marital Status</label>
          <select name="maritalStatus" value={form.maritalStatus} onChange={handleChange} className="input input-bordered border border-gray-300 w-full text-gray-800 placeholder-gray-400">
            <option value="single">Single</option>
            <option value="married">Married</option>
            <option value="divorced">Divorced</option>
            <option value="widowed">Widowed</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Address</label>
          <input name="address" value={form.address} onChange={handleChange} className="input input-bordered border border-gray-300 w-full text-gray-800 placeholder-gray-400" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Nationality</label>
          <input name="nationality" value={form.nationality} onChange={handleChange} className="input input-bordered border border-gray-300 w-full text-gray-800 placeholder-gray-400" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">NIN</label>
          <input name="NIN" value={form.NIN} onChange={handleChange} className="input input-bordered border border-gray-300 w-full text-gray-800 placeholder-gray-400" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">ID Card</label>
          <input name="idCard" value={form.idCard} onChange={handleChange} className="input input-bordered border border-gray-300 w-full text-gray-800 placeholder-gray-400" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Occupation</label>
          <input name="occupation" value={form.occupation} onChange={handleChange} className="input input-bordered border border-gray-300 w-full text-gray-800 placeholder-gray-400" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Profile Picture URL</label>
          <input name="profilePicture" value={form.profilePicture} onChange={handleChange} className="input input-bordered border border-gray-300 w-full text-gray-800 placeholder-gray-400" />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Bio</label>
        <textarea name="bio" value={form.bio} onChange={handleChange} className="textarea textarea-bordered border border-gray-300 w-full text-gray-800 placeholder-gray-400" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Twitter</label>
          <input name="twitter" value={form.twitter} onChange={handleChange} className="input input-bordered border border-gray-300 w-full text-gray-800 placeholder-gray-400" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">LinkedIn</label>
          <input name="linkedin" value={form.linkedin} onChange={handleChange} className="input input-bordered border border-gray-300 w-full text-gray-800 placeholder-gray-400" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Facebook</label>
          <input name="facebook" value={form.facebook} onChange={handleChange} className="input input-bordered border border-gray-300 w-full text-gray-800 placeholder-gray-400" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Instagram</label>
          <input name="instagram" value={form.instagram} onChange={handleChange} className="input input-bordered border border-gray-300 w-full text-gray-800 placeholder-gray-400" />
        </div>
      </div>
      <button type="submit" className="btn btn-primary w-full" disabled={loading}>
        {loading ? "Saving..." : "Update Profile"}
      </button>
    </form>
  );
}
