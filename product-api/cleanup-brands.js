const mongoose = require('mongoose');
const Brand = require('./models/Brand');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/commercedb', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

async function cleanupBrands() {
  try {
    console.log('Cleaning up brands with null slug...');
    
    // Delete all brands with null slug
    const result = await Brand.deleteMany({ slug: null });
    console.log(`Deleted ${result.deletedCount} brands with null slug`);
    
    // Update existing brands without slug to generate one
    const brandsWithoutSlug = await Brand.find({ slug: { $exists: false } });
    console.log(`Found ${brandsWithoutSlug.length} brands without slug`);
    
    for (let brand of brandsWithoutSlug) {
      await brand.save(); // This will trigger the pre-save hook to generate slug
      console.log(`Generated slug for brand: ${brand.name} -> ${brand.slug}`);
    }
    
    console.log('Cleanup completed!');
    process.exit(0);
  } catch (error) {
    console.error('Error during cleanup:', error);
    process.exit(1);
  }
}

cleanupBrands();
