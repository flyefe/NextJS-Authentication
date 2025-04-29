// OptionRateSection handles the form fields for shipping rate options such as sea, fast track, and console rates.
// It receives the current option object (form), a setForm updater for that object, and the rateType string.
// The component renders different fields depending on the rateType and ensures all updates are merged into the parent state.

import React from 'react';

interface OptionRateSectionProps {  
  form: Record<string, any>;
  setForm: (value: Record<string, any>) => void;
  rateType: 'seaRate' | 'fastTrackRate' | 'consoleRate' | 'expressRate';
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
    console.log('Input value:', value); // Debug: Log the raw input value
    if (name === 'goodsCategory') {
      // Split by commas, trim leading/trailing whitespace, but preserve spaces within names
      const categories = value.split(',').map((s) => s.trim());
      console.log('Processed categories:', categories); // Debug: Log the processed categories
      setForm({ ...form, goodsCategory: categories });
    } else if (type === 'checkbox') {
      setForm({ ...form, [name]: checked });
    } else {
      setForm({ ...form, [name]: value === '' ? '' : isNaN(Number(value)) ? value : Number(value) });
    }
  };

  if (rateType === 'expressRate') {
    return (
      <div className="mb-4">
        <h3 className="text-lg font-bold mb-2">Express Rate</h3>
        <div className="space-y-2">
          {["0_5kg", "1_0kg", "1_5kg", "2_0kg", "2_5kg", "3_0kg", "3_5kg", "4_0kg", "4_5kg", "5_0kg"].map((weight) => (
            <div key={weight}>
              <label className="block text-gray-700">{weight}</label>
              <input
                type="number"
                name={weight}
                value={form[weight] || 0} // Default to 0 if no value
                onChange={handleChange}
                className="w-full border rounded px-3 py-2 text-gray-900"
              />
            </div>
          ))}
          <div>
            <label className="block text-gray-700">Extra Half KG Rate</label>
            <input
              type="number"
              name="extraHalfKgRate"
              value={form.extraHalfKgRate ?? ''}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 text-gray-900"
            />
          </div>
          <div>
            <label className="block text-gray-700">Sub Charge</label>
            <input
              type="number"
              name="subCharge"
              value={form.subCharge ?? ''}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 text-gray-900"
            />
          </div>
          <div>
            <label className="block text-gray-700">VAT Percent</label>
            <input
              type="number"
              name="vatPercent"
              value={form.vatPercent ?? ''}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 text-gray-900"
            />
          </div>
          <div>
            <label className="block text-gray-700">Base Rate</label>
            <input
              type="number"
              name="baseRate"
              value={form.baseRate ?? 0}
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
          {/* ETA input for this rate option */}
          <div className="mt-2">
            <label className="block text-gray-900">ETA (days)</label>
            <span className="block text-xs text-gray-500 mb-1">Set the estimated delivery time for this shipping option.</span>
            <input
              type="number"
              name="eta"
              value={form.eta ?? 0}
              onChange={e => {
                const eta = Number(e.target.value);
                setForm({
                  ...form,
                  eta,
                });
              }}
              className="w-full border rounded px-3 py-2 bg-white text-gray-900"
              min="0"
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

  if (rateType === 'fastTrackRate' || rateType === 'consoleRate') {
    return (
      <div className="mb-4">
        <h3 className="text-lg font-bold mb-2">{rateType === 'fastTrackRate' ? 'Fast Track Rate' : 'Console Rate'}</h3>
        <div className="space-y-2">
          {["1-5kg", "6-10kg", "above10kg"].map((range) => (
            <div key={range}>
              <label className="block text-gray-700">{range}</label>
              <input
                type="number"
                name={range}
                value={form[range] || 0} // Default to 0 if no value
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
            <label className="block text-gray-700">Has Battery Rate</label>
            <input
              type="number"
              name="hasBatteryRate"
              value={form.hasBatteryRate || ''}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 text-gray-900"
            />
          </div>
          <div>
            <label className="block text-gray-700">Has Food Rate</label>
            <input
              type="number"
              name="hasFoodRate"
              value={form.hasFoodRate || ''}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 text-gray-900"
            />
          </div>
          <div>
            <label className="block text-gray-700">Special Goods Rate</label>
            <input
              type="number"
              name="specialGoodsRate"
              value={form.specialGoodsRate || ''}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 text-gray-900"
            />
          </div>
          <div>
            <label className="block text-gray-700">Has Chemical Rate</label>
            <input
              type="number"
              name="hasChemicalRate"
              value={form.hasChemicalRate || ''}
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
          {/* ETA input for this rate option */}
          <div className="mt-2">
            <label className="block text-gray-900">ETA (days)</label>
            <span className="block text-xs text-gray-500 mb-1">Set the estimated delivery time for this shipping option.</span>
            <input
              type="number"
              name="eta"
              value={form.eta ?? 0}
              onChange={e => {
                const eta = Number(e.target.value);
                setForm({
                  ...form,
                  eta,
                });
              }}
              className="w-full border rounded px-3 py-2 bg-white text-gray-900"
              min="0"
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
            <label className="block text-gray-700">Rate Per 40ft High Cube</label>
            <input
              type="number"
              name="ratePer40ftHighCube"
              value={form.ratePer40ftHighCube || ''}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 text-gray-900"
            />
          </div>
          <div>
            <label className="block text-gray-700">Rate Per 45ft High Cube</label>
            <input
              type="number"
              name="ratePer45ftHighCube"
              value={form.ratePer45ftHighCube || ''}
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
          {/* ETA input for this rate option */}
          <div className="mt-2">
            <label className="block text-gray-900">ETA (days)</label>
            <span className="block text-xs text-gray-500 mb-1">Set the estimated delivery time for this shipping option.</span>
            <input
              type="number"
              name="eta"
              value={form.eta ?? 0}
              onChange={e => {
                const eta = Number(e.target.value);
                setForm({
                  ...form,
                  eta,
                });
              }}
              className="w-full border rounded px-3 py-2 bg-white text-gray-900"
              min="0"
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