const { Schema, model } = require('mongoose');

const BudgetCategorySchema = new Schema({
  name:            { type: String, required: true },
  allocatedAmount: { type: Number, required: true, min: 0 },
  spentAmount:     { type: Number, default: 0, min: 0 }
});

const BudgetSchema = new Schema({
  tripId:      { type: Schema.Types.ObjectId, ref: 'Trip', required: true, unique: true },
  totalBudget: { type: Number, required: true, min: 0 },
  categories:  [BudgetCategorySchema]
}, {
  timestamps: true,
  toJSON:     { virtuals: true },
  toObject:   { virtuals: true }
});

BudgetSchema.index({ tripId: 1 });

// Virtual: remainingBudget
BudgetSchema.virtual('remainingBudget').get(function () {
  const spent = this.categories.reduce((sum, c) => sum + c.spentAmount, 0);
  return parseFloat((this.totalBudget - spent).toFixed(2));
});

// Virtual: totalSpent
BudgetSchema.virtual('totalSpent').get(function () {
  return parseFloat(this.categories.reduce((sum, c) => sum + c.spentAmount, 0).toFixed(2));
});

module.exports = model('Budget', BudgetSchema);
