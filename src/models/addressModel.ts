import mongoose from 'mongoose'

const AddressSchema = new mongoose.Schema({
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  country: { type: mongoose.Schema.Types.ObjectId, ref: "Country" },
  postalCode: { type: String },
}, { timestamps: true });

const Address = mongoose.models.Address || mongoose.model("Address", AddressSchema);
export default Address;
