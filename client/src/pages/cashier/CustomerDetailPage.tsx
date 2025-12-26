import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiRequest } from '../../lib/api';
import { GlassCard } from '../../components/ui/GlassCard';
import { ConfirmModal } from '../../components/ui/ConfirmModal';
import { useToast } from '../../context/ToastContext';
import { toTitleCase } from '../../lib/formatters';
import { Package, Save, ArrowLeft, Phone, MapPin, Edit2, Trash2, X, Plus } from 'lucide-react';

// --- TIPE DATA & INTERFACES ---

interface Customer {
  id: string;
  name: string;
  whatsapp: string;
  address: string;
}

interface Product {
  id: string;
  product_name: string;
  brand: string;
  variant?: string;
  netto?: string;
  packaging_type: string;
  size: string;
  nib?: string;
  pirt?: string;
  halal?: string;
}

interface APIResponse {
  customer: Customer;
  products: Product[];
}

// Interface untuk Baris Form Varian (Frontend Only)
interface VariantRow {
  id: number; // ID sementara untuk key React (timestamp)
  variant: string;
  netto: string;
  packaging_type: string;
  size: string;
}

export const CustomerDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();
  
  // State Data Utama
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  
  // State UI Form
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  // State Modal Delete
  const [deleteId, setDeleteId] = useState<string | null>(null); // ID produk yg mau dihapus
  const [isDeleting, setIsDeleting] = useState(false);

  // --- STATE FORM INPUT ---
  
  // 1. Data Dasar (Nama, Merek, Izin)
  const [baseInfo, setBaseInfo] = useState({
    product_name: '', brand: '', nib: '', pirt: '', halal: ''
  });

  // 2. Data Varian (Array Dinamis)
  const [variants, setVariants] = useState<VariantRow[]>([
    { id: Date.now(), variant: '', netto: '', packaging_type: '', size: '' }
  ]);

  // --- FETCH DATA ---
  const fetchData = async () => {
    try {
      const data = await apiRequest<APIResponse>(`/customers/${id}`, {
        token: localStorage.getItem('simkemas_token') || undefined
      });
      setCustomer(data.customer);
      setProducts(data.products);
    } catch (err) {
      addToast('Gagal memuat data pelanggan', 'error');
    }
  };

  useEffect(() => { fetchData(); }, [id]);

  // --- LOGIC FORM VARIAN DINAMIS ---
  
  const addVariantRow = () => {
    setVariants([
      ...variants, 
      { id: Date.now(), variant: '', netto: '', packaging_type: '', size: '' }
    ]);
  };

  const removeVariantRow = (rowId: number) => {
    if (variants.length === 1) return; // Minimal sisa 1 baris
    setVariants(variants.filter(v => v.id !== rowId));
  };

  const handleVariantChange = (rowId: number, field: keyof VariantRow, value: string) => {
    setVariants(variants.map(v => 
      v.id === rowId ? { ...v, [field]: value } : v
    ));
  };

  const handleBaseChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // Auto capitalize untuk Nama & Brand
    const val = (name === 'product_name' || name === 'brand') ? toTitleCase(value) : value;
    setBaseInfo({ ...baseInfo, [name]: val });
  };

  // --- SUBMIT (CREATE / EDIT) ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditing && editId) {
        // --- MODE EDIT (Update 1 Produk) ---
        const singlePayload = {
          ...baseInfo,
          ...variants[0] // Ambil data varian pertama saja
        };

        await apiRequest(`/customers/products/${editId}`, {
          method: 'PATCH',
          token: localStorage.getItem('simkemas_token') || undefined,
          body: JSON.stringify(singlePayload)
        });
        addToast('Produk diperbarui!', 'success');

      } else {
        // --- MODE CREATE (Bulk Insert) ---
        const payload = {
          base: baseInfo,
          variants: variants.map(({ id, ...rest }) => rest) // Buang ID sementara sebelum kirim ke API
        };

        await apiRequest(`/customers/${id}/products`, {
          method: 'POST',
          token: localStorage.getItem('simkemas_token') || undefined,
          body: JSON.stringify(payload)
        });
        addToast(`${variants.length} Varian produk ditambahkan!`, 'success');
      }
      
      resetForm();
      fetchData();
    } catch (err) {
      addToast('Gagal menyimpan produk', 'error');
    }
  };

  // --- DELETE LOGIC (VIA MODAL) ---
  
  // 1. Klik Tombol Sampah -> Buka Modal
  const onDeleteClick = (productId: string) => {
    setDeleteId(productId); 
  };

  // 2. Konfirmasi di Modal -> Hapus Data
  const confirmDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      await apiRequest(`/customers/products/${deleteId}`, {
        method: 'DELETE',
        token: localStorage.getItem('simkemas_token') || undefined
      });
      addToast('Produk berhasil dihapus.', 'info');
      fetchData();
    } catch (err) {
      addToast('Gagal menghapus produk.', 'error');
    } finally {
      setIsDeleting(false);
      setDeleteId(null); // Tutup modal
    }
  };

  // --- HELPER UI ---
  const startEdit = (prod: Product) => {
    setIsEditing(true);
    setEditId(prod.id);
    setShowForm(true);
    
    // Populate Data Dasar
    setBaseInfo({
      product_name: prod.product_name,
      brand: prod.brand,
      nib: prod.nib || '',
      pirt: prod.pirt || '',
      halal: prod.halal || ''
    });
    // Populate Varian (Hanya 1 baris saat edit)
    setVariants([{
      id: Date.now(),
      variant: prod.variant || '',
      netto: prod.netto || '',
      packaging_type: prod.packaging_type,
      size: prod.size
    }]);
  };

  const resetForm = () => {
    setShowForm(false);
    setIsEditing(false);
    setEditId(null);
    setBaseInfo({ product_name: '', brand: '', nib: '', pirt: '', halal: '' });
    setVariants([{ id: Date.now(), variant: '', netto: '', packaging_type: '', size: '' }]);
  };

  if (!customer) return <div className="p-10 text-center">Loading Data...</div>;

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-20 animate-[fadeIn_0.5s_ease-out]">
      
      {/* 1. HEADER & NAVIGATION */}
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate('/cashier/customers')} 
          className="p-2 hover:bg-white/50 rounded-full cursor-pointer transition-colors"
        >
          <ArrowLeft size={24} className="text-slate-600" />
        </button>
        <div>
          <h1 className="text-2xl font-black text-slate-800">{customer.name}</h1>
          <p className="text-slate-500 text-sm font-mono bg-slate-200 px-1 rounded inline-block">
            ID: {customer.id.split('-')[0]}
          </p>
        </div>
      </div>

      {/* 2. INFO CUSTOMER CARD */}
      <GlassCard className="p-6 grid md:grid-cols-2 gap-6 bg-linear-to-br from-white/60 to-blue-50/30">
        <div>
          <label className="text-xs font-bold text-slate-400 uppercase">WhatsApp</label>
          <div className="flex items-center gap-2 mt-1 font-bold text-slate-700">
            <Phone size={16} className="text-emerald-500" /> {customer.whatsapp}
          </div>
        </div>
        <div>
          <label className="text-xs font-bold text-slate-400 uppercase">Alamat</label>
          <div className="flex items-center gap-2 mt-1 font-medium text-slate-700">
            <MapPin size={16} className="text-rose-500" /> {customer.address}
          </div>
        </div>
      </GlassCard>

      {/* 3. SECTION HEADER PRODUK */}
      <div className="flex items-center justify-between pt-4">
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <Package className="text-primary" /> Daftar Produk
        </h2>
        <button 
          onClick={showForm ? resetForm : () => setShowForm(true)}
          className={`
            text-sm font-bold px-4 py-2 rounded-xl flex items-center gap-2 cursor-pointer transition-all shadow-lg
            ${showForm ? 'bg-rose-100 text-rose-600 hover:bg-rose-200' : 'bg-primary text-white hover:bg-primary/90'}
          `}
        >
          {showForm ? <><X size={16}/> Batal</> : '+ Tambah Produk'}
        </button>
      </div>

      {/* 4. FORM INPUT / EDIT (DINAMIS) */}
      {showForm && (
        <GlassCard className="p-6 border-2 border-primary/20 animate-[slideDown_0.3s_ease-out]">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* A. Informasi Dasar */}
            <div className="space-y-4">
              <h3 className="font-bold text-primary border-b border-primary/10 pb-2">1. Informasi Dasar Produk</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input name="product_name" placeholder="Nama Produk (e.g. Keripik Pisang)" required className="input-field" value={baseInfo.product_name} onChange={handleBaseChange} />
                <input name="brand" placeholder="Merek / Label (e.g. Maknyus)" required className="input-field" value={baseInfo.brand} onChange={handleBaseChange} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input name="nib" placeholder="No. NIB" className="input-field text-sm" value={baseInfo.nib} onChange={handleBaseChange} />
                <input name="pirt" placeholder="No. PIRT" className="input-field text-sm" value={baseInfo.pirt} onChange={handleBaseChange} />
                <input name="halal" placeholder="No. Halal" className="input-field text-sm" value={baseInfo.halal} onChange={handleBaseChange} />
              </div>
            </div>

            {/* B. Varian & Kemasan */}
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-primary/10 pb-2">
                <h3 className="font-bold text-primary">2. Varian & Kemasan</h3>
                {!isEditing && (
                  <button type="button" onClick={addVariantRow} className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded font-bold hover:bg-emerald-200 cursor-pointer flex items-center gap-1">
                    <Plus size={14} /> Tambah Varian
                  </button>
                )}
              </div>

              {/* Header Kolom (Desktop Only) */}
              <div className="hidden md:grid grid-cols-12 gap-2 text-xs font-bold text-slate-400 px-2">
                <div className="col-span-3">Varian Rasa</div>
                <div className="col-span-2">Netto</div>
                <div className="col-span-3">Jenis Kemasan *</div>
                <div className="col-span-3">Ukuran (cm) *</div>
                <div className="col-span-1"></div>
              </div>

              {/* Rows Input */}
              <div className="space-y-3">
                {variants.map((row, index) => (
                  <div key={row.id} className="relative grid grid-cols-1 md:grid-cols-12 gap-2 p-3 bg-white/50 rounded-xl border border-slate-200 shadow-sm items-start md:items-center">
                    <div className="md:hidden text-xs font-bold text-slate-400 mb-1">Varian #{index + 1}</div>
                    
                    <div className="col-span-3">
                      <input placeholder="Varian (e.g. Pedas)" className="input-field-sm" value={row.variant} onChange={(e) => handleVariantChange(row.id, 'variant', e.target.value)} />
                    </div>
                    <div className="col-span-2">
                      <input placeholder="Netto (e.g. 100g)" className="input-field-sm" value={row.netto} onChange={(e) => handleVariantChange(row.id, 'netto', e.target.value)} />
                    </div>
                    <div className="col-span-3">
                      <input placeholder="Jenis (e.g. Pouch)" required className="input-field-sm" value={row.packaging_type} onChange={(e) => handleVariantChange(row.id, 'packaging_type', e.target.value)} />
                    </div>
                    <div className="col-span-3">
                      <input placeholder="Ukuran (e.g. 12x20)" required className="input-field-sm" value={row.size} onChange={(e) => handleVariantChange(row.id, 'size', e.target.value)} />
                    </div>
                    
                    {/* Tombol Hapus Row */}
                    <div className="col-span-1 flex justify-end">
                      {!isEditing && variants.length > 1 && (
                        <button type="button" onClick={() => removeVariantRow(row.id)} className="p-1.5 text-rose-400 hover:bg-rose-100 rounded-lg cursor-pointer">
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* C. Tombol Simpan */}
            <button type="submit" className="w-full bg-linear-to-r from-primary to-secondary text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-500/30 hover:scale-[1.01] transition-transform flex justify-center gap-2 cursor-pointer mt-4">
              <Save size={20} /> {isEditing ? 'Simpan Perubahan' : `Simpan ${variants.length} Produk Baru`}
            </button>

          </form>
        </GlassCard>
      )}

      {/* 5. LIST PRODUK */}
      <div className="grid gap-4">
        {products.length === 0 ? (
          <div className="text-center py-10 text-slate-400 bg-white/30 rounded-2xl border border-dashed border-slate-300">
            Belum ada produk terdaftar.
          </div>
        ) : (
          products.map((prod) => (
            <GlassCard key={prod.id} className="p-5 flex flex-col md:flex-row justify-between gap-4 group hover:border-primary/30 transition-all">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-lg text-slate-800">{prod.product_name}</h3>
                  <span className="bg-orange-100 text-orange-600 text-xs font-bold px-2 py-0.5 rounded-md">{prod.brand}</span>
                </div>
                <div className="text-sm text-slate-600 space-y-1">
                  <div className="flex flex-wrap gap-2 items-center">
                    <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-100 font-medium">
                      {prod.packaging_type} ({prod.size})
                    </span>
                    {(prod.variant || prod.netto) && (
                      <span className="bg-purple-50 text-purple-700 px-2 py-0.5 rounded border border-purple-100">
                        {prod.variant} {prod.netto ? `• ${prod.netto}` : ''}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col gap-2 items-end justify-between">
                {/* Action Buttons */}
                <div className="flex items-center gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => startEdit(prod)} 
                    className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 cursor-pointer transition-colors" 
                    title="Edit"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button 
                    onClick={() => onDeleteClick(prod.id)} 
                    className="p-2 bg-rose-50 text-rose-600 rounded-lg hover:bg-rose-100 cursor-pointer transition-colors" 
                    title="Hapus"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <div className="flex flex-col gap-1 text-xs text-slate-400 text-right mt-2 md:mt-0">
                  {prod.nib && <span className="bg-slate-100 px-2 py-1 rounded">NIB: {prod.nib}</span>}
                  {prod.pirt && <span className="bg-slate-100 px-2 py-1 rounded">PIRT: {prod.pirt}</span>}
                </div>
              </div>
            </GlassCard>
          ))
        )}
      </div>

      {/* 6. MODAL KONFIRMASI DELETE */}
      <ConfirmModal 
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={confirmDelete}
        title="Hapus Produk?"
        message="Produk yang dihapus tidak dapat dikembalikan lagi. Apakah Anda yakin?"
        confirmLabel="Ya, Hapus"
        isDanger={true}
        isLoading={isDeleting}
      />

      {/* Styles Local */}
      <style>{`
        .input-field { width: 100%; padding: 10px 14px; border-radius: 10px; background: rgba(255,255,255,0.7); border: 1px solid #e2e8f0; outline: none; transition: all 0.2s; }
        .input-field:focus { border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1); }
        .input-field-sm { width: 100%; padding: 8px 12px; border-radius: 8px; background: white; border: 1px solid #e2e8f0; outline: none; font-size: 0.9rem; }
        .input-field-sm:focus { border-color: #3b82f6; border-left: 3px solid #3b82f6; }
      `}</style>

    </div>
  );
};