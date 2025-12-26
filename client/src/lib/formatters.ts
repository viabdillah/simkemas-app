/**
 * Mengubah string menjadi Title Case (Huruf besar di awal setiap kata).
 */
export const toTitleCase = (text: string): string => {
  return text.replace(/\b\w/g, (char) => char.toUpperCase());
};

/**
 * Format ke mata uang Rupiah (Output: "Rp 50.000")
 */
export const formatRupiah = (amount: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * [BARU] Format Angka saja dengan Ribuan (Output: "50.000")
 * Berguna untuk input field saat mengetik
 */
export const formatNumber = (value: string | number): string => {
  if (!value) return '';
  // Hapus karakter non-digit
  const nums = value.toString().replace(/[^0-9]/g, '');
  // Format dengan titik
  return nums.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

/**
 * [BARU] Mengembalikan nilai number asli dari string terformat
 * Contoh: "50.000" -> 50000
 */
export const parseNumber = (value: string): number => {
  return Number(value.replace(/\./g, ''));
};