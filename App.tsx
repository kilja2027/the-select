import React, { useState, useEffect, useMemo } from 'react';
console.log("통신판매업신고번호 컴포넌트 렌더됨 - 최신 코드");
import type { Product, Feature, NewsArticle, GalleryImage } from './types';
import { COMPANY_INFO, FEATURES, INITIAL_PRODUCTS, NEWS_ARTICLES, GALLERY_IMAGES } from './constants';
import Header from './components/Header';
import Footer from './components/Footer';
import ProductCard from './components/ProjectCard'; // Re-using ProjectCard as ProductCard
import ProductDetail from './components/ProjectDetail'; // Re-using ProjectDetail
import FeatureCard from './components/StatCard'; // Re-using StatCard as FeatureCard
import { ArrowRightIcon, MailIcon, PhoneIcon, LocationMarkerIcon } from './components/icons';

const App: React.FC = () => {
  type Page = 'home' | 'about' | 'products' | 'gallery' | 'news' | 'contact';
  const [page, setPage] = useState<Page>('home');
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [detailProduct, setDetailProduct] = useState<Product | null>(null);
  const [showDetailImage, setShowDetailImage] = useState(false);
  const [detailImageError, setDetailImageError] = useState(false);
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const handleContactInput = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setContactForm({ ...contactForm, [e.target.id]: e.target.value });
  };
  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 전화번호 또는 이메일 형식 중 하나만 허용
    const emailOrPhone = contactForm.email.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{2,4}-\d{3,4}-\d{4}$/;
    if (!emailRegex.test(emailOrPhone) && !phoneRegex.test(emailOrPhone)) {
      alert('이메일 형식(abc@domain.com) 또는 전화번호 형식(010-1234-5678)으로 입력해 주세요.');
      return;
    }
    const newMsg = {
      name: contactForm.name,
      email: contactForm.email,
      message: contactForm.message,
      date: new Date().toISOString()
    };
    const prev = JSON.parse(localStorage.getItem('contactMessages') || '[]');
    localStorage.setItem('contactMessages', JSON.stringify([newMsg, ...prev]));
    setContactForm({ name: '', email: '', message: '' });
    alert('문의가 접수되었습니다. 감사합니다!');
  };

  const sortedProducts = products;

  useEffect(() => {
    const loadProducts = () => {
      try {
        const storedProducts = localStorage.getItem('products');
        if (process.env.NODE_ENV === 'development') {
          console.log('App: Loading products from localStorage:', storedProducts);
        }
        
        if (storedProducts) {
          const parsedProducts = JSON.parse(storedProducts);
          if (process.env.NODE_ENV === 'development') {
            console.log('App: Parsed products:', parsedProducts);
            console.log('App: Number of products loaded:', parsedProducts.length);
          }
          setProducts(parsedProducts);
        } else {
          if (process.env.NODE_ENV === 'development') {
            console.log('App: No stored products found, using INITIAL_PRODUCTS');
            console.log('App: INITIAL_PRODUCTS:', INITIAL_PRODUCTS);
          }
          setProducts(INITIAL_PRODUCTS);
          localStorage.setItem('products', JSON.stringify(INITIAL_PRODUCTS));
        }
      } catch (error) {
        console.error("Failed to load products from localStorage", error);
        setProducts(INITIAL_PRODUCTS);
      }
    };

    // 초기 로드
    loadProducts();

    // 갤러리 이미지 로드
    const loadGalleryImages = () => {
      try {
        const storedGallery = localStorage.getItem('galleryImages');
        if (process.env.NODE_ENV === 'development') {
          console.log('Loading gallery images from localStorage:', storedGallery);
        }
        if (storedGallery) {
          const parsed = JSON.parse(storedGallery);
          if (process.env.NODE_ENV === 'development') {
            console.log('Parsed gallery data:', parsed);
          }
          // 기존 string 배열을 새로운 형식으로 변환
          if (Array.isArray(parsed) && parsed.length > 0 && typeof parsed[0] === 'string') {
            const convertedImages = parsed.map((src: string, index: number) => ({ 
              id: Date.now() + index, 
              src, 
              alt: `gallery-image-${index}`,
              message: undefined 
            }));
            if (process.env.NODE_ENV === 'development') {
              console.log('Converted string array to gallery images:', convertedImages);
            }
            setGalleryImages(convertedImages);
          } else if (Array.isArray(parsed)) {
            if (process.env.NODE_ENV === 'development') {
              console.log('Setting parsed gallery images:', parsed);
            }
            setGalleryImages(parsed);
          } else {
            if (process.env.NODE_ENV === 'development') {
              console.log('Invalid gallery data format, setting empty array');
            }
            setGalleryImages([]);
          }
        } else {
          if (process.env.NODE_ENV === 'development') {
            console.log('No gallery data in localStorage');
          }
          setGalleryImages([]);
        }
      } catch (error) {
        console.error("Failed to load gallery images from localStorage", error);
        setGalleryImages([]);
      }
    };

    loadGalleryImages();

    // localStorage 변경 감지
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'products') {
        loadProducts();
      } else if (e.key === 'galleryImages') {
        loadGalleryImages();
      }
    };

    // 다른 탭에서의 변경 감지
    window.addEventListener('storage', handleStorageChange);

    // 같은 탭에서의 변경 감지를 위한 커스텀 이벤트
    const handleCustomStorageChange = () => {
      if (process.env.NODE_ENV === 'development') {
        console.log('App: productsUpdated event received, reloading products');
      }
      loadProducts();
    };

    const handleGalleryUpdated = () => {
      if (process.env.NODE_ENV === 'development') {
        console.log('Gallery updated event received');
      }
      // 즉시 localStorage에서 다시 로드
      try {
        const storedGallery = localStorage.getItem('galleryImages');
        if (process.env.NODE_ENV === 'development') {
          console.log('Reloading gallery from localStorage:', storedGallery);
        }
        if (storedGallery) {
          const parsed = JSON.parse(storedGallery);
          if (process.env.NODE_ENV === 'development') {
            console.log('Parsed gallery data on update:', parsed);
          }
          setGalleryImages(parsed);
        } else {
          if (process.env.NODE_ENV === 'development') {
            console.log('No gallery data found, setting empty array');
          }
          setGalleryImages([]);
        }
      } catch (error) {
        console.error("Error reloading gallery images:", error);
        setGalleryImages([]);
      }
    };

    window.addEventListener('productsUpdated', handleCustomStorageChange);
    window.addEventListener('galleryUpdated', handleGalleryUpdated);

    // 디버그용 함수들 (개발 환경에서만 사용)
    if (process.env.NODE_ENV === 'development') {
      (window as any).resetProducts = () => {
        console.log('Resetting products to initial state');
        localStorage.removeItem('products');
        setProducts(INITIAL_PRODUCTS);
        localStorage.setItem('products', JSON.stringify(INITIAL_PRODUCTS));
        console.log('Products reset complete');
      };

      (window as any).checkProducts = () => {
        console.log('Current products state:', products);
        console.log('Current sorted products:', sortedProducts);
        const stored = localStorage.getItem('products');
        console.log('localStorage products:', stored);
        if (stored) {
          console.log('Parsed localStorage products:', JSON.parse(stored));
        }
      };
    }

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('productsUpdated', handleCustomStorageChange);
      window.removeEventListener('galleryUpdated', handleGalleryUpdated);
    };
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [page, selectedProduct]);

  // 모달 상태 디버깅 (개발 환경에서만)
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('Modal state changed - detailModalOpen:', detailModalOpen, 'detailProduct:', detailProduct);
    }
  }, [detailModalOpen, detailProduct]);

  // 상세 모달 열릴 때마다 상태 초기화
  useEffect(() => {
    setShowDetailImage(false);
    setDetailImageError(false);
  }, [detailModalOpen, detailProduct]);

  const handleNavClick = (targetPage: Page) => {
    setSelectedProduct(null);
    setPage(targetPage);
  };
  
  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
  }
  
  const handleBackToList = () => {
    setSelectedProduct(null);
  }

  const handleOpenDetailModal = (product: Product) => {
    if (process.env.NODE_ENV === 'development') {
      console.log('handleOpenDetailModal called with product:', product);
      console.log('Product detailImageUrl:', product.detailImageUrl);
    }
    setDetailProduct(product);
    setDetailModalOpen(true);
    if (process.env.NODE_ENV === 'development') {
      console.log('Modal state set to open');
    }
  };

  const handleCloseDetailModal = () => {
    setDetailModalOpen(false);
    setDetailProduct(null);
  };

  const renderContent = () => {
    if (selectedProduct) {
      return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
            <ProductDetail product={selectedProduct} onBack={handleBackToList} />
        </div>
      );
    }

    switch (page) {
      case 'home':
        return (
          <>
            <section className="relative text-center py-20 sm:py-32 bg-cover bg-center bg-no-repeat" style={{backgroundImage: 'url(/photo/main_photo1.png)'}}>
              <div className="absolute inset-0 bg-black bg-opacity-50"></div>
              <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-4xl sm:text-6xl font-serif font-bold text-white mb-4 leading-tight">
                  농부의 정직함을 담다
                  <div className="mt-6 text-yellow-400 leading-normal ">
                    오늘 수확한 신선함 <br />바로 당신의 식탁으로
                  </div>
                </h1>
                <button
                  onClick={() => handleNavClick('products')}
                  className="px-8 py-3 text-lg font-medium text-white bg-brand-accent rounded-lg hover:bg-brand-accent-dark transition-colors duration-300 shadow-lg"
                >
                  제품 보러가기
                </button>
              </div>
            </section>
            
            <section id="features" className="py-20 sm:py-24 bg-white">
              <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                  <h2 className="text-3xl sm:text-4xl font-serif font-bold text-brand-dark">더셀렉의 약속</h2>
                  <p className="mt-4 text-lg text-brand-secondary max-w-2xl mx-auto">우리는 세 가지 핵심 가치를 통해 최고의 제품을 만듭니다</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {FEATURES.map((feature, index) => (
                    <FeatureCard key={index} feature={feature} />
                  ))}
                </div>
              </div>
            </section>

            <section id="products" className="py-20 sm:py-24 bg-brand-light">
              <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                  <h2 className="text-3xl sm:text-4xl font-serif font-bold text-brand-dark">주요 상품</h2>
                  <p className="mt-4 text-lg text-brand-secondary max-w-2xl mx-auto">가장 신선하고 인기있는 상품들을 만나보세요</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {sortedProducts.map((product) => (
                    <ProductCard key={product.id} project={product} onClick={() => handleSelectProduct(product)} onDetailClick={handleOpenDetailModal} />
                  ))}
                </div>
                 <div className="text-center mt-16">
                  <button onClick={() => handleNavClick('products')} className="font-semibold text-brand-accent hover:text-brand-accent-dark transition-colors inline-flex items-center">
                    모든 제품 보기 <ArrowRightIcon className="w-5 h-5 ml-2" />
                  </button>
                </div>
              </div>
            </section>
          </>
        );
      case 'about':
        return (
           <div className="bg-white py-20 sm:py-24">
              <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                   <h1 className="text-4xl sm:text-5xl font-serif font-bold text-brand-dark">우리의 이야기</h1>
                   <p className="mt-4 text-xl text-brand-secondary max-w-3xl mx-auto">{COMPANY_INFO.name}는 자연과 사람의 건강한 연결을 꿈꿉니다</p>
                </div>
                <div className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                    <img src="https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?q=80&w=1000&auto=format&fit=crop" alt="Company Philosophy" className="rounded-lg shadow-xl" />
                    <div>
                        <h2 className="text-3xl font-serif font-bold text-brand-dark mb-4">기업 철학</h2>
                        <p className="text-lg text-brand-secondary leading-relaxed">{COMPANY_INFO.philosophy.split('<br />').map((line, idx) => (
                          <React.Fragment key={idx}>
                            {line}
                            {idx !== COMPANY_INFO.philosophy.split('<br />').length - 1 && <br />}
                          </React.Fragment>
                        ))}</p>
                    </div>
                </div>
                 <div className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                    <div className="md:order-2">
                        <img src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1000&auto=format&fit=crop" alt="Company Vision" className="rounded-lg shadow-xl" />
                    </div>
                    <div className="md:order-1">
                        <h2 className="text-3xl font-serif font-bold text-brand-dark mb-4">우리의 비전</h2>
                        <p className="text-lg text-brand-secondary leading-relaxed">{COMPANY_INFO.vision}</p>
                    </div>
                </div>
              </div>
           </div>
        );
      case 'products':
        return (
            <div className="py-20 sm:py-24 bg-white">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h1 className="text-4xl sm:text-5xl font-serif font-bold text-brand-dark">주요 상품</h1>
                        <p className="mt-4 text-xl text-brand-secondary max-w-3xl mx-auto">더셀렉(The Select)이 자신있게 선보이는 건강한 먹거리들입니다</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {sortedProducts.map((product) => (
                           <ProductCard key={product.id} project={product} onClick={() => handleSelectProduct(product)} onDetailClick={handleOpenDetailModal} />
                        ))}
                    </div>
                </div>
            </div>
        );
      case 'gallery':
         return (
             <div className="py-20 sm:py-24 bg-white">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h1 className="text-4xl sm:text-5xl font-serif font-bold text-brand-dark">갤러리</h1>
                        <p className="mt-4 text-xl text-brand-secondary max-w-3xl mx-auto">소소한 이야기</p>
                    </div>

                     <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {galleryImages.length > 0 ? (
                          galleryImages.map((image, index) => (
                            <div key={image.id} className="overflow-hidden rounded-lg shadow-md group cursor-pointer">
                              <div className="aspect-square relative">
                                <img src={image.src} alt={image.alt} className="w-full h-full object-cover" />
                                {image.message && (
                                  <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white p-3">
                                    <p className="text-base text-center font-medium">{image.message}</p>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))
                        ) : (
                          GALLERY_IMAGES.map((image) => (
                            <div key={image.id} className="overflow-hidden rounded-lg shadow-md aspect-square">
                              <img src={image.src} alt={image.alt} className="w-full h-full object-cover" />
                            </div>
                          ))
                        )}
                    </div>
                </div>
            </div>
         );
      case 'contact':
        return (
            <div className="py-20 sm:py-24 bg-white">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h1 className="text-4xl sm:text-5xl font-serif font-bold text-brand-dark">연락처</h1>
                        <p className="mt-4 text-xl text-brand-secondary max-w-3xl mx-auto">궁금한 점이 있으시면 언제든지 문의해주세요</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                        <div className="bg-brand-light p-8 rounded-lg">
                            <h2 className="text-2xl font-serif font-bold text-brand-dark mb-6">문의 양식</h2>
                            <form onSubmit={handleContactSubmit}>
                                <div className="space-y-4">
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-medium text-brand-dark">이름</label>
                                        <input type="text" id="name" required className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-accent focus:border-brand-accent" value={contactForm.name} onChange={handleContactInput}/>
                                    </div>
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-brand-dark">전화/이메일</label>
                                        <input type="text" id="email" required className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-accent focus:border-brand-accent" value={contactForm.email} onChange={handleContactInput}/>
                                    </div>
                                     <div>
                                        <label htmlFor="message" className="block text-sm font-medium text-brand-dark">메시지</label>
                                        <textarea id="message" rows={4} required className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-accent focus:border-brand-accent" value={contactForm.message} onChange={handleContactInput}></textarea>
                                    </div>
                                    <button type="submit" className="w-full px-6 py-3 text-base font-medium text-white bg-brand-accent rounded-lg hover:bg-brand-accent-dark transition-colors duration-300 shadow-sm">보내기</button>
                                </div>
                            </form>
                        </div>
                         <div className="space-y-8">
                             <h2 className="text-2xl font-serif font-bold text-brand-dark">연락 정보</h2>
                              <div>
                                <h3 className="text-lg font-semibold text-brand-dark flex items-center"><LocationMarkerIcon className="w-5 h-5 mr-3 text-brand-accent" /> 주소</h3>
                                <p className="mt-2 text-brand-secondary pl-8">{COMPANY_INFO.address}</p>
                              </div>
                               <div>
                                <h3 className="text-lg font-semibold text-brand-dark flex items-center"><PhoneIcon className="w-5 h-5 mr-3 text-brand-accent" /> 전화(월~금, 업무시간 10:00 ~ 18:00)</h3>
                                <p className="mt-2 text-brand-secondary pl-8">{COMPANY_INFO.phone}</p>
                              </div>
                               <div>
                                <h3 className="text-lg font-semibold text-brand-dark flex items-center"><MailIcon className="w-5 h-5 mr-3 text-brand-accent" /> 이메일</h3>
                                <p className="mt-2 text-brand-secondary pl-8">{COMPANY_INFO.email}</p>
                              </div>
                        </div>
                    </div>
                </div>
            </div>
        );
      default:
        return <div>페이지를 찾을 수 없습니다.</div>;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-brand-light">
      <Header onNavClick={handleNavClick} />
      <main className="flex-grow w-full">
        {renderContent()}
      </main>
      <Footer onNavClick={handleNavClick} />
      {/* 상세페이지 모달 */}
      {detailModalOpen && detailProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-2xl font-bold text-brand-dark">{detailProduct.name}</h2>
              <button 
                onClick={handleCloseDetailModal}
                className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
              >
                ×
              </button>
            </div>
            <div className="p-6">
              <div className="text-center">
                <h3 className="text-xl font-bold text-brand-dark mb-4">{detailProduct.name}</h3>
                <p className="text-gray-600 mb-6">{detailProduct.description}</p>
                {/* 상세 정보 이미지 표시 로직 */}
                {detailProduct.detailImageUrl && detailProduct.detailImageUrl.trim() ? (
                  <div className="mb-6">
                    <button
                      onClick={() => window.open(detailProduct.detailImageUrl, '_blank')}
                      className="inline-block bg-brand-accent text-white py-3 px-8 rounded-lg hover:bg-brand-accent-dark transition-colors font-medium mb-2"
                    >
                      상세 정보 보기 →
                    </button>
                    <p className="text-sm text-gray-500 mt-2">클릭하면 상세 정보 페이지로 이동합니다</p>
                  </div>
                ) : (
                  <div className="mb-6">
                    <p className="text-gray-500 text-lg">상세 정보 링크가 설정되지 않았습니다.</p>
                  </div>
                )}
                {detailProduct.purchaseUrl && detailProduct.purchaseUrl.trim() && (
                  <div className="mb-6">
                    <a 
                      href={detailProduct.purchaseUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block bg-green-600 text-white py-3 px-8 rounded-lg hover:bg-green-700 transition-colors font-medium"
                    >
                      구매하기 →
                    </a>
                  </div>
                )}
              </div>
              <div className="mt-6 text-center">
                <button
                  onClick={handleCloseDetailModal}
                  className="bg-gray-500 text-white py-2 px-6 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  닫기
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;