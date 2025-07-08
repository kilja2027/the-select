import React from 'react';
import type { Product } from '../types';
import { BackArrowIcon, CheckBadgeIcon } from './icons';

interface ProductDetailProps {
  product: Product;
  onBack: () => void;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ product, onBack }) => {
  return (
    <article className="animate-fade-in bg-white p-4 sm:p-8 rounded-2xl shadow-lg">
      <button
        onClick={onBack}
        className="inline-flex items-center text-sm font-medium text-brand-secondary hover:text-brand-accent mb-8 transition-colors"
      >
        <BackArrowIcon className="w-4 h-4 mr-2" />
        제품 목록으로
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div>
           <div className="mb-8 rounded-xl overflow-hidden shadow-lg border border-gray-100">
              <img src={product.imageUrl} alt={product.name} className="w-full h-auto object-cover aspect-square"/>
          </div>
        </div>
        
        <div>
          <header className="mb-6">
            <h1 className="text-4xl sm:text-5xl font-serif font-bold text-brand-dark mb-4">{product.name}</h1>
            <p className="text-xl text-brand-secondary">{product.summary}</p>
          </header>

          <div className="prose max-w-none prose-p:text-brand-secondary prose-p:leading-relaxed mb-8">
            <p>{product.description}</p>
          </div>
          
          <div className="mt-auto pt-6 border-t border-gray-200">
             <div className="flex justify-between items-center">
                <span className="text-3xl font-bold text-brand-dark font-serif">{product.price}</span>
                <button
                  className="px-6 py-3 font-semibold text-white bg-brand-accent rounded-lg hover:bg-brand-accent-dark transition-colors shadow-sm inline-flex items-center"
                  onClick={() => {
                    if (product.purchaseUrl && product.purchaseUrl.trim() !== '') {
                      window.open(product.purchaseUrl, '_blank');
                    } else {
                      window.alert('상품 미 판매중');
                    }
                  }}
                >
                  <CheckBadgeIcon className="w-5 h-5 mr-2" />
                  구매하기
                </button>
             </div>
          </div>
        </div>
      </div>
    </article>
  );
};

export default ProductDetail;
