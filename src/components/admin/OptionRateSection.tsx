// OptionRateSection handles the form fields for shipping rate options such as sea, fast track, and console rates.
// It receives the current option object (form), a setForm updater for that object, and the rateType string.
// The component renders different fields depending on the rateType and ensures all updates are merged into the parent state.

import React from 'react';

interface OptionRateSectionProps {  
  form: Record<string, any>;
  setForm: (value: Record<string, any>) => void;
  rateType: 'seaRate' | 'fastTrackRate' | 'consoleRate';
}

/**
 * OptionRateSection renders the input form for a specific shipping option (seaRate, fastTrackRate, or consoleRate).
 * - form: The current state object for this option.
 * - setForm: A function to update the option object, used to propagate changes up to the parent.
 * - rateType: Determines which fields to display (sea, fast track, or console).
 */
const OptionRateSection: React.FC<OptionRateSectionProps> = ({ form, setForm, rateType }) => {
  // Debug: Log the form state every render
  console.log('[OptionRateSection]', rateType, form);
  /**
   * handleChange updates the local option object for any field change.
   * - For goodsCategory, it splits the comma-separated string into an array.
   * - For checkboxes, it sets the boolean value.
   * - For numbers, it parses and stores as a number if possible, otherwise as a string.
   * All changes are merged into the current option object and propagated up via setForm.
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    if (name === 'goodsCategory') {
      setForm({ ...form, goodsCategory: value.split(',').map((s) => s.trim()).filter(Boolean) });
    } else if (type === 'checkbox') {
      setForm({ ...form, [name]: checked });
    } else {
      setForm({ ...form, [name]: value === '' ? '' : isNaN(Number(value)) ? value : Number(value) });
    }
  };

  if (rateType === 'fastTrackRate' || rateType === 'consoleRate') {
    return (
      <div className="mb-4">
        <h3 className="text-lg font-bold mb-2">{rateType === 'fastTrackRate' ? 'Fast Track Rate' : 'Console Rate'}</h3>
        <div className="space-y-2">
          {["1-5kg", "6-10kg", "above10kg"].map((range) => (
            <div key={range}>
              <label className="block text-gray-700">{range}</label>
              <input
                type="text"
                name={range}
                value={form[range] || ''}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2 text-gray-900"
              />
            </div>
          ))}
          <div>
            <label className="block text-gray-700">Rate Per Kg</label>
            <input
              type="number"
              name="ratePerKg"
              value={form.ratePerKg || ''}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 text-gray-900"
            />
          </div>
          <div>
            <label className="block text-gray-700">Rate Per Piece</label>
            <input
              type="number"
              name="ratePerPiece"
              value={form.ratePerPiece || ''}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 text-gray-900"
            />
          </div>
          <div>
            <label className="block text-gray-700">Rate Per Volume</label>
            <input
              type="number"
              name="ratePerVolume"
              value={form.ratePerVolume || ''}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 text-gray-900"
            />
          </div>
          <div>
            <label className="block text-gray-700">Custom Clearance Rate (Air)</label>
            <input
              type="number"
              name="customClearanceRateAir"
              value={form.customClearanceRateAir || ''}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 text-gray-900"
            />
          </div>
          <div>
            <label className="block text-gray-700">Goods Category (comma separated)</label>
            <input
              type="text"
              name="goodsCategory"
              value={Array.isArray(form.goodsCategory) ? form.goodsCategory.join(', ') : ''}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 text-gray-900"
            />
          </div>
          <div className="flex items-center mt-2">
            <input
              type="checkbox"
              name="active"
              checked={form.active}
              onChange={handleChange}
              className="mr-2"
            />
            <label className="text-gray-700">Is Active</label>
          </div>
        </div>
      </div>
    );
  }

  if (rateType === 'seaRate') {
    return (
      <div className="mb-4">
        <h3 className="text-lg font-bold mb-2">Sea Rate</h3>
        <div className="space-y-2">
          <div>
            <label className="block text-gray-700">Rate Per CBM</label>
            <input
              type="number"
              name="ratePerCBM"
              value={form.ratePerCBM || ''}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 text-gray-900"
            />
          </div>
          <div>
            <label className="block text-gray-700">Rate Per 20ft</label>
            <input
              type="number"
              name="ratePer20ft"
              value={form.ratePer20ft || ''}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 text-gray-900"
            />
          </div>
          <div>
            <label className="block text-gray-700">Rate Per 40ft</label>
            <input
              type="number"
              name="ratePer40ft"
              value={form.ratePer40ft || ''}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 text-gray-900"
            />
          </div>
          <div>
            <label className="block text-gray-700">Custom Clearance Cost</label>
            <input
              type="number"
              name="customClearanceCost"
              value={form.customClearanceCost || ''}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 text-gray-900"
            />
          </div>
          <div>
            <label className="block text-gray-700">Documentation Cost</label>
            <input
              type="number"
              name="documentationCost"
              value={form.documentationCost || ''}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 text-gray-900"
            />
          </div>
          <div>
            <label className="block text-gray-700">Goods Category (comma separated)</label>
            <input
              type="text"
              name="goodsCategory"
              value={Array.isArray(form.goodsCategory) ? form.goodsCategory.join(', ') : ''}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 text-gray-900"
            />
          </div>
          <div>
            <label className="block text-gray-700">Custom Clearance Rate Per CBM</label>
            <input
              type="number"
              name="customClearanceRatePerCBM"
              value={form.customClearanceRatePerCBM || ''}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 text-gray-900"
            />
          </div>
          <div className="flex items-center mt-2">
            <input
              type="checkbox"
              name="active"
              checked={form.active} 
              onChange={handleChange}
              className="mr-2"
            />
            <label className="text-gray-700">Is Active</label>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default OptionRateSection;