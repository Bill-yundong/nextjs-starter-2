import { createContext, useContext, useReducer, useEffect, useState } from 'react';

// 初始状态
const initialState = {
  // 用户认证
  user: null,
  isAuthenticated: false,
  authLoading: false,
  authError: null,
  
  // 购物车
  cart: {
    items: [],
    totalQuantity: 0,
    totalPrice: 0,
    discount: 0,
    finalPrice: 0,
  },
  cartLoading: false,
  
  // 商品
  products: [],
  productsLoading: false,
  productsError: null,
  selectedProduct: null,
  
  // 搜索筛选
  filters: {
    search: '',
    category: 'all',
    minPrice: 0,
    maxPrice: 1000,
    sortBy: 'default',
    inStock: false,
  },
  filteredProducts: [],
  
  // 订单
  orders: [],
  currentOrder: null,
  checkoutStep: 1,
  
  // UI 状态
  notifications: [],
  theme: 'light',
  sidebarOpen: false,
};

// Reducer
function appReducer(state, action) {
  switch (action.type) {
    // 用户认证
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
      return { 
        ...state, 
        authLoading: false, 
        authError: action.payload 
      };
    case 'LOGOUT':
      return { 
        ...state, 
        user: null, 
        isAuthenticated: false,
        cart: initialState.cart,
      };
    case 'UPDATE_USER':
      return { ...state, user: { ...state.user, ...action.payload } };
    
    // 购物车
    case 'CART_START':
      return { ...state, cartLoading: true };
    case 'CART_ADD_ITEM': {
      const existingItem = state.cart.items.find(item => item.id === action.payload.id);
      let newItems;
      if (existingItem) {
        newItems = state.cart.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        newItems = [...state.cart.items, { ...action.payload, quantity: 1 }];
      }
      return {
        ...state,
        cart: calculateCartTotals({ ...state.cart, items: newItems }),
        cartLoading: false,
      };
    }
    case 'CART_REMOVE_ITEM': {
      const newItems = state.cart.items.filter(item => item.id !== action.payload);
      return {
        ...state,
        cart: calculateCartTotals({ ...state.cart, items: newItems }),
        cartLoading: false,
      };
    }
    case 'CART_UPDATE_QUANTITY': {
      const newItems = state.cart.items.map(item =>
        item.id === action.payload.id
          ? { ...item, quantity: action.payload.quantity }
          : item
      ).filter(item => item.quantity > 0);
      return {
        ...state,
        cart: calculateCartTotals({ ...state.cart, items: newItems }),
        cartLoading: false,
      };
    }
    case 'CART_CLEAR':
      return { ...state, cart: initialState.cart, cartLoading: false };
    case 'CART_RESTORE':
      return { ...state, cart: action.payload, cartLoading: false };
    case 'CART_APPLY_DISCOUNT':
      return {
        ...state,
        cart: calculateCartTotals({ ...state.cart, discount: action.payload }),
      };
    
    // 商品
    case 'PRODUCTS_START':
      return { ...state, productsLoading: true, productsError: null };
    case 'PRODUCTS_SUCCESS':
      return { 
        ...state, 
        products: action.payload, 
        filteredProducts: action.payload,
        productsLoading: false,
        productsError: null 
      };
    case 'PRODUCTS_FAILURE':
      return { 
        ...state, 
        productsLoading: false, 
        productsError: action.payload 
      };
    case 'SELECT_PRODUCT':
      return { ...state, selectedProduct: action.payload };
    
    // 筛选
    case 'SET_FILTER':
      const newFilters = { ...state.filters, [action.payload.key]: action.payload.value };
      return {
        ...state,
        filters: newFilters,
        filteredProducts: applyFilters(state.products, newFilters),
      };
    case 'CLEAR_FILTERS':
      return {
        ...state,
        filters: initialState.filters,
        filteredProducts: state.products,
      };
    
    // 订单
    case 'ADD_ORDER':
      return {
        ...state,
        orders: [action.payload, ...state.orders],
        currentOrder: action.payload,
      };
    case 'SET_CURRENT_ORDER':
      return { ...state, currentOrder: action.payload };
    case 'UPDATE_CHECKOUT_STEP':
      return { ...state, checkoutStep: action.payload };
    case 'RESET_CHECKOUT':
      return { ...state, checkoutStep: 1, currentOrder: null };
    
    // UI
    case 'ADD_NOTIFICATION':
      // 替换旧的提示，只保留最新的一个
      return {
        ...state,
        notifications: [{ id: Date.now(), ...action.payload }],
      };
    case 'REMOVE_NOTIFICATION':
      return {
        ...state,
        notifications: state.notifications.filter(n => n.id !== action.payload),
      };
    case 'TOGGLE_THEME':
      return { ...state, theme: state.theme === 'light' ? 'dark' : 'light' };
    case 'TOGGLE_SIDEBAR':
      return { ...state, sidebarOpen: !state.sidebarOpen };
    
    default:
      return state;
  }
}

