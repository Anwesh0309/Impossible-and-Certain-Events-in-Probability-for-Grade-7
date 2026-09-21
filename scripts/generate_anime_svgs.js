import fs from 'fs';
import path from 'path';

const targetDir = path.resolve('public/assets/images');
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

function makeStars(count) {
  let stars = '';
  for (let i = 0; i < count; i++) {
    const cx = Math.floor(Math.random() * 1024);
    const cy = Math.floor(Math.random() * 1024);
    const r = (Math.random() * 2 + 0.4).toFixed(1);
    const opacity = (Math.random() * 0.7 + 0.3).toFixed(2);
    stars += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#ffffff" opacity="${opacity}" />`;
  }
  return stars;
}

// SLIDE 6: Anime Detective Girl + 3 Jars
const slide6SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="1024" height="1024">
  <defs>
    <linearGradient id="bgGrad6" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0b0326"/>
      <stop offset="40%" stop-color="#190938"/>
      <stop offset="100%" stop-color="#2d0859"/>
    </linearGradient>
    <radialGradient id="nebula6" cx="40%" cy="40%" r="50%">
      <stop offset="0%" stop-color="#a855f7" stop-opacity="0.4"/>
      <stop offset="100%" stop-color="#a855f7" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="goldText6" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#fef08a"/>
      <stop offset="50%" stop-color="#f59e0b"/>
      <stop offset="100%" stop-color="#d97706"/>
    </linearGradient>
    <linearGradient id="glassGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="rgba(255,255,255,0.3)"/>
      <stop offset="100%" stop-color="rgba(255,255,255,0.05)"/>
    </linearGradient>
    <filter id="glow6">
      <feGaussianBlur stdDeviation="8" result="blur" />
      <feMerge>
        <feMergeNode in="blur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
  </defs>

  <!-- Background -->
  <rect width="1024" height="1024" fill="url(#bgGrad6)"/>
  <circle cx="450" cy="400" r="480" fill="url(#nebula6)"/>
  <g>${makeStars(140)}</g>

  <!-- Title -->
  <text x="512" y="90" text-anchor="middle" font-family="'Outfit', 'Inter', sans-serif" font-weight="900" font-size="44" fill="url(#goldText6)" filter="url(#glow6)" letter-spacing="2">
    THE SAMPLE SPACE DECIDES!
  </text>
  <text x="512" y="132" text-anchor="middle" font-family="'Inter', sans-serif" font-weight="700" font-size="20" fill="#d8b4fe">
    Change the Contents → Change the Probability
  </text>

  <!-- Table Pedestal -->
  <path d="M80,750 L944,750 L880,820 L144,820 Z" fill="rgba(28, 12, 64, 0.9)" stroke="#a855f7" stroke-width="3" filter="url(#glow6)"/>

  <!-- JAR 1: CERTAIN -->
  <g transform="translate(110, 360)">
    <rect x="0" y="0" width="220" height="270" rx="35" fill="url(#glassGrad)" stroke="rgba(255,255,255,0.4)" stroke-width="3" filter="url(#glow6)"/>
    <rect x="30" y="-22" width="160" height="32" rx="12" fill="rgba(255,255,255,0.25)" stroke="rgba(255,255,255,0.6)" stroke-width="2"/>
    <!-- Marbles (All Red) -->
    <circle cx="65" cy="210" r="26" fill="#ef4444" filter="url(#glow6)"/>
    <circle cx="155" cy="210" r="26" fill="#ef4444" filter="url(#glow6)"/>
    <circle cx="110" cy="185" r="26" fill="#f87171" filter="url(#glow6)"/>
    <circle cx="65" cy="140" r="26" fill="#dc2626" filter="url(#glow6)"/>
    <circle cx="155" cy="140" r="26" fill="#ef4444" filter="url(#glow6)"/>
    <circle cx="110" cy="100" r="26" fill="#f87171" filter="url(#glow6)"/>
    <!-- Highlight -->
    <path d="M22,35 Q28,135 22,235" stroke="rgba(255,255,255,0.7)" stroke-width="6" stroke-linecap="round" fill="none"/>
    <!-- Badge -->
    <rect x="-10" y="295" width="240" height="55" rx="28" fill="#15803d" stroke="#4ade80" stroke-width="3" filter="url(#glow6)"/>
    <text x="110" y="330" text-anchor="middle" font-family="sans-serif" font-weight="900" font-size="20" fill="#ffffff">
      CERTAIN (P = 1)
    </text>
  </g>

  <!-- JAR 2: LIKELY -->
  <g transform="translate(402, 360)">
    <rect x="0" y="0" width="220" height="270" rx="35" fill="url(#glassGrad)" stroke="rgba(255,255,255,0.4)" stroke-width="3" filter="url(#glow6)"/>
    <rect x="30" y="-22" width="160" height="32" rx="12" fill="rgba(255,255,255,0.25)" stroke="rgba(255,255,255,0.6)" stroke-width="2"/>
    <!-- Marbles (5 Red + 1 Glowing Blue) -->
    <circle cx="65" cy="210" r="26" fill="#ef4444" filter="url(#glow6)"/>
    <circle cx="155" cy="210" r="26" fill="#ef4444" filter="url(#glow6)"/>
    <!-- Glowing Blue Marble -->
    <circle cx="110" cy="185" r="28" fill="#3b82f6" stroke="#60a5fa" stroke-width="5" filter="url(#glow6)"/>
    <circle cx="110" cy="185" r="10" fill="#ffffff" opacity="0.9"/>
    <circle cx="65" cy="140" r="26" fill="#ef4444" filter="url(#glow6)"/>
    <circle cx="155" cy="140" r="26" fill="#dc2626" filter="url(#glow6)"/>
    <circle cx="110" cy="100" r="26" fill="#f87171" filter="url(#glow6)"/>
    <!-- Highlight -->
    <path d="M22,35 Q28,135 22,235" stroke="rgba(255,255,255,0.7)" stroke-width="6" stroke-linecap="round" fill="none"/>
    <!-- Badge -->
    <rect x="-10" y="295" width="240" height="55" rx="28" fill="#b45309" stroke="#fbbf24" stroke-width="3" filter="url(#glow6)"/>
    <text x="110" y="330" text-anchor="middle" font-family="sans-serif" font-weight="900" font-size="20" fill="#ffffff">
      LIKELY (P = 5/6)
    </text>
  </g>

  <!-- JAR 3: IMPOSSIBLE -->
  <g transform="translate(694, 360)">
    <rect x="0" y="0" width="220" height="270" rx="35" fill="url(#glassGrad)" stroke="rgba(255,255,255,0.4)" stroke-width="3" filter="url(#glow6)"/>
    <rect x="30" y="-22" width="160" height="32" rx="12" fill="rgba(255,255,255,0.25)" stroke="rgba(255,255,255,0.6)" stroke-width="2"/>
    <!-- Marbles (All Blue) -->
    <circle cx="65" cy="210" r="26" fill="#2563eb" filter="url(#glow6)"/>
    <circle cx="155" cy="210" r="26" fill="#3b82f6" filter="url(#glow6)"/>
    <circle cx="110" cy="185" r="26" fill="#1d4ed8" filter="url(#glow6)"/>
    <circle cx="65" cy="140" r="26" fill="#3b82f6" filter="url(#glow6)"/>
    <circle cx="155" cy="140" r="26" fill="#2563eb" filter="url(#glow6)"/>
    <circle cx="110" cy="100" r="26" fill="#60a5fa" filter="url(#glow6)"/>
    <!-- Highlight -->
    <path d="M22,35 Q28,135 22,235" stroke="rgba(255,255,255,0.7)" stroke-width="6" stroke-linecap="round" fill="none"/>
    <!-- Badge -->
    <rect x="-10" y="295" width="240" height="55" rx="28" fill="#b91c1c" stroke="#f87171" stroke-width="3" filter="url(#glow6)"/>
    <text x="110" y="330" text-anchor="middle" font-family="sans-serif" font-weight="900" font-size="20" fill="#ffffff">
      IMPOSSIBLE (P = 0)
    </text>
  </g>

  <!-- Anime Detective Girl Portrait Vignette in Corner -->
  <g transform="translate(160, 160)" filter="url(#glow6)">
    <!-- Face base -->
    <ellipse cx="0" cy="40" rx="35" ry="42" fill="#fed7aa"/>
    <!-- Hair Dark Blue Anime Cut -->
    <path d="M-45,20 C-45,-30 45,-30 45,20 C40,0 20,-20 0,-15 C-20,-20 -40,0 -45,20 Z" fill="#1e1b4b"/>
    <path d="M-38,15 L-25,45 L-15,10 L0,50 L15,10 L25,45 L38,15 Z" fill="#312e81"/>
    <!-- Large Anime Eyes -->
    <ellipse cx="-16" cy="38" rx="8" ry="12" fill="#047857"/>
    <ellipse cx="16" cy="38" rx="8" ry="12" fill="#047857"/>
    <circle cx="-14" cy="34" r="3" fill="#ffffff"/>
    <circle cx="18" cy="34" r="3" fill="#ffffff"/>
    <!-- Cute Smile & Blush -->
    <path d="M-8,55 Q0,63 8,55" stroke="#be123c" stroke-width="3" fill="none" stroke-linecap="round"/>
    <ellipse cx="-25" cy="48" rx="6" ry="3" fill="#f43f5e" opacity="0.6"/>
    <ellipse cx="25" cy="48" rx="6" ry="3" fill="#f43f5e" opacity="0.6"/>
    <!-- School Blazer Collar -->
    <path d="M-30,75 L0,95 L30,75 L40,110 L-40,110 Z" fill="#1e293b"/>
    <path d="M-5,78 L0,100 L5,78 Z" fill="#dc2626"/>
    <!-- Glowing Holographic Magnifying Glass -->
    <circle cx="45" cy="20" r="24" fill="none" stroke="#fbbf24" stroke-width="4"/>
    <circle cx="45" cy="20" r="20" fill="rgba(251, 191, 36, 0.2)"/>
    <line x1="62" y1="37" x2="80" y2="55" stroke="#fbbf24" stroke-width="6" stroke-linecap="round"/>
  </g>

  <!-- Speech Bubble from Robot Zara -->
  <g transform="translate(720, 160)" filter="url(#glow6)">
    <rect x="-140" y="0" width="280" height="60" rx="20" fill="#ffffff" stroke="#fbbf24" stroke-width="4"/>
    <text x="0" y="36" text-anchor="middle" font-family="sans-serif" font-weight="900" font-size="16" fill="#0f172a">
      "Even 1 blue marble changes red!" 🔵
    </text>
  </g>

  <!-- Bottom Glass Banner -->
  <rect x="112" y="890" width="800" height="85" rx="42" fill="rgba(22, 11, 54, 0.95)" stroke="#fbbf24" stroke-width="3" filter="url(#glow6)"/>
  <text x="512" y="942" text-anchor="middle" font-family="'Outfit', sans-serif" font-weight="900" font-size="26" fill="#fef08a">
    "Change the bag → Change the probability!"
  </text>
