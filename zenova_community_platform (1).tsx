import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Gamepad2,
  Music,
  GraduationCap,
  Trophy,
  Palette,
  Camera,
  Video,
  Sparkles,
  Tv,
  BookOpen,
  MessageSquare,
  Users,
  Search,
  ExternalLink,
  ChevronRight,
  Send,
  Calendar,
  Zap,
  Flame,
  Award,
  Bell,
  X,
  Copy,
  Check,
  Share2,
  Heart,
  Volume2,
  VolumeX,
  Play,
  Compass,
  Radio,
  Sliders,
  ShieldCheck,
  Globe,
  Plus,
  Filter,
  CheckCircle2,
  HelpCircle
} from 'lucide-react';

// --- BACKGROUND NEON PARTICLE CANVAS ---
const BackgroundCanvas = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const resize = () => {
      canvas.width = canvas.parentElement.clientWidth;
      canvas.height = canvas.parentElement.clientHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Cyan and Magenta particles based on logo colors
    const colors = ['#00f0ff', '#ff007f', '#8b5cf6', '#3b82f6'];
    const particles = Array.from({ length: 45 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      radius: Math.random() * 2 + 1,
      color: colors[Math.floor(Math.random() * colors.length)],
      alpha: Math.random() * 0.6 + 0.2,
      pulse: Math.random() * 0.02 + 0.005
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw faint connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 130) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(139, 92, 246, ${0.12 * (1 - dist / 130)})`;
            ctx.lineWidth = 0.8;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw particles
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        p.alpha += p.pulse;
        if (p.alpha > 0.8 || p.alpha < 0.2) p.pulse *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.shadowBlur = 10;
        ctx.shadowColor = p.color;
        ctx.fill();
        ctx.globalAlpha = 1;
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-0" />;
};

// --- CUSTOM SVG LOGO EMBEDDED FROM USER DESIGN ---
const ZenovaLogo = ({ className = "w-10 h-10" }) => (
  <svg className={className} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="zenovaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#00f0ff" />
        <stop offset="50%" stopColor="#8b5cf6" />
        <stop offset="100%" stopColor="#ff007f" />
      </linearGradient>
      <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="6" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>
    {/* Outer Glowing Sphere Base */}
    <circle cx="100" cy="100" r="90" fill="#0f051d" stroke="url(#zenovaGrad)" strokeWidth="3" filter="url(#neonGlow)" />
    
    {/* Background Grid Lines */}
    <path d="M40 80 Q100 60 160 80 M40 120 Q100 140 160 120" stroke="#8b5cf6" strokeWidth="1" opacity="0.4" />
    
    {/* Graduation Cap Icon on Z */}
    <path d="M35 80 L65 65 L95 80 L65 95 Z" fill="none" stroke="#00f0ff" strokeWidth="3" filter="url(#neonGlow)" />
    <path d="M45 86 V98 C45 102 85 102 85 98 V86" fill="none" stroke="#00f0ff" strokeWidth="2" />
    <path d="M88 80 V105 L92 108" stroke="#00f0ff" strokeWidth="2" />

    {/* Gaming Mouse / Ghost in O */}
    <path d="M98 118 C92 118 88 123 88 132 C88 142 112 142 112 132 C112 123 108 118 98 118 Z" fill="none" stroke="#ff007f" strokeWidth="2.5" filter="url(#neonGlow)" />
    <circle cx="94" cy="125" r="1.5" fill="#00f0ff" />
    <circle cx="102" cy="125" r="1.5" fill="#00f0ff" />

    {/* ZENOVA Futuristic Typography Outline */}
    <text x="100" y="112" textAnchor="middle" fill="none" stroke="#00f0ff" strokeWidth="3" fontSize="28" fontFamily="monospace" fontWeight="900" letterSpacing="2">
      ZENOVA
    </text>
    <text x="100" y="112" textAnchor="middle" fill="#ffffff" fontSize="28" fontFamily="monospace" fontWeight="900" letterSpacing="2">
      ZENOVA
    </text>
  </svg>
);

// --- MAIN APPLICATION COMPONENT ---
export default function App() {
  // Navigation & Modal States
  const [activeTab, setActiveTab] = useState('home'); // home, hubs, categories, events, showcase, leaderboard
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [joinModalOpen, setJoinModalOpen] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState(1);
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [copiedLink, setCopiedLink] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [quizScore, setQuizScore] = useState(null);
  const [ambientAudio, setAmbientAudio] = useState(false);

  // Social Links Platform Data
  const platformHubs = [
    {
      id: 'discord',
      name: 'Discord Megaserver',
      type: 'Primary Hub & Voice Lounge',
      members: '24,850+ Online',
      desc: '24/7 active voice channels, live esports matches, beats lounge & gaming parties.',
      color: 'from-indigo-600 to-purple-600',
      borderColor: 'border-indigo-500/50',
      glowColor: 'shadow-indigo-500/30',
      iconColor: '#5865F2',
      link: 'https://discord.gg/PgyN5R7cwW',
      badge: 'Main Core',
      features: ['24/7 Voice Rooms', 'Custom Bot Games', 'Stage Talk Shows']
    },
    {
      id: 'whatsapp',
      name: 'WhatsApp Community',
      type: 'Announcements & Local Groups',
      members: '12,400+ Members',
      desc: 'Instant updates, daily memes, local sports meetup chats, and sub-group channels.',
      color: 'from-emerald-600 to-teal-600',
      borderColor: 'border-emerald-500/50',
      glowColor: 'shadow-emerald-500/30',
      iconColor: '#25D366',
      link: 'https://chat.whatsapp.com/EfS2OX1h8B56gTTqKe7oTs',
      badge: 'Instant Alert',
      features: ['Direct Mobile Updates', 'Sub-Interest Chats', 'Instant Polls']
    },
    {
      id: 'instagram',
      name: 'Instagram Channel & Group',
      type: 'Broadcasting & Visual Highlights',
      members: '38.5k Followers',
      desc: 'Weekly member highlight reels, photography contests, and direct channel broadcasts.',
      color: 'from-pink-600 via-purple-600 to-amber-500',
      borderColor: 'border-pink-500/50',
      glowColor: 'shadow-pink-500/30',
      iconColor: '#E1306C',
      link: 'https://www.instagram.com/0zenova0/',
      badge: 'Visual Hub',
      features: ['Daily Highlights', 'Behind-the-Scenes', 'Member Spotlights']
    },
    {
      id: 'tiktok',
      name: 'TikTok Group & Channel',
      type: 'Short Clips & Anime Edits',
      members: '52.1k Followers',
      desc: 'Trending gaming highlights, anime edits, short tutorials, and creative challenges.',
      color: 'from-cyan-500 via-slate-900 to-rose-500',
      borderColor: 'border-cyan-500/50',
      glowColor: 'shadow-cyan-500/30',
      iconColor: '#00f0ff',
      link: 'https://www.tiktok.com/@0zenova0?_r=1&_t=ZS-9AnWQf9GyqQ',
      badge: 'Trending Content',
      features: ['Esports Clips', 'Manhwa Reviews', 'Speed Arts']
    },
    {
      id: 'facebook',
      name: 'Facebook Group & Page',
      type: 'Long-form Discussions & Events',
      members: '18.9k Members',
      desc: 'Community forums, trade/buy-sell zones, event RSVP, and educational guides.',
      color: 'from-blue-600 to-indigo-700',
      borderColor: 'border-blue-500/50',
      glowColor: 'shadow-blue-500/30',
      iconColor: '#1877F2',
      link: 'https://www.facebook.com/share/g/19yaTZG1Du/',
      badge: 'Forum Lounge',
      features: ['Guides & Articles', 'Community Events', 'Big Discussions']
    }
  ];

  // Categories / Interest Spheres
  const categories = [
    {
      id: 'gaming',
      title: 'Gaming & Esports',
      icon: Gamepad2,
      color: 'from-cyan-500 to-blue-600',
      textColor: 'text-cyan-400',
      bgGlow: 'shadow-cyan-500/20',
      count: '8,420 Active',
      description: 'LFG lobbies, Valorant/CS2 scrims, casual party games, and tournament brackets.',
      topics: ['Valorant Scrims', 'Genshin / Star Rail', 'Minecraft SMP', 'Console & PC Lounge'],
      subChannels: ['#lfg-ranked', '#clips-and-highlights', '#tournaments', '#patch-notes']
    },
    {
      id: 'music',
      title: 'Music & Beats',
      icon: Music,
      color: 'from-purple-500 to-pink-600',
      textColor: 'text-purple-400',
      bgGlow: 'shadow-purple-500/20',
      count: '3,110 Active',
      description: 'Music production feedback, beatmaking jams, live listening parties, and vocal covers.',
      topics: ['Beat Lab', 'Vocal Covers', 'Music Production', 'Genre Lounge'],
      subChannels: ['#producer-corner', '#jam-sessions', '#listening-party', '#song-critique']
    },
    {
      id: 'education',
      title: 'Education & Tech',
      icon: GraduationCap,
      color: 'from-blue-500 to-indigo-600',
      textColor: 'text-blue-400',
      bgGlow: 'shadow-blue-500/20',
      count: '4,520 Active',
      description: 'Silent study sessions, coding help, AI research, academic resources, and career growth.',
      topics: ['Coding & WebDev', 'AI & Data Science', 'Study Buddy LFG', 'Language Exchange'],
      subChannels: ['#coding-help', '#study-pomodoro', '#resource-library', '#tech-news']
    },
    {
      id: 'sports',
      title: 'Sports & Fitness',
      icon: Trophy,
      color: 'from-amber-500 to-orange-600',
      textColor: 'text-amber-400',
      bgGlow: 'shadow-amber-500/20',
      count: '2,890 Active',
      description: 'Live match watch parties, football/basketball banter, fitness goals, and workout tips.',
      topics: ['Football / Soccer', 'NBA & Basketball', 'Fitness & Calisthenics', 'F1 Racing'],
      subChannels: ['#match-day-chat', '#gym-motivation', '#f1-paddock', '#fantasy-league']
    },
    {
      id: 'creativity',
      title: 'Creativity & Digital Art',
      icon: Palette,
      color: 'from-pink-500 to-rose-600',
      textColor: 'text-pink-400',
      bgGlow: 'shadow-pink-500/20',
      count: '3,840 Active',
      description: '3D modeling, Blender, UI/UX design, concept art showcases, and monthly art prompts.',
      topics: ['Digital Illustration', '3D & Blender', 'UI/UX Design', 'Concept Art'],
      subChannels: ['#art-showcase', '#critique-corner', '#monthly-contest', '#design-assets']
    },
    {
      id: 'photography',
      title: 'Photography & Optics',
      icon: Camera,
      color: 'from-teal-500 to-emerald-600',
      textColor: 'text-teal-400',
      bgGlow: 'shadow-teal-500/20',
      count: '2,150 Active',
      description: 'Lightroom presets, camera gear reviews, street photography, and weekly photo prompts.',
      topics: ['Street & Urban', 'Portrait Photography', 'Presets & Grading', 'Gear & Lenses'],
      subChannels: ['#photo-of-the-day', '#gear-discussion', '#preset-sharing', '#raw-edits']
    },
    {
      id: 'videography',
      title: 'Videography & Editing',
      icon: Video,
      color: 'from-rose-500 to-red-600',
      textColor: 'text-rose-400',
      bgGlow: 'shadow-rose-500/20',
      count: '1,980 Active',
      description: 'After Effects, Premiere Pro, color grading, VFX breakdowns, and YouTube creator tips.',
      topics: ['AMV & Edits', 'Color Grading', 'VFX & Motion Graphics', 'Short-form Reels'],
      subChannels: ['#edit-showcase', '#project-feedback', '#vfx-lab', '#transitions-hub']
    },
    {
      id: 'anime',
      title: 'Anime & Manga',
      icon: Tv,
      color: 'from-violet-500 to-purple-700',
      textColor: 'text-violet-400',
      bgGlow: 'shadow-violet-500/20',
      count: '6,730 Active',
      description: 'Weekly episode reactions, seasonal tier lists, cosplay showcases, and watch-alongs.',
      topics: ['Seasonal Anime', 'Jujutsu Kaisen / Demon Slayer', 'Cosplay Lounge', 'OSTs & Openings'],
      subChannels: ['#anime-spoilers', '#watch-party', '#cosplay-gallery', '#recommendations']
    },
    {
      id: 'manhwa',
      title: 'Manhwa & Webtoons',
      icon: BookOpen,
      color: 'from-fuchsia-500 to-pink-700',
      textColor: 'text-fuchsia-400',
      bgGlow: 'shadow-fuchsia-500/20',
      count: '4,120 Active',
      description: 'Solo Leveling, Tower of God chapter drops, hidden gem webtoons, and theory crafting.',
      topics: ['Action & Necromancy', 'Romance & Villainess', 'Cultivation & Murim', 'Raw Scans Discussion'],
      subChannels: ['#chapter-drops', '#hidden-gems', '#theory-crafting', '#manhwa-recommendations']
    },
    {
      id: 'fun',
      title: 'Fun & Chill Lounge',
      icon: Sparkles,
      color: 'from-yellow-400 to-amber-600',
      textColor: 'text-yellow-400',
      bgGlow: 'shadow-yellow-500/20',
      count: '9,500+ Active',
      description: 'Memes, daily trivia mini-games, pet photos, late-night shower thoughts, and casual banter.',
      topics: ['Meme Vault', 'Pet Showcase', 'Trivia & Bots', 'Late Night Lounge'],
      subChannels: ['#memes-only', '#pet-pics', '#daily-trivia', '#general-chill']
    }
  ];

  // Upcoming Community Events
  const events = [
    {
      id: 1,
      title: 'ZENOVA Valorant 5v5 Cyber Cup',
      category: 'Gaming',
      date: 'COMING SOON',
      platform: 'Discord Voice & Twitch',
      prize: 'UPCOMING',
      attendees: ...,
      tag: 'Tournament'
    },
    {
      id: 2,
      title: 'Anime Stream Night',
      category: 'Anime',
      date: 'COMING SOON',
      platform: 'Discord Stage Room',
      prize: 'UPCOMING',
      attendees: ...,
      tag: 'Watch Party'
    },
    {
      id: 3,
      title: 'Neon Cyberpunk Art Contest',
      category: 'Creativity',
      date: 'COMING SOON',
      platform: 'Instagram & Discord #art-showcase',
      prize: 'UPCOMING',
      attendees: ...,
      tag: 'Contest'
    },
    {
      id: 4,
      title: 'Music Producer Beat Battle & Vocal Jam',
      category: 'Music',
      date: 'COMING SOON',
      platform: 'WhatsApp Live & Discord VC',
      prize: 'UPCOMING',
      attendees: ...,
      tag: 'Live Session'
    },
    {
      id: 5,
      title: 'League Of Legends',
      category: 'Gaming',
      date: 'COMING SOON',
      platform: 'Twitch & Discord VC',
      prize: 'UPCOMING',
      attendees: ...,
      tag: 'Live Session'
    },
    {
      id: 6,
      title: 'Marvel Viral',
      category: 'Gaming',
      date: 'COMING SOON',
      platform: 'Twitch & Discord VC',
      prize: 'UPCOMING',
      attendees: ...,
      tag: 'Live Session'
    },
    {
      id: 7,
      title: 'Overwatch',
      category: 'Gaming',
      date: 'COMING SOON',
      platform: 'Twitch & Discord VC',
      prize: 'UPCOMING',
      attendees: ...,
      tag: 'Live Session'
    }
  ];

  // Community Showcase Feed Data
  const showcases = [
    {
      id: 1,
      author: 'Cherine',
      avatar: 'https://www.image2url.com/r2/default/images/1792938055292-42099eef-1b66-49c9-a277-dbba14b9617b.jpeg',
      badge: 'Creativity Master',
      title: 'Making of Bookmark',
      category: 'Creativity',
      likes: 0,
      comments: 0,
      image: 'https://www.image2url.com/r2/default/images/1792937753804-02ba3104-51da-4d2c-830b-f924f3d59c00.jpeg',
      time: 'UPCOMING'
    },
    {
      id: 2,
      author: 'Zenor',
      avatar: 'https://www.image2url.com/r2/default/images/1792937198393-0ac46d0e-ccdc-46b6-a930-ecebf64fa1fc.webp',
      badge: 'Music Lead',
      title: 'The Art of Music',
      category: 'Music',
      likes: 0,
      comments: 0,
      image: 'https://www.image2url.com/r2/default/images/1792936920830-63592b58-bef2-47fa-a8a2-5ec858683855.jpg',
      time: 'UPCOMING'
    },
    {
      id: 3,
      author: 'Vash',
      avatar: 'https://www.image2url.com/r2/default/images/1792936284915-4defe23f-3562-4a84-9b6d-4172f6486603.jpg',
      badge: 'Gaming Elite',
      title: 'Dying Light',
      category: 'Gaming',
      likes: 0,
      comments: 0,
      image: 'https://www.image2url.com/r2/default/images/1792936615072-ad3b8052-a123-409c-90c3-c8a6d1956e16.jpg',
      time: 'UPCOMING'
    }
  ];

  // Operation Team
  const Operatiomteam = [
    { name: 'Zenor', role: 'Owner/Founder', category: 'Music', badge: '👑' },
    { name: 'Pink Rose', role: 'Administrator', category: 'Gaming', badge: '⚜️' },
    { name: 'Vash', role: 'Moderator', category: 'Gaming', badge: '⚙️' },
    { name: 'Zoro', role: 'Moderator', category: 'Anime', badge: '⚙️' },
    { name: 'Zenin Toji', role: 'Moderator', category: 'Gaming', badge: '⚙️' },
    { name: 'Mao', role: 'Helper', category: 'Gaming', badge: '🔗' },
    { name: 'Cherine', role: 'Helper', category: 'Creativity', badge: '🔗' },
    { name: 'Batman', role: 'Helper', category: 'Gaming', badge: '🔗' },
    { name: 'Gamster', role: 'Helper', category: 'Gaming', badge: '🔗' },
    { name: 'Hamster', role: 'Helper', category: 'Gaming', badge: '🔗' }
  ];

  // Copy Link Helper
  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedLink(id);
    setTimeout(() => setCopiedLink(null), 2000);
  };

  // Filter Categories
  const filteredCategories = useMemo(() => {
    return categories.filter((cat) => {
      const matchesSearch = cat.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cat.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cat.topics.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesSearch;
    });
  }, [searchQuery]);

  // Quiz handler for onboarding or fun lounge
  const handleQuizAnswer = (sphere) => {
    setQuizScore(sphere);
  };

  return (
    <div className="min-h-screen bg-[#07020d] text-gray-100 flex flex-col font-sans relative overflow-x-hidden selection:bg-cyan-500 selection:text-black">
      {/* Background Interactive Particle Mesh */}
      <BackgroundCanvas />

      {/* Ambient Top Glow Orbs matching Logo Palette */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-20 right-1/4 w-[500px] h-[500px] bg-pink-500/10 rounded-full blur-[140px] pointer-events-none" />

      {/* TOP NAVIGATION HEADER */}
      <header className="sticky top-0 z-40 bg-[#0c041a]/80 backdrop-blur-2xl border-b border-purple-900/40 px-4 lg:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div 
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="relative">
              <ZenovaLogo className="w-10 h-10 group-hover:scale-105 transition-transform" />
              <div className="absolute -inset-1 bg-cyan-500/30 rounded-full blur group-hover:bg-pink-500/40 transition-all opacity-70" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-300 to-pink-500 font-mono">
                  ZENOVA
                </span>
                <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/40 text-cyan-400 tracking-wider">
                  COMMUNITY
                </span>
              </div>
              <p className="text-[10px] text-gray-400 font-mono">The Ultimate Cyber Realm</p>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1 bg-purple-950/30 border border-purple-800/30 rounded-full p-1 text-xs font-medium">
            {[
              { id: 'home', label: 'Home Hub', icon: Compass },
              { id: 'hubs', label: 'Social Hubs', icon: Globe },
              { id: 'categories', label: '10 Interest Spheres', icon: Sliders },
              { id: 'events', label: 'Events & Battles', icon: Calendar },
              { id: 'showcase', label: 'Creative Showcase', icon: Flame },
              { id: 'operation', label: 'Operation Team', icon: Interlocking Gears Symbol },
            ].map((nav) => {
              const Icon = nav.icon;
              const isActive = activeTab === nav.id;
              return (
                <button
                  key={nav.id}
                  onClick={() => setActiveTab(nav.id)}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold shadow-lg shadow-cyan-500/20'
                      : 'text-gray-400 hover:text-white hover:bg-purple-900/30'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {nav.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setAmbientAudio(!ambientAudio)}
            className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-mono transition-all ${
              ambientAudio
                ? 'border-cyan-500/60 bg-cyan-950/40 text-cyan-400 shadow-sm shadow-cyan-500/30'
                : 'border-purple-800/40 bg-purple-950/30 text-gray-400 hover:text-white'
            }`}
          >
            {ambientAudio ? <Volume2 className="w-3.5 h-3.5 text-cyan-400 animate-pulse" /> : <VolumeX className="w-3.5 h-3.5" />}
            <span>{ambientAudio ? 'NEON SOUND ON' : 'AMBIENT MUTE'}</span>
          </button>

          <button
            onClick={() => {
              setOnboardingStep(1);
              setJoinModalOpen(true);
            }}
            className="flex items-center gap-2 px-5 py-2 rounded-full font-bold text-xs bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 text-black hover:opacity-95 shadow-lg shadow-pink-500/25 transition-all hover:scale-105"
          >
            <Zap className="w-4 h-4 fill-black" />
            <span>JOIN ZENOVA</span>
          </button>
        </div>
      </header>

      {/* MAIN CONTENT ROUTER AREA */}
      <main className="flex-1 relative z-10 max-w-7xl w-full mx-auto p-4 lg:p-8 space-y-12">
        
        {/* TAB 1: HERO & HOME OVERVIEW */}
        {activeTab === 'home' && (
          <div className="space-y-12">
            {/* HERO BANNER SECTION */}
            <div className="relative rounded-3xl bg-gradient-to-br from-purple-950/70 via-slate-900/80 to-[#120524]/90 border border-purple-800/50 p-6 lg:p-12 overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-cyan-500/20 via-pink-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />
              
              <div className="max-w-3xl space-y-6 relative z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-xs font-mono font-semibold">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                  <span>24,850+ Active Cyber Members</span>
                </div>

                <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-tight font-sans">
                  WHERE CREATORS, GAMERS & SCHOLARS{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-500">
                    UNITE IN ZENOVA
                  </span>
                </h1>

                <p className="text-gray-300 text-sm sm:text-base leading-relaxed max-w-2xl">
                  Step into the next-gen mega community hub. Whether you are climbing esports ranks, producing beats, coding algorithms, discussing weekly Manhwa chapters, or snapping aesthetic photos — ZENOVA is your ultimate home across Discord, WhatsApp, Instagram, TikTok & Facebook.
                </p>

                {/* Quick Join CTA Buttons */}
                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <button
                    onClick={() => {
                      setOnboardingStep(1);
                      setJoinModalOpen(true);
                    }}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl font-extrabold text-sm bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 text-slate-950 hover:opacity-95 shadow-xl shadow-cyan-500/20 transition-all hover:scale-105"
                  >
                    <Users className="w-4 h-4" />
                    <span>Get Instant Platform Invites</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('categories')}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm bg-purple-950/60 hover:bg-purple-900/60 border border-purple-700/50 text-white transition-all"
                  >
                    <Compass className="w-4 h-4 text-cyan-400" />
                    <span>Explore 10 Spheres</span>
                  </button>
                </div>

                {/* Stats Counters */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-purple-900/40">
                  <div>
                    <div className="text-2xl font-black font-mono text-cyan-400">10 SPHERES</div>
                    <div className="text-xs text-gray-400">Tailored Interests</div>
                  </div>
                  <div>
                    <div className="text-2xl font-black font-mono text-pink-400">5 PLATFORMS</div>
                    <div className="text-xs text-gray-400">Synced Socials</div>
                  </div>
                  <div>
                    <div className="text-2xl font-black font-mono text-purple-400">24/7 VOICE</div>
                    <div className="text-xs text-gray-400">Active Voice Lounges</div>
                  </div>
                  <div>
                    <div className="text-2xl font-black font-mono text-yellow-400">$2,500+</div>
                    <div className="text-xs text-gray-400">Monthly Tournament Prizes</div>
                  </div>
                </div>
              </div>
            </div>

            {/* OFFICIAL SOCIAL HUBS SUMMARY CARDS */}
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <div>
                  <h2 className="text-2xl font-black text-white flex items-center gap-2">
                    <Globe className="w-6 h-6 text-cyan-400" />
                    Official Social Community Links
                  </h2>
                  <p className="text-xs text-gray-400">Connect through your favorite social media platform groups & channels.</p>
                </div>
                <button
                  onClick={() => setActiveTab('hubs')}
                  className="text-xs font-mono font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                >
                  View All Hubs <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {platformHubs.slice(0, 3).map((hub) => (
                  <div
                    key={hub.id}
                    className={`p-5 rounded-2xl bg-purple-950/20 backdrop-blur-xl border ${hub.borderColor} shadow-lg ${hub.glowColor} space-y-4 flex flex-col justify-between hover:translate-y-[-2px] transition-all`}
                  >
                    <div className="space-y-2">
                      <div className="flex justify-between items-start">
                        <span className="px-2.5 py-0.5 rounded-full bg-purple-900/50 border border-purple-700/40 text-[10px] font-mono text-cyan-300">
                          {hub.badge}
                        </span>
                        <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          {hub.members}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-white">{hub.name}</h3>
                      <p className="text-xs text-gray-300 leading-relaxed">{hub.desc}</p>
                    </div>

                    <div className="pt-3 border-t border-purple-900/40 flex items-center justify-between gap-2">
                      <button
                        onClick={() => copyToClipboard(hub.link, hub.id)}
                        className="p-2 rounded-lg bg-purple-900/40 hover:bg-purple-800/40 text-gray-300 text-xs flex items-center gap-1.5 font-mono"
                      >
                        {copiedLink === hub.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        {copiedLink === hub.id ? 'Copied' : 'Copy Link'}
                      </button>

                      <a
                        href={hub.link}
                        target="_blank"
                        rel="noreferrer"
                        className="px-4 py-2 rounded-lg font-bold text-xs bg-gradient-to-r from-cyan-500 to-purple-600 text-white flex items-center gap-1.5 hover:opacity-90 transition-opacity"
                      >
                        <span>Join Hub</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* FEATURED SPHERES CATEGORIES PREVIEW */}
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <div>
                  <h2 className="text-2xl font-black text-white flex items-center gap-2">
                    <Sliders className="w-6 h-6 text-pink-400" />
                    Featured Interest Spheres
                  </h2>
                  <p className="text-xs text-gray-400">Join dedicated sub-channels based on what you love.</p>
                </div>
                <button
                  onClick={() => setActiveTab('categories')}
                  className="text-xs font-mono font-bold text-pink-400 hover:text-pink-300 flex items-center gap-1"
                >
                  Browse All 10 <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {categories.slice(0, 4).map((cat) => {
                  const Icon = cat.icon;
                  return (
                    <div
                      key={cat.id}
                      onClick={() => {
                        setSelectedCategory(cat);
                        setActiveTab('categories');
                      }}
                      className="p-5 rounded-2xl bg-purple-950/20 backdrop-blur-xl border border-purple-800/40 hover:border-cyan-500/50 cursor-pointer transition-all hover:scale-[1.02] space-y-3 group"
                    >
                      <div className="flex justify-between items-center">
                        <div className={`p-2.5 rounded-xl bg-gradient-to-br ${cat.color} text-black font-bold`}>
                          <Icon className="w-5 h-5 text-slate-950" />
                        </div>
                        <span className="text-[10px] font-mono text-cyan-400">{cat.count}</span>
                      </div>
                      <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">{cat.title}</h3>
                      <p className="text-xs text-gray-400 line-clamp-2">{cat.description}</p>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {cat.topics.slice(0, 2).map((top, idx) => (
                          <span key={idx} className="text-[9px] font-mono px-2 py-0.5 rounded bg-purple-900/40 text-purple-200 border border-purple-800/30">
                            {top}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* LIVE QUIZ & CHILL INTERACTIVE SECTION */}
            <div className="p-6 rounded-3xl bg-gradient-to-r from-purple-950/60 via-slate-900/90 to-pink-950/60 border border-purple-800/50 flex flex-col lg:flex-row items-center justify-between gap-6">
              <div className="space-y-3 max-w-xl">
                <div className="inline-flex items-center gap-1.5 text-xs font-mono text-yellow-400 bg-yellow-950/40 border border-yellow-800/50 px-2.5 py-1 rounded-full">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Interactive Sphere Matcher</span>
                </div>
                <h3 className="text-2xl font-bold text-white">Unsure where to start in ZENOVA?</h3>
                <p className="text-xs text-gray-300 leading-relaxed">
                  Take a quick 10-second quiz to match your vibe with the right ZENOVA interest sphere and get direct social group links!
                </p>

                {quizScore ? (
                  <div className="p-4 rounded-xl bg-cyan-950/60 border border-cyan-500/40 text-xs text-cyan-200 space-y-2">
                    <div className="font-bold text-cyan-400">✨ Recommended Matched Sphere: {quizScore}</div>
                    <p>You belong in our top active Voice & Discord sub-hubs!</p>
                    <button
                      onClick={() => setQuizScore(null)}
                      className="text-[10px] underline text-gray-400 hover:text-white"
                    >
                      Reset Quiz
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2 pt-2">
                    <button
                      onClick={() => handleQuizAnswer('Gaming & Esports')}
                      className="px-3 py-1.5 rounded-lg bg-purple-900/50 hover:bg-cyan-500 hover:text-black border border-purple-700/40 text-xs font-semibold transition-all"
                    >
                      🎮 Competitive Gamer
                    </button>
                    <button
                      onClick={() => handleQuizAnswer('Music & Beats')}
                      className="px-3 py-1.5 rounded-lg bg-purple-900/50 hover:bg-pink-500 hover:text-black border border-purple-700/40 text-xs font-semibold transition-all"
                    >
                      🎵 Music Producer
                    </button>
                    <button
                      onClick={() => handleQuizAnswer('Anime & Manhwa')}
                      className="px-3 py-1.5 rounded-lg bg-purple-900/50 hover:bg-violet-500 hover:text-black border border-purple-700/40 text-xs font-semibold transition-all"
                    >
                      🌸 Anime & Webtoons Reader
                    </button>
                  </div>
                )}
              </div>

              <div className="p-4 rounded-2xl bg-black/40 border border-purple-800/40 text-center space-y-2 max-w-xs w-full">
                <ZenovaLogo className="w-12 h-12 mx-auto animate-pulse" />
                <div className="text-xs font-bold text-white">ZENOVA Live Radio & Chill</div>
                <div className="text-[10px] text-gray-400 font-mono">Lo-Fi & Synthwave Streaming 24/7</div>
                <button
                  onClick={() => setAmbientAudio(!ambientAudio)}
                  className="w-full py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-500 to-purple-600 text-white flex items-center justify-center gap-2"
                >
                  <Radio className="w-3.5 h-3.5" />
                  {ambientAudio ? 'Stop Radio Stream' : 'Play ZENOVA Beats'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: OFFICIAL SOCIAL PLATFORM HUBS */}
        {activeTab === 'hubs' && (
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-3xl font-black text-white flex items-center gap-3">
                <Globe className="w-7 h-7 text-cyan-400" />
                Official Social Platform Links
              </h2>
              <p className="text-sm text-gray-400">
                ZENOVA operates across 5 primary social ecosystems. Join your preferred platform or sync with all of them for complete access!
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {platformHubs.map((hub) => (
                <div
                  key={hub.id}
                  className={`p-6 rounded-3xl bg-purple-950/20 backdrop-blur-xl border ${hub.borderColor} shadow-xl ${hub.glowColor} space-y-5 flex flex-col justify-between`}
                >
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="px-3 py-1 rounded-full bg-purple-900/60 border border-purple-700/50 text-xs font-mono text-cyan-300 font-bold">
                        {hub.badge}
                      </span>
                      <span className="text-xs font-mono text-emerald-400 flex items-center gap-1.5 font-bold">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        {hub.members}
                      </span>
                    </div>

                    <h3 className="text-2xl font-bold text-white">{hub.name}</h3>
                    <div className="text-xs font-mono text-gray-400">{hub.type}</div>
                    <p className="text-xs text-gray-300 leading-relaxed">{hub.desc}</p>

                    <div className="space-y-2 pt-2">
                      <div className="text-[11px] font-mono text-gray-400 uppercase tracking-wider">Key Features:</div>
                      <div className="flex flex-wrap gap-2">
                        {hub.features.map((feat, i) => (
                          <span key={i} className="text-xs px-2.5 py-1 rounded-lg bg-black/40 border border-purple-800/40 text-purple-200">
                            ✓ {feat}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-purple-900/40 flex items-center justify-between gap-3">
                    <button
                      onClick={() => copyToClipboard(hub.link, hub.id)}
                      className="px-4 py-2.5 rounded-xl bg-purple-900/50 hover:bg-purple-800/50 text-gray-200 text-xs font-mono flex items-center gap-2"
                    >
                      {copiedLink === hub.id ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                      {copiedLink === hub.id ? 'Invite Copied!' : 'Copy Direct Link'}
                    </button>

                    <a
                      href={hub.link}
                      target="_blank"
                      rel="noreferrer"
                      className="px-6 py-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 text-black flex items-center gap-2 hover:scale-105 transition-all shadow-lg shadow-cyan-500/20"
                    >
                      <span>Join Official Link</span>
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: 10 INTEREST SPHERES & SUB-CHANNELS */}
        {activeTab === 'categories' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-3xl font-black text-white flex items-center gap-3">
                  <Sliders className="w-7 h-7 text-pink-400" />
                  10 ZENOVA Interest Spheres
                </h2>
                <p className="text-sm text-gray-400">Discover sub-communities and active chat rooms dedicated to your passions.</p>
              </div>

              {/* Search Bar */}
              <div className="relative max-w-xs w-full">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search spheres or topics..."
                  className="w-full bg-purple-950/30 border border-purple-800/50 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCategories.map((cat) => {
                const Icon = cat.icon;
                return (
                  <div
                    key={cat.id}
                    className="p-6 rounded-3xl bg-purple-950/20 backdrop-blur-xl border border-purple-800/40 hover:border-cyan-500/50 transition-all space-y-4 flex flex-col justify-between group"
                  >
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <div className={`p-3 rounded-2xl bg-gradient-to-br ${cat.color} text-black font-bold`}>
                          <Icon className="w-6 h-6 text-slate-950" />
                        </div>
                        <span className="text-xs font-mono text-cyan-400 bg-cyan-950/60 border border-cyan-800 px-2.5 py-1 rounded-full">
                          {cat.count}
                        </span>
                      </div>

                      <h3 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors">{cat.title}</h3>
                      <p className="text-xs text-gray-300 leading-relaxed">{cat.description}</p>

                      <div className="space-y-2 pt-2">
                        <div className="text-[10px] font-mono text-gray-400 uppercase tracking-wider">Sub-Channels:</div>
                        <div className="flex flex-wrap gap-1.5">
                          {cat.subChannels.map((sub, i) => (
                            <span key={i} className="text-xs font-mono px-2 py-1 rounded bg-black/50 border border-purple-800/40 text-cyan-300">
                              {sub}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-purple-900/40 flex items-center justify-between">
                      <button
                        onClick={() => {
                          setSelectedCategory(cat);
                          setJoinModalOpen(true);
                        }}
                        className="w-full py-2.5 rounded-xl font-bold text-xs bg-purple-900/50 hover:bg-cyan-500 hover:text-black border border-purple-700/50 text-white transition-all flex items-center justify-center gap-2"
                      >
                        <span>Join {cat.title} Hub</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 4: UPCOMING EVENTS & BATTLES */}
        {activeTab === 'events' && (
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-3xl font-black text-white flex items-center gap-3">
                <Calendar className="w-7 h-7 text-amber-400" />
                Community Tournaments & Stream Events
              </h2>
              <p className="text-sm text-gray-400">RSVP for weekly gaming cups, anime watch-alongs, beat battles, and art contests.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {events.map((evt) => (
                <div
                  key={evt.id}
                  className="p-6 rounded-3xl bg-purple-950/20 backdrop-blur-xl border border-purple-800/40 hover:border-amber-500/50 transition-all space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="px-3 py-1 rounded-full bg-amber-950/60 border border-amber-800/60 text-xs font-mono text-amber-300 font-bold">
                        {evt.tag}
                      </span>
                      <span className="text-xs font-mono text-cyan-400">{evt.category}</span>
                    </div>

                    <h3 className="text-xl font-bold text-white">{evt.title}</h3>

                    <div className="space-y-1.5 text-xs text-gray-300 font-mono">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-amber-400" />
                        <span>{evt.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Radio className="w-4 h-4 text-cyan-400" />
                        <span>Location: {evt.platform}</span>
                      </div>
                      <div className="flex items-center gap-2 text-emerald-400 font-bold">
                        <Trophy className="w-4 h-4" />
                        <span>Prize: {evt.prize}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-purple-900/40 flex items-center justify-between">
                    <span className="text-xs text-gray-400 font-mono">{evt.attendees} Members Attending</span>
                    <button
                      onClick={() => setJoinModalOpen(true)}
                      className="px-5 py-2 rounded-xl font-bold text-xs bg-gradient-to-r from-amber-500 to-orange-600 text-slate-950 flex items-center gap-2 hover:scale-105 transition-all shadow-md shadow-amber-500/20"
                    >
                      <Bell className="w-3.5 h-3.5" />
                      <span>Set Event Reminder</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: COMMUNITY CREATIVE SHOWCASE */}
        {activeTab === 'showcase' && (
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-3xl font-black text-white flex items-center gap-3">
                <Flame className="w-7 h-7 text-pink-500" />
                Community Showcase Feed
              </h2>
              <p className="text-sm text-gray-400">Discover top fan arts, beat clips, esports highlights, and photography from ZENOVA members.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {showcases.map((post) => (
                <div key={post.id} className="rounded-3xl bg-purple-950/20 border border-purple-800/40 overflow-hidden space-y-3 flex flex-col justify-between">
                  <div className="relative h-48 w-full overflow-hidden">
                    <img src={post.image} alt={post.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                    <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md text-[10px] font-mono text-cyan-300 border border-cyan-500/40">
                      {post.category}
                    </span>
                  </div>

                  <div className="p-4 space-y-3">
                    <div className="flex items-center gap-3">
                      <img src={post.avatar} alt={post.author} className="w-8 h-8 rounded-full border border-cyan-400 object-cover" />
                      <div>
                        <div className="text-xs font-bold text-white flex items-center gap-1.5">
                          {post.author}
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-purple-900 text-pink-300 font-mono">{post.badge}</span>
                        </div>
                        <div className="text-[10px] text-gray-500 font-mono">{post.time}</div>
                      </div>
                    </div>

                    <h4 className="text-sm font-bold text-white">{post.title}</h4>

                    <div className="flex items-center justify-between text-xs text-gray-400 pt-2 border-t border-purple-900/40 font-mono">
                      <button className="flex items-center gap-1 hover:text-pink-400">
                        <Heart className="w-4 h-4 text-pink-500" />
                        <span>{post.likes}</span>
                      </button>
                      <button className="flex items-center gap-1 hover:text-cyan-400">
                        <MessageSquare className="w-4 h-4 text-cyan-400" />
                        <span>{post.comments} Comments</span>
                      </button>
                      <button className="hover:text-white">
                        <Share2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: OPERATION TEAM */}
        {activeTab === 'operation team' && (
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-3xl font-black text-white flex items-center gap-3">
                <Award className="w-7 h-7 text-yellow-400" />
                ZENOVA Operation Team
              </h2>
              <p className="text-sm text-gray-400">Earn XP by participating in voice chats, sub-channel discussions, and monthly events.</p>
            </div>

            <div className="p-6 rounded-3xl bg-purple-950/20 backdrop-blur-xl border border-purple-800/40 space-y-4">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-gray-300">
                  <thead className="bg-purple-950/60 font-mono text-gray-400 uppercase text-[10px] border-b border-purple-800/60">
                    <tr>
                      <th className="p-4">Member</th>
                      <th className="p-4">Primary Sphere</th>
                      <th className="p-4">Special Title</th>
                      <th className="p-4">Activity XP</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-purple-900/40 font-mono">
                    {topMembers.map((m) =>
                        <td className="p-4 text-base font-bold font-mono text-amber-400">{m.badge} #{m.rank}</td>
                        <td className="p-4 text-white font-bold">{m.name}</td>
                        <td className="p-4 text-cyan-400">{m.category}</td>
                        <td className="p-4">
                          <span className="px-2.5 py-1 rounded bg-purple-900/60 border border-purple-700 text-purple-300 text-[10px]">
                            {m.role}
                          </span>
                        </td>
                        <td className="p-4 text-emerald-400 font-bold">{m.xp}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* FOOTER SECTION */}
      <footer className="mt-16 border-t border-purple-900/40 bg-[#080212]/90 backdrop-blur-xl py-12 px-4 lg:px-8 relative z-10 text-xs text-gray-400">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <ZenovaLogo className="w-8 h-8" />
              <span className="font-extrabold text-lg tracking-widest text-white font-mono">ZENOVA</span>
            </div>
            <p className="text-gray-400 text-xs leading-relaxed">
              The premier cyber community bridging gamers, artists, producers, scholars, and webtoon enthusiasts worldwide.
            </p>
          </div>

          <div>
            <div className="font-bold text-white font-mono uppercase tracking-wider mb-3">Official Platforms</div>
            <ul className="space-y-2">
              {platformHubs.map(p => (
                <li key={p.id}>
                  <a href={p.link} target="_blank" rel="noreferrer" className="hover:text-cyan-400 transition-colors flex items-center gap-1.5">
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>{p.name}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="font-bold text-white font-mono uppercase tracking-wider mb-3">Top Spheres</div>
            <ul className="space-y-2">
              <li><button onClick={() => setActiveTab('categories')} className="hover:text-pink-400">Gaming & Esports</button></li>
              <li><button onClick={() => setActiveTab('categories')} className="hover:text-pink-400">Music & Beats</button></li>
              <li><button onClick={() => setActiveTab('categories')} className="hover:text-pink-400">Anime & Manhwa</button></li>
              <li><button onClick={() => setActiveTab('categories')} className="hover:text-pink-400">Education & Tech</button></li>
            </ul>
          </div>

          <div className="space-y-3">
            <div className="font-bold text-white font-mono uppercase tracking-wider">Join Newsletter</div>
            <p className="text-gray-400">Get weekly tournament updates & custom invite links.</p>
            <div className="flex gap-2">
              <input type="email" placeholder="Enter email..." className="w-full bg-purple-950/40 border border-purple-800/50 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none" />
              <button className="px-3 py-2 rounded-xl font-bold bg-cyan-400 text-black hover:bg-cyan-300">
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-8 mt-8 border-t border-purple-900/40 text-center text-[11px] font-mono text-gray-500">
          © 2026 ZENOVA COMMUNITY. ALL RIGHTS RESERVED. POWERED BY CYBER MATRIX ENGINE.
        </div>
      </footer>

      {/* STEP-BY-STEP ONBOARDING & JOIN MODAL */}
      {joinModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0f051d] border border-purple-800/60 rounded-3xl max-w-lg w-full p-6 space-y-6 shadow-2xl relative overflow-hidden">
            <button
              onClick={() => setJoinModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white rounded-full bg-purple-950/40 border border-purple-800/40"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <ZenovaLogo className="w-8 h-8" />
                <span className="text-xl font-black text-white font-mono">ZENOVA ONBOARDING</span>
              </div>
              <p className="text-xs text-gray-400">
                Step {onboardingStep} of 2: Select your social platform & spheres.
              </p>
            </div>

            {onboardingStep === 1 && (
              <div className="space-y-4">
                <div className="text-xs font-bold text-white">Select platforms you wish to join:</div>
                <div className="space-y-2">
                  {platformHubs.map((hub) => (
                    <div key={hub.id} className="p-3 rounded-2xl bg-purple-950/30 border border-purple-800/40 flex items-center justify-between">
                      <div>
                        <div className="text-xs font-bold text-white">{hub.name}</div>
                        <div className="text-[10px] text-gray-400">{hub.members}</div>
                      </div>
                      <a
                        href={hub.link}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 rounded-lg text-xs font-bold bg-cyan-400 text-black flex items-center gap-1 hover:bg-cyan-300"
                      >
                        Join Direct <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => setOnboardingStep(2)}
                  className="w-full py-3 rounded-xl font-bold text-xs bg-gradient-to-r from-cyan-400 to-pink-500 text-black"
                >
                  Next: Pick Interest Spheres
                </button>
              </div>
            )}

            {onboardingStep === 2 && (
              <div className="space-y-4">
                <div className="text-xs font-bold text-white">Choose your top interest spheres:</div>
                <div className="grid grid-cols-2 gap-2 max-h-56 overflow-y-auto p-1">
                  {categories.map((c) => {
                    const isSelected = selectedInterests.includes(c.id);
                    return (
                      <button
                        key={c.id}
                        onClick={() => {
                          if (isSelected) {
                            setSelectedInterests(selectedInterests.filter(i => i !== c.id));
                          } else {
                            setSelectedInterests([...selectedInterests, c.id]);
                          }
                        }}
                        className={`p-2.5 rounded-xl border text-left text-xs font-bold transition-all ${
                          isSelected
                            ? 'bg-cyan-950/80 border-cyan-400 text-cyan-300'
                            : 'bg-purple-950/20 border-purple-800/40 text-gray-400 hover:text-white'
                        }`}
                      >
                        {c.title}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => setJoinModalOpen(false)}
                  className="w-full py-3 rounded-xl font-bold text-xs bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 text-black flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Finish Setup & Enter ZENOVA</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
