import React from 'react';

interface ExpressRateSectionProps {
  form: Record<string, any>;
  setForm: (updater: (prev: Record<string, any>) => Record<string, any>) => void;
}

const ExpressRateSection: React.FC<ExpressRateSectionProps> = ({ form, setForm }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'goodsCategory') {
      setForm((prev) => ({ ...prev, goodsCategory: value.split(',').map(s => s.trim()).filter(Boolean) }));
    } else {
      setForm((prev) => ({ ...prev, [name]: parseFloat(value) || 0 }));
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
        <div>
          <label className="block text-gray-700">Goods Category (comma separated)</label>
          <input
            type="text"
            name="goodsCategory"
            value={Array.isArray(form.goodsCategory) ? form.goodsCategory.join(', ') : ''}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />
        </div>
      </div>
    </div>
  );
};

export default ExpressRateSection;