</svg>`;


// SLIDE 7: Anime Duo (Schoolgirl & Schoolboy back to back)
const slide7SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="1024" height="1024">
  <defs>
    <linearGradient id="bgGrad7" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0a0422"/>
      <stop offset="50%" stop-color="#18093c"/>
      <stop offset="100%" stop-color="#2c094e"/>
    </linearGradient>
    <radialGradient id="goldGlow7" cx="25%" cy="50%" r="45%">
      <stop offset="0%" stop-color="#f59e0b" stop-opacity="0.45"/>
      <stop offset="100%" stop-color="#f59e0b" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="cyanGlow7" cx="75%" cy="50%" r="45%">
      <stop offset="0%" stop-color="#06b6d4" stop-opacity="0.45"/>
      <stop offset="100%" stop-color="#06b6d4" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="goldText7" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#fef08a"/>
      <stop offset="100%" stop-color="#f59e0b"/>
    </linearGradient>
    <filter id="glow7">
      <feGaussianBlur stdDeviation="9" result="blur" />
      <feMerge>
        <feMergeNode in="blur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
  </defs>

  <!-- Background -->
  <rect width="1024" height="1024" fill="url(#bgGrad7)"/>
  <circle cx="260" cy="500" r="450" fill="url(#goldGlow7)"/>
  <circle cx="760" cy="500" r="450" fill="url(#cyanGlow7)"/>
  <g>${makeStars(140)}</g>

  <!-- Title -->
  <text x="512" y="90" text-anchor="middle" font-family="'Outfit', sans-serif" font-weight="900" font-size="46" fill="url(#goldText7)" filter="url(#glow7)" letter-spacing="2">
    OPPOSITE PARTNERS
  </text>
  <text x="512" y="132" text-anchor="middle" font-family="sans-serif" font-weight="700" font-size="20" fill="#e9d5ff">
    Every Event A and Not A Always Total 1 Whole!
  </text>

  <!-- Top Central Formula Badge -->
  <rect x="180" y="165" width="664" height="75" rx="37" fill="#1a0c40" stroke="#f59e0b" stroke-width="3" filter="url(#glow7)"/>
  <text x="512" y="213" text-anchor="middle" font-family="'Outfit', sans-serif" font-weight="900" font-size="28" fill="#fef08a">
    P(A) + P(not A) = 1  ➜  P(not A) = 1 − P(A)
  </text>

  <!-- LEFT CARD: EVENT A (Gold Sun + Anime Girl Avatar) -->
  <g transform="translate(110, 270)">
    <rect x="0" y="0" width="370" height="500" rx="35" fill="rgba(26, 12, 64, 0.9)" stroke="#f59e0b" stroke-width="4" filter="url(#glow7)"/>
    
    <!-- Anime Schoolgirl Character Portrait -->
    <g transform="translate(185, 130)">
      <circle cx="0" cy="0" r="75" fill="#fde047" opacity="0.3" filter="url(#glow7)"/>
      <ellipse cx="0" cy="15" rx="38" ry="44" fill="#ffedd5"/>
      <!-- Long Brown Twintails -->
      <path d="M-40,0 C-70,-30 -80,50 -55,80 C-45,50 -35,20 -35,0 Z" fill="#78350f"/>
      <path d="M40,0 C70,-30 80,50 55,80 C45,50 35,20 35,0 Z" fill="#78350f"/>
      <path d="M-42,-15 C-40,-55 40,-55 42,-15 C35,-35 0,-40 -42,-15 Z" fill="#92400e"/>
      <!-- Eyes & Face -->
      <ellipse cx="-16" cy="12" rx="9" ry="13" fill="#b45309"/>
      <ellipse cx="16" cy="12" rx="9" ry="13" fill="#b45309"/>
      <circle cx="-13" cy="8" r="3.5" fill="#ffffff"/>
      <circle cx="19" cy="8" r="3.5" fill="#ffffff"/>
      <path d="M-8,30 Q0,38 8,30" stroke="#be123c" stroke-width="3" fill="none"/>
      <!-- Gold Sun Emblem held in hand -->
      <circle cx="0" cy="70" r="28" fill="#f59e0b" filter="url(#glow7)"/>
      <circle cx="0" cy="70" r="18" fill="#fef08a"/>
    </g>

    <text x="185" y="295" text-anchor="middle" font-family="sans-serif" font-weight="900" font-size="34" fill="#fbbf24">
      EVENT A
    </text>
    <text x="185" y="340" text-anchor="middle" font-family="sans-serif" font-weight="700" font-size="24" fill="#ffffff">
      Probability = 3/8
    </text>

    <rect x="45" y="390" width="280" height="55" rx="27" fill="#78350f" stroke="#fbbf24" stroke-width="2"/>
    <text x="185" y="425" text-anchor="middle" font-family="sans-serif" font-weight="800" font-size="18" fill="#fef08a">
      CERTAIN ↔ IMPOSSIBLE
    </text>
  </g>

  <!-- RIGHT CARD: EVENT NOT A (Cyan Moon + Anime Boy Avatar) -->
  <g transform="translate(544, 270)">
    <rect x="0" y="0" width="370" height="500" rx="35" fill="rgba(26, 12, 64, 0.9)" stroke="#06b6d4" stroke-width="4" filter="url(#glow7)"/>
    
    <!-- Anime Schoolboy Character Portrait -->
    <g transform="translate(185, 130)">
      <circle cx="0" cy="0" r="75" fill="#38bdf8" opacity="0.3" filter="url(#glow7)"/>
      <ellipse cx="0" cy="15" rx="38" ry="44" fill="#ffedd5"/>
      <!-- Messy Blue Anime Hair -->
      <path d="M-45,0 C-45,-55 45,-55 45,0 C30,-35 -30,-35 -45,0 Z" fill="#1e3a8a"/>
      <path d="M-40,-5 L-25,25 L-12,5 L0,30 L15,5 L28,25 L40,-5 Z" fill="#2563eb"/>
      <!-- Eyes & Face -->
      <ellipse cx="-16" cy="12" rx="9" ry="13" fill="#0284c7"/>
      <ellipse cx="16" cy="12" rx="9" ry="13" fill="#0284c7"/>
      <circle cx="-13" cy="8" r="3.5" fill="#ffffff"/>
      <circle cx="19" cy="8" r="3.5" fill="#ffffff"/>
      <path d="M-8,30 Q0,38 8,30" stroke="#be123c" stroke-width="3" fill="none"/>
      <!-- Cyan Crescent Moon Emblem held in hand -->
      <circle cx="0" cy="70" r="28" fill="#06b6d4" filter="url(#glow7)"/>
      <circle cx="8" cy="64" r="22" fill="#1a0c40"/>
    </g>

    <text x="185" y="295" text-anchor="middle" font-family="sans-serif" font-weight="900" font-size="34" fill="#22d3ee">
      NOT A
    </text>
    <text x="185" y="340" text-anchor="middle" font-family="sans-serif" font-weight="700" font-size="24" fill="#ffffff">
      Probability = 5/8
    </text>

    <rect x="45" y="390" width="280" height="55" rx="27" fill="#164e63" stroke="#22d3ee" stroke-width="2"/>
    <text x="185" y="425" text-anchor="middle" font-family="sans-serif" font-weight="800" font-size="18" fill="#a5f3fc">
      3/8 + 5/8 = 8/8 = 1
    </text>
  </g>

  <!-- Central Plus Circle -->
  <circle cx="512" cy="520" r="42" fill="#f59e0b" stroke="#ffffff" stroke-width="4" filter="url(#glow7)"/>
  <text x="512" y="534" text-anchor="middle" font-family="sans-serif" font-weight="900" font-size="44" fill="#000000">
    +
  </text>

  <!-- Bottom Glass Banner -->
  <rect x="112" y="890" width="800" height="85" rx="42" fill="rgba(22, 11, 54, 0.95)" stroke="#06b6d4" stroke-width="3" filter="url(#glow7)"/>
  <text x="512" y="942" text-anchor="middle" font-family="'Outfit', sans-serif" font-weight="900" font-size="26" fill="#a5f3fc">
    "Certain and Impossible are perfect opposite partners!"
  </text>
</svg>`;


