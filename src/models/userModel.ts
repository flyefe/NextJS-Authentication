// This model can be used to store information about users.

import mongoose from "mongoose";

// Subschema for user profile
const UserProfileSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [false, "Please provide a first name"],
  },
  lastName: {
    type: String,
    required: [false, "Please provide a last name"],
  },
  address: {
    type: String,
    required: [false, "Please provide an address"],
  },
  phoneNumber: {
    type: String,
    required: [false, "Please provide a phone number"],
  },
  idCard: {
    type: String,
    required: [false, "Please provide an ID card"],
  },
  dob: {
    type: Date,
    required: [false, "Please provide a date of birth"],
  },
  gender: {
    type: String,
    enum: ["male", "female"],
    required: [false, "Please provide a gender"],
  },
  profilePicture: {
    type: String,
    default: "",
  },
  bio: {
    type: String,
    default: "",
  },
  nationality: {
    type: String,
    default: "",
  },
  NIN: {
    type: String,
  },
  occupation: {
    type: String,
    default: "",
  },
  maritalStatus: {
    type: String,
    enum: ["single", "married", "divorced", "widowed", "other"],
    default: "single",
  },
  socialLinks: {
    twitter: { type: String, default: "" },
    linkedin: { type: String, default: "" },
    facebook: { type: String, default: "" },
    instagram: { type: String, default: "" },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
}, { _id: false });

// Subschema for company (for B2B users)
const CompanySchema = new mongoose.Schema({
  companyName: {
    type: String,
    required: [false, "Please provide a company name"],
  },
  companyAddress: {
    type: String,
    default: "",
  },
  companyEmail: {
    type: String,
    default: "",
  },
  companyPhone: {
    type: String,
    default: "",
  },
  registrationNumber: {
    type: String,
    default: "",
  },
  website: {
    type: String,
    default: "",
  },
  industry: {
    type: String,
    default: "",
  },
  companyLogo: {
    type: String,
    default: "",
  },
  contactPerson: {
    type: String,
    default: "",
  },
  position: {
    type: String,
    default: "",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
}, { _id: false });

// Main user schema, embedding UserProfileSchema and CompanySchema
const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Please provide a username"],
    unique: true,
  },
  email: {
    type: String,
    required: [true, "Please provide an email"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  isStaff: {
    type: Boolean,
    default: false,
  },
  isCustomer: {
    type: Boolean,
    default: false,
  },
  isDriver: {
    type: Boolean,
    default: false,
  },
  isShipmentStaff: {
    type: Boolean,
    default: false,
  },
  forgotPasswordToken: String,
  forgotPasswordTokenExpiry: Date,
  verifyToken: String,
  verifyTokenExpiry: Date,
  profile: UserProfileSchema,
  company: {
    type: CompanySchema,
    default: undefined, // Optional field
  },
});

const User = mongoose.models.User || mongoose.model("User", UserSchema);

export default User;
