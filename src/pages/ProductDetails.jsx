import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { supabase } from '../lib/supabase'

export default function ProductDetails() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    fetchProduct()
  }, [id])

  async function fetchProduct() {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single()
      
      if (error) throw error
      setProduct(data)
    } catch (error) {
      console.error('Error fetching product:', error)
      // Use demo product if database fetch fails
      setProduct(demoProduct)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="bg-gray-200 h-96 rounded-lg mb-4"></div>
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
        </div>
      </div>
    )
  }

  // Demo product if no product is found
  const demoProduct = {
    id: 1,
    title: "Premium Wireless Headphones",
    description: "Experience crystal-clear sound with our premium wireless headphones. Features include active noise cancellation, 30-hour battery life, and comfortable over-ear design. Perfect for music lovers and professionals alike.",
    price: 299.99,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80",
    rating: 4.5,
    reviews: 128
  }

  const displayProduct = product || demoProduct

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <img
            src={displayProduct.image}
            alt={displayProduct.title}
            className="w-full h-[500px] object-cover rounded-lg"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          <h1 className="text-4xl font-bold">{displayProduct.title}</h1>
          
          <div className="flex items-center space-x-4">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`w-6 h-6 ${
                    i < Math.floor(displayProduct.rating)
                      ? 'text-yellow-400'
                      : 'text-gray-300'
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-gray-600">
              {displayProduct.rating} ({displayProduct.reviews} reviews)
            </span>
          </div>

          <p className="text-xl font-bold">${displayProduct.price}</p>
          
          <p className="text-gray-600">
            {displayProduct.description}
          </p>

          <div className="flex items-center space-x-4">
            <div className="flex items-center border rounded-lg">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-4 py-2 text-xl"
              >
                -
              </button>
              <span className="px-4 py-2 border-x">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="px-4 py-2 text-xl"
              >
                +
              </button>
            </div>
            
            <button className="flex-1 bg-yellow-400 text-black px-8 py-3 rounded-lg font-semibold hover:bg-yellow-500 transition">
              Add to Cart - ${(displayProduct.price * quantity).toFixed(2)}
            </button>
          </div>

          <div className="border-t pt-6 mt-6">
            <h2 className="text-xl font-semibold mb-4">Product Features</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-600">
              <li>High-quality premium materials</li>
              <li>Advanced technology integration</li>
              <li>Ergonomic design for comfort</li>
              <li>1-year manufacturer warranty</li>
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
