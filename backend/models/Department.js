const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    code: { type: String, required: true, unique: true, uppercase: true },
    categories: [
      {
        type: String,
        enum: ['road', 'water', 'drainage', 'electricity', 'garbage', 'streetlight', 'other'],
      },
    ],
    head: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    officers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    contactEmail: String,
    contactPhone: String,
    slaHours: { type: Number, default: 72 }, // Service Level Agreement in hours
    isActive: { type: Boolean, default: true },
    ward: [String],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Department', departmentSchema);
