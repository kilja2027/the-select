import React from 'react';
import type { Product } from '../types';
import { ArrowRightIcon } from './icons';

interface ProductCardProps {
  project: Product; // Re-using `project` prop name, but it's a Product
  onClick: () => void;
  onDetailClick?: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ project, onClick, onDetailClick }) => {
  const { name, summary, imageUrl, price, purchaseUrl, detailImageUrl } = project;
  
  const handlePurchaseClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the card click
    if (purchaseUrl && purchaseUrl.trim()) {
      window.open(purchaseUrl, '_blank');
    } else {
      alert('구매 링크가 설정되지 않았습니다.');
    }
  };

  const handleDetailClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the card click
    if (process.env.NODE_ENV === 'development') {
      console.log('handleDetailClick called');
      console.log('onDetailClick function exists:', !!onDetailClick);
      console.log('Product detailImageUrl:', detailImageUrl);
    }
    
    if (onDetailClick) {
      if (process.env.NODE_ENV === 'development') {
        console.log('Calling onDetailClick with product:', project);
      }
      onDetailClick(project);
    } else if (detailImageUrl && detailImageUrl.trim()) {
      // Fallback: Show detail image in new window
      if (process.env.NODE_ENV === 'development') {
        console.log('Opening detailImageUrl in new window:', detailImageUrl);
      }
      window.open(detailImageUrl, '_blank');
    } else {
      if (process.env.NODE_ENV === 'development') {
        console.log('No detail image URL available');
      }
      alert('상세 이미지가 설정되지 않았습니다.');
    }
  };
  
  return (
    <div 
      onClick={onClick} 
      className="group cursor-pointer bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 hover:-translate-y-1 flex flex-col"
    >
      <div className="overflow-hidden aspect-[3/2]">
        <img
          src={imageUrl}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl font-serif font-bold text-brand-dark mb-2">{name}</h3>
        <p className="text-brand-secondary mb-4 text-base leading-relaxed flex-grow">{summary}</p>
        <div className="flex justify-between items-center mb-4">
          <span className="text-lg font-bold text-brand-dark">{price}</span>
          <span className="inline-flex items-center font-medium text-brand-accent">
            상세 보기
            <ArrowRightIcon className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
          </span>
        </div>
        
        {/* 구매하기 버튼과 상세페이지 링크 */}
        <div className="flex flex-col gap-2 mt-auto">
          <button
            onClick={handlePurchaseClick}
            className="w-full bg-brand-accent text-white py-2 px-4 rounded-lg hover:bg-brand-accent-dark transition-colors duration-200 font-medium"
          >
            구매하기
          </button>
          <button
            onClick={handleDetailClick}
            className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors duration-200 font-medium border border-gray-300"
          >
            상세페이지
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;