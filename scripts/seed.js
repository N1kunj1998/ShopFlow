const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

// Product data templates
const productTemplates = {
  electronics: [
    { name: 'Wireless Headphones', price: 99.99, compareAtPrice: 149.99, stock: 50, featured: true },
    { name: 'Smart Watch', price: 199.99, compareAtPrice: null, stock: 30, featured: true },
    { name: 'Laptop Stand', price: 49.99, compareAtPrice: 69.99, stock: 40, featured: false },
    { name: 'USB-C Cable', price: 12.99, compareAtPrice: 19.99, stock: 200, featured: false },
    { name: 'Wireless Mouse', price: 29.99, compareAtPrice: 39.99, stock: 75, featured: false },
    { name: 'Mechanical Keyboard', price: 89.99, compareAtPrice: 129.99, stock: 45, featured: true },
    { name: 'Webcam HD', price: 59.99, compareAtPrice: 79.99, stock: 60, featured: false },
    { name: 'External Hard Drive 1TB', price: 79.99, compareAtPrice: 99.99, stock: 35, featured: false },
    { name: 'Bluetooth Speaker', price: 49.99, compareAtPrice: 69.99, stock: 80, featured: true },
    { name: 'Tablet Stand', price: 24.99, compareAtPrice: 34.99, stock: 100, featured: false },
    { name: 'Phone Charger', price: 15.99, compareAtPrice: 24.99, stock: 150, featured: false },
    { name: 'Power Bank 10000mAh', price: 34.99, compareAtPrice: 49.99, stock: 90, featured: false },
    { name: 'Gaming Headset', price: 79.99, compareAtPrice: 119.99, stock: 55, featured: true },
    { name: 'Monitor Stand', price: 39.99, compareAtPrice: 54.99, stock: 65, featured: false },
    { name: 'USB Hub', price: 19.99, compareAtPrice: 29.99, stock: 120, featured: false },
  ],
  clothing: [
    { name: 'Cotton T-Shirt', price: 24.99, compareAtPrice: 29.99, stock: 100, featured: false },
    { name: 'Denim Jeans', price: 79.99, compareAtPrice: 99.99, stock: 60, featured: true },
    { name: 'Hoodie', price: 59.99, compareAtPrice: 79.99, stock: 70, featured: true },
    { name: 'Sneakers', price: 89.99, compareAtPrice: 119.99, stock: 50, featured: true },
    { name: 'Baseball Cap', price: 19.99, compareAtPrice: 29.99, stock: 150, featured: false },
    { name: 'Sweatpants', price: 44.99, compareAtPrice: 59.99, stock: 80, featured: false },
    { name: 'Polo Shirt', price: 34.99, compareAtPrice: 49.99, stock: 90, featured: false },
    { name: 'Jacket', price: 99.99, compareAtPrice: 149.99, stock: 40, featured: true },
    { name: 'Shorts', price: 29.99, compareAtPrice: 39.99, stock: 110, featured: false },
    { name: 'Dress Shirt', price: 49.99, compareAtPrice: 69.99, stock: 75, featured: false },
    { name: 'Winter Coat', price: 149.99, compareAtPrice: 199.99, stock: 30, featured: true },
    { name: 'Running Shoes', price: 79.99, compareAtPrice: 109.99, stock: 65, featured: false },
    { name: 'Belt', price: 24.99, compareAtPrice: 34.99, stock: 130, featured: false },
    { name: 'Socks Pack', price: 12.99, compareAtPrice: 19.99, stock: 200, featured: false },
    { name: 'Backpack', price: 69.99, compareAtPrice: 89.99, stock: 55, featured: false },
  ],
  books: [
    { name: 'JavaScript Guide', price: 39.99, compareAtPrice: null, stock: 25, featured: true },
    { name: 'Python Programming', price: 44.99, compareAtPrice: null, stock: 30, featured: true },
    { name: 'Web Development Basics', price: 34.99, compareAtPrice: null, stock: 40, featured: false },
    { name: 'React Complete Guide', price: 49.99, compareAtPrice: null, stock: 20, featured: true },
    { name: 'Node.js Essentials', price: 42.99, compareAtPrice: null, stock: 35, featured: false },
    { name: 'Database Design', price: 47.99, compareAtPrice: null, stock: 28, featured: false },
    { name: 'CSS Mastery', price: 37.99, compareAtPrice: null, stock: 45, featured: false },
    { name: 'TypeScript Handbook', price: 45.99, compareAtPrice: null, stock: 32, featured: true },
    { name: 'System Design', price: 54.99, compareAtPrice: null, stock: 22, featured: true },
    { name: 'Algorithms & Data Structures', price: 52.99, compareAtPrice: null, stock: 26, featured: false },
    { name: 'Clean Code', price: 39.99, compareAtPrice: null, stock: 38, featured: true },
    { name: 'Design Patterns', price: 47.99, compareAtPrice: null, stock: 29, featured: false },
    { name: 'API Development', price: 43.99, compareAtPrice: null, stock: 33, featured: false },
    { name: 'DevOps Handbook', price: 49.99, compareAtPrice: null, stock: 27, featured: false },
    { name: 'Cloud Computing Guide', price: 51.99, compareAtPrice: null, stock: 24, featured: true },
  ],
}

