import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { fetchProduct, fetchRelatedProducts, ALL_PRODUCTS } from '../../data/products';
import { useApp } from '../../context/AppContext';

export default function ProductDetail() {
  const router = useRouter();
  const { id } = router.query;
  const { state, dispatch } = useApp();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [selectedSize, setSelectedSize] = useState('');

  useEffect(() => {
    if (!id) return;

    const loadProduct = async () => {
      try {
        setLoading(true);
        setError(null);

        const productData = await fetchProduct(id);
        if (!productData) {
          setError('Product not found');
          return;
        }

        setProduct(productData);
        dispatch({ type: 'SELECT_PRODUCT', payload: productData });

        // Load related products
        const related = await fetchRelatedProducts(id);
        setRelatedProducts(related);

        // Set default size
        if (productData.specifications?.size) {
          const sizes = productData.specifications.size.split(', ').map(s => s.trim());
          setSelectedSize(sizes[0]);
        }
      } catch (err) {
        setError('Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id, dispatch]);

  const handleAddToCart = () => {
    if (!product) return;

    dispatch({ type: 'CART_START' });
    dispatch({
      type: 'CART_ADD_ITEM',
      payload: { ...product, selectedSize, quantity }
    });

    dispatch({
      type: 'ADD_NOTIFICATION',
      payload: { type: 'success', message: `Added ${product.name} to cart!` }
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl">Loading product...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">{error}</h1>
          <Link href="/">
            <a className="text-blue-600 hover:underline">Back to products</a>
          </Link>
        </div>
      </div>
    );
  }

  if (!product) return null;

  const availableSizes = product.specifications?.size
    ? product.specifications.size.split(',').map(s => s.trim())
    : [];

  return (
    <>
      <Head>
        <title>{product.name} - Next.js Starter</title>
        <meta name="description" content={product.description} />
      </Head>

      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Breadcrumb */}
          <nav className="mb-6">
            <ol className="flex items-center space-x-2 text-gray-500">
              <li><Link href="/"><a className="hover:text-blue-600">Home</a></Link></li>
              <li>/</li>
              <li className="capitalize">{product.category.name}</li>
              <li>/</li>
              <li className="text-gray-900">{product.name}</li>
            </ol>
          </nav>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {/* Product Image */}
            <div className="relative aspect-square bg-white rounded-lg shadow-md overflow-hidden">
              {product.image.startsWith('http') ? (
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Image
                  src={product.image}
                  alt={product.name}
                  layout="fill"
                  objectFit="cover"
                />
              )}
            </div>

            {/* Product Info */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="mb-4">
                <span className="text-sm text-gray-500 uppercase tracking-wide">
                  {product.category.name}
                </span>
                <h1 className="text-3xl font-bold mt-2">{product.name}</h1>
                <div className="flex items-center mt-2">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="ml-2 text-gray-600">
                    {product.rating} ({product.reviews} reviews)
                  </span>
                </div>
              </div>

              <div className="mb-6">
                <span className="text-4xl font-bold text-blue-600">${product.price}</span>
                {product.stock <= 3 && product.stock > 0 && (
                  <p className="text-red-500 text-sm mt-1">Only {product.stock} left in stock!</p>
                )}
                {product.stock === 0 && (
                  <p className="text-red-500 text-sm mt-1">Out of stock</p>
                )}
              </div>

              <p className="text-gray-600 mb-6">{product.description}</p>

              {/* Size Selection */}
              {availableSizes.length > 0 && availableSizes[0] !== 'One Size' && availableSizes[0] !== 'One Size Fits All' && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Size
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {availableSizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-4 py-2 border rounded-lg font-medium transition-colors ${
                          selectedSize === size
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'bg-white text-gray-700 border-gray-300 hover:border-blue-600'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity
                </label>
                <div className="flex items-center border rounded-lg w-fit">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2 hover:bg-gray-100"
                  >
                    -
                  </button>
                  <span className="px-4 py-2 border-x">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="px-4 py-2 hover:bg-gray-100"
                    disabled={quantity >= product.stock}
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="w-full bg-blue-600 text-white py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </button>

              {/* Features */}
              <div className="mt-6">
                <h3 className="font-semibold mb-2">Key Features:</h3>
                <ul className="list-disc list-inside text-gray-600">
                  {product.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-12">
            <div className="flex border-b">
              {['description', 'specifications', 'reviews'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-4 font-medium capitalize transition-colors ${
                    activeTab === tab
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="p-6">
              {activeTab === 'description' && (
                <div>
                  <h3 className="text-xl font-bold mb-4">Product Description</h3>
                  <p className="text-gray-600">{product.description}</p>
                  <p className="text-gray-600 mt-4">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
                    eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
                    minim veniam, quis nostrud exercitation ullamco laboris.
                  </p>
                </div>
              )}

              {activeTab === 'specifications' && (
                <div>
                  <h3 className="text-xl font-bold mb-4">Technical Specifications</h3>
                  <table className="w-full">
                    <tbody>
                      {Object.entries(product.specifications).map(([key, value]) => (
                        <tr key={key} className="border-b">
                          <td className="py-3 text-gray-600 capitalize">{key}</td>
                          <td className="py-3 font-medium">{value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {activeTab === 'reviews' && (
                <div>
                  <h3 className="text-xl font-bold mb-4">Customer Reviews</h3>
                  <div className="flex items-center mb-6">
                    <div className="text-5xl font-bold mr-4">{product.rating}</div>
                    <div>
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <p className="text-gray-600">Based on {product.reviews} reviews</p>
                    </div>
                  </div>
                  <p className="text-gray-500">Reviews feature coming soon...</p>
                </div>
              )}
            </div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Related Products</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.map((relatedProduct) => (
                  <Link key={relatedProduct.id} href={`/product/${relatedProduct.id}`}>
                    <a className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer block">
                      <div className="relative aspect-square">
                        {relatedProduct.image.startsWith('http') ? (
                          <img
                            src={relatedProduct.image}
                            alt={relatedProduct.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Image
                            src={relatedProduct.image}
                            alt={relatedProduct.name}
                            layout="fill"
                            objectFit="cover"
                          />
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold">{relatedProduct.name}</h3>
                        <p className="text-blue-600 font-bold">${relatedProduct.price}</p>
                      </div>
                    </a>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
