import React from 'react';

const OptionRateSection = ({ form, setForm }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: parseFloat(value) || 0 }));
  };

  return (
    <div className="mb-4">
      <h3 className="text-lg font-bold mb-2">Option Rate</h3>
      <div className="space-y-2">
        {["1-5kg", "6-10kg", "above10kg"].map((range) => (
          <div key={range}>
            <label className="block text-gray-700">{range}</label>
            <input
              type="text"
              name={`optionRate.${range}`}
              value={form.optionRate?.[range] || ''}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>
        ))}
        <div>
          <label className="block text-gray-700">Rate Per KG</label>
          <input
            type="number"
            name="optionRate.ratePerKg"
            value={form.optionRate?.ratePerKg || ''}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-gray-700">Rate Per Piece</label>
          <input
            type="number"
            name="optionRate.ratePerPiece"
            value={form.optionRate?.ratePerPiece || ''}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-gray-700">Rate Per CBM</label>
          <input
            type="number"
            name="optionRate.ratePerCBM"
            value={form.optionRate?.ratePerCBM || ''}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-gray-700">Rate Per 20ft</label>
          <input
            type="number"
            name="optionRate.ratePer20ft"
            value={form.optionRate?.ratePer20ft || ''}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-gray-700">Rate Per 40ft</label>
          <input
            type="number"
            name="optionRate.ratePer40ft"
            value={form.optionRate?.ratePer40ft || ''}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-gray-700">Custom Clearance Rate Sea</label>
          <input
            type="number"
            name="optionRate.customClearanceRateSea"
            value={form.optionRate?.customClearanceRateSea || ''}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-gray-700">Custom Clearance Rate Air</label>
          <input
            type="number"
            name="optionRate.customClearanceRateAir"
            value={form.optionRate?.customClearanceRateAir || ''}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-gray-700">Exchange Rate</label>
          <input
            type="number"
            name="optionRate.exchangeRate"
            value={form.optionRate?.exchangeRate || ''}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />
        </div>
      </div>
    </div>
  );
};

export default OptionRateSection; 