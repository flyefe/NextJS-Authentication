// ExpressRateSection handles the form fields for the express shipping rate option.
// It manages a nested expressRate object and ensures updates are propagated correctly to the parent state.

import React from 'react';

interface ExpressRateSectionProps {
  form: Record<string, any>;
  setForm: (value: Record<string, any>) => void;
}

/**
 * ExpressRateSection renders the input form for the express shipping rate option.
 * - form: The current state object for this option.
 * - setForm: A function to update the option object, used to propagate changes up to the parent.
 * Fields like 'expressRate.0.5' are handled as nested keys in the expressRate object.
 */
const ExpressRateSection: React.FC<ExpressRateSectionProps> = ({ form, setForm }) => {
  // Debug: Log the form state every render
  console.log('[ExpressRateSection]', form);
  /**
   * handleChange updates the expressRate object for any field change.
   * - For fields starting with 'expressRate.', it updates the nested expressRate property.
   * - For goodsCategory, it splits the comma-separated string into an array.
   * - For checkboxes, it sets the boolean value.
   * - For numbers, it parses and stores as a number if possible, otherwise as a string.
   * All changes are merged into the current option object and propagated up via setForm.
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    if (name.startsWith("expressRate.")) {
      const key = name.split(".")[1];
      setForm({
        ...form,
        expressRate: {
          ...form.expressRate,
          [key]: value === '' ? '' : isNaN(Number(value)) ? value : Number(value)
        }
      });
    } else if (name === 'goodsCategory') {
      setForm({ ...form, goodsCategory: value.split(',').map(s => s.trim()).filter(Boolean) });
    } else if (type === 'checkbox') {
      setForm({ ...form, [name]: checked });
    } else {
      setForm({ ...form, [name]: value === '' ? '' : isNaN(Number(value)) ? value : Number(value) });
    }
  };

  return (
    <div className="mb-4">
      <h3 className="text-lg font-bold mb-2">Express Rate</h3>
      <div className="space-y-2">
        {["0.5", "1.0", "1.5", "2.0", "2.5", "3.0", "3.5", "4.0", "4.5", "5.0"].map((weight) => (
          <div key={weight}>
            <label className="block text-gray-700">{weight} kg</label>
            <input
              type="number"
              name={`expressRate.${weight}`} // Use dynamic property name
              value={form.expressRate?.[weight] || ''} // Default to empty string if undefined
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 text-gray-900"
            />
          </div>
        ))}
        <div>
          <label className="block text-gray-700">Extra Half KG Rate</label>
          <input
            type="number"
            name="expressRate.extraHalfKgRate"
            value={form.expressRate?.extraHalfKgRate || ''}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 text-gray-900"
          />
        </div>
        <div>
          <label className="block text-gray-700">Subcharge</label>
          <input
            type="number"
            name="expressRate.subCharge"
            value={form.expressRate?.subCharge || ''}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 text-gray-900"
          />
        </div>
        <div>
          <label className="block text-gray-700">VAT Percent</label>
          <input
            type="number"
            name="expressRate.vatPercent"
            value={form.expressRate?.vatPercent || ''}
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
};

export default ExpressRateSection;