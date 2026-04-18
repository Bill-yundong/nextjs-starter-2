/**
 * Bug修复验证测试
 * 专门验证本次修复的两个问题
 */

console.log('\n========== Bug修复验证测试 ==========\n');

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

// ========== Bug 1: 登录状态刷新丢失验证 ==========
console.log('\n--- Bug 1: 登录状态刷新丢失验证 ---\n');

test('AUTH_SUCCESS action 完整保留用户数据 - 不覆盖 isAuthenticated', () => {
  const fs = require('fs');
  const path = require('path');
  const contextContent = fs.readFileSync(path.join(__dirname, '../context/AppContext.js'), 'utf8');
  
  assert(
    !contextContent.includes('isAuthenticated: undefined'),
    '不应该存在 "isAuthenticated: undefined" 代码，这会破坏登录状态'
  );
});

test('登录状态恢复不应该有 setTimeout 延迟', () => {
  const fs = require('fs');
  const path = require('path');
  const contextContent = fs.readFileSync(path.join(__dirname, '../context/AppContext.js'), 'utf8');
  
  assert(
    !contextContent.includes('setTimeout(() => {'),
    '不应该使用 setTimeout 延迟恢复状态，这会导致登录状态闪烁'
  );
});

test('localStorage 访问包含 SSR 安全检查', () => {
  const fs = require('fs');
  const path = require('path');
  const contextContent = fs.readFileSync(path.join(__dirname, '../context/AppContext.js'), 'utf8');
  
  assert(
    contextContent.includes("typeof window !== 'undefined'"),
    '应该包含 "typeof window !== \'undefined\'" 检查，避免服务端渲染错误'
  );
});

test('AUTH_SUCCESS payload 直接使用解析后的用户数据', () => {
  const fs = require('fs');
  const path = require('path');
  const contextContent = fs.readFileSync(path.join(__dirname, '../context/AppContext.js'), 'utf8');
  
  assert(
    contextContent.includes("dispatch({ type: 'AUTH_SUCCESS', payload: parsed })"),
    '应该直接使用 parsed 作为 payload，不应该修改用户数据'
  );
});

test('localStorage 写入应该在客户端挂载后执行', () => {
  const fs = require('fs');
  const path = require('path');
  const contextContent = fs.readFileSync(path.join(__dirname, '../context/AppContext.js'), 'utf8');
  
  assert(
    contextContent.includes('hasMounted'),
    '应该使用 hasMounted 状态确保只在客户端挂载后写入 localStorage'
  );
});

// ========== Bug 2: 筛选状态跳转丢失验证 ==========
console.log('\n--- Bug 2: 筛选状态跳转丢失验证 ---\n');

test('首页不应该自动调用 CLEAR_FILTERS', () => {
  const fs = require('fs');
  const path = require('path');
  const indexContent = fs.readFileSync(path.join(__dirname, '../pages/index.js'), 'utf8');
  
  const clearFiltersCount = (indexContent.match(/CLEAR_FILTERS/g) || []).length;
  
  assert(
    clearFiltersCount <= 2,
    `CLEAR_FILTERS 出现次数应该 <= 2 (只在按钮点击和clear函数中)，实际出现 ${clearFiltersCount} 次`
  );
});

test('首页不应该有在 mount 时清空筛选的 useEffect', () => {
  const fs = require('fs');
  const path = require('path');
  const indexContent = fs.readFileSync(path.join(__dirname, '../pages/index.js'), 'utf8');
  
  const buggyCodePattern = /useEffect\(\s*\(\s*\)\s*=>\s*\{\s*.*CLEAR_FILTERS.*\s*\}\s*,\s*\[\s*\]\)/s;
  
  assert(
    !buggyCodePattern.test(indexContent),
    '不应该存在空依赖数组的 useEffect 中调用 CLEAR_FILTERS，这会导致跳转返回时筛选丢失'
  );
});

test('PRODUCTS_SUCCESS action 正确使用 filters 状态进行筛选', () => {
  const fs = require('fs');
  const path = require('path');
  const contextContent = fs.readFileSync(path.join(__dirname, '../context/AppContext.js'), 'utf8');
  
  assert(
    contextContent.includes('filteredProducts: applyFilters(action.payload, state.filters)'),
    'PRODUCTS_SUCCESS 应该使用当前的 state.filters 而不是重置筛选'
  );
});

// ========== 上下文状态设计验证 ==========
console.log('\n--- Context 状态设计验证 ---\n');

test('Context 中正确定义了完整的 filters 状态结构', () => {
  const fs = require('fs');
  const path = require('path');
  const contextContent = fs.readFileSync(path.join(__dirname, '../context/AppContext.js'), 'utf8');
  
  const requiredFilters = ['search', 'category', 'minPrice', 'maxPrice', 'sortBy', 'inStock'];
  const allPresent = requiredFilters.every(filter => contextContent.includes(filter));
  
  assert(allPresent, '应该包含完整的 filters 字段定义');
});

test('SET_FILTER action 正确更新单个 filter 字段', () => {
  const fs = require('fs');
  const path = require('path');
  const contextContent = fs.readFileSync(path.join(__dirname, '../context/AppContext.js'), 'utf8');
  
  assert(
    contextContent.includes('...state.filters') && contextContent.includes('[action.payload.key]'),
    'SET_FILTER 应该使用展开运算符保留其他 filter 状态'
  );
});

test('筛选状态更新后正确重新计算 filteredProducts', () => {
  const fs = require('fs');
  const path = require('path');
  const contextContent = fs.readFileSync(path.join(__dirname, '../context/AppContext.js'), 'utf8');
  
  assert(
    contextContent.includes('filteredProducts: applyFilters(state.products, newFilters)'),
    'SET_FILTER 后应该调用 applyFilters 更新 filteredProducts'
  );
});

// ========== 总结 ==========
console.log('\n========== 测试报告 ==========\n');
console.log(`总测试数: ${passed + failed}`);
console.log(`通过: ${passed} ✅`);
console.log(`失败: ${failed} ❌`);
console.log(`通过率: ${((passed / (passed + failed)) * 100).toFixed(2)}%`);

if (failed === 0) {
  console.log('\n🎉 所有 Bug 修复验证测试通过！');
  console.log('\n修复总结:');
  console.log('  ✅ Bug 1: 登录状态刷新丢失 - 已修复');
  console.log('     - 移除了 setTimeout 延迟恢复');
  console.log('     - 移除了 isAuthenticated: undefined 破坏代码');
  console.log('     - 添加了 SSR 安全检查');
  console.log('     - 优化了客户端挂载判断');
  console.log('');
  console.log('  ✅ Bug 2: 筛选状态跳转丢失 - 已修复');
  console.log('     - 移除了 mount 时自动清空筛选的 useEffect');
  console.log('     - 保留了 Context 中的筛选状态');
  console.log('     - 跳转返回时筛选状态可以保持');
  process.exit(0);
} else {
  console.log('\n⚠️ 存在失败的测试，请检查修复代码');
  process.exit(1);
}
