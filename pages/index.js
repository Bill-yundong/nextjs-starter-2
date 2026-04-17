import Head from 'next/head';
import Product from '../components/Product';

const mockProducts = [
  {
    id: 1,
    name: 'Helmet',
    description: 'A stylish helmet for your everyday adventures',
    price: '49.99',
    image: '/images/helmet.jpg',
    category: { id: 1, name: 'Gear', description: 'Outdoor gear and equipment' }
  },
  {
    id: 2,
    name: 'T-Shirt',
    description: 'Comfortable cotton t-shirt for daily wear',
    price: '29.99',
    image: '/images/shirt.jpg',
    category: { id: 2, name: 'Clothing', description: 'Apparel and fashion items' }
  },
  {
    id: 3,
    name: 'Socks',
    description: 'High-quality socks for maximum comfort',
    price: '9.99',
    image: '/images/socks.jpg',
    category: { id: 2, name: 'Clothing', description: 'Apparel and fashion items' }
  },
  {
    id: 4,
    name: 'Sweatshirt',
    description: 'Warm and cozy sweatshirt for cold days',
    price: '59.99',
    image: '/images/sweatshirt.jpg',
    category: { id: 2, name: 'Clothing', description: 'Apparel and fashion items' }
  }
];

export default function Home({ products }) {
  return (
    <div>
      <Head>
        <title>Next.js Starter</title>
        <meta name="description" content="Next.js Starter Demo" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="p-10 mx-auto max-w-4xl">
        <h1 className="text-6xl font-bold mb-4 text-center">Next.js Starter</h1>
        <p className="mb-20 text-xl text-center">
          🔥 Shop from the hottest items in the world 🔥
        </p>
        <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 justify-items-center  gap-4">
          {products.map((product) => (
            <Product product={product} key={product.id} />
          ))}
        </div>
      </main>

      <footer></footer>
    </div>
  );
}

export async function getStaticProps() {
  return {
    props: { products: mockProducts },
  };
}
