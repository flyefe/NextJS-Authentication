
// This model can be used to store information about countries.

import mongoose from 'mongoose'

const CountrySchema = new mongoose.Schema({
  name: String,
  code: String,
})

export default mongoose.models.Country || mongoose.model('Country', CountrySchema)
