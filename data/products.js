// 扩展商品数据 - 每个商品都有唯一匹配的图片
export const ALL_PRODUCTS = [
  {
    id: 1,
    name: 'Classic Helmet',
    description: 'A stylish helmet for your everyday adventures',
    price: '49.99',
    image: '/images/helmet.jpg',
    category: { id: 1, name: 'Gear', description: 'Outdoor gear and equipment' },
    stock: 5,
    rating: 4.5,
    reviews: 128,
    features: ['Lightweight', 'Durable', 'Adjustable fit'],
    specifications: {
      weight: '300g',
      material: 'Polycarbonate',
      size: 'One Size Fits All',
    },
    relatedProducts: [2, 3, 4],
  },
  {
    id: 2,
    name: 'Classic T-Shirt',
    description: 'Comfortable cotton t-shirt for daily wear',
    price: '29.99',
    image: '/images/shirt.jpg',
    category: { id: 2, name: 'Clothing', description: 'Apparel and fashion items' },
    stock: 10,
    rating: 4.2,
    reviews: 256,
    features: ['100% Cotton', 'Machine Washable', 'Breathable'],
    specifications: {
      weight: '200g',
      material: 'Cotton',
      size: 'S, M, L, XL',
    },
    relatedProducts: [1, 3, 4],
  },
  {
    id: 3,
    name: 'Comfort Socks',
    description: 'High-quality socks for maximum comfort',
    price: '9.99',
    image: '/images/socks.jpg',
    category: { id: 2, name: 'Clothing', description: 'Apparel and fashion items' },
    stock: 20,
    rating: 4.0,
    reviews: 89,
    features: ['Moisture Wicking', 'Cushioned Sole', 'Anti-Odor'],
    specifications: {
      weight: '50g',
      material: 'Merino Wool Blend',
      size: 'One Size',
    },
    relatedProducts: [1, 2, 4],
  },
  {
    id: 4,
    name: 'Cozy Sweatshirt',
    description: 'Warm and cozy sweatshirt for cold days',
    price: '59.99',
    image: '/images/sweatshirt.jpg',
    category: { id: 2, name: 'Clothing', description: 'Apparel and fashion items' },
    stock: 3,
    rating: 4.7,
    reviews: 342,
    features: ['Fleece Lined', 'Kangaroo Pocket', 'Ribbed Cuffs'],
    specifications: {
      weight: '500g',
      material: 'Cotton-Polyester Blend',
      size: 'S, M, L, XL, XXL',
    },
    relatedProducts: [1, 2, 3],
  },
  // 新增商品 - 使用 Unsplash 免费图片
  {
    id: 5,
    name: 'Running Shoes',
    description: 'Professional running shoes with cushioned sole for maximum comfort',
    price: '89.99',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop',
    category: { id: 1, name: 'Gear', description: 'Outdoor gear and equipment' },
    stock: 8,
    rating: 4.6,
    reviews: 215,
    features: ['Breathable Mesh', 'Cushioned Sole', 'Non-slip'],
    specifications: {
      weight: '600g',
      material: 'Mesh & Rubber',
      size: 'US 7-12',
    },
    relatedProducts: [6, 7, 8],
  },
  {
    id: 6,
    name: 'Travel Backpack',
    description: 'Spacious travel backpack with laptop compartment and water bottle holder',
    price: '79.99',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop',
    category: { id: 1, name: 'Gear', description: 'Outdoor gear and equipment' },
    stock: 12,
    rating: 4.4,
    reviews: 178,
    features: ['Water Resistant', 'Laptop Compartment', 'Multiple Pockets'],
    specifications: {
      weight: '800g',
      material: 'Nylon',
      size: '30L Capacity',
    },
    relatedProducts: [5, 7, 8],
  },
  {
    id: 7,
    name: 'Classic Watch',
    description: 'Elegant analog watch with leather strap and water resistance',
    price: '129.99',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop',
    category: { id: 3, name: 'Accessories', description: 'Fashion accessories and jewelry' },
    stock: 6,
    rating: 4.8,
    reviews: 92,
    features: ['Water Resistant', 'Genuine Leather Strap', 'Quartz Movement'],
    specifications: {
      weight: '80g',
      material: 'Stainless Steel & Leather',
      size: '42mm Dial',
    },
    relatedProducts: [5, 6, 8],
  },
  {
    id: 8,
    name: 'Sunglasses',
    description: 'UV protection sunglasses with polarized lenses and durable frame',
    price: '39.99',
    image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=400&fit=crop',
    category: { id: 3, name: 'Accessories', description: 'Fashion accessories and jewelry' },
    stock: 15,
    rating: 4.3,
    reviews: 145,
    features: ['UV400 Protection', 'Polarized', 'Lightweight Frame'],
    specifications: {
      weight: '25g',
      material: 'Polycarbonate',
      size: 'One Size',
    },
    relatedProducts: [5, 6, 7],
  },
  {
    id: 9,
    name: 'Baseball Cap',
    description: 'Classic baseball cap with adjustable strap and breathable fabric',
    price: '24.99',
    image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=400&h=400&fit=crop',
    category: { id: 2, name: 'Clothing', description: 'Apparel and fashion items' },
    stock: 18,
    rating: 4.1,
    reviews: 203,
    features: ['Adjustable Strap', 'Breathable', 'Sun Protection'],
    specifications: {
      weight: '85g',
      material: 'Cotton',
      size: 'Adjustable',
    },
    relatedProducts: [2, 3, 4],
  },
  {
    id: 10,
    name: 'Water Bottle',
    description: 'Insulated stainless steel water bottle keeps drinks cold for 24 hours',
    price: '34.99',
    image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&h=400&fit=crop',
    category: { id: 1, name: 'Gear', description: 'Outdoor gear and equipment' },
    stock: 25,
    rating: 4.7,
    reviews: 312,
    features: ['24h Cold / 12h Hot', 'BPA Free', 'Leak Proof'],
    specifications: {
      weight: '400g',
      material: 'Stainless Steel',
      size: '750ml',
    },
    relatedProducts: [5, 6, 11],
  },
  {
    id: 11,
    name: 'Wireless Headphones',
    description: 'Premium wireless headphones with noise cancellation and 30h battery life',
    price: '199.99',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
    category: { id: 3, name: 'Accessories', description: 'Fashion accessories and jewelry' },
    stock: 4,
    rating: 4.9,
    reviews: 87,
    features: ['Active Noise Cancellation', '30h Battery', 'Bluetooth 5.0'],
    specifications: {
      weight: '250g',
      material: 'Plastic & Foam',
      size: 'Over-ear',
    },
    relatedProducts: [7, 8, 10],
  },
  {
    id: 12,
    name: 'Leather Wallet',
    description: 'Slim leather wallet with RFID protection and multiple card slots',
    price: '44.99',
    image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=400&h=400&fit=crop',
    category: { id: 3, name: 'Accessories', description: 'Fashion accessories and jewelry' },
    stock: 10,
    rating: 4.5,
    reviews: 156,
    features: ['RFID Protection', 'Genuine Leather', 'Slim Design'],
    specifications: {
      weight: '60g',
      material: 'Genuine Leather',
      size: '11 x 9 cm',
    },
    relatedProducts: [7, 8, 11],
  },
];

