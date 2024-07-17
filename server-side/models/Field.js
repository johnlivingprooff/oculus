const mongoose = require('mongoose');

// field schema class
const FieldSchema = new mongoose.Schema({
  fieldName: { type: String, required: true },
  fieldSize: { type: Number },
  fieldLocation: { type: String, required: true },
  crop: { type: String, required: true },
  fieldLog: [{
    title: { type: String, required: true },
    description: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date },
  }], // a list of logs
  marketInsights: {
    currentPrice: { type: Number },
    priceTrend: { type: String },
    demand: { type: String },
    supply: { type: String },
  },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

// export class
const Field = mongoose.model('Field', FieldSchema);
module.exports = Field;