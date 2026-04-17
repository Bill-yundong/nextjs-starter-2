// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

const mockProducts = [
  {
    id: 1,
    name: 'Helmet',
    description: 'A stylish helmet for your everyday adventures',
    price: 49.99,
    image: '/images/helmet.jpg',
    category_id: 1
  },
  {
    id: 2,
    name: 'T-Shirt',
    description: 'Comfortable cotton t-shirt for daily wear',
    price: 29.99,
    image: '/images/shirt.jpg',
    category_id: 2
  },
  {
    id: 3,
    name: 'Socks',
    description: 'High-quality socks for maximum comfort',
    price: 9.99,
    image: '/images/socks.jpg',
    category_id: 2
  },
  {
    id: 4,
    name: 'Sweatshirt',
    description: 'Warm and cozy sweatshirt for cold days',
    price: 59.99,
    image: '/images/sweatshirt.jpg',
    category_id: 2
  }
];

export default async function handler(req, res) {
  if (req.method === 'GET') {
    return res.status(200).json({ data: mockProducts });
  } else {
    return res.status(405).json({ msg: 'Method not allowed' });
  }
}
