import mongoose from 'mongoose';
import calculateCost from '../modules/calculateCost.js';

const loanSchema = mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
  loan_type: { type: String, required: true, enum: ['Home', 'Auto', 'Personal'], default: 'Mortgage' },
  loan_number: { type: String, required: true, unique: true },
  amount: { type: Number, required: true, min: 1000, max: 1000000 },
  interest_rate: { type: Number, required: true },
  loan_term: { type: Number, required: true, range: [1, 30] },
  total_cost: { type: String },
  start_date: { type: Date, required: true },
  created_date: { type: Date, default: Date.now },
  updated_date: { type: Date, default: Date.now },
  is_deleted: { type: Boolean, default: false },
});

loanSchema.pre('save', function (next) {
  console.log(this.amount)
  console.log(this.interest_rate)
  console.log(this.loan_term)

  this.total_cost = calculateCost(this.amount, this.interest_rate, this.loan_term);
  console.log(this.total_cost)
  next();
});

const Loan = mongoose.model('loan', loanSchema);

export default Loan;