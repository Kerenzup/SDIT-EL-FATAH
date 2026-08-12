export function formatRupiah(amount: number): string {
  if (isNaN(amount)) return 'Rp 0';
  const isNegative = amount < 0;
  const absAmount = Math.abs(amount);
  const formatted = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(absAmount);

  return isNegative ? `(${formatted})` : formatted;
}

export function formatDateIndonesian(dateString: string): string {
  if (!dateString) return '-';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

export function numberToWordsID(amount: number): string {
  const abs = Math.abs(Math.floor(amount));
  if (abs === 0) return 'Nol Rupiah';

  const units = ['', 'Satu', 'Dua', 'Tiga', 'Empat', 'Lima', 'Enam', 'Tujuh', 'Delapan', 'Sembilan', 'Sepuluh', 'Sebelas'];

  function convert(n: number): string {
    if (n < 12) return units[n];
    if (n < 20) return convert(n - 10) + ' Belas';
    if (n < 100) return convert(Math.floor(n / 10)) + ' Puluh ' + convert(n % 10);
    if (n < 200) return 'Seratus ' + convert(n - 100);
    if (n < 1000) return convert(Math.floor(n / 100)) + ' Ratus ' + convert(n % 100);
    if (n < 2000) return 'Seribu ' + convert(n - 1000);
    if (n < 1000000) return convert(Math.floor(n / 1000)) + ' Ribu ' + convert(n % 1000);
    if (n < 1000000000) return convert(Math.floor(n / 1000000)) + ' Juta ' + convert(n % 1000000);
    if (n < 1000000000000) return convert(Math.floor(n / 1000000000)) + ' Milyar ' + convert(n % 1000000000);
    return convert(Math.floor(n / 1000000000000)) + ' Trilyun ' + convert(n % 1000000000000);
  }

  return convert(abs).trim().replace(/\s+/g, ' ') + ' Rupiah';
}

export function exportToCSV(filename: string, rows: (string | number)[][]) {
  const csvContent = 'data:text/csv;charset=utf-8,' + rows.map((e) => e.map((cell) => `"${cell}"`).join(',')).join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function isMediaVideo(url: string): boolean {
  if (!url) return false;
  const lower = url.toLowerCase();
  return (
    lower.startsWith('data:video/') ||
    lower.includes('.mp4') ||
    lower.includes('.webm') ||
    lower.includes('.mov') ||
    lower.includes('.ogg') ||
    lower.includes('youtube.com') ||
    lower.includes('youtu.be')
  );
}

export function getYoutubeEmbedUrl(url: string): string {
  if (!url) return '';
  if (url.includes('youtube.com/embed/')) return url;

  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|shorts\/)([^#\&\?]*).*/;
  const match = url.match(regExp);

  if (match && match[2] && match[2].length === 11) {
    return `https://www.youtube.com/embed/${match[2]}?autoplay=1&mute=1&loop=1&playlist=${match[2]}`;
  }
  return url;
}