// Generate product descriptions
function generateDescription(category, productName) {
  const descriptions = {
    electronics: [
      'High-quality electronic device with advanced features and modern design.',
      'Premium electronics with cutting-edge technology and reliable performance.',
      'Professional-grade device designed for optimal user experience.',
      'Innovative electronic solution with sleek design and superior functionality.',
      'State-of-the-art technology with excellent build quality and durability.',
    ],
    clothing: [
      'Comfortable and stylish apparel made from high-quality materials.',
      'Fashion-forward design with premium fabric and excellent fit.',
      'Durable clothing item perfect for everyday wear.',
      'Trendy and comfortable garment with modern styling.',
      'Classic design with contemporary touches and superior comfort.',
    ],
    books: [
      'Comprehensive guide with detailed explanations and practical examples.',
      'In-depth coverage of the subject with real-world applications.',
      'Well-structured content with clear explanations and exercises.',
      'Expert-authored book with valuable insights and best practices.',
      'Essential resource for learning and mastering the topic.',
    ],
  }
  const categoryDescriptions = descriptions[category] || descriptions.electronics
  return categoryDescriptions[Math.floor(Math.random() * categoryDescriptions.length)]
}

// Generate product images using Picsum Photos with category-based seeds
function generateImageUrl(productName, category, index) {
  const width = 400
  const height = 400
  
  // Create a seed based on product name and category for consistent images
  // This ensures the same product always gets the same image
  const nameHash = productName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  const categoryHash = category === 'electronics' ? 1000 : category === 'clothing' ? 2000 : 3000
  const seed = nameHash + categoryHash + index
  
  // Use Picsum Photos with seed for consistent images
  // Format: https://picsum.photos/seed/{seed}/{width}/{height}
  return `https://picsum.photos/seed/${seed}/${width}/${height}`
}

async function main() {
  console.log('🌱 Seeding database with 100 products...')
  console.log('🗑️  Clearing existing data...')

  // Clear existing products and categories
  try {
    await prisma.product.deleteMany({})
    console.log('✅ Deleted all existing products')
  } catch (error) {
    console.log('⚠️  No products to delete or error:', error.message)
  }

  try {
    await prisma.category.deleteMany({})
    console.log('✅ Deleted all existing categories')
  } catch (error) {
    console.log('⚠️  No categories to delete or error:', error.message)
  }

  console.log('✅ Database cleared')
  console.log('📦 Creating new data...')

  // Create categories
  const electronics = await prisma.category.upsert({
    where: { slug: 'electronics' },
    update: {},
    create: {
      name: 'Electronics',
      slug: 'electronics',
      description: 'Electronic devices and gadgets',
    },
  })

  const clothing = await prisma.category.upsert({
    where: { slug: 'clothing' },
    update: {},
    create: {
      name: 'Clothing',
      slug: 'clothing',
      description: 'Fashion and apparel',
    },
  })

  const books = await prisma.category.upsert({
    where: { slug: 'books' },
    update: {},
    create: {
      name: 'Books',
      slug: 'books',
      description: 'Books and literature',
    },
  })

  console.log('✅ Categories created')

  // Generate products
  const allProducts = []
  let productCounter = 1

  // Generate products for each category
  const productsPerCategory = 34 // 34 * 3 = 102 products (close to 100)
  
  for (const [categorySlug, templates] of Object.entries(productTemplates)) {
    const category = categorySlug === 'electronics' ? electronics : categorySlug === 'clothing' ? clothing : books
    
    // Use templates and create variations to reach 34 products per category
    for (let i = 0; i < productsPerCategory; i++) {
      const template = templates[i % templates.length]
      const variation = Math.floor(i / templates.length)
      
      let productName = template.name
      if (variation > 0) {
        productName = `${template.name} ${variation + 1}`
      }
      
      const slug = productName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') + (variation > 0 ? `-${variation}` : '')
      const sku = `${categorySlug.substring(0, 2).toUpperCase()}-${String(productCounter).padStart(3, '0')}`
      
      // Add price variation (±10%)
      const priceVariation = template.price * (0.9 + Math.random() * 0.2)
      const comparePriceVariation = template.compareAtPrice 
        ? template.compareAtPrice * (0.9 + Math.random() * 0.2)
        : null
      
      const imageUrl = generateImageUrl(productName, categorySlug, i)
      
      allProducts.push({
        name: productName,
        slug: slug,
        description: generateDescription(categorySlug, productName),
        price: Math.round(priceVariation * 100) / 100,
        compareAtPrice: comparePriceVariation ? Math.round(comparePriceVariation * 100) / 100 : null,
        sku: sku,
        stock: template.stock + Math.floor(Math.random() * 50),
        categoryId: category.id,
        images: [imageUrl], // Store as array
        featured: template.featured && variation === 0, // Only first variation is featured
        active: true,
      })
      
      // Debug: Log first few products with their image keywords
      if (allProducts.length <= 5) {
        const keyword = imageUrl.match(/\?([^&]+)/)?.[1] || 'unknown'
        console.log(`Sample product ${allProducts.length}:`, productName, 'Keyword:', keyword, 'Image URL:', imageUrl)
      }
      
      productCounter++
    }
  }

  // Create products in database
  console.log(`Creating ${allProducts.length} products...`)
  let createdCount = 0
  for (const product of allProducts) {
    const created = await prisma.product.upsert({
      where: { slug: product.slug },
      update: product,
      create: product,
    })
    createdCount++
    
    // Log first product to verify images are stored
    if (createdCount === 1) {
      const verify = await prisma.product.findUnique({
        where: { id: created.id },
        select: { name: true, images: true }
      })
      console.log('✅ First product created:', verify?.name, 'Images:', verify?.images)
    }
  }

  console.log(`✅ ${allProducts.length} products created`)
  console.log('🎉 Seeding completed!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
