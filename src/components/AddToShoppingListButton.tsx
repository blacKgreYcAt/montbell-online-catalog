'use client';

import { useState, useEffect } from 'react';
import { Product } from '@/types';
import {
  addToShoppingList,
  removeFromShoppingList,
  isInShoppingList,
} from '@/lib/shoppingList';

interface AddToShoppingListButtonProps {
  product: Product;
  variant?: 'compact' | 'full';
}

export default function AddToShoppingListButton({
  product,
  variant = 'full',
}: AddToShoppingListButtonProps) {
  const [isAdded, setIsAdded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 檢查商品是否已在清單中
    const added = isInShoppingList(product.id);
    setIsAdded(added);
    setIsLoading(false);
  }, [product.id]);

  const handleToggle = () => {
    if (isAdded) {
      removeFromShoppingList(product.id);
    } else {
      addToShoppingList(product);
    }
    setIsAdded(!isAdded);
  };

  if (isLoading) {
    return <div className="h-10 bg-gray-200 rounded animate-pulse" />;
  }

  if (variant === 'compact') {
    return (
      <button
        onClick={handleToggle}
        className={`px-3 py-1 text-sm rounded font-semibold transition-colors ${
          isAdded
            ? 'bg-green-500 text-white hover:bg-green-600'
            : 'bg-blue-500 text-white hover:bg-blue-600'
        }`}
        title={isAdded ? '已加入清單' : '加入清單'}
      >
        {isAdded ? '✓ 已加入' : '加入清單'}
      </button>
    );
  }

  return (
    <button
      onClick={handleToggle}
      className={`w-full px-4 py-3 rounded-lg font-semibold transition-colors ${
        isAdded
          ? 'bg-green-500 text-white hover:bg-green-600'
          : 'bg-blue-500 text-white hover:bg-blue-600'
      }`}
    >
      {isAdded ? '✓ 已加入清單' : '加入選擇清單'}
    </button>
  );
}
