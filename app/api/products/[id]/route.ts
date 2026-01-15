import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const product = await db.product.findUnique({
      where: {
        id: params.id,
        active: true,
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    })

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    // Get related products (same category)
    const relatedProducts = await db.product.findMany({
      where: {
        categoryId: product.categoryId,
        id: { not: product.id },
        active: true,
      },
      take: 4,
      select: {
        id: true,
        name: true,
        slug: true,
        price: true,
        images: true,
      },
    })

    // Convert Decimal to number for JSON serialization
    const productWithNumbers = {
      ...product,
      price: parseFloat(product.price.toString()),
      compareAtPrice: product.compareAtPrice ? parseFloat(product.compareAtPrice.toString()) : null,
    }

    const relatedProductsWithNumbers = relatedProducts.map((p) => ({
      ...p,
      price: parseFloat(p.price.toString()),
    }))

    return NextResponse.json({
      product: productWithNumbers,
      relatedProducts: relatedProductsWithNumbers,
    })
  } catch (error) {
    console.error('Error fetching product:', error)
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    )
  }
}

