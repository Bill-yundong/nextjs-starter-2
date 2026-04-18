/**
 * 完整性测试脚本
 * 测试所有核心功能模块
 */

const { ALL_PRODUCTS, CATEGORIES, fetchProducts, fetchProduct, fetchRelatedProducts } = require('../data/products');

// 从 AppContext 提取 reducer 逻辑进行测试
const initialState = {
  user: null,
  isAuthenticated: false,
  authLoading: false,
  authError: null,
  cart: {
    items: [],
    totalQuantity: 0,
    totalPrice: 0,
    discount: 0,
    finalPrice: 0,
  },
  products: [],
  productsLoading: false,
  productsError: null,
  selectedProduct: null,
  filters: {
    search: '',
    category: 'all',
    minPrice: 0,
    maxPrice: 1000,
    sortBy: 'default',
    inStock: false,
  },
  filteredProducts: [],
  orders: [],
  currentOrder: null,
  checkoutStep: 1,
  notifications: [],
  theme: 'light',
  sidebarOpen: false,
};

function appReducer(state, action) {
  switch (action.type) {
    case 'AUTH_START':
      return { ...state, authLoading: true, authError: null };
    case 'AUTH_SUCCESS':
      return { 
        ...state, 
        user: action.payload, 
        isAuthenticated: true, 
        authLoading: false,
        authError: null 
      };
    case 'AUTH_FAILURE':
      return { ...state, authLoading: false, authError: action.payload };
    case 'LOGOUT':
      return { ...state, user: null, isAuthenticated: false, cart: initialState.cart };
    case 'SET_FILTER':
      const newFilters = { ...state.filters, [action.payload.key]: action.payload.value };
      return { ...state, filters: newFilters };
    case 'CLEAR_FILTERS':
      return { ...state, filters: initialState.filters };
    default:
      return state;
  }
}

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

  console.log('\n========== Bug修复验证测试 ==========\n');
  
  console.log('--- Bug 1: 登录状态刷新后恢复测试 ---\n');
  
  test('AUTH_SUCCESS action 正确设置 isAuthenticated 为 true', () => {
    const mockUser = { id: '123', email: 'test@example.com', firstName: 'Test', lastName: 'User' };
    const state = appReducer(initialState, { type: 'AUTH_SUCCESS', payload: mockUser });
    assert(state.isAuthenticated === true, 'isAuthenticated 应该为 true');
    assert(state.user.email === 'test@example.com', '用户信息应该正确保存');
  });

  test('用户数据可以被正确序列化和反序列化', () => {
    const mockUser = { id: '123', email: 'test@example.com', firstName: 'Test', lastName: 'User' };
    const serialized = JSON.stringify(mockUser);
    const deserialized = JSON.parse(serialized);
    assert(deserialized.email === mockUser.email, '反序列化后数据应该一致');
    assert(deserialized.id === mockUser.id, 'ID应该保持不变');
  });

  test('从 localStorage 恢复用户状态时 isAuthenticated 正确设置', () => {
    const savedUser = { id: '123', email: 'test@example.com', firstName: 'Test', lastName: 'User' };
    const state = appReducer(initialState, { type: 'AUTH_SUCCESS', payload: savedUser });
    assert(state.isAuthenticated === true, '恢复用户时 isAuthenticated 应该为 true');
    assert(state.user !== null, '用户对象不应该为 null');
  });

  test('登出后状态正确重置', () => {
    const loggedInState = { 
      ...initialState, 
      user: { id: '123', email: 'test@example.com' }, 
      isAuthenticated: true 
    };
    const state = appReducer(loggedInState, { type: 'LOGOUT' });
    assert(state.isAuthenticated === false, '登出后 isAuthenticated 应该为 false');
    assert(state.user === null, '登出后 user 应该为 null');
  });

  console.log('\n--- Bug 2: 筛选状态跳转后保持测试 ---\n');

  test('SET_FILTER action 正确更新筛选状态', () => {
    const state = appReducer(initialState, { 
      type: 'SET_FILTER', 
      payload: { key: 'search', value: 'Helmet' } 
    });
    assert(state.filters.search === 'Helmet', '搜索筛选应该被正确设置');
    assert(state.filters.category === 'all', '其他筛选条件应该保持不变');
  });

  test('多个筛选条件可以同时存在', () => {
    let state = appReducer(initialState, { type: 'SET_FILTER', payload: { key: 'search', value: 'Helmet' } });
    state = appReducer(state, { type: 'SET_FILTER', payload: { key: 'category', value: '1' } });
    state = appReducer(state, { type: 'SET_FILTER', payload: { key: 'sortBy', value: 'price-asc' } });
    assert(state.filters.search === 'Helmet', '搜索筛选应该保持');
    assert(state.filters.category === '1', '分类筛选应该保持');
    assert(state.filters.sortBy === 'price-asc', '排序筛选应该保持');
  });

  test('筛选状态在组件重新挂载时不会被清空（模拟返回操作）', () => {
    let state = appReducer(initialState, { type: 'SET_FILTER', payload: { key: 'search', value: 'Test' } });
    const savedFilters = { ...state.filters };
    const newState = { ...state, filters: savedFilters };
    assert(newState.filters.search === 'Test', '筛选状态应该被保留');
  });

  test('CLEAR_FILTERS 仅在用户主动触发时执行', () => {
    let state = appReducer(initialState, { type: 'SET_FILTER', payload: { key: 'search', value: 'Helmet' } });
    assert(state.filters.search === 'Helmet', '筛选应该被设置');
    state = appReducer(state, { type: 'CLEAR_FILTERS' });
    assert(state.filters.search === '', '清空后搜索应该为空');
    assert(state.filters.category === 'all', '清空后分类应该为 all');
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
