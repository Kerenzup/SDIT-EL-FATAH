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

export function isYouTubeUrl(url: string): boolean {
  if (!url) return false;
  const lower = url.toLowerCase();
  return lower.includes('youtube.com') || lower.includes('youtu.be');
}

export function isGoogleDriveUrl(url: string): boolean {
  if (!url) return false;
  const lower = url.toLowerCase();
  return lower.includes('drive.google.com');
}

export function isVimeoUrl(url: string): boolean {
  if (!url) return false;
  const lower = url.toLowerCase();
  return lower.includes('vimeo.com');
}

export function isMediaVideo(url: string): boolean {
  if (!url) return false;
  const lower = url.toLowerCase();
  return (
    lower.startsWith('data:video/') ||
    lower.startsWith('data:application/octet-stream') ||
    (lower.startsWith('data:') && lower.includes('video')) ||
    lower.startsWith('blob:') ||
    lower.includes('.mp4') ||
    lower.includes('.webm') ||
    lower.includes('.mov') ||
    lower.includes('.m4v') ||
    lower.includes('.mkv') ||
    lower.includes('.avi') ||
    lower.includes('.3gp') ||
    lower.includes('.ogg') ||
    lower.includes('.flv') ||
    isVimeoUrl(url) ||
    isGoogleDriveUrl(url) ||
    isYouTubeUrl(url)
  );
}

export function getYoutubeEmbedUrl(url: string): string {
  if (!url) return '';
  if (url.includes('youtube.com/embed/')) return url;

  // Handle formats: watch?v=ID, youtu.be/ID, youtube.com/shorts/ID, youtube.com/live/ID
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|shorts\/|live\/)([^#\&\?]*).*/;
  const match = url.match(regExp);

  if (match && match[2] && match[2].length >= 11) {
    return `https://www.youtube.com/embed/${match[2].substring(0, 11)}`;
  }
  return url;
}

export function getGoogleDriveEmbedUrl(url: string): string {
  if (!url) return '';
  if (url.includes('/preview')) return url;
  // Convert https://drive.google.com/file/d/FILE_ID/view... to /preview
  const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
  if (match && match[1]) {
    return `https://drive.google.com/file/d/${match[1]}/preview`;
  }
  return url;
}

export function getVimeoEmbedUrl(url: string): string {
  if (!url) return '';
  if (url.includes('player.vimeo.com/video/')) return url;
  const match = url.match(/vimeo\.com\/(\d+)/);
  if (match && match[1]) {
    return `https://player.vimeo.com/video/${match[1]}`;
  }
  return url;
}

export function getEmbedVideoUrl(url: string): string {
  if (!url) return '';
  if (isYouTubeUrl(url)) return getYoutubeEmbedUrl(url);
  if (isGoogleDriveUrl(url)) return getGoogleDriveEmbedUrl(url);
  if (isVimeoUrl(url)) return getVimeoEmbedUrl(url);
  return url;
}

