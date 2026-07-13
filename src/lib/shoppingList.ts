/**
 * 購物清單管理邏輯
 * 使用 localStorage 存儲用戶選擇的商品
 */

import { Product } from '@/types';

const SHOPPING_LIST_KEY = 'montbell_internal_shopping_list';
const COMPANY_INFO_KEY = 'montbell_company_info';

export interface ShoppingListItem extends Product {
  addedAt: string; // ISO 時間戳
}

export interface CompanyInfo {
  name: string;
  contactPerson?: string;
  phone?: string;
}

/**
 * 獲取購物清單
 */
export function getShoppingList(): ShoppingListItem[] {
  if (typeof window === 'undefined') return [];

  try {
    const data = localStorage.getItem(SHOPPING_LIST_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('獲取購物清單失敗:', error);
    return [];
  }
}

/**
 * 添加商品到清單
 */
export function addToShoppingList(product: Product): void {
  const list = getShoppingList();

  // 檢查是否已存在
  const exists = list.some(item => item.id === product.id);
  if (exists) return;

  const newItem: ShoppingListItem = {
    ...product,
    addedAt: new Date().toISOString(),
  };

  list.push(newItem);
  saveShoppingList(list);
}

/**
 * 從清單移除商品
 */
export function removeFromShoppingList(productId: string): void {
  const list = getShoppingList();
  const filtered = list.filter(item => item.id !== productId);
  saveShoppingList(filtered);
}

/**
 * 清空購物清單
 */
export function clearShoppingList(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(SHOPPING_LIST_KEY);
}

/**
 * 檢查商品是否在清單中
 */
export function isInShoppingList(productId: string): boolean {
  const list = getShoppingList();
  return list.some(item => item.id === productId);
}

/**
 * 獲取清單商品數量
 */
export function getShoppingListCount(): number {
  return getShoppingList().length;
}

/**
 * 保存購物清單到 localStorage
 */
function saveShoppingList(list: ShoppingListItem[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(SHOPPING_LIST_KEY, JSON.stringify(list));
  } catch (error) {
    console.error('保存購物清單失敗:', error);
  }
}

/**
 * 獲取公司資訊
 */
export function getCompanyInfo(): CompanyInfo | null {
  if (typeof window === 'undefined') return null;

  try {
    const data = localStorage.getItem(COMPANY_INFO_KEY);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('獲取公司資訊失敗:', error);
    return null;
  }
}

/**
 * 保存公司資訊
 */
export function saveCompanyInfo(info: CompanyInfo): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(COMPANY_INFO_KEY, JSON.stringify(info));
  } catch (error) {
    console.error('保存公司資訊失敗:', error);
  }
}

/**
 * 清除公司資訊
 */
export function clearCompanyInfo(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(COMPANY_INFO_KEY);
}