// SLIDE 8: Sci-Fi Multiverse Portal + Zara + Station Badges
const slide8SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="1024" height="1024">
  <defs>
    <linearGradient id="bgGrad8" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0a0224"/>
      <stop offset="50%" stop-color="#1e074a"/>
      <stop offset="100%" stop-color="#3b0763"/>
    </linearGradient>
    <radialGradient id="portalCore" cx="50%" cy="46%" r="42%">
      <stop offset="0%" stop-color="#e9d5ff" stop-opacity="0.95"/>
      <stop offset="35%" stop-color="#c084fc" stop-opacity="0.7"/>
      <stop offset="70%" stop-color="#3b82f6" stop-opacity="0.4"/>
      <stop offset="100%" stop-color="#0a0224" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="goldText8" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#fef08a"/>
      <stop offset="100%" stop-color="#f59e0b"/>
    </linearGradient>
    <filter id="glow8">
      <feGaussianBlur stdDeviation="10" result="blur" />
      <feMerge>
        <feMergeNode in="blur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
  </defs>

  <!-- Background -->
  <rect width="1024" height="1024" fill="url(#bgGrad8)"/>
  <circle cx="512" cy="460" r="440" fill="url(#portalCore)"/>
  <g>${makeStars(160)}</g>

  <!-- Title -->
  <text x="512" y="90" text-anchor="middle" font-family="'Outfit', sans-serif" font-weight="900" font-size="44" fill="url(#goldText8)" filter="url(#glow8)" letter-spacing="2">
    STEP INTO THE SIMULATION LAB!
  </text>
  <text x="512" y="132" text-anchor="middle" font-family="sans-serif" font-weight="700" font-size="20" fill="#c084fc">
    Test Your Chance-Detective Skills Across 3 Lab Stations
  </text>

  <!-- Sci-Fi Portal Energy Rings -->
  <ellipse cx="512" cy="470" rx="360" ry="270" fill="none" stroke="#c084fc" stroke-width="7" stroke-dasharray="24 12" filter="url(#glow8)"/>
  <ellipse cx="512" cy="470" rx="290" ry="215" fill="none" stroke="#38bdf8" stroke-width="9" filter="url(#glow8)"/>
  <ellipse cx="512" cy="470" rx="220" ry="160" fill="none" stroke="#fbbf24" stroke-width="5" stroke-dasharray="16 16"/>

  <!-- Cute Blue Chibi Robot Zara Front & Center -->
  <g transform="translate(512, 450)" filter="url(#glow8)">
    <rect x="-65" y="-35" width="130" height="115" rx="32" fill="#3b82f6" stroke="#93c5fd" stroke-width="5"/>
    <rect x="-48" y="-18" width="96" height="52" rx="16" fill="#1e3a8a"/>
    <!-- Glowing LED Eyes -->
    <ellipse cx="-22" cy="8" rx="13" ry="16" fill="#60a5fa"/>
    <ellipse cx="22" cy="8" rx="13" ry="16" fill="#60a5fa"/>
    <circle cx="-18" cy="3" r="5" fill="#ffffff"/>
    <circle cx="26" cy="3" r="5" fill="#ffffff"/>
    <!-- Cute Smile -->
    <path d="M-16,24 Q0,36 16,24" stroke="#fef08a" stroke-width="4" fill="none" stroke-linecap="round"/>
    <!-- Antenna Star -->
    <line x1="0" y1="-35" x2="0" y2="-62" stroke="#93c5fd" stroke-width="6"/>
    <circle cx="0" cy="-68" r="14" fill="#fbbf24"/>
    <!-- Waving Arm -->
    <path d="M65,15 Q105,-15 115,-45" stroke="#3b82f6" stroke-width="14" stroke-linecap="round" fill="none"/>
    <circle cx="115" cy="-45" r="16" fill="#93c5fd"/>
  </g>

  <!-- Station 1 Card (Top Left) -->
  <g transform="translate(90, 240)" filter="url(#glow8)">
    <rect x="0" y="0" width="240" height="115" rx="24" fill="rgba(26,12,64,0.92)" stroke="#fbbf24" stroke-width="4"/>
    <text x="120" y="48" text-anchor="middle" font-family="sans-serif" font-weight="900" font-size="24" fill="#fef08a">
      🎒 Station 1
    </text>
    <text x="120" y="82" text-anchor="middle" font-family="sans-serif" font-weight="700" font-size="17" fill="#ffffff">
      Chance Builder
    </text>
  </g>

  <!-- Station 2 Card (Top Right) -->
  <g transform="translate(694, 240)" filter="url(#glow8)">
    <rect x="0" y="0" width="240" height="115" rx="24" fill="rgba(26,12,64,0.92)" stroke="#38bdf8" stroke-width="4"/>
    <text x="120" y="48" text-anchor="middle" font-family="sans-serif" font-weight="900" font-size="24" fill="#38bdf8">
      🧭 Station 2
    </text>
    <text x="120" y="82" text-anchor="middle" font-family="sans-serif" font-weight="700" font-size="17" fill="#ffffff">
      Event Explorer
    </text>
  </g>

  <!-- Station 3 Card (Bottom Center) -->
  <g transform="translate(392, 690)" filter="url(#glow8)">
    <rect x="0" y="0" width="240" height="115" rx="24" fill="rgba(26,12,64,0.92)" stroke="#c084fc" stroke-width="4"/>
    <text x="120" y="48" text-anchor="middle" font-family="sans-serif" font-weight="900" font-size="24" fill="#c084fc">
      🕵️ Station 3
    </text>
    <text x="120" y="82" text-anchor="middle" font-family="sans-serif" font-weight="700" font-size="17" fill="#ffffff">
      Case Solver
    </text>
  </g>

  <!-- Speech Bubble above Zara -->
  <g transform="translate(512, 195)" filter="url(#glow8)">
    <rect x="-180" y="0" width="360" height="65" rx="22" fill="#ffffff" stroke="#fbbf24" stroke-width="4"/>
    <text x="0" y="40" text-anchor="middle" font-family="sans-serif" font-weight="900" font-size="19" fill="#0f172a">
      "Ready to test your chance skills?" ✨
    </text>
  </g>

  <!-- Bottom Glass Banner -->
  <rect x="112" y="890" width="800" height="85" rx="42" fill="rgba(22, 11, 54, 0.95)" stroke="#c084fc" stroke-width="3" filter="url(#glow8)"/>
  <text x="512" y="942" text-anchor="middle" font-family="'Outfit', sans-serif" font-weight="900" font-size="26" fill="#fef08a">
    Click below to enter the interactive lab! 🧪
  </text>
</svg>`;

fs.writeFileSync(path.join(targetDir, 'slide6.svg'), slide6SVG, 'utf8');
fs.writeFileSync(path.join(targetDir, 'slide7.svg'), slide7SVG, 'utf8');
fs.writeFileSync(path.join(targetDir, 'slide8.svg'), slide8SVG, 'utf8');

console.log('Successfully updated slide6.svg, slide7.svg, slide8.svg with anime character art!');
