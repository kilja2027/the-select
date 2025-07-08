import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import type { Product } from './types';
import { INITIAL_PRODUCTS } from './constants';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
// DropResult 타입은 react-beautiful-dnd에서 직접 import type으로 사용

const AdminPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [newProduct, setNewProduct] = useState({
    name: '',
    summary: '',
    imageUrl: '',
    description: '',
    price: '',
    purchaseUrl: '',
    detailImageUrl: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginForm, setLoginForm] = useState({
    username: '',
    password: ''
  });
  const [loginError, setLoginError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [newProductImage, setNewProductImage] = useState<File | null>(null);
  const [showPwModal, setShowPwModal] = useState(false);
  const [pwForm, setPwForm] = useState({ current: '', next: '', confirm: '' });
  const [pwError, setPwError] = useState('');
  const [pwSuccess, setPwSuccess] = useState('');
  const [galleryImages, setGalleryImages] = useState<{ id: string, src: string, alt?: string, message?: string }[]>([]);
  const [galleryPage, setGalleryPage] = useState(1);
  const [galleryUpload, setGalleryUpload] = useState<File | null>(null);
  const [galleryMessage, setGalleryMessage] = useState('');
  const [editProductId, setEditProductId] = useState<string | null>(null);
  const [editProduct, setEditProduct] = useState({
    name: '',
    summary: '',
    imageUrl: '',
    description: '',
    price: '',
    purchaseUrl: '',
    detailImageUrl: ''
  });
  const [editProductImage, setEditProductImage] = useState<File | null>(null);
  
  const PRODUCTS_PER_PAGE = 5;
  const totalPages = Math.ceil(products.length / PRODUCTS_PER_PAGE);
  const paginatedProducts = products.slice((currentPage - 1) * PRODUCTS_PER_PAGE, currentPage * PRODUCTS_PER_PAGE);
  const GALLERY_PER_PAGE = 6;
  const galleryTotalPages = Math.ceil(galleryImages.length / GALLERY_PER_PAGE);
  const paginatedGallery = galleryImages.slice((galleryPage - 1) * GALLERY_PER_PAGE, galleryPage * GALLERY_PER_PAGE);

  // 관리자 계정 정보
  const ADMIN_CREDENTIALS = {
    username: 'bestcompany',
    passwordHash: '0f55b579bd3723dcdd1e996fa8bb3b76114aa69a6a762bc039719bffe89425d9'
  };

  // SHA-256 해시 함수
  const sha256 = async (message: string): Promise<string> => {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
  };

  // 이미지 파일을 base64로 변환하는 함수
  const convertImageToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  useEffect(() => {
    const loginStatus = localStorage.getItem('adminLoggedIn');
    if (loginStatus === 'true') {
      setIsLoggedIn(true);
    }

    const loadData = () => {
      try {
        const storedProducts = localStorage.getItem('products');
        if (storedProducts) {
          setProducts(JSON.parse(storedProducts));
        } else {
          setProducts(INITIAL_PRODUCTS);
          localStorage.setItem('products', JSON.stringify(INITIAL_PRODUCTS));
        }
      } catch (e) {
        setProducts(INITIAL_PRODUCTS);
        localStorage.setItem('products', JSON.stringify(INITIAL_PRODUCTS));
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    // 갤러리 이미지 로드
    const storedGallery = localStorage.getItem('galleryImages');
    if (storedGallery) {
      setGalleryImages(JSON.parse(storedGallery));
    }
  }, []);

  // localStorage에 저장된 비밀번호 해시 우선 사용
  const getPasswordHash = () => {
    return localStorage.getItem('adminPasswordHash') || ADMIN_CREDENTIALS.passwordHash;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const passwordHash = await sha256(loginForm.password);
      const savedHash = getPasswordHash();
      
      if (loginForm.username === ADMIN_CREDENTIALS.username && 
          passwordHash === savedHash) {
        setIsLoggedIn(true);
        localStorage.setItem('adminLoggedIn', 'true');
        localStorage.setItem('adminLoginTime', Date.now().toString());
        setLoginError('');
      } else {
        setLoginError('아이디 또는 비밀번호가 올바르지 않습니다.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setLoginError('로그인 처리 중 오류가 발생했습니다.');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('adminLoggedIn');
    localStorage.removeItem('adminLoginTime');
    setLoginForm({ username: '', password: '' });
  };

  const handleLoginInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginForm(prev => ({ ...prev, [name]: value }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewProduct(prev => ({ ...prev, [name]: value }));
  };

  const handleNewProductImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewProductImage(file);
      setNewProduct(prev => ({ ...prev, imageUrl: '' }));
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price || !newProduct.summary || !newProduct.description) {
      alert('모든 필수 필드를 입력해주세요.');
      return;
    }
    let finalImageUrl = newProduct.imageUrl;
    if (newProductImage) {
      try {
        finalImageUrl = await convertImageToBase64(newProductImage);
      } catch (error) {
        alert('이미지 변환 중 오류가 발생했습니다.');
        return;
      }
    }
    if (!finalImageUrl && !newProductImage) {
      alert('제품 이미지를 업로드하거나 이미지 URL을 입력해주세요.');
      return;
    }
    const newProductItem: Product = {
      id: `prod_${Date.now()}`,
      name: newProduct.name,
      summary: newProduct.summary,
      imageUrl: finalImageUrl,
      description: newProduct.description,
      price: newProduct.price,
      purchaseUrl: newProduct.purchaseUrl || '',
      detailImageUrl: newProduct.detailImageUrl || ''
    };
    // 항상 updatedProducts로 동기화
    const updatedProducts = [newProductItem, ...products];
    setProducts(updatedProducts);
    localStorage.setItem('products', JSON.stringify(updatedProducts));
    setNewProduct({
      name: '', summary: '', imageUrl: '', description: '', price: '', purchaseUrl: '', detailImageUrl: ''
    });
    setNewProductImage(null);
    window.dispatchEvent(new CustomEvent('productsUpdated'));
    alert('제품이 성공적으로 추가되었습니다!');
  };

  const handleDeleteProduct = (id: string) => {
    if (!window.confirm('정말로 이 제품을 삭제하시겠습니까?')) return;
    const updatedProducts = products.filter(product => product.id !== id);
    setProducts(updatedProducts);
    localStorage.setItem('products', JSON.stringify(updatedProducts));
    window.dispatchEvent(new CustomEvent('productsUpdated'));
    alert('제품이 삭제되었습니다.');
  };

  const handleResetData = () => {
    if (!window.confirm('정말로 모든 데이터를 초기화하시겠습니까?')) return;
    setProducts(INITIAL_PRODUCTS);
    localStorage.setItem('products', JSON.stringify(INITIAL_PRODUCTS));
    window.dispatchEvent(new CustomEvent('productsUpdated'));
    alert('데이터가 초기화되었습니다.');
  };

  const handleClearStorage = () => {
    if (!window.confirm('정말로 localStorage를 완전히 초기화하시겠습니까?')) return;
    
    localStorage.clear();
    setProducts([]);
    alert('localStorage가 초기화되었습니다.');
  };

  const handlePwInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPwForm(prev => ({ ...prev, [name]: value }));
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwError('');
    setPwSuccess('');
    if (!pwForm.current || !pwForm.next || !pwForm.confirm) {
      setPwError('모든 항목을 입력하세요.');
      return;
    }
    if (pwForm.next !== pwForm.confirm) {
      setPwError('새 비밀번호가 일치하지 않습니다.');
      return;
    }
    const currentHash = await sha256(pwForm.current);
    if (currentHash !== getPasswordHash()) {
      setPwError('현재 비밀번호가 올바르지 않습니다.');
      return;
    }
    const newHash = await sha256(pwForm.next);
    localStorage.setItem('adminPasswordHash', newHash);
    setPwSuccess('비밀번호가 성공적으로 변경되었습니다!');
    setPwForm({ current: '', next: '', confirm: '' });
    setTimeout(() => setShowPwModal(false), 1200);
  };

  const handleGalleryUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!galleryUpload) {
      alert('이미지 파일을 선택해 주세요.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const newImg = {
        id: `gallery_${Date.now()}`,
        src: reader.result as string,
        alt: `gallery-image-${galleryImages.length}`,
        message: galleryMessage.trim() || undefined
      };
      const updated = [newImg, ...galleryImages];
      setGalleryImages(updated);
      localStorage.setItem('galleryImages', JSON.stringify(updated));
      setGalleryUpload(null);
      setGalleryMessage('');
      setGalleryPage(1);
      window.dispatchEvent(new CustomEvent('galleryUpdated'));
      alert('이미지가 업로드되었습니다!');
    };
    reader.readAsDataURL(galleryUpload);
  };

  const handleGalleryFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setGalleryUpload(file);
  };

  const handleDeleteGallery = (id: string) => {
    if (!window.confirm('정말로 이 이미지를 삭제하시겠습니까?')) return;
    const updated = galleryImages.filter(img => img.id !== id);
    setGalleryImages(updated);
    localStorage.setItem('galleryImages', JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('galleryUpdated'));
  };

  const handleEditClick = (product: Product) => {
    setEditProductId(product.id);
    setEditProduct({
      name: product.name,
      summary: product.summary,
      imageUrl: product.imageUrl,
      description: product.description,
      price: product.price,
      purchaseUrl: product.purchaseUrl || '',
      detailImageUrl: product.detailImageUrl || ''
    });
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditProduct(prev => ({ ...prev, [name]: value }));
  };

  const handleEditImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setEditProductImage(file);
  };

  const handleEditSave = async (id: string) => {
    let finalImageUrl = editProduct.imageUrl;
    if (editProductImage) {
      try {
        finalImageUrl = await convertImageToBase64(editProductImage);
      } catch (error) {
        alert('이미지 변환 중 오류가 발생했습니다.');
        return;
      }
    }
    const updatedProducts = products.map(p =>
      p.id === id ? { ...p, ...editProduct, imageUrl: finalImageUrl } : p
    );
    setProducts(updatedProducts);
    localStorage.setItem('products', JSON.stringify(updatedProducts));
    setEditProductId(null);
    setEditProductImage(null);
    window.dispatchEvent(new CustomEvent('productsUpdated'));
    alert('제품 정보가 수정되었습니다!');
  };

  const handleEditCancel = () => {
    setEditProductId(null);
    setEditProductImage(null);
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    const reordered = Array.from(products);
    const [removed] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, removed);
    setProducts(reordered);
    localStorage.setItem('products', JSON.stringify(reordered));
    window.dispatchEvent(new CustomEvent('productsUpdated'));
  };

  // ContactMessagesAdmin 컴포넌트
  const ContactMessagesAdmin = () => {
    const [messages, setMessages] = React.useState<any[]>([]);
    const [msgPage, setMsgPage] = React.useState(1);
    const MSGS_PER_PAGE = 5;
    const msgTotalPages = Math.ceil(messages.length / MSGS_PER_PAGE);
    const paginatedMsgs = messages.slice((msgPage - 1) * MSGS_PER_PAGE, msgPage * MSGS_PER_PAGE);
    
    React.useEffect(() => {
      const msgs = JSON.parse(localStorage.getItem('contactMessages') || '[]');
      setMessages(msgs);
      const handler = () => {
        const updated = JSON.parse(localStorage.getItem('contactMessages') || '[]');
        setMessages(updated);
      };
      window.addEventListener('storage', handler);
      return () => window.removeEventListener('storage', handler);
    }, []);

    const handleDelete = (idx: number) => {
      if (!window.confirm('정말로 이 메시지를 삭제하시겠습니까?')) return;
      const updated = messages.filter((_, i) => i !== (idx + (msgPage - 1) * MSGS_PER_PAGE));
      setMessages(updated);
      localStorage.setItem('contactMessages', JSON.stringify(updated));
    };

    if (messages.length === 0) return <p className="text-gray-500">문의 메시지가 없습니다.</p>;
    
    return (
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2">이름</th>
              <th className="p-2">이메일</th>
              <th className="p-2">메시지</th>
              <th className="p-2">날짜</th>
              <th className="p-2">삭제</th>
            </tr>
          </thead>
          <tbody>
            {paginatedMsgs.map((msg, idx) => (
              <tr key={idx} className="border-b">
                <td className="p-2 whitespace-nowrap">{msg.name}</td>
                <td className="p-2 whitespace-nowrap">{msg.email}</td>
                <td className="p-2">{msg.message}</td>
                <td className="p-2 whitespace-nowrap">{new Date(msg.date).toLocaleString()}</td>
                <td className="p-2">
                  <button onClick={() => handleDelete(idx)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors text-xs">삭제</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {msgTotalPages > 1 && (
          <div className="flex justify-center mt-6 gap-2">
            {Array.from({ length: msgTotalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setMsgPage(i + 1)}
                className={`px-3 py-1 rounded ${msgPage === i + 1 ? 'bg-brand-accent text-white' : 'bg-gray-200 text-gray-700'} font-semibold`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  if (isLoading) {
    return <div className="p-8 text-center">로딩 중...</div>;
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
          <div>
            <h2 className="text-center text-3xl font-bold text-brand-dark">관리자 로그인</h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              관리자 계정으로 로그인하세요
            </p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleLogin}>
            {loginError && (
              <div className="text-red-500 text-sm text-center">{loginError}</div>
            )}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                아이디
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                value={loginForm.username}
                onChange={handleLoginInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-accent focus:border-brand-accent"
                placeholder="아이디를 입력하세요"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                비밀번호
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={loginForm.password}
                onChange={handleLoginInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-accent focus:border-brand-accent"
                placeholder="비밀번호를 입력하세요"
              />
            </div>
            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-accent hover:bg-brand-accent-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-accent"
              >
                로그인
              </button>
            </div>
          </form>
          <div className="text-center text-xs text-gray-500">
            <p>관리자 계정으로 로그인하세요</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-brand-dark mb-2">제품 관리 페이지</h1>
          <p className="text-brand-secondary">이곳에서 웹사이트에 표시될 제품을 추가, 수정하거나 삭제할 수 있습니다.</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setShowPwModal(true)}
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
          >
            비밀번호 변경
          </button>
          <button 
            onClick={handleLogout}
            className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 transition-colors"
          >
            로그아웃
          </button>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-2xl font-bold text-brand-dark mb-4">새 제품 추가</h2>
        <form onSubmit={handleAddProduct} className="space-y-4">
          <input name="name" value={newProduct.name} onChange={handleInputChange} placeholder="제품명" required className="w-full p-2 border rounded" />
          <input name="price" value={newProduct.price} onChange={handleInputChange} placeholder="가격 (예: 12,000원)" required className="w-full p-2 border rounded" />
          <input name="summary" value={newProduct.summary} onChange={handleInputChange} placeholder="짧은 요약" required className="w-full p-2 border rounded" />
          <input
            type="text"
            name="purchaseUrl"
            value={newProduct.purchaseUrl}
            onChange={handleInputChange}
            placeholder="구매 링크 (예: https://...)"
            className="w-full p-2 border rounded"
          />
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">제품 이미지</label>
            <div className="flex gap-2">
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleNewProductImageChange}
                className="flex-1 p-2 border rounded"
              />
            </div>
            {newProductImage && (
              <div className="mt-2">
                <p className="text-sm text-green-600">✓ 이미지 파일이 선택되었습니다: {newProductImage.name}</p>
              </div>
            )}
          </div>
          
          <label className="block text-sm font-bold text-gray-700">상세 정보 링크</label>
          <input type="text" name="detailImageUrl" value={newProduct.detailImageUrl} onChange={handleInputChange} placeholder="상세 정보 페이지 URL (선택)" className="w-full p-2 border rounded mb-2" />
          
          <textarea name="description" value={newProduct.description} onChange={handleInputChange} placeholder="상세 설명" required className="w-full p-2 border rounded" rows={3}></textarea>
          <button type="submit" className="w-full bg-brand-accent text-white py-2 px-4 rounded hover:bg-brand-accent-dark transition-colors">제품 추가</button>
        </form>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-brand-dark">현재 제품 목록</h2>
          <div className="flex gap-2">
            <button onClick={handleResetData} className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600 transition-colors text-sm">데이터 초기화</button>
            <button onClick={handleClearStorage} className="bg-orange-500 text-white py-1 px-3 rounded hover:bg-orange-600 transition-colors text-sm">localStorage 초기화</button>
          </div>
        </div>
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="product-list">
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps} className="space-y-4">
                {paginatedProducts.map((product, idx) => (
                  <Draggable key={product.id} draggableId={product.id} index={idx}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={`bg-white rounded-lg shadow p-4 flex items-center justify-between ${snapshot.isDragging ? 'ring-2 ring-brand-accent' : ''}`}
                      >
                        <div className="flex items-center gap-4">
                          <img src={product.imageUrl} alt={product.name} className="w-16 h-16 object-cover rounded" />
                          <div>
                            {editProductId === product.id ? (
                              <>
                                <input name="name" value={editProduct.name} onChange={handleEditInputChange} className="border rounded p-1 mb-1 w-full" />
                                <input name="price" value={editProduct.price} onChange={handleEditInputChange} className="border rounded p-1 mb-1 w-full" />
                                <input name="summary" value={editProduct.summary} onChange={handleEditInputChange} className="border rounded p-1 mb-1 w-full" />
                                <input name="purchaseUrl" value={editProduct.purchaseUrl} onChange={handleEditInputChange} className="border rounded p-1 mb-1 w-full" />
                                <input name="detailImageUrl" value={editProduct.detailImageUrl} onChange={handleEditInputChange} className="border rounded p-1 mb-1 w-full" />
                                <textarea name="description" value={editProduct.description} onChange={handleEditInputChange} className="border rounded p-1 mb-1 w-full" rows={2}></textarea>
                                <div className="flex items-center gap-2 mt-2">
                                  <img src={editProductImage ? URL.createObjectURL(editProductImage) : editProduct.imageUrl} alt="미리보기" className="w-16 h-16 object-cover rounded" />
                                  <input type="file" accept="image/*" onChange={handleEditImageChange} />
                                </div>
                              </>
                            ) : (
                              <>
                                <h3 className="font-bold">{product.name}</h3>
                                <p className="text-sm text-gray-600">{product.price}</p>
                              </>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          {editProductId === product.id ? (
                            <>
                              <button onClick={() => handleEditSave(product.id)} className="bg-green-500 text-white py-1 px-3 rounded hover:bg-green-600 transition-colors text-sm">저장</button>
                              <button onClick={handleEditCancel} className="bg-gray-300 text-gray-700 py-1 px-3 rounded hover:bg-gray-400 transition-colors text-sm">취소</button>
                            </>
                          ) : (
                            <button onClick={() => handleEditClick(product)} className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600 transition-colors text-sm">수정</button>
                          )}
                          <button 
                            onClick={() => handleDeleteProduct(product.id)} 
                            className="bg-gray-200 text-gray-700 py-1 px-3 rounded hover:bg-gray-300 transition-colors"
                          >
                            삭제
                          </button>
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
        {totalPages > 1 && (
          <div className="flex justify-center mt-6 gap-2">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1 rounded ${currentPage === i + 1 ? 'bg-brand-accent text-white' : 'bg-gray-200 text-gray-700'} font-semibold`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md mt-8">
        <h2 className="text-2xl font-bold text-brand-dark mb-4">갤러리 관리</h2>
        <form onSubmit={handleGalleryUpload} className="flex flex-col sm:flex-row gap-4 mb-6">
          <input type="file" accept="image/*" onChange={handleGalleryFileChange} className="flex-1 border rounded p-2" />
          <input type="text" placeholder="이미지 메시지(선택)" value={galleryMessage} onChange={e => setGalleryMessage(e.target.value)} className="flex-1 border rounded p-2" />
          <button type="submit" className="bg-brand-accent text-white px-4 py-2 rounded hover:bg-brand-accent-dark transition-colors">이미지 업로드</button>
        </form>
        {galleryUpload && (
          <div className="mb-4">
            <span className="text-green-600 text-sm">✓ 선택된 파일: {galleryUpload.name}</span>
          </div>
        )}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {paginatedGallery.map(img => (
            <div key={img.id} className="relative group">
              <img src={img.src} alt={img.alt} className="w-full h-32 object-cover rounded shadow" />
              <button onClick={() => handleDeleteGallery(img.id)} className="absolute top-2 right-2 bg-red-500 text-white rounded-full px-2 py-1 text-xs opacity-80 group-hover:opacity-100">삭제</button>
            </div>
          ))}
        </div>
        {galleryTotalPages > 1 && (
          <div className="flex justify-center mt-6 gap-2">
            {Array.from({ length: galleryTotalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setGalleryPage(i + 1)}
                className={`px-3 py-1 rounded ${galleryPage === i + 1 ? 'bg-brand-accent text-white' : 'bg-gray-200 text-gray-700'} font-semibold`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md mt-8">
        <h2 className="text-2xl font-bold text-brand-dark mb-4">문의 메시지 관리</h2>
        <ContactMessagesAdmin />
      </div>

      {showPwModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md relative">
            <button onClick={() => setShowPwModal(false)} className="absolute top-2 right-3 text-2xl text-gray-400 hover:text-gray-600">×</button>
            <h2 className="text-xl font-bold mb-4">비밀번호 변경</h2>
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">현재 비밀번호</label>
                <input type="password" name="current" value={pwForm.current} onChange={handlePwInput} className="w-full border rounded p-2" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">새 비밀번호</label>
                <input type="password" name="next" value={pwForm.next} onChange={handlePwInput} className="w-full border rounded p-2" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">새 비밀번호 확인</label>
                <input type="password" name="confirm" value={pwForm.confirm} onChange={handlePwInput} className="w-full border rounded p-2" required />
              </div>
              {pwError && <div className="text-red-500 text-sm">{pwError}</div>}
              {pwSuccess && <div className="text-green-600 text-sm">{pwSuccess}</div>}
              <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition-colors">비밀번호 변경</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(<AdminPage />); 