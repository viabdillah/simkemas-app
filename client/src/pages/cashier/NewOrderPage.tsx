import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiRequest } from '../../lib/api';
import { GlassCard } from '../../components/ui/GlassCard';
import { useToast } from '../../context/ToastContext';
import { formatRupiah, formatNumber, parseNumber } from '../../lib/formatters';
import { 
  ShoppingCart, User, Package, Plus, Trash2, Save, 
  FileCheck, FileX, Search, Loader2, Calendar
} from 'lucide-react'; // Hapus Truck & Store karena tidak dipakai lagi

// --- TYPES ---
interface Customer { 
  id: string; 
  name: string; 
  whatsapp: string; 
}

interface Product { 
  id: string; 
  product_name: string; 
  brand: string; 
  packaging_type: string; 
  size: string; 
  variant?: string; 
}

interface CartItem {
  tempId: number;
  product_id: string;
  product_name: string;
  quantity: number;
  price: number;
  has_design: boolean;
  notes: string;
}

export const NewOrderPage = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  
  // --- STATE DATA ---
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [customerProducts, setCustomerProducts] = useState<Product[]>([]);
  
  // --- STATE PELANGGAN ---
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  // --- STATE INPUT ITEM (FORM) ---
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [qty, setQty] = useState<string>('');
  const [priceDisplay, setPriceDisplay] = useState<string>('');
  const [hasDesign, setHasDesign] = useState(true);
  const [notes, setNotes] = useState('');

  // --- STATE KERANJANG & ORDER ---
  const [cart, setCart] = useState<CartItem[]>([]);
  const [deadline, setDeadline] = useState(''); // YYYY-MM-DD
  // [REVISI] State pickupMethod dihapus
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 1. EFFECT: CARI PELANGGAN
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (searchQuery.length < 2) return;
      setIsSearching(true);
      try {
        const data = await apiRequest<Customer[]>(`/customers?q=${searchQuery}`);
        setCustomers(data);
      } catch (err) { console.error(err); } 
      finally { setIsSearching(false); }
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // 2. EFFECT: LOAD PRODUK
  useEffect(() => {
    if (selectedCustomer) {
      const fetchProducts = async () => {
        try {
          const data = await apiRequest<any>(`/customers/${selectedCustomer.id}`);
          setCustomerProducts(data.products);
        } catch (err) { addToast('Gagal muat produk', 'error'); }
      };
      fetchProducts();
    } else {
      setCustomerProducts([]);
      setCart([]);
    }
  }, [selectedCustomer]);

  // 3. HANDLERS
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPriceDisplay(formatNumber(e.target.value));
  };

  const addToCart = () => {
    if (!selectedProduct) { addToast('Pilih produk terlebih dahulu.', 'error'); return; }
    
    const realPrice = parseNumber(priceDisplay);
    const realQty = Number(qty);

    if (!realPrice || !realQty) { addToast('Harga dan Jumlah harus diisi.', 'error'); return; }

    const productNameFull = `${selectedProduct.product_name} ${selectedProduct.variant ? `(${selectedProduct.variant})` : ''} - ${selectedProduct.brand}`;

    const newItem: CartItem = {
      tempId: Date.now(),
      product_id: selectedProduct.id,
      product_name: productNameFull,
      quantity: realQty,
      price: realPrice,
      has_design: hasDesign,
      notes: notes
    };

    setCart([...cart, newItem]);
    
    // Reset Form
    setSelectedProduct(null);
    setQty('');
    setPriceDisplay(''); 
    setNotes('');
    setHasDesign(true);
  };

  const removeFromCart = (id: number) => {
    setCart(cart.filter(item => item.tempId !== id));
  };

  const handleCheckout = async () => {
    if (cart.length === 0) return;

    if (!deadline) {
      addToast('Harap tentukan tanggal deadline selesai.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      
      const payload = {
        customer_id: selectedCustomer?.id,
        total_amount: totalAmount,
        items: cart,
        deadline_date: deadline
        // [REVISI] pickup_method dihapus dari payload
      };

      await apiRequest('/orders', {
        method: 'POST',
        token: localStorage.getItem('simkemas_token') || undefined,
        body: JSON.stringify(payload)
      });

      addToast('Pesanan berhasil dibuat & disimpan!', 'success');
      
      // Reset All State
      setCart([]);
      setSelectedCustomer(null);
      setSearchQuery('');
      setDeadline('');
      
    } catch (err) {
      addToast('Gagal membuat pesanan', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-20 animate-[fadeIn_0.5s_ease-out]">
      
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-black text-slate-800">Buat Pesanan Baru</h1>
        <p className="text-slate-500 font-medium">Input transaksi pelanggan.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* === KOLOM KIRI: FORM INPUT === */}
        <div className="xl:col-span-2 space-y-6">
          
          {/* STEP 1: PILIH PELANGGAN */}
          <GlassCard className="p-6 space-y-4">
            <h3 className="font-bold text-primary flex items-center gap-2 border-b border-primary/10 pb-2">
              <User size={20}/> 1. Pilih Pelanggan
            </h3>
            
            {!selectedCustomer ? (
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text"
                  placeholder="Ketik nama pelanggan..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/60 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  autoFocus
                />
                
                {searchQuery.length > 1 && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-xl border border-slate-200 rounded-xl shadow-xl z-50 max-h-60 overflow-y-auto">
                    {isSearching ? (
                      <div className="p-4 text-center text-slate-400"><Loader2 className="animate-spin inline"/> Mencari...</div>
                    ) : customers.length > 0 ? (
                      customers.map(c => (
                        <div 
                          key={c.id} 
                          onClick={() => { setSelectedCustomer(c); setSearchQuery(''); }}
                          className="p-3 hover:bg-primary/10 cursor-pointer border-b last:border-0 border-slate-100 transition-colors"
                        >
                          <p className="font-bold text-slate-800">{c.name}</p>
                          <p className="text-xs text-slate-500">{c.whatsapp}</p>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 text-center text-slate-400">Pelanggan tidak ditemukan.</div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex justify-between items-center bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                <div>
                  <p className="font-bold text-slate-800 text-lg">{selectedCustomer.name}</p>
                  <p className="text-sm text-slate-500 flex items-center gap-1">WA: {selectedCustomer.whatsapp}</p>
                </div>
                <button 
                  onClick={() => { setSelectedCustomer(null); setCart([]); }}
                  className="px-3 py-1 text-xs font-bold bg-white text-rose-500 border border-rose-200 rounded-lg hover:bg-rose-50 cursor-pointer"
                >
                  Ganti
                </button>
              </div>
            )}
          </GlassCard>

          {/* STEP 2: INPUT PRODUK */}
          {selectedCustomer && (
            <GlassCard className="p-6 space-y-6 border-t-4 border-t-primary/80">
              <h3 className="font-bold text-primary flex items-center gap-2 border-b border-primary/10 pb-2">
                <Package size={20}/> 2. Input Item Produk
              </h3>

              {/* Dropdown Produk */}
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase">Produk</label>
                <select 
                  className="w-full mt-1 px-4 py-3 bg-white/60 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
                  value={selectedProduct?.id || ''}
                  onChange={(e) => {
                    const prod = customerProducts.find(p => p.id === e.target.value);
                    setSelectedProduct(prod || null);
                  }}
                >
                  <option value="">-- Pilih Produk --</option>
                  {customerProducts.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.product_name} - {p.brand} ({p.packaging_type} {p.size}) {p.variant ? `[${p.variant}]` : ''}
                    </option>
                  ))}
                </select>
                {customerProducts.length === 0 && (
                  <p className="text-xs text-rose-500 mt-2 bg-rose-50 p-2 rounded-lg inline-block">
                    * Pelanggan ini belum memiliki data produk. Silakan input produk dulu di menu <b>Database Pelanggan</b>.
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase">Harga Satuan</label>
                  <div className="relative mt-1">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold">Rp</span>
                    <input 
                      type="text" 
                      placeholder="0"
                      value={priceDisplay}
                      onChange={handlePriceChange}
                      className="w-full pl-12 pr-4 py-3 bg-white/60 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 font-mono font-bold text-lg"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase">Jumlah (Pcs)</label>
                  <input 
                    type="number" 
                    placeholder="0"
                    value={qty}
                    onChange={(e) => setQty(e.target.value)}
                    className="w-full mt-1 px-4 py-3 bg-white/60 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 font-mono font-bold text-lg"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Status File Desain</label>
                <div className="flex gap-4">
                  <button 
                    onClick={() => setHasDesign(true)}
                    className={`flex-1 py-3 rounded-xl border flex items-center justify-center gap-2 transition-all cursor-pointer ${hasDesign ? 'bg-emerald-50 border-emerald-500 text-emerald-700 font-bold ring-1 ring-emerald-500' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}
                  >
                    <FileCheck size={18} /> Sudah Ada (Siap Cetak)
                  </button>
                  <button 
                    onClick={() => setHasDesign(false)}
                    className={`flex-1 py-3 rounded-xl border flex items-center justify-center gap-2 transition-all cursor-pointer ${!hasDesign ? 'bg-orange-50 border-orange-500 text-orange-700 font-bold ring-1 ring-orange-500' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}
                  >
                    <FileX size={18} /> Belum Ada (Perlu Desain)
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 uppercase">Keterangan / Catatan</label>
                <textarea 
                  rows={2}
                  placeholder="Contoh: Warna dominan merah, deadline jumat..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full mt-1 px-4 py-3 bg-white/60 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                />
              </div>

              <button 
                onClick={addToCart}
                disabled={!selectedProduct || !priceDisplay || !qty}
                className="w-full py-3.5 bg-slate-800 text-white font-bold rounded-xl hover:bg-slate-900 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-lg shadow-slate-300 active:scale-[0.98]"
              >
                <Plus size={20} /> Masukkan Keranjang
              </button>

            </GlassCard>
          )}
        </div>

        {/* === KOLOM KANAN: KERANJANG === */}
        <div className="xl:col-span-1">
          <div className="sticky top-6">
            <GlassCard className="p-6 min-h-[500px] flex flex-col bg-linear-to-b from-white/80 to-blue-50/50 border-2 border-white/60">
              <h3 className="font-bold text-slate-800 flex items-center gap-2 border-b border-slate-200 pb-4 mb-4">
                <ShoppingCart size={20} className="text-primary"/> Ringkasan Pesanan
              </h3>

              {/* LIST ITEM */}
              <div className="flex-1 space-y-3 overflow-y-auto max-h-[350px] pr-1 custom-scrollbar mb-4">
                {cart.length === 0 ? (
                  <div className="text-center py-12 text-slate-400 flex flex-col items-center">
                    <div className="p-4 bg-slate-100 rounded-full mb-3">
                      <ShoppingCart size={32} className="opacity-50"/>
                    </div>
                    <p className="text-sm font-medium">Keranjang kosong.</p>
                  </div>
                ) : (
                  cart.map((item, index) => (
                    <div key={item.tempId} className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm relative group animate-[fadeIn_0.3s_ease-out]">
                      <div className="absolute -left-2 -top-2 w-5 h-5 bg-slate-800 text-white text-[10px] flex items-center justify-center rounded-full font-bold">
                        {index + 1}
                      </div>

                      <button 
                        onClick={() => removeFromCart(item.tempId)}
                        className="absolute top-2 right-2 text-slate-300 hover:text-rose-500 cursor-pointer p-1 rounded-md hover:bg-rose-50 transition-colors"
                        title="Hapus Item"
                      >
                        <Trash2 size={16} />
                      </button>

                      <p className="font-bold text-slate-800 text-sm pr-6 leading-tight mb-1">{item.product_name}</p>
                      
                      <div className="flex gap-2 mt-1 mb-2">
                        <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold border ${item.has_design ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-orange-50 text-orange-600 border-orange-100'}`}>
                          {item.has_design ? 'File Ready' : 'Butuh Desain'}
                        </span>
                      </div>

                      <div className="flex justify-between items-end border-t border-slate-50 pt-2">
                        <div className="text-xs text-slate-500">
                          {item.quantity} x {formatRupiah(item.price)}
                        </div>
                        <div className="font-bold text-primary font-mono text-sm">
                          {formatRupiah(item.quantity * item.price)}
                        </div>
                      </div>
                      
                      {item.notes && <p className="text-[10px] text-slate-400 mt-1 italic border-l-2 border-slate-200 pl-2">"{item.notes}"</p>}
                    </div>
                  ))
                )}
              </div>

              {/* INFO DEADLINE (Metode Pengambilan DIHAPUS) */}
              <div className="bg-white/60 p-4 rounded-xl border border-white space-y-4 mb-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1 mb-1">
                    <Calendar size={12} /> Target Selesai (Deadline)
                  </label>
                  <input 
                    type="date" 
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-700 focus:ring-2 focus:ring-primary/20 outline-none"
                    required
                  />
                </div>
              </div>

              {/* FOOTER TOTAL */}
              <div className="pt-4 border-t border-slate-200">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-slate-500 font-bold text-sm">Total Tagihan</span>
                  <span className="text-2xl font-black text-slate-800">
                    {formatRupiah(cart.reduce((a, b) => a + (b.price * b.quantity), 0))}
                  </span>
                </div>

                <button 
                  onClick={handleCheckout}
                  disabled={cart.length === 0 || isSubmitting}
                  className="w-full py-4 bg-linear-to-r from-primary to-secondary text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isSubmitting ? <Loader2 className="animate-spin" /> : <Save size={20} />}
                  Proses Pesanan
                </button>
              </div>

            </GlassCard>
          </div>
        </div>

      </div>
    </div>
  );
};