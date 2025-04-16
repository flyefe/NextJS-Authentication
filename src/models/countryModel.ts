
// This model can be used to store information about countries.

import mongoose from 'mongoose'

const CountrySchema = new mongoose.Schema({
  name: { type: String, required: true },
  code: { type: String }, // ISO code (optional)
}, { timestamps: true });

const Country = mongoose.models.Country || mongoose.model("Country", CountrySchema);
export default Country;