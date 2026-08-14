import React, { useState, useRef } from 'react';
import { Upload, Image as ImageIcon, Video, X, Link, Check, Eye, Grid, Loader2, PlayCircle, ShieldCheck } from 'lucide-react';
import { compressImageFile } from '../../utils/imageCompressor';
import { isYouTubeUrl, getYoutubeEmbedUrl, isMediaVideo, getEmbedVideoUrl, isGoogleDriveUrl, getGoogleDriveEmbedUrl } from '../../utils/formatters';

export const PRESET_PHOTOS = [
  {
    category: 'Gedung & Kampus',
    items: [
      { name: 'Gedung Sekolah Modern 1', url: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=1200&q=80' },
      { name: 'Gedung Sekolah Modern 2', url: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&q=80' },
      { name: 'Kampus Asri & Hijau', url: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1200&q=80' },
      { name: 'Gedung Arsitektur Megah', url: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1200&q=80' },
    ],
  },
  {
    category: 'Siswa & Belajar',
    items: [
      { name: 'Siswa Belajar Bersama', url: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=1200&q=80' },
      { name: 'Lab Komputer ANBK', url: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1200&q=80' },
      { name: 'Eksperimen Lab Sains', url: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=1200&q=80' },
      { name: 'Perpustakaan Digital', url: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1200&q=80' },
    ],
  },
  {
    category: 'Prestasi & Juara',
    items: [
      { name: 'Penyerahan Medali Juara', url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80' },
      { name: 'Piala Juara Olimpiade', url: 'https://images.unsplash.com/photo-1569517282132-25d22f4573e6?auto=format&fit=crop&w=1200&q=80' },
      { name: 'Siswa Tersenyum Bangga', url: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80' },
    ],
  },
  {
    category: 'Pimpinan & Guru',
    items: [
      { name: 'Profil Pimpinan Pria 1', url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=800&q=80' },
      { name: 'Profil Pimpinan Pria 2', url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=800&q=80' },
      { name: 'Profil Ibu Guru / Kepsek', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80' },
      { name: 'Profil Ibu Guru Ramah', url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80' },
    ],
  },
];

export const PRESET_VIDEOS = [
  {
    category: 'Video Profil & Tur Kampus',
    items: [
      { name: 'Video Profil Sekolah & Tur Kampus', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
      { name: 'Video Suasana Belajar Mengajar Siswa', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4' },
    ],
  },
  {
    category: 'Kegiatan & Prestasi Santri',
    items: [
      { name: 'Video Wisuda Tahfidz Qur\'an & Pentas Seni', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4' },
      { name: 'Video Pembelajaran Praktik Sains & Robotik', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4' },
    ],
  },
];

interface MediaUploaderProps {
  value: string;
  onChange: (url: string, mediaType?: 'photo' | 'video') => void;
  label?: string;
  mediaType?: 'photo' | 'video' | 'any';
  accept?: string;
  placeholder?: string;
  helperText?: string;
  className?: string;
}

export const MediaUploader: React.FC<MediaUploaderProps> = ({
  value,
  onChange,
  label = 'Upload Media (Foto / Video)',
  mediaType = 'any',
  accept = 'image/*,video/*',
  placeholder = 'Masukkan link YouTube, Google Drive, atau URL Video/Foto...',
  helperText = 'Mendukung format gambar (JPG, PNG, WebP) & video (MP4, WebM, YouTube, Google Drive) dengan penyimpanan permanen IndexedDB.',
  className = '',
}) => {
  const [activeInputMode, setActiveInputMode] = useState<'file' | 'url' | 'preset'>('file');
  const [presetTypeTab, setPresetTypeTab] = useState<'photo' | 'video'>('photo');
  const [urlInput, setUrlInput] = useState(value);
  const [dragActive, setDragActive] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileSize, setFileSize] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isVideo = (url: string) => {
    return isMediaVideo(url);
  };

  const isYouTube = (url: string) => {
    return isYouTubeUrl(url);
  };

  const formatBytes = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = async (file: File) => {
    const isVid = file.type.startsWith('video/');

    setFileName(file.name);
    setFileSize(formatBytes(file.size));
    setIsCompressing(true);

    try {
      if (isVid) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const result = (event.target?.result as string) || '';
          onChange(result, 'video');
          setIsCompressing(false);
        };
        reader.onerror = () => setIsCompressing(false);
        reader.readAsDataURL(file);
      } else {
        // Compress photo to HD optimized web format (1200x1200, 0.82 quality)
        const compressed = await compressImageFile(file, {
          maxWidth: 1200,
          maxHeight: 1200,
          quality: 0.82,
        });
        setFileSize(formatBytes(compressed.sizeBytes));
        onChange(compressed.dataUrl, 'photo');
        setIsCompressing(false);
      }
    } catch (err) {
      console.error('Error processing media file:', err);
      setIsCompressing(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleUrlSubmit = () => {
    if (!urlInput || !urlInput.trim()) return;
    const cleanUrl = urlInput.trim();
    const formatted = getEmbedVideoUrl(cleanUrl);
    const isVid = isMediaVideo(formatted) || isYouTubeUrl(cleanUrl) || isGoogleDriveUrl(cleanUrl);
    onChange(formatted, isVid ? 'video' : 'photo');
    setFileName(null);
  };

  const handleClear = () => {
    onChange('', 'photo');
    setFileName(null);
    setFileSize(null);
    setUrlInput('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <div className="flex justify-between items-center">
          <label className="block text-xs font-bold text-slate-700">{label}</label>
          <div className="flex gap-1 text-[10px]">
            <button
              type="button"
              onClick={() => setActiveInputMode('file')}
              className={`px-2 py-0.5 rounded-md font-bold transition cursor-pointer flex items-center gap-1 ${
                activeInputMode === 'file'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Upload className="w-3 h-3" /> Upload Komputer
            </button>
            <button
              type="button"
              onClick={() => setActiveInputMode('preset')}
              className={`px-2 py-0.5 rounded-md font-bold transition cursor-pointer flex items-center gap-1 ${
                activeInputMode === 'preset'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Grid className="w-3 h-3" /> Preset HD
            </button>
            <button
              type="button"
              onClick={() => setActiveInputMode('url')}
              className={`px-2 py-0.5 rounded-md font-bold transition cursor-pointer flex items-center gap-1 ${
                activeInputMode === 'url'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Link className="w-3 h-3" /> URL Link / YouTube
            </button>
          </div>
        </div>
      )}

      {/* Upload Box Mode */}
      {activeInputMode === 'file' && (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer transition ${
            dragActive
              ? 'border-emerald-500 bg-emerald-50/50 scale-[0.99]'
              : 'border-slate-300 bg-slate-50 hover:bg-slate-100/80 hover:border-emerald-400'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            onChange={handleFileChange}
            className="hidden"
          />

          <div className="flex flex-col items-center justify-center gap-1">
            {isCompressing ? (
              <div className="py-2 flex flex-col items-center gap-1 text-emerald-700">
                <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
                <p className="text-xs font-bold">Memproses & Menyimpan Media ke IndexedDB...</p>
                <span className="text-[10px] text-slate-500">Menjaga data tetap permanen tanpa batas kuota</span>
              </div>
            ) : (
              <>
                <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shadow-xs mb-1">
                  {mediaType === 'video' ? (
                    <Video className="w-5 h-5" />
                  ) : mediaType === 'photo' ? (
                    <ImageIcon className="w-5 h-5" />
                  ) : (
                    <Upload className="w-5 h-5" />
                  )}
                </div>

                <p className="text-xs font-extrabold text-slate-800">
                  Klik untuk pilih File Foto / Video dari Komputer Lokal
                </p>
                <p className="text-[11px] text-slate-500">
                  atau seret & drop file foto atau video (MP4, WebM, MOV) ke sini
                </p>
                <div className="flex items-center gap-1.5 text-[10px] text-emerald-800 font-extrabold bg-emerald-100/90 px-3 py-1 rounded-full mt-1 border border-emerald-300">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Penyimpanan Permanen (IndexedDB Engine) &bull; Bebas Hilang Saat Refresh</span>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Preset Photos & Videos Mode */}
      {activeInputMode === 'preset' && (
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 space-y-3 max-h-72 overflow-y-auto">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <p className="text-xs font-bold text-slate-700">Pilih Preset Media HD (1-Klik):</p>
            <div className="flex gap-1">
              <button
                type="button"
                onClick={() => setPresetTypeTab('photo')}
                className={`px-2.5 py-0.5 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                  presetTypeTab === 'photo' ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                }`}
              >
                <ImageIcon className="w-3 h-3" /> Foto HD
              </button>
              <button
                type="button"
                onClick={() => setPresetTypeTab('video')}
                className={`px-2.5 py-0.5 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                  presetTypeTab === 'video' ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                }`}
              >
                <Video className="w-3 h-3" /> Video HD
              </button>
            </div>
          </div>

          {presetTypeTab === 'photo' ? (
            <div className="space-y-3">
              {PRESET_PHOTOS.map((cat) => (
                <div key={cat.category} className="space-y-1.5">
                  <span className="text-[10px] font-extrabold uppercase text-slate-500 tracking-wider">
                    {cat.category}
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {cat.items.map((item) => (
                      <button
                        key={item.url}
                        type="button"
                        onClick={() => {
                          onChange(item.url, 'photo');
                          setUrlInput(item.url);
                          setFileName(item.name);
                        }}
                        className={`group relative rounded-xl overflow-hidden border-2 transition text-left cursor-pointer ${
                          value === item.url ? 'border-blue-600 ring-2 ring-blue-300' : 'border-slate-200 hover:border-blue-400'
                        }`}
                      >
                        <img src={item.url} alt={item.name} className="w-full h-16 object-cover group-hover:scale-105 transition duration-300" />
                        <div className="p-1 bg-white/90 backdrop-blur-xs text-[9px] font-bold text-slate-800 truncate">
                          {item.name}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {PRESET_VIDEOS.map((cat) => (
                <div key={cat.category} className="space-y-1.5">
                  <span className="text-[10px] font-extrabold uppercase text-slate-500 tracking-wider">
                    {cat.category}
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {cat.items.map((item) => (
                      <button
                        key={item.url}
                        type="button"
                        onClick={() => {
                          onChange(item.url, 'video');
                          setUrlInput(item.url);
                          setFileName(item.name);
                        }}
                        className={`p-2.5 rounded-xl border-2 transition text-left cursor-pointer flex items-center gap-2.5 ${
                          value === item.url ? 'border-emerald-600 bg-emerald-50' : 'border-slate-200 bg-white hover:border-emerald-400'
                        }`}
                      >
                        <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                          <PlayCircle className="w-5 h-5" />
                        </div>
                        <div className="overflow-hidden">
                          <p className="text-xs font-bold text-slate-900 truncate">{item.name}</p>
                          <span className="text-[10px] text-emerald-700 font-medium">Klik untuk terapkan video</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* URL Input Mode */}
      {activeInputMode === 'url' && (
        <div className="space-y-1.5">
          <div className="flex gap-2">
            <input
              type="text"
              value={urlInput}
              onChange={(e) => {
                setUrlInput(e.target.value);
                const clean = e.target.value.trim();
                if (clean) {
                  const formatted = getEmbedVideoUrl(clean);
                  const isVid = isMediaVideo(formatted) || isYouTubeUrl(clean) || isGoogleDriveUrl(clean);
                  onChange(formatted, isVid ? 'video' : 'photo');
                }
              }}
              placeholder={placeholder}
              className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:border-emerald-500"
            />
            <button
              type="button"
              onClick={handleUrlSubmit}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer shadow-xs"
            >
              <Check className="w-3.5 h-3.5" /> Terapkan Link
            </button>
          </div>
          <p className="text-[10px] text-slate-500">
            Contoh: Link YouTube (<code>https://www.youtube.com/watch?v=...</code> atau <code>https://youtu.be/...</code>), Google Drive Video, atau file direct <code>.mp4</code>.
          </p>
        </div>
      )}

      {/* Media Active Preview Card */}
      {value && (
        <div className="relative mt-2 p-3 bg-slate-900 rounded-2xl border border-slate-800 text-white space-y-2">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div className="flex items-center gap-2">
              <Eye className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-xs font-bold text-emerald-300">
                Pratinjau Media Aktif {isVideo(value) || isYouTubeUrl(value) || isGoogleDriveUrl(value) ? '(Video)' : '(Foto)'}
              </span>
            </div>
            {fileName && (
              <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full font-mono">
                {fileName} {fileSize ? `(${fileSize})` : ''}
              </span>
            )}
            <button
              type="button"
              onClick={handleClear}
              className="p-1 text-slate-400 hover:text-rose-400 rounded-md transition cursor-pointer"
              title="Hapus Media"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="overflow-hidden rounded-xl bg-black/40 flex items-center justify-center min-h-[120px] max-h-[280px]">
            {isYouTubeUrl(value) ? (
              <iframe
                src={getYoutubeEmbedUrl(value)}
                className="w-full h-52 rounded-xl border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : isGoogleDriveUrl(value) ? (
              <iframe
                src={getGoogleDriveEmbedUrl(value)}
                className="w-full h-52 rounded-xl border-0"
                allow="autoplay"
                allowFullScreen
              />
            ) : isVideo(value) ? (
              <video
                src={value}
                controls
                playsInline
                className="max-h-60 w-full object-contain rounded-xl bg-black"
              />
            ) : (
              <img
                src={value}
                alt="Pratinjau Media Aktif"
                className="max-h-60 w-full object-contain rounded-xl"
              />
            )}
          </div>
        </div>
      )}

      <p className="text-[10px] text-slate-400">{helperText}</p>
    </div>
  );
};
