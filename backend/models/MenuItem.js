import mongoose from 'mongoose';

const menuItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    flavorNotes: [{ type: String }],
    origin: { type: String, default: 'Single Origin' },
    calories: { type: Number, default: 120 },
    image: { type: String, required: true },
    isChefSpecial: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const MenuItem = mongoose.model('MenuItem', menuItemSchema);
export default MenuItem;
