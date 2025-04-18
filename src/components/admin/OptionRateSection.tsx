import React from 'react';

interface OptionRateSectionProps {  
  form: Record<string, any>;
  setForm: (updater: (prev: Record<string, any>) => Record<string, any>) => void;
  rateType: 'seaRate' | 'fastTrackRate' | 'consoleRate';
}

const OptionRateSection: React.FC<OptionRateSectionProps> = ({ form, setForm, rateType }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    if (name === 'goodsCategory') {
      setForm((prev) => ({ ...prev, goodsCategory: value.split(',').map((s) => s.trim()).filter(Boolean) }));
    } else if (type === 'checkbox') {
      setForm((prev) => ({ ...prev, [name]: checked }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value === '' ? '' : isNaN(Number(value)) ? value : Number(value) }));
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
                type="number"
                name={range}
                value={form[range] || ''}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              />
            </div>
          ))}
          <div>
            <label className="block text-gray-700">Rate Per Piece</label>
            <input
              type="number"
              name="ratePerPiece"
              value={form.ratePerPiece || ''}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-gray-700">Rate Per Volume</label>
            <input
              type="number"
              name="ratePerVolume"
              value={form.ratePerVolume || ''}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-gray-700">Custom Clearance Rate (Air)</label>
            <input
              type="number"
              name="customClearanceRateAir"
              value={form.customClearanceRateAir || ''}
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
          <div className="flex items-center mt-2">
            <input
              type="checkbox"
              name="active"
              checked={!!form.active}
              onChange={handleChange}
              className="mr-2"
            />
            <label className="text-gray-700">Active</label>
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
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-gray-700">Rate Per 20ft</label>
            <input
              type="number"
              name="ratePer20ft"
              value={form.ratePer20ft || ''}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-gray-700">Rate Per 40ft</label>
            <input
              type="number"
              name="ratePer40ft"
              value={form.ratePer40ft || ''}
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
          <div>
            <label className="block text-gray-700">Custom Clearance Rate Per CBM</label>
            <input
              type="number"
              name="customClearanceRatePerCBM"
              value={form.customClearanceRatePerCBM || ''}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div className="flex items-center mt-2">
            <input
              type="checkbox"
              name="active"
              checked={!!form.active}
              onChange={handleChange}
              className="mr-2"
            />
            <label className="text-gray-700">Active</label>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default OptionRateSection;