'use client'

import { useState, useEffect } from 'react'

interface CustomProduct {
  id: string
  properties: {
    partdescription: string
    quantity: string
  }
}

export default function CustomProductList({ rfqId }: { rfqId: string }) {
  const [products, setProducts] = useState<CustomProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchCustomProducts() {
      try {
        const response = await fetch(`/api/custom-products?rfqId=${rfqId}`)
        if (!response.ok) {
          throw new Error('Failed to fetch custom products')
        }
        const data = await response.json()
        setProducts(data)
      } catch (err) {
        setError('Error fetching custom products')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchCustomProducts()
  }, [rfqId])

  if (loading) return <div>Loading custom products...</div>
  if (error) return <div>{error}</div>

  return (
    <div>
      <h4 className="text-lg font-bold mb-4">Custom Products for RFQ</h4>
      <ul>
        {products.map((product) => (
          <li key={product.id} className="mb-4 p-4 border rounded">
            <p><strong>Part Description:</strong> {product.properties.partdescription}</p>
            <p><strong>Quantity:</strong> {product.properties.quantity}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}