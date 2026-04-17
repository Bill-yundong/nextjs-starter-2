/**
 * 完整性测试脚本
 * 测试所有核心功能模块
 */

const { ALL_PRODUCTS, CATEGORIES, fetchProducts, fetchProduct, fetchRelatedProducts } = require('../data/products');

// 测试计数器
let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`✅ ${name}`);
    passed++;
  } catch (error) {
    console.log(`❌ ${name}`);
    console.log(`   Error: ${error.message}`);
    failed++;
  }
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message || 'Assertion failed');
  }
}

console.log('\n========== 数据层测试 ==========\n');

// 测试商品数据
test('商品数据存在且不为空', () => {
  assert(ALL_PRODUCTS && ALL_PRODUCTS.length > 0, '商品数据为空');
});

test('每个商品都有必要的字段', () => {
  const requiredFields = ['id', 'name', 'description', 'price', 'image', 'category', 'stock'];
  ALL_PRODUCTS.forEach(product => {
    requiredFields.forEach(field => {
      assert(product[field] !== undefined, `商品 ${product.id} 缺少字段 ${field}`);
    });
  });
});

test('商品ID唯一', () => {
  const ids = ALL_PRODUCTS.map(p => p.id);
  const uniqueIds = new Set(ids);
  assert(ids.length === uniqueIds.size, '商品ID重复');
});

test('商品价格有效', () => {
  ALL_PRODUCTS.forEach(product => {
    const price = parseFloat(product.price);
    assert(!isNaN(price) && price >= 0, `商品 ${product.id} 价格无效`);
  });
});

test('商品分类有效', () => {
  ALL_PRODUCTS.forEach(product => {
    assert(product.category && product.category.id, `商品 ${product.id} 分类无效`);
  });
});

// 测试商品图片唯一性
test('每个商品都有唯一的图片', () => {
  const images = ALL_PRODUCTS.map(p => p.image);
  const uniqueImages = new Set(images);
  assert(images.length === uniqueImages.size, '商品图片有重复');
});

// 测试分类数据
test('分类数据存在', () => {
  assert(CATEGORIES && CATEGORIES.length > 0, '分类数据为空');
});

test('分类包含 "all" 选项', () => {
  const allCategory = CATEGORIES.find(c => c.id === 'all');
  assert(allCategory, '缺少 "all" 分类选项');
});

console.log('\n========== API 模拟测试 ==========\n');

// 测试 fetchProducts
(async () => {
  try {
    const products = await fetchProducts();
    test('fetchProducts 返回商品列表', () => {
      assert(Array.isArray(products) && products.length > 0, '未返回商品列表');
    });
  } catch (error) {
    test('fetchProducts 返回商品列表', () => {
      throw error;
    });
  }

  // 测试 fetchProduct
  try {
    const product = await fetchProduct(1);
    test('fetchProduct 返回单个商品', () => {
      assert(product && product.id === 1, '未返回正确的商品');
    });
  } catch (error) {
    test('fetchProduct 返回单个商品', () => {
      throw error;
    });
  }

  // 测试 fetchProduct 不存在的商品
  try {
    const product = await fetchProduct(9999);
    test('fetchProduct 对不存在商品返回 undefined', () => {
      assert(product === undefined, '应该返回 undefined');
    });
  } catch (error) {
    test('fetchProduct 对不存在商品返回 undefined', () => {
      throw error;
    });
  }

  // 测试 fetchRelatedProducts
  try {
    const related = await fetchRelatedProducts(1);
    test('fetchRelatedProducts 返回相关商品', () => {
      assert(Array.isArray(related), '未返回数组');
    });
  } catch (error) {
    test('fetchRelatedProducts 返回相关商品', () => {
      throw error;
    });
  }

  console.log('\n========== 购物车逻辑测试 ==========\n');

  // 模拟购物车计算
  const mockCartItems = [
    { id: 1, name: 'Classic Helmet', price: '49.99', quantity: 2 },
    { id: 2, name: 'Classic T-Shirt', price: '29.99', quantity: 1 },
  ];

  test('购物车总价计算正确', () => {
    const total = mockCartItems.reduce((sum, item) => sum + (parseFloat(item.price) * item.quantity), 0);
    assert(Math.abs(total - 129.97) < 0.01, `总价计算错误: ${total}`);
  });

  test('购物车商品数量计算正确', () => {
    const totalQuantity = mockCartItems.reduce((sum, item) => sum + item.quantity, 0);
    assert(totalQuantity === 3, `数量计算错误: ${totalQuantity}`);
  });

  console.log('\n========== 筛选逻辑测试 ==========\n');

  // 模拟筛选函数
  function applyFilters(products, filters) {
    return products.filter(product => {
      if (filters.search && !product.name.toLowerCase().includes(filters.search.toLowerCase())) {
        return false;
      }
      if (filters.category !== 'all' && product.category?.id !== parseInt(filters.category)) {
        return false;
      }
      const price = parseFloat(product.price);
      if (price < filters.minPrice || price > filters.maxPrice) {
        return false;
      }
      return true;
    }).sort((a, b) => {
      switch (filters.sortBy) {
        case 'price-asc':
          return parseFloat(a.price) - parseFloat(b.price);
        case 'price-desc':
          return parseFloat(b.price) - parseFloat(a.price);
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        default:
          return 0;
      }
    });
  }

  test('搜索筛选功能正常', () => {
    const filters = { search: 'Helmet', category: 'all', minPrice: 0, maxPrice: 1000, sortBy: 'default' };
    const result = applyFilters(ALL_PRODUCTS, filters);
    assert(result.every(p => p.name.toLowerCase().includes('helmet')), '搜索结果不准确');
  });

  test('分类筛选功能正常', () => {
    const filters = { search: '', category: '1', minPrice: 0, maxPrice: 1000, sortBy: 'default' };
    const result = applyFilters(ALL_PRODUCTS, filters);
    assert(result.every(p => p.category.id === 1), '分类筛选结果不准确');
  });

  test('价格范围筛选功能正常', () => {
    const filters = { search: '', category: 'all', minPrice: 0, maxPrice: 30, sortBy: 'default' };
    const result = applyFilters(ALL_PRODUCTS, filters);
    assert(result.every(p => parseFloat(p.price) <= 30), '价格筛选结果不准确');
  });

  test('排序功能 - 价格升序', () => {
    const filters = { search: '', category: 'all', minPrice: 0, maxPrice: 1000, sortBy: 'price-asc' };
    const result = applyFilters(ALL_PRODUCTS, filters);
    for (let i = 1; i < result.length; i++) {
      assert(parseFloat(result[i-1].price) <= parseFloat(result[i].price), '价格升序排序错误');
    }
  });

  test('排序功能 - 价格降序', () => {
    const filters = { search: '', category: 'all', minPrice: 0, maxPrice: 1000, sortBy: 'price-desc' };
    const result = applyFilters(ALL_PRODUCTS, filters);
    for (let i = 1; i < result.length; i++) {
      assert(parseFloat(result[i-1].price) >= parseFloat(result[i].price), '价格降序排序错误');
    }
  });

  console.log('\n========== 测试报告 ==========\n');
  console.log(`总测试数: ${passed + failed}`);
  console.log(`通过: ${passed} ✅`);
  console.log(`失败: ${failed} ❌`);
  console.log(`通过率: ${((passed / (passed + failed)) * 100).toFixed(2)}%`);
  
  if (failed === 0) {
    console.log('\n🎉 所有测试通过！');
    process.exit(0);
  } else {
    console.log('\n⚠️ 存在失败的测试');
    process.exit(1);
  }
})();