// 商品分类
export const CATEGORIES = [
  { id: 'all', name: 'All Products' },
  { id: 1, name: 'Gear', description: 'Outdoor gear and equipment' },
  { id: 2, name: 'Clothing', description: 'Apparel and fashion items' },
  { id: 3, name: 'Accessories', description: 'Fashion accessories and jewelry' },
];

// 模拟 API 延迟
export const simulateAPI = (data, delay = 500) => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), delay);
  });
};

// 获取所有商品
export const fetchProducts = async () => {
  return simulateAPI(ALL_PRODUCTS, 800);
};

// 获取单个商品
export const fetchProduct = async (id) => {
  const product = ALL_PRODUCTS.find(p => p.id === parseInt(id));
  return simulateAPI(product, 600);
};

// 获取相关商品
export const fetchRelatedProducts = async (productId) => {
  const product = ALL_PRODUCTS.find(p => p.id === parseInt(productId));
  if (!product) return [];
  
  const related = product.relatedProducts
    .map(id => ALL_PRODUCTS.find(p => p.id === id))
    .filter(Boolean);
  
  return simulateAPI(related, 400);
};

// 搜索商品
export const searchProducts = async (query) => {
  const results = ALL_PRODUCTS.filter(p =>
    p.name.toLowerCase().includes(query.toLowerCase()) ||
    p.description.toLowerCase().includes(query.toLowerCase())
  );
  return simulateAPI(results, 300);
};
