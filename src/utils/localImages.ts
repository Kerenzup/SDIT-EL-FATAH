// Local Image Assets & Local SVG Fallbacks for Pimpinan, Pengurus, Guru, and Building

export const LOCAL_IMAGES = {
  pembina: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
    <defs>
      <linearGradient id="bgPembina" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="%23064e3b" />
        <stop offset="100%" stop-color="%23022c22" />
      </linearGradient>
      <linearGradient id="goldRing" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="%23fbbf24" />
        <stop offset="100%" stop-color="%23d97706" />
      </linearGradient>
    </defs>
    <rect width="400" height="400" rx="30" fill="url(%23bgPembina)"/>
    <circle cx="200" cy="200" r="185" stroke="url(%23goldRing)" stroke-width="6" fill="none" opacity="0.6"/>
    <!-- Head & Neck -->
    <path d="M 160 210 L 240 210 L 230 280 L 170 280 Z" fill="%23f7d6be"/>
    <!-- Face -->
    <ellipse cx="200" cy="180" rx="65" ry="75" fill="%23f7d6be"/>
    <!-- Glasses -->
    <rect x="155" y="160" width="38" height="26" rx="6" fill="none" stroke="%231e293b" stroke-width="4"/>
    <rect x="207" y="160" width="38" height="26" rx="6" fill="none" stroke="%231e293b" stroke-width="4"/>
    <line x1="193" y1="173" x2="207" y2="173" stroke="%231e293b" stroke-width="4"/>
    <!-- Eyes -->
    <circle cx="174" cy="173" r="4" fill="%230f172a"/>
    <circle cx="226" cy="173" r="4" fill="%230f172a"/>
    <!-- Smile & Mustache -->
    <path d="M 175 200 Q 200 208 225 200" stroke="%23334155" stroke-width="5" fill="none" stroke-linecap="round"/>
    <path d="M 180 220 Q 200 230 220 220" stroke="%230f172a" stroke-width="3" fill="none"/>
    <!-- Peci / Songkok (Islamic Hat) -->
    <path d="M 132 150 Q 200 135 268 150 L 262 110 Q 200 95 138 110 Z" fill="%230f172a"/>
    <path d="M 138 110 Q 200 95 262 110 L 260 100 Q 200 85 140 100 Z" fill="%23fbbf24"/>
    <!-- Suit & Shirt -->
    <path d="M 80 400 L 130 270 Q 200 290 270 270 L 320 400 Z" fill="%230f172a"/>
    <polygon points="200,285 175,360 225,360" fill="%23ffffff"/>
    <polygon points="200,295 190,380 210,380" fill="%230284c7"/>
    <polygon points="130,270 180,330 195,290" fill="%231e293b"/>
    <polygon points="270,270 220,330 205,290" fill="%231e293b"/>
    <!-- Badge -->
    <rect x="250" y="320" width="50" height="20" rx="4" fill="%23fbbf24"/>
    <text x="275" y="334" font-family="sans-serif" font-size="10" font-weight="bold" fill="%230f172a" text-anchor="middle">PEMBINA</text>
  </svg>`,

  ketua: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
    <defs>
      <linearGradient id="bgKetua" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="%231e1b4b" />
        <stop offset="100%" stop-color="%23312e81" />
      </linearGradient>
      <linearGradient id="amberGold" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="%23f59e0b" />
        <stop offset="100%" stop-color="%23b45309" />
      </linearGradient>
    </defs>
    <rect width="400" height="400" rx="30" fill="url(%23bgKetua)"/>
    <circle cx="200" cy="200" r="185" stroke="url(%23amberGold)" stroke-width="6" fill="none" opacity="0.6"/>
    <!-- Neck -->
    <path d="M 165 210 L 235 210 L 225 280 L 175 280 Z" fill="%23f5c29b"/>
    <!-- Face -->
    <ellipse cx="200" cy="175" rx="62" ry="72" fill="%23f5c29b"/>
    <!-- Hair -->
    <path d="M 135 160 Q 140 100 200 95 Q 260 100 265 160 Q 250 120 200 115 Q 150 120 135 160 Z" fill="%231c1917"/>
    <!-- Eyes -->
    <circle cx="176" cy="168" r="4.5" fill="%230f172a"/>
    <circle cx="224" cy="168" r="4.5" fill="%230f172a"/>
    <!-- Eyebrows -->
    <path d="M 162 156 Q 176 150 190 156" stroke="%231c1917" stroke-width="4" fill="none"/>
    <path d="M 210 156 Q 224 150 238 156" stroke="%231c1917" stroke-width="4" fill="none"/>
    <!-- Smile -->
    <path d="M 180 212 Q 200 225 220 212" stroke="%239a3412" stroke-width="4" fill="none" stroke-linecap="round"/>
    <!-- Suit & Shirt -->
    <path d="M 75 400 L 125 270 Q 200 290 275 270 L 325 400 Z" fill="%231e293b"/>
    <polygon points="200,285 178,360 222,360" fill="%23ffffff"/>
    <polygon points="200,295 192,380 208,380" fill="%23b45309"/>
    <polygon points="125,270 178,335 195,290" fill="%230f172a"/>
    <polygon points="275,270 222,335 205,290" fill="%230f172a"/>
    <!-- Badge -->
    <rect x="245" y="320" width="60" height="20" rx="4" fill="%23f59e0b"/>
    <text x="275" y="334" font-family="sans-serif" font-size="9" font-weight="bold" fill="%230f172a" text-anchor="middle">KETUA YAYASAN</text>
  </svg>`,

  sekretaris: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
    <defs>
      <linearGradient id="bgSekre" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="%230f172a" />
        <stop offset="100%" stop-color="%231e293b" />
      </linearGradient>
    </defs>
    <rect width="400" height="400" rx="30" fill="url(%23bgSekre)"/>
    <circle cx="200" cy="200" r="185" stroke="%2338bdf8" stroke-width="5" fill="none" opacity="0.5"/>
    <path d="M 165 210 L 235 210 L 225 280 L 175 280 Z" fill="%23f7d6be"/>
    <ellipse cx="200" cy="175" rx="60" ry="70" fill="%23f7d6be"/>
    <path d="M 138 150 Q 145 105 200 100 Q 255 105 262 150 Q 248 118 200 115 Q 152 118 138 150 Z" fill="%2327272a"/>
    <circle cx="176" cy="168" r="4" fill="%230f172a"/>
    <circle cx="224" cy="168" r="4" fill="%230f172a"/>
    <path d="M 182 210 Q 200 220 218 210" stroke="%230284c7" stroke-width="4" fill="none" stroke-linecap="round"/>
    <path d="M 80 400 L 130 270 Q 200 290 270 270 L 320 400 Z" fill="%230369a1"/>
    <polygon points="200,285 180,360 220,360" fill="%23ffffff"/>
    <polygon points="200,295 192,380 208,380" fill="%230f172a"/>
    <rect x="240" y="320" width="65" height="20" rx="4" fill="%2338bdf8"/>
    <text x="272" y="334" font-family="sans-serif" font-size="8" font-weight="bold" fill="%230f172a" text-anchor="middle">SEKRETARIS</text>
  </svg>`,

  bendahara: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
    <defs>
      <linearGradient id="bgBenda" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="%23831843" />
        <stop offset="100%" stop-color="%23500724" />
      </linearGradient>
      <linearGradient id="goldHj" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="%23fef08a" />
        <stop offset="100%" stop-color="%23eab308" />
      </linearGradient>
    </defs>
    <rect width="400" height="400" rx="30" fill="url(%23bgBenda)"/>
    <circle cx="200" cy="200" r="185" stroke="url(%23goldHj)" stroke-width="5" fill="none" opacity="0.6"/>
    <!-- Hijab back/chest cover -->
    <path d="M 90 400 C 100 240 300 240 310 400 Z" fill="%239d174d"/>
    <path d="M 120 400 C 130 270 270 270 280 400 Z" fill="%23be185d"/>
    <!-- Inner face -->
    <ellipse cx="200" cy="180" rx="55" ry="65" fill="%23f7d6be"/>
    <!-- Hijab frame around face -->
    <path d="M 140 185 C 135 120 265 120 260 185 C 260 250 140 250 140 185 Z" fill="none" stroke="%23be185d" stroke-width="25"/>
    <path d="M 148 180 C 145 130 255 130 252 180 C 252 240 148 240 148 180 Z" fill="none" stroke="%23fef08a" stroke-width="5"/>
    <!-- Eyes & Makeup -->
    <circle cx="178" cy="175" r="4" fill="%230f172a"/>
    <circle cx="222" cy="175" r="4" fill="%230f172a"/>
    <path d="M 168 167 Q 178 162 188 167" stroke="%23831843" stroke-width="3" fill="none"/>
    <path d="M 212 167 Q 222 162 232 167" stroke="%23831843" stroke-width="3" fill="none"/>
    <!-- Smile -->
    <path d="M 183 205 Q 200 215 217 205" stroke="%23be185d" stroke-width="4" fill="none" stroke-linecap="round"/>
    <!-- Badge -->
    <rect x="245" y="320" width="60" height="20" rx="4" fill="%23fef08a"/>
    <text x="275" y="334" font-family="sans-serif" font-size="8" font-weight="bold" fill="%23831843" text-anchor="middle">BENDAHARA</text>
  </svg>`,

  kepalaSekolah: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
    <defs>
      <linearGradient id="bgKepsek" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="%231e3a8a" />
        <stop offset="100%" stop-color="%23172554" />
      </linearGradient>
    </defs>
    <rect width="400" height="400" rx="30" fill="url(%23bgKepsek)"/>
    <circle cx="200" cy="200" r="185" stroke="%2360a5fa" stroke-width="5" fill="none" opacity="0.6"/>
    <path d="M 165 210 L 235 210 L 225 280 L 175 280 Z" fill="%23f7d6be"/>
    <ellipse cx="200" cy="175" rx="60" ry="70" fill="%23f7d6be"/>
    <!-- Glasses -->
    <rect x="155" y="160" width="36" height="24" rx="4" fill="none" stroke="%231e293b" stroke-width="3.5"/>
    <rect x="209" y="160" width="36" height="24" rx="4" fill="none" stroke="%231e293b" stroke-width="3.5"/>
    <line x1="191" y1="172" x2="209" y2="172" stroke="%231e293b" stroke-width="3.5"/>
    <!-- Eyes -->
    <circle cx="173" cy="172" r="3.5" fill="%230f172a"/>
    <circle cx="227" cy="172" r="3.5" fill="%230f172a"/>
    <path d="M 138 148 Q 145 105 200 100 Q 255 105 262 148 Q 248 118 200 115 Q 152 118 138 148 Z" fill="%23334155"/>
    <path d="M 182 212 Q 200 224 218 212" stroke="%231e3a8a" stroke-width="4" fill="none" stroke-linecap="round"/>
    <path d="M 75 400 L 125 270 Q 200 290 275 270 L 325 400 Z" fill="%231e293b"/>
    <polygon points="200,285 180,360 220,360" fill="%23ffffff"/>
    <polygon points="200,295 192,380 208,380" fill="%232563eb"/>
    <rect x="235" y="320" width="75" height="20" rx="4" fill="%2360a5fa"/>
    <text x="272" y="334" font-family="sans-serif" font-size="8" font-weight="bold" fill="%230f172a" text-anchor="middle">KEPALA SEKOLAH</text>
  </svg>`,

  guruPria: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
    <rect width="400" height="400" rx="30" fill="%230f172a"/>
    <circle cx="200" cy="200" r="185" stroke="%2338bdf8" stroke-width="4" fill="none" opacity="0.4"/>
    <ellipse cx="200" cy="175" rx="55" ry="65" fill="%23f7d6be"/>
    <path d="M 145 150 Q 150 110 200 105 Q 250 110 255 150 Z" fill="%231e293b"/>
    <circle cx="178" cy="170" r="3.5" fill="%230f172a"/>
    <circle cx="222" cy="170" r="3.5" fill="%230f172a"/>
    <path d="M 185 205 Q 200 215 215 205" stroke="%230284c7" stroke-width="3.5" fill="none"/>
    <path d="M 85 400 L 135 275 Q 200 290 265 275 L 315 400 Z" fill="%230369a1"/>
    <polygon points="200,285 185,350 215,350" fill="%23ffffff"/>
    <rect x="250" y="320" width="55" height="20" rx="4" fill="%2338bdf8"/>
    <text x="277" y="334" font-family="sans-serif" font-size="8" font-weight="bold" fill="%230f172a" text-anchor="middle">GURU / STAF</text>
  </svg>`,

  guruWanita: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
    <rect width="400" height="400" rx="30" fill="%23064e3b"/>
    <circle cx="200" cy="200" r="185" stroke="%2334d399" stroke-width="4" fill="none" opacity="0.4"/>
    <path d="M 100 400 C 110 250 290 250 300 400 Z" fill="%23047857"/>
    <ellipse cx="200" cy="180" rx="52" ry="62" fill="%23f7d6be"/>
    <path d="M 145 185 C 140 125 260 125 255 185 C 255 245 145 245 145 185 Z" fill="none" stroke="%2310b981" stroke-width="22"/>
    <circle cx="180" cy="175" r="3.5" fill="%230f172a"/>
    <circle cx="220" cy="175" r="3.5" fill="%230f172a"/>
    <path d="M 185 205 Q 200 215 215 205" stroke="%23047857" stroke-width="3.5" fill="none"/>
    <rect x="250" y="320" width="55" height="20" rx="4" fill="%2334d399"/>
    <text x="277" y="334" font-family="sans-serif" font-size="8" font-weight="bold" fill="%23064e3b" text-anchor="middle">GURU / STAF</text>
  </svg>`,

  building: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" width="100%" height="100%">
    <defs>
      <linearGradient id="skyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="%230f172a" />
        <stop offset="100%" stop-color="%231e293b" />
      </linearGradient>
      <linearGradient id="bldgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="%23065f46" />
        <stop offset="100%" stop-color="%23022c22" />
      </linearGradient>
      <linearGradient id="goldAcc" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="%23fbbf24" />
        <stop offset="100%" stop-color="%23f59e0b" />
      </linearGradient>
    </defs>
    <rect width="800" height="500" fill="url(%23skyGrad)"/>
    <!-- Grass / Lawn -->
    <rect x="0" y="420" width="800" height="80" fill="%23047857"/>
    <!-- Main School Building -->
    <rect x="150" y="150" width="500" height="270" rx="12" fill="url(%23bldgGrad)" stroke="%2334d399" stroke-width="3"/>
    <rect x="150" y="150" width="500" height="25" fill="url(%23goldAcc)"/>
    <!-- Roof Dome / Islamic Arch top -->
    <path d="M 330 150 Q 400 70 470 150 Z" fill="url(%23goldAcc)"/>
    <circle cx="400" cy="110" r="10" fill="%23fef08a"/>
    <!-- Windows Grid -->
    <g fill="%2338bdf8" opacity="0.85">
      <!-- 3rd floor -->
      <rect x="180" y="190" width="40" height="40" rx="6"/><rect x="240" y="190" width="40" height="40" rx="6"/>
      <rect x="300" y="190" width="40" height="40" rx="6"/><rect x="460" y="190" width="40" height="40" rx="6"/>
      <rect x="520" y="190" width="40" height="40" rx="6"/><rect x="580" y="190" width="40" height="40" rx="6"/>
      <!-- 2nd floor -->
      <rect x="180" y="250" width="40" height="40" rx="6"/><rect x="240" y="250" width="40" height="40" rx="6"/>
      <rect x="300" y="250" width="40" height="40" rx="6"/><rect x="460" y="250" width="40" height="40" rx="6"/>
      <rect x="520" y="250" width="40" height="40" rx="6"/><rect x="580" y="250" width="40" height="40" rx="6"/>
      <!-- 1st floor -->
      <rect x="180" y="320" width="40" height="40" rx="6"/><rect x="240" y="320" width="40" height="40" rx="6"/>
      <rect x="520" y="320" width="40" height="40" rx="6"/><rect x="580" y="320" width="40" height="40" rx="6"/>
    </g>
    <!-- Entrance Gate -->
    <path d="M 360 420 L 360 300 Q 400 270 440 300 L 440 420 Z" fill="%230f172a" stroke="url(%23goldAcc)" stroke-width="4"/>
    <text x="400" y="220" font-family="sans-serif" font-size="16" font-weight="900" fill="%23ffffff" text-anchor="middle">YAYASAN PENDIDIKAN DAARUL HABIBAH</text>
    <text x="400" y="240" font-family="sans-serif" font-size="12" font-weight="bold" fill="%23fbbf24" text-anchor="middle">GEDUNG KAMPUS TERPADU & ROMBEL 1-6</text>
  </svg>`,
};

/**
 * Returns a guaranteed local image URL or Data URI based on title/position or provided url
 */
export function getLocalPhotoUrl(url?: string, positionOrName: string = ''): string {
  if (url && (url.startsWith('data:') || url.startsWith('blob:') || url.startsWith('/images/'))) {
    return url;
  }
  
  const pos = positionOrName.toLowerCase();
  if (pos.includes('pembina')) return LOCAL_IMAGES.pembina;
  if (pos.includes('ketua') || pos.includes('pimpinan')) return LOCAL_IMAGES.ketua;
  if (pos.includes('sekretaris')) return LOCAL_IMAGES.sekretaris;
  if (pos.includes('bendahara')) return LOCAL_IMAGES.bendahara;
  if (pos.includes('kepala sekolah') || pos.includes('kepsek')) return LOCAL_IMAGES.kepalaSekolah;
  if (pos.includes('fatimah') || pos.includes('rina') || pos.includes('ibu') || pos.includes('hj')) return LOCAL_IMAGES.guruWanita;
  
  return LOCAL_IMAGES.guruPria;
}