// 计算购物车总价
function calculateCartTotals(cart) {
  const totalQuantity = cart.items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.items.reduce((sum, item) => sum + (parseFloat(item.price) * item.quantity), 0);
  const discount = cart.discount || 0;
  const finalPrice = Math.max(0, totalPrice - discount);
  
  return {
    ...cart,
    totalQuantity,
    totalPrice: parseFloat(totalPrice.toFixed(2)),
    finalPrice: parseFloat(finalPrice.toFixed(2)),
  };
}

// 应用筛选
function applyFilters(products, filters) {
  return products.filter(product => {
    // 搜索
    if (filters.search && !product.name.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }
    // 分类
    if (filters.category !== 'all' && product.category?.id !== parseInt(filters.category)) {
      return false;
    }
    // 价格范围
    const price = parseFloat(product.price);
    if (price < filters.minPrice || price > filters.maxPrice) {
      return false;
    }
    // 库存
    if (filters.inStock && product.stock <= 0) {
      return false;
    }
    return true;
  }).sort((a, b) => {
    // 排序
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

// Context
const AppContext = createContext();

// Provider
export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);
  
  // Bug 6: 状态恢复逻辑存在hydration问题
  // 在服务端渲染时localStorage不可用，但恢复逻辑没有正确处理
  const [isHydrated, setIsHydrated] = useState(false);
  
  // 保存到 localStorage - 必须在条件return之前
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(state.cart));
  }, [state.cart]);
  
  useEffect(() => {
    if (state.user) {
      localStorage.setItem('user', JSON.stringify(state.user));
    } else {
      localStorage.removeItem('user');
    }
  }, [state.user]);
  
  useEffect(() => {
    // Bug: 延迟hydration完成标记，导致页面先显示未登录状态
    const timer = setTimeout(() => {
      const savedCart = localStorage.getItem('cart');
      const savedUser = localStorage.getItem('user');
      
      if (savedCart) {
        try {
          const parsed = JSON.parse(savedCart);
          dispatch({ type: 'CART_RESTORE', payload: parsed });
        } catch (e) {
          console.error('Failed to parse cart', e);
        }
      }
      
      // Bug: 用户恢复逻辑有问题 - 只恢复部分字段
      if (savedUser) {
        try {
          const parsed = JSON.parse(savedUser);
          // Bug: 故意丢失isAuthenticated字段，导致用户对象不完整
          dispatch({ 
            type: 'AUTH_SUCCESS', 
            payload: { 
              ...parsed,
              isAuthenticated: undefined  // Bug: 覆盖掉正确的状态
            } 
          });
        } catch (e) {
          console.error('Failed to parse user', e);
        }
      }
      
      setIsHydrated(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Bug 6: 在hydration完成前返回loading状态
  if (!isHydrated) {
    // 这个null会导致页面闪烁
    return null;
  }
  
  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

// Hook
export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
