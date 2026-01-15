import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

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

  // Create sample products
  const products = [
    {
      name: 'Wireless Headphones',
      slug: 'wireless-headphones',
      description: 'High-quality wireless headphones with noise cancellation',
      price: 99.99,
      compareAtPrice: 149.99,
      sku: 'WH-001',
      stock: 50,
      categoryId: electronics.id,
      images: ['https://via.placeholder.com/400x400?text=Headphones'],
      featured: true,
    },
    {
      name: 'Smart Watch',
      slug: 'smart-watch',
      description: 'Feature-rich smartwatch with fitness tracking',
      price: 199.99,
      compareAtPrice: null,
      sku: 'SW-001',
      stock: 30,
      categoryId: electronics.id,
      images: ['https://via.placeholder.com/400x400?text=Smart+Watch'],
      featured: true,
    },
    {
      name: 'Cotton T-Shirt',
      slug: 'cotton-t-shirt',
      description: 'Comfortable 100% cotton t-shirt',
      price: 24.99,
      compareAtPrice: 29.99,
      sku: 'CT-001',
      stock: 100,
      categoryId: clothing.id,
      images: ['https://via.placeholder.com/400x400?text=T-Shirt'],
      featured: false,
    },
    {
      name: 'JavaScript Guide',
      slug: 'javascript-guide',
      description: 'Comprehensive guide to JavaScript programming',
      price: 39.99,
      compareAtPrice: null,
      sku: 'BG-001',
      stock: 25,
      categoryId: books.id,
      images: ['https://via.placeholder.com/400x400?text=Book'],
      featured: true,
    },
    {
      name: 'Laptop Stand',
      slug: 'laptop-stand',
      description: 'Ergonomic laptop stand for better posture',
      price: 49.99,
      compareAtPrice: 69.99,
      sku: 'LS-001',
      stock: 40,
      categoryId: electronics.id,
      images: ['https://via.placeholder.com/400x400?text=Laptop+Stand'],
      featured: false,
    },
    {
      name: 'Denim Jeans',
      slug: 'denim-jeans',
      description: 'Classic fit denim jeans',
      price: 79.99,
      compareAtPrice: 99.99,
      sku: 'DJ-001',
      stock: 60,
      categoryId: clothing.id,
      images: ['https://via.placeholder.com/400x400?text=Jeans'],
      featured: true,
    },
  ]

  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: product,
    })
  }

  console.log('✅ Products created')
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

