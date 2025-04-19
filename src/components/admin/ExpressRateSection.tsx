// ExpressRateSection handles the form fields for the express shipping rate option.
// It manages a nested expressRate object and ensures updates are propagated correctly to the parent state.

import React from 'react';

interface ExpressRateSectionProps {
  form: Record<string, any>;
  setForm: (value: Record<string, any>) => void;
}

/**
 * ExpressRateSection renders the input form for the express shipping rate option.
 * - expressRate: The current state object for this option.
 * - setExpressRate: A function to update the option object, used to propagate changes up to the parent.
 */
// DEPRECATED: All express rate logic has been moved to OptionRateSection.
// This file is preserved for reference only and should not be used in new code.
import React from "react";
const ExpressRateSection: React.FC = () => null;
export default ExpressRateSection;

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