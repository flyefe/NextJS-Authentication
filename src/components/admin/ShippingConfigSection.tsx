import React from 'react';

const ShippingConfigSection = ({ form, setForm }) => {
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