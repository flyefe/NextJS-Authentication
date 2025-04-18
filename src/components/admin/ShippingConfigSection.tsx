// ShippingConfigSection handles the form fields for configuring general shipping options and allowed goods.
// It receives the current shippingConfig object (form) and a setForm updater for that object.

import React from 'react';

/**
 * ShippingConfigSection renders input fields for general shipping configuration.
 * - form: The current state object for this section.
 * - setForm: A function to update the shippingConfig object, propagating changes up to the parent.
 */
const ShippingConfigSection = ({ form, setForm }) => {
  /**
   * handleChange updates the shippingConfig object for any field change.
   * - For array fields (like availableOptions, allowedGoods), it splits the comma-separated string into an array.
   * - For numbers, it parses the value to a float, defaulting to 0 if invalid.
   * All changes are merged into the current shippingConfig object and propagated up via setForm.
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: Array.isArray(value) ? value.split(',') : parseFloat(value) || 0 }));
  };

  return (
    <div className="mb-4">
      <h3 className="text-lg font-bold mb-2">Shipping Configuration</h3>
      <div className="space-y-2">
        <div>
          <label className="block text-gray-700">Available Options (comma separated)</label>
          <input
            type="text"
            name="shippingConfig.availableOptions"
            value={form.shippingConfig?.availableOptions?.join(',') || ''}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-gray-700">Allowed Goods (comma separated)</label>
          <input
            type="text"
            name="shippingConfig.allowedGoods"
            value={form.shippingConfig?.allowedGoods?.join(',') || ''}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-gray-700">SubCharge</label>
          <input
            type="number"
            name="shippingConfig.subCharge"
            value={form.shippingConfig?.subCharge || ''}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-gray-700">VAT Percent</label>
          <input
            type="number"
            name="shippingConfig.vatPercent"
            value={form.shippingConfig?.vatPercent || ''}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />
        </div>
      </div>
    </div>
  );
};

export default ShippingConfigSection; 