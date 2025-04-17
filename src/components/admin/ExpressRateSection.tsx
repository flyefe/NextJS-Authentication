import React from 'react';

const ExpressRateSection = ({ form, setForm }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: parseFloat(value) || 0 }));
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
              name={`expressRate.${weight}`}
              value={form.expressRate?.[weight] || ''}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
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
            className="w-full border rounded px-3 py-2"
          />
        </div>
      </div>
    </div>
  );
};

export default ExpressRateSection; 