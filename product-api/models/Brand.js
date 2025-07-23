const mongoose = require('mongoose');

// Function to generate slug from name
function generateSlug(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .trim('-'); // Remove leading/trailing hyphens
}

const BrandSchema = new mongoose.Schema({
  name: { type: String, required: true },
  subCategory: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'SubCategory', 
    required: true 
  },
  description: String,
  logo: String,
  website: String,
  slug: { type: String, unique: true },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

// Automatically generate slug before saving
BrandSchema.pre('save', async function(next) {
  if (!this.slug && this.name) {
    let baseSlug = generateSlug(this.name);
    let slug = baseSlug;
    let counter = 1;
    
    // Check if slug already exists and make it unique
    while (await mongoose.models.Brand.findOne({ slug: slug, _id: { $ne: this._id } })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }
    
    this.slug = slug;
  }
  next();
});

module.exports = mongoose.model('Brand', BrandSchema);
