import React, { useState, useMemo, useEffect, useRef } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area, BarChart, Bar } from 'recharts';
import { Heart, MessageCircle, Repeat2, Bookmark, Users, Eye, TrendingUp, Settings2, Info, Play, Sparkles, BadgeCheck, Image as ImageIcon, Film, Link as LinkIcon, ThumbsDown, Timer, Zap, Square, AlertTriangle, BookOpen, ShieldAlert, Clock, Github, ExternalLink, Lightbulb, CheckCircle2, XCircle, Globe } from 'lucide-react';
import { motion, useMotionValue, useTransform, animate } from 'motion/react';
import { translations, Language } from './translations';

// ------------------------------------------------------------------
// 独立的高性能动画组件
// ------------------------------------------------------------------

const AnimatedCounter = ({ value, playKey, speed, isSlowPlaying }: { value: number, playKey: number, speed: number, isSlowPlaying: boolean }) => {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest).toLocaleString());
  const prevPlayKey = useRef(playKey);

  useEffect(() => {
    let duration = 0.3; // 默认滑块拖动时的平滑过渡
    
    if (playKey !== prevPlayKey.current) {
      count.set(0);
      // 如果是慢速推演，第一帧(第0轮)跳动要快一点；如果是酷炫推演，则使用全局设定的长动画时间
      duration = isSlowPlaying ? 0.5 : speed;
      prevPlayKey.current = playKey;
    } else if (isSlowPlaying) {
      // 慢速推演过程中的每一轮递增，使用 0.8 秒的平滑过渡 (配合 1秒/轮 的定时器)
      duration = 0.8;
    }
    
    const controls = animate(count, value, { duration, ease: "easeOut" });
    return controls.stop;
  }, [value, playKey, count, speed, isSlowPlaying]);

  return <motion.span>{rounded}</motion.span>;
};

const StatCard = ({ title, value, icon: Icon, colorClass, subtitle, bgGradient, playKey, speed, isSlowPlaying }: any) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="relative overflow-hidden bg-[#16181c]/80 backdrop-blur-md border border-[#2f3336] rounded-2xl p-5 flex flex-col group hover:border-[#1d9bf0]/50 transition-all duration-300 shadow-lg"
  >
    <div className={`absolute -right-10 -top-10 w-32 h-32 opacity-10 blur-3xl rounded-full ${bgGradient}`} />
    <div className="flex items-center justify-between mb-2 relative z-10">
      <span className="text-[#71767b] text-sm font-medium">{title}</span>
      <div className={`p-2 rounded-full bg-[#202327] ${colorClass} group-hover:scale-110 transition-transform duration-300`}>
        <Icon size={18} />
      </div>
    </div>
    <div className="text-3xl font-bold text-[#e7e9ea] mb-1 relative z-10">
      <AnimatedCounter value={value} playKey={playKey} speed={speed} isSlowPlaying={isSlowPlaying} />
    </div>
    {subtitle && <div className="text-[#71767b] text-xs relative z-10">{subtitle}</div>}
  </motion.div>
);

// 提示框组件
const InfoTooltip = ({ text }: { text: string }) => (
  <div className="relative group flex items-center ml-1">
    <Info size={14} className="text-[#71767b] cursor-help hover:text-[#1d9bf0] transition-colors" />
    <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-64 p-3 bg-[#2f3336] text-xs text-[#e7e9ea] rounded-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 shadow-2xl border border-[#3e4144] leading-relaxed">
      {text}
      <div className="absolute left-1/2 -translate-x-1/2 top-full border-4 border-transparent border-t-[#2f3336]"></div>
    </div>
  </div>
);

const ControlSlider = ({ label, value, setValue, min, max, step, suffix = "", icon: Icon, colorClass = "text-[#1d9bf0]", tooltip, allowInput = false }: any) => {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(value.toString());

  useEffect(() => {
    if (!isEditing) {
      setInputValue(value.toString());
    }
  }, [value, isEditing]);

  const handleBlur = () => {
    setIsEditing(false);
    let parsed = parseFloat(inputValue);
    if (!isNaN(parsed)) {
      parsed = Math.max(min, Math.min(max, parsed));
      setValue(parsed);
      setInputValue(parsed.toString());
    } else {
      setInputValue(value.toString());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleBlur();
    }
  };

  const displayValue = value >= 1000000 
    ? (value / 1000000).toFixed(2) + 'M' 
    : value >= 10000 
      ? (value / 10000).toFixed(1) + 'W' 
      : value;

  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-2">
        <label className="text-sm font-medium text-[#e7e9ea] flex items-center gap-1.5">
          {Icon && <Icon size={14} className={colorClass} />}
          {label}
          {tooltip && <InfoTooltip text={tooltip} />}
        </label>
        {allowInput ? (
          <div className="flex items-center bg-[#1d9bf0]/10 rounded px-2 py-0.5 border border-transparent focus-within:border-[#1d9bf0]/50 transition-colors">
            <input
              type="number"
              value={isEditing ? inputValue : value}
              onChange={(e) => {
                setInputValue(e.target.value);
                if (!isEditing) setIsEditing(true);
              }}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              className="w-20 text-right text-sm font-bold text-[#1d9bf0] bg-transparent outline-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              style={{ MozAppearance: 'textfield' }}
            />
            {suffix && <span className="text-sm font-bold text-[#1d9bf0] ml-0.5">{suffix}</span>}
          </div>
        ) : (
          <span className="text-sm font-bold text-[#1d9bf0] bg-[#1d9bf0]/10 px-2 py-0.5 rounded">
            {displayValue}{suffix}
          </span>
        )}
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => setValue(parseFloat(e.target.value))}
        className="w-full h-1.5 bg-[#2f3336] rounded-lg appearance-none cursor-pointer accent-[#1d9bf0] hover:accent-[#4cb3f9] transition-all"
      />
    </div>
  );
};

// ------------------------------------------------------------------
// 主应用
// ------------------------------------------------------------------

export default function App() {
  const [lang, setLang] = useState<Language>('zh');
  const t = translations[lang];

  // 1. 初始状态 & 内容特征
  const [baseFollowers, setBaseFollowers] = useState(1000);
  const [initialViewRate, setInitialViewRate] = useState(30); // %
  const [isBlueVerified, setIsBlueVerified] = useState(false);
  const [isToxic, setIsToxic] = useState(false); // 敏感/引战内容
  const [mediaType, setMediaType] = useState('image'); // text, image, video, link

  // 2. 互动转化率 (%)
  const [likeRate, setLikeRate] = useState(5);
  const [replyRate, setReplyRate] = useState(1);
  const [retweetRate, setRetweetRate] = useState(0.5);
  const [bookmarkRate, setBookmarkRate] = useState(2);
  const [negativeRate, setNegativeRate] = useState(0.05); // 负面反馈率 (拉黑/不感兴趣)

  // 3. 算法权重 (基于最新社区逆向工程修正)
  const [likeWeight, setLikeWeight] = useState(10); // 点赞通货膨胀，权重削弱
  const [replyWeight, setReplyWeight] = useState(20); // 评论依然重要
  const [retweetWeight, setRetweetWeight] = useState(20); // 转发保持稳定
  const [bookmarkWeight, setBookmarkWeight] = useState(50); // 收藏史诗级加强

  // 4. 全局参数
  const [followerConversionRate, setFollowerConversionRate] = useState(1); // %
  const [decayFactor, setDecayFactor] = useState(0.7); 
  const [outOfNetworkPenalty, setOutOfNetworkPenalty] = useState(20); // 破圈后的互动保留率(%)
  const [simSpeed, setSimSpeed] = useState(2.5); // 动画速度 (秒)
  const [cycles, setCycles] = useState(10);

  // Animation & Simulation State
  const [playKey, setPlayKey] = useState(0);
  const [isSimulating, setIsSimulating] = useState(false);
  const [isSlowPlaying, setIsSlowPlaying] = useState(false);
  const [visibleCycles, setVisibleCycles] = useState(cycles);

  // 慢速推演定时器
  useEffect(() => {
    let timer: any;
    if (isSlowPlaying && visibleCycles < cycles) {
      timer = setTimeout(() => {
        setVisibleCycles(prev => prev + 1);
      }, 1000); // 每秒推进一轮
    } else if (isSlowPlaying && visibleCycles >= cycles) {
      setIsSlowPlaying(false); // 结束慢速推演
    }
    return () => clearTimeout(timer);
  }, [isSlowPlaying, visibleCycles, cycles]);

  // 生成完整的模拟数据
  const simulationData = useMemo(() => {
    let currentViews = baseFollowers * (initialViewRate / 100);
    let cumulativeViews = currentViews;
    let cumulativeFollowers = baseFollowers;
    let history = [];

    let authorMultiplier = isBlueVerified ? 1.5 : 1.0;
    let toxicityMultiplier = isToxic ? 0.1 : 1.0; // 敏感内容降权90%
    
    let mediaMultiplier = 1.0;
    if (mediaType === 'video') mediaMultiplier = 1.2;
    if (mediaType === 'text') mediaMultiplier = 0.8;
    if (mediaType === 'link') mediaMultiplier = 0.2; // 外链严重限流

    history.push({
      cycle: 0,
      name: '初始发布',
      views: Math.round(currentViews),
      cumulativeViews: Math.round(cumulativeViews),
      newFollowers: 0,
      totalFollowers: Math.round(cumulativeFollowers),
      likes: 0, replies: 0, retweets: 0, bookmarks: 0, negatives: 0
    });

    for (let i = 1; i <= cycles; i++) {
      let ratioOut = cumulativeViews > baseFollowers ? (cumulativeViews - baseFollowers) / cumulativeViews : 0;
      let currentPenalty = 1 - (ratioOut * (1 - (outOfNetworkPenalty / 100)));

      let likes = currentViews * (likeRate / 100) * currentPenalty;
      let replies = currentViews * (replyRate / 100) * currentPenalty;
      let retweets = currentViews * (retweetRate / 100) * currentPenalty;
      let bookmarks = currentViews * (bookmarkRate / 100) * currentPenalty;
      let negatives = currentViews * (negativeRate / 100); 

      let baseNewViews = (likes * likeWeight) + (replies * replyWeight) + (retweets * retweetWeight) + (bookmarks * bookmarkWeight);
      let negativePenaltyViews = negatives * 74; // 开源算法中负面反馈惩罚是 -74

      let newViews = (baseNewViews * authorMultiplier * mediaMultiplier * toxicityMultiplier) - negativePenaltyViews;
      newViews = newViews * Math.pow(decayFactor, i - 1); // 时间半衰期衰减
      newViews = Math.max(0, newViews);

      let newFollowers = newViews * (followerConversionRate / 100);

      cumulativeViews += newViews;
      cumulativeFollowers += newFollowers;

      history.push({
        cycle: i,
        name: `第 ${i} 轮传播`,
        views: Math.round(newViews),
        cumulativeViews: Math.round(cumulativeViews),
        newFollowers: Math.round(newFollowers),
        totalFollowers: Math.round(cumulativeFollowers),
        likes: Math.round(likes),
        replies: Math.round(replies),
        retweets: Math.round(retweets),
        bookmarks: Math.round(bookmarks),
        negatives: Math.round(negatives)
      });

      currentViews = newViews;
      if (currentViews < 1) break;
    }

    return history;
  }, [baseFollowers, initialViewRate, likeRate, replyRate, retweetRate, bookmarkRate, likeWeight, replyWeight, retweetWeight, bookmarkWeight, followerConversionRate, decayFactor, cycles, isBlueVerified, isToxic, mediaType, negativeRate, outOfNetworkPenalty]);

  // 为图表生成"截断"的数据 (用于慢速推演时固定X轴并逐步显示)
  const displayedData = useMemo(() => {
    return simulationData.map((d, i) => {
      if (i > visibleCycles) {
        return { cycle: d.cycle, name: d.name }; // 隐藏未来轮次的数据，但保留X轴占位
      }
      return d;
    });
  }, [simulationData, visibleCycles]);

  // 当前显示的统计总数
  const safeVisibleCycles = Math.min(visibleCycles, simulationData.length - 1);
  const currentTotals = simulationData[safeVisibleCycles];

  // 酷炫推演 (一次性动画)
  const handlePlay = () => {
    setIsSlowPlaying(false);
    setVisibleCycles(cycles);
    setPlayKey(k => k + 1);
    setIsSimulating(true);
    setTimeout(() => setIsSimulating(false), simSpeed * 1000);
  };

  // 慢速推演 (逐步推进)
  const handleSlowPlay = () => {
    if (isSlowPlaying) {
      // 停止
      setIsSlowPlaying(false);
      setVisibleCycles(cycles);
    } else {
      // 开始
      setIsSlowPlaying(true);
      setVisibleCycles(0);
      setPlayKey(k => k + 1);
    }
  };

  const chartAnimDuration = isSimulating ? simSpeed * 1000 : (isSlowPlaying ? 800 : 300);

  return (
    <div className="min-h-screen bg-[#000000] text-[#e7e9ea] font-sans selection:bg-[#1d9bf0]/30 selection:text-white pb-20 relative overflow-x-hidden">
      
      <div className="fixed top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#1d9bf0] opacity-[0.04] blur-[120px] rounded-full pointer-events-none" />
      <div className="fixed bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-[#8a2be2] opacity-[0.04] blur-[120px] rounded-full pointer-events-none" />

      <header className="sticky top-0 z-30 bg-[#000000]/80 backdrop-blur-xl border-b border-[#2f3336] px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-gray-100 to-gray-300 text-black p-1.5 rounded-lg shadow-[0_0_15px_rgba(255,255,255,0.1)]">
              <svg viewBox="0 0 24 24" aria-hidden="true" className="w-6 h-6 fill-current"><g><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></g></svg>
            </div>
            <div>
              <h1 className="text-xl font-bold leading-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">{t.title}</h1>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <span className="text-[#71767b] text-xs">{t.subtitle}</span>
                <span className="text-[#3e4144] text-xs hidden sm:inline">•</span>
                <a href="https://x.com/mac20777" target="_blank" rel="noreferrer" className="text-[#1d9bf0] hover:underline text-xs flex items-center gap-1">
                  <svg viewBox="0 0 24 24" aria-hidden="true" className="w-3 h-3 fill-current"><g><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></g></svg>
                  @mac20777
                </a>
                <span className="text-[#3e4144] text-xs hidden sm:inline">•</span>
                <a href="https://x-recommendation-simulator.vercel.app/" target="_blank" rel="noreferrer" className="text-[#00ba7c] hover:underline text-xs flex items-center gap-1">
                  <ExternalLink size={12} />
                  {t.demo}
                </a>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setLang(lang === 'zh' ? 'en' : 'zh')}
              className="flex items-center gap-1.5 bg-[#2f3336] hover:bg-[#3e4144] text-white px-3 py-2 rounded-full font-bold text-xs transition-colors mr-2"
            >
              <Globe size={14} />
              {lang === 'zh' ? 'EN' : '中文'}
            </button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSlowPlay}
              className="flex items-center gap-2 bg-[#2f3336] hover:bg-[#3e4144] text-white px-5 py-2.5 rounded-full font-bold text-sm transition-colors"
            >
              {isSlowPlaying ? <Square size={16} className="text-[#f91880]" /> : <Play size={16} />}
              <span>{isSlowPlaying ? (lang === 'zh' ? '停止慢速' : 'Stop') : t.buttons.stepSim}</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handlePlay}
              className="flex items-center gap-2 bg-gradient-to-r from-[#1d9bf0] to-[#8a2be2] text-white px-6 py-2.5 rounded-full font-bold text-sm shadow-[0_0_20px_rgba(29,155,240,0.4)] hover:shadow-[0_0_30px_rgba(29,155,240,0.6)] transition-shadow relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
              <Sparkles size={16} className="relative z-10" />
              <span className="relative z-10">{isSimulating ? t.buttons.simulating : t.buttons.instantSim}</span>
            </motion.button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
        
        {/* Left Sidebar: Controls */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* 1. 初始状态 & 特征 */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="bg-[#16181c]/80 backdrop-blur-md border border-[#2f3336] rounded-2xl p-6 shadow-lg">
            <div className="flex items-center gap-2 mb-6 border-b border-[#2f3336] pb-4">
              <Users size={20} className="text-[#1d9bf0]" />
              <h2 className="text-lg font-bold">{t.sections.contentFeatures}</h2>
            </div>
            
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="flex flex-col justify-center bg-[#1d9bf0]/10 p-3 rounded-xl border border-[#1d9bf0]/20">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5">
                    <BadgeCheck size={16} className="text-[#1d9bf0]" />
                    <span className="text-xs font-medium text-[#e7e9ea]">{t.toggles.xPremium}</span>
                    <InfoTooltip text={lang === 'zh' ? "蓝V认证用户在推荐流(For You)中拥有硬编码的流量乘数加成，更容易被推荐。" : "X Premium users have a hardcoded traffic multiplier in the For You stream, making them easier to be recommended."} />
                  </div>
                  <button onClick={() => setIsBlueVerified(!isBlueVerified)} className={`w-8 h-4 rounded-full relative transition-colors ${isBlueVerified ? 'bg-[#1d9bf0]' : 'bg-[#2f3336]'}`}>
                    <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all ${isBlueVerified ? 'left-4.5' : 'left-0.5'}`} />
                  </button>
                </div>
              </div>

              <div className="flex flex-col justify-center bg-[#f91880]/10 p-3 rounded-xl border border-[#f91880]/20">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5">
                    <ShieldAlert size={16} className="text-[#f91880]" />
                    <span className="text-xs font-medium text-[#e7e9ea]">{t.toggles.containsToxicity}</span>
                    <InfoTooltip text={lang === 'zh' ? "被NLP模型判定为有毒(Toxic)或NSFW的内容，不会被删，但推荐权重会被直接削减 90% 以上。" : "Content judged as toxic or NSFW by NLP models will not be deleted, but its recommendation weight will be directly reduced by more than 90%."} />
                  </div>
                  <button onClick={() => setIsToxic(!isToxic)} className={`w-8 h-4 rounded-full relative transition-colors ${isToxic ? 'bg-[#f91880]' : 'bg-[#2f3336]'}`}>
                    <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all ${isToxic ? 'left-4.5' : 'left-0.5'}`} />
                  </button>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <label className="text-sm font-medium text-[#e7e9ea] flex items-center gap-1.5 mb-3">
                <ImageIcon size={14} className="text-[#1d9bf0]" />
                {lang === 'zh' ? '内容类型 (媒体权重)' : 'Content Type (Media Weight)'}
                <InfoTooltip text={lang === 'zh' ? "视频权重最高；纯文本较低；带外部链接(Link)的推文会被严重限流，因为平台不想让用户跳出App。" : "Video has the highest weight; pure text is lower; tweets with external links are severely throttled because the platform doesn't want users to leave the App."} />
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { id: 'text', label: t.mediaTypes.text, icon: <span className="text-xs font-serif">Aa</span> },
                  { id: 'image', label: t.mediaTypes.image, icon: <ImageIcon size={14} /> },
                  { id: 'video', label: t.mediaTypes.video, icon: <Film size={14} /> },
                  { id: 'link', label: t.mediaTypes.link, icon: <LinkIcon size={14} /> }
                ].map(type => (
                  <button
                    key={type.id}
                    onClick={() => setMediaType(type.id)}
                    className={`py-2 rounded-lg text-xs font-medium flex flex-col items-center justify-center gap-1.5 transition-colors ${mediaType === type.id ? 'bg-[#1d9bf0] text-white shadow-md' : 'bg-[#2f3336] text-[#71767b] hover:bg-[#2f3336]/80'}`}
                  >
                    {type.icon} {type.label}
                  </button>
                ))}
              </div>
            </div>

            <ControlSlider label={lang === 'zh' ? "初始粉丝数" : "Initial Followers"} value={baseFollowers} setValue={setBaseFollowers} min={10} max={5000000} step={10} icon={Users} colorClass="text-[#e7e9ea]" tooltip={lang === 'zh' ? "推文发布初期的基础流量池。粉丝基数越大，冷启动越容易。" : "The base traffic pool in the early stage of tweet publication. The larger the follower base, the easier the cold start."} allowInput={true} />
            <ControlSlider label={t.controls.initialFollowers} value={initialViewRate} setValue={setInitialViewRate} min={1} max={100} step={1} suffix="%" icon={Eye} colorClass="text-[#e7e9ea]" tooltip={lang === 'zh' ? "并非所有粉丝都能看到你的推文。通常只有 5%-20% 的活跃粉丝会在第一时间刷到。" : "Not all followers will see your tweet. Usually only 5%-20% of active followers will see it immediately."} />
          </motion.div>

          {/* 2. 互动转化率 */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="bg-[#16181c]/80 backdrop-blur-md border border-[#2f3336] rounded-2xl p-6 shadow-lg">
            <div className="flex items-center gap-2 mb-6 border-b border-[#2f3336] pb-4">
              <Heart size={20} className="text-[#f91880]" />
              <h2 className="text-lg font-bold">{t.sections.engagementRates}</h2>
            </div>
            <ControlSlider label={t.controls.likeRate} value={likeRate} setValue={setLikeRate} min={0} max={20} step={0.1} suffix="%" icon={Heart} colorClass="text-[#f91880]" tooltip={lang === 'zh' ? "看到推文的人中，点赞的比例。常规推文在 1%-5% 之间。" : "The percentage of people who see the tweet and like it. Regular tweets are between 1%-5%."} />
            <ControlSlider label={t.controls.replyRate} value={replyRate} setValue={setReplyRate} min={0} max={10} step={0.1} suffix="%" icon={MessageCircle} colorClass="text-[#1d9bf0]" tooltip={lang === 'zh' ? "评论代表深度参与，虽然转化率低，但权重极高。" : "Replies represent deep engagement. Although the conversion rate is low, the weight is extremely high."} />
            <ControlSlider label={t.controls.retweetRate} value={retweetRate} setValue={setRetweetRate} min={0} max={10} step={0.1} suffix="%" icon={Repeat2} colorClass="text-[#00ba7c]" tooltip={lang === 'zh' ? "内容裂变的核心。转发能直接将推文暴露给另一个粉丝网络。" : "The core of content virality. Retweets directly expose the tweet to another follower network."} />
            <ControlSlider label={t.controls.bookmarkRate} value={bookmarkRate} setValue={setBookmarkRate} min={0} max={10} step={0.1} suffix="%" icon={Bookmark} colorClass="text-[#1d9bf0]" tooltip={lang === 'zh' ? "收藏被算法视为'高价值长效内容'的强烈信号。" : "Bookmarks are seen by the algorithm as a strong signal of 'high-value long-term content'."} />
            
            <div className="mt-6 pt-4 border-t border-[#2f3336]/50">
              <ControlSlider label={t.controls.negativeRate} value={negativeRate} setValue={setNegativeRate} min={0} max={1} step={0.01} suffix="%" icon={ThumbsDown} colorClass="text-[#f91880]" tooltip={lang === 'zh' ? "点击'不感兴趣'或'屏蔽'的比例。这是算法最讨厌的行为，惩罚极重。" : "The percentage of clicking 'Not interested' or 'Block'. This is the behavior the algorithm hates most, and the penalty is extremely heavy."} />
              <p className="text-xs text-[#f91880]/80 mt-1">{lang === 'zh' ? '警告：极小的负面反馈也会导致流量熔断' : 'Warning: Even tiny negative feedback can cause traffic circuit breaker'}</p>
            </div>
          </motion.div>

          {/* 3. 算法权重 */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="bg-[#16181c]/80 backdrop-blur-md border border-[#2f3336] rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-6 border-b border-[#2f3336] pb-4">
              <div className="flex items-center gap-2">
                <Settings2 size={20} className="text-[#ffd400]" />
                <h2 className="text-lg font-bold">{t.sections.algorithmWeights}</h2>
              </div>
            </div>
            <ControlSlider label={t.controls.likeWeight} value={likeWeight} setValue={setLikeWeight} min={0} max={50} step={1} icon={Heart} colorClass="text-[#f91880]" tooltip={lang === 'zh' ? "开源代码中曾为 30，但目前已被大幅削弱，仅作为最基础的指标。" : "It was 30 in the open source code, but it has been significantly weakened and is only used as the most basic indicator."} />
            <ControlSlider label={t.controls.replyWeight} value={replyWeight} setValue={setReplyWeight} min={0} max={50} step={1} icon={MessageCircle} colorClass="text-[#1d9bf0]" tooltip={lang === 'zh' ? "开源代码中曾为 27。目前依然是深度参与的核心指标，尤其是作者回复的评论。" : "It was 27 in the open source code. It is still a core indicator of deep participation, especially comments replied to by the author."} />
            <ControlSlider label={t.controls.retweetWeight} value={retweetWeight} setValue={setRetweetWeight} min={0} max={100} step={1} icon={Repeat2} colorClass="text-[#00ba7c]" tooltip={lang === 'zh' ? "开源代码中设定为 20。保持稳定，是内容裂变的基础。" : "Set to 20 in the open source code. Remains stable, is the basis of content virality."} />
            <ControlSlider label={t.controls.bookmarkWeight} value={bookmarkWeight} setValue={setBookmarkWeight} min={0} max={100} step={1} icon={Bookmark} colorClass="text-[#1d9bf0]" tooltip={lang === 'zh' ? "马斯克公开确认的'安静的点赞'，目前权重史诗级加强，远超普通点赞。" : "The 'quiet like' publicly confirmed by Musk, currently the weight is epicly strengthened, far exceeding ordinary likes."} />
          </motion.div>

          {/* 4. 全局参数 */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }} className="bg-[#16181c]/80 backdrop-blur-md border border-[#2f3336] rounded-2xl p-6 shadow-lg">
            <div className="flex items-center gap-2 mb-6 border-b border-[#2f3336] pb-4">
              <TrendingUp size={20} className="text-[#00ba7c]" />
              <h2 className="text-lg font-bold">{t.sections.globalParams}</h2>
            </div>
            <ControlSlider label={t.controls.outOfNetworkPenalty} value={outOfNetworkPenalty} setValue={setOutOfNetworkPenalty} min={1} max={100} step={1} suffix="%" icon={Zap} colorClass="text-[#ffd400]" tooltip={lang === 'zh' ? "推文被推给非粉丝(For You页面)时，陌生人的互动意愿通常只有粉丝的 10%-20%。" : "When a tweet is pushed to non-followers (For You page), strangers' willingness to interact is usually only 10%-20% of followers."} />
            <ControlSlider label={t.controls.decayFactor} value={decayFactor} setValue={setDecayFactor} min={0.1} max={1.5} step={0.05} icon={Clock} colorClass="text-[#ffd400]" tooltip={lang === 'zh' ? "推特对老推文降权极快。开源算法中半衰期约为6小时（每过6小时权重减半）。" : "Twitter downgrades old tweets very quickly. In the open source algorithm, the half-life is about 6 hours (weight halves every 6 hours)."} />
            <ControlSlider label={t.controls.followerConversion} value={followerConversionRate} setValue={setFollowerConversionRate} min={0} max={5} step={0.01} suffix="%" icon={Users} colorClass="text-[#00ba7c]" tooltip={lang === 'zh' ? "每获得100个浏览量，能转化为多少个新粉丝。" : "How many new followers can be converted for every 100 views."} />
            
            <div className="mt-6 pt-4 border-t border-[#2f3336]/50">
              <ControlSlider label={t.controls.simSpeed} value={simSpeed} setValue={setSimSpeed} min={0.5} max={5} step={0.1} suffix={lang === 'zh' ? " 秒" : " s"} icon={Timer} colorClass="text-[#1d9bf0]" tooltip={lang === 'zh' ? "调节'一键酷炫推演'的动画播放速度。" : "Adjust the animation playback speed of 'Instant Simulation'."} />
            </div>
          </motion.div>

        </div>

        {/* Right Content: Visualization */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Top Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard 
              playKey={playKey} speed={simSpeed} isSlowPlaying={isSlowPlaying}
              title={t.stats.estImpressions} 
              value={currentTotals.cumulativeViews} 
              icon={Eye} 
              colorClass="text-[#1d9bf0]"
              bgGradient="bg-[#1d9bf0]"
              subtitle={
                <span className="flex gap-1">
                  {lang === 'zh' ? '初始' : 'Init'} <AnimatedCounter value={Math.round(baseFollowers * (initialViewRate / 100))} playKey={playKey} speed={simSpeed} isSlowPlaying={isSlowPlaying} /> + 
                  {lang === 'zh' ? '推荐' : 'Rec'} <AnimatedCounter value={currentTotals.cumulativeViews - Math.round(baseFollowers * (initialViewRate / 100))} playKey={playKey} speed={simSpeed} isSlowPlaying={isSlowPlaying} />
                </span>
              }
            />
            <StatCard 
              playKey={playKey} speed={simSpeed} isSlowPlaying={isSlowPlaying}
              title={t.stats.newFollowers} 
              value={currentTotals.totalFollowers} 
              icon={Users} 
              colorClass="text-[#00ba7c]"
              bgGradient="bg-[#00ba7c]"
              subtitle={
                <span className="flex gap-1 text-[#00ba7c]">
                  {lang === 'zh' ? '新增' : 'New'} +<AnimatedCounter value={currentTotals.totalFollowers - baseFollowers} playKey={playKey} speed={simSpeed} isSlowPlaying={isSlowPlaying} />
                </span>
              }
            />
            <StatCard 
              playKey={playKey} speed={simSpeed} isSlowPlaying={isSlowPlaying}
              title={lang === 'zh' ? "总互动量" : "Total Engagement"} 
              value={simulationData.slice(0, safeVisibleCycles + 1).reduce((acc, curr) => acc + curr.likes + curr.replies + curr.retweets + curr.bookmarks, 0)} 
              icon={Heart} 
              colorClass="text-[#f91880]"
              bgGradient="bg-[#f91880]"
              subtitle={lang === 'zh' ? "点赞/评论/转发/收藏" : "Likes/Replies/RTs/Bookmarks"}
            />
            <StatCard 
              playKey={playKey} speed={simSpeed} isSlowPlaying={isSlowPlaying}
              title={t.stats.negative} 
              value={simulationData.slice(0, safeVisibleCycles + 1).reduce((acc, curr) => acc + curr.negatives, 0)} 
              icon={ThumbsDown} 
              colorClass="text-[#f91880]"
              bgGradient="bg-[#f91880]"
              subtitle={lang === 'zh' ? "导致流量熔断的核心因素" : "Core factor causing traffic circuit breaker"}
            />
          </div>

          {/* Charts */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="bg-[#16181c]/80 backdrop-blur-md border border-[#2f3336] rounded-2xl p-6 relative overflow-hidden shadow-lg"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#1d9bf0] to-transparent opacity-30" />
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
              <TrendingUp size={20} className="text-[#1d9bf0]" />
              {t.charts.impressionTrend}
              {isSlowPlaying && <span className="ml-2 text-xs bg-[#1d9bf0]/20 text-[#1d9bf0] px-2 py-1 rounded animate-pulse">{lang === 'zh' ? `正在推演 第 ${visibleCycles} 轮...` : `Simulating Cycle ${visibleCycles}...`}</span>}
            </h3>
            <div className="h-[300px] w-full min-h-[300px] min-w-0">
              <ResponsiveContainer key={playKey} width="100%" height="100%">
                <AreaChart data={displayedData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1d9bf0" stopOpacity={0.5}/>
                      <stop offset="95%" stopColor="#1d9bf0" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2f3336" vertical={false} />
                  <XAxis dataKey="cycle" stroke="#71767b" tick={{fill: '#71767b', fontSize: 12}} tickLine={false} axisLine={false} />
                  <YAxis stroke="#71767b" tick={{fill: '#71767b', fontSize: 12}} tickLine={false} axisLine={false} tickFormatter={(value) => value >= 1000000 ? `${(value / 1000000).toFixed(1)}M` : value >= 1000 ? `${(value / 1000).toFixed(1)}k` : value} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#16181c', borderColor: '#2f3336', borderRadius: '12px', color: '#e7e9ea', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}
                    itemStyle={{ color: '#e7e9ea', fontWeight: 'bold' }}
                    labelStyle={{ color: '#71767b', marginBottom: '4px' }}
                  />
                  <Area type="monotone" dataKey="views" name={lang === 'zh' ? "单轮新增浏览量" : "New Impressions"} stroke="#1d9bf0" strokeWidth={3} fillOpacity={1} fill="url(#colorViews)" isAnimationActive={!isSlowPlaying} animationDuration={chartAnimDuration} animationEasing="ease-out" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-[#16181c]/80 backdrop-blur-md border border-[#2f3336] rounded-2xl p-6 shadow-lg">
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                <Users size={20} className="text-[#00ba7c]" />
                {lang === 'zh' ? '粉丝增长趋势' : 'Follower Growth Trend'}
              </h3>
              <div className="h-[250px] w-full min-h-[250px] min-w-0">
                <ResponsiveContainer key={playKey} width="100%" height="100%">
                  <LineChart data={displayedData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2f3336" vertical={false} />
                    <XAxis dataKey="cycle" stroke="#71767b" tick={{fill: '#71767b', fontSize: 12}} tickLine={false} axisLine={false} />
                    <YAxis stroke="#71767b" tick={{fill: '#71767b', fontSize: 12}} tickLine={false} axisLine={false} domain={['dataMin', 'dataMax']} tickFormatter={(value) => value >= 1000000 ? `${(value / 1000000).toFixed(1)}M` : value >= 1000 ? `${(value / 1000).toFixed(1)}k` : value} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#16181c', borderColor: '#2f3336', borderRadius: '12px', color: '#e7e9ea', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}
                    />
                    <Line type="monotone" dataKey="totalFollowers" name={lang === 'zh' ? "总粉丝数" : "Total Followers"} stroke="#00ba7c" strokeWidth={3} dot={{r: 4, fill: '#00ba7c', strokeWidth: 0}} activeDot={{r: 6, fill: '#fff', stroke: '#00ba7c', strokeWidth: 2}} isAnimationActive={!isSlowPlaying} animationDuration={chartAnimDuration} animationEasing="ease-out" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-[#16181c]/80 backdrop-blur-md border border-[#2f3336] rounded-2xl p-6 shadow-lg">
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                <Heart size={20} className="text-[#f91880]" />
                {t.charts.engagementComparison}
              </h3>
              <div className="h-[250px] w-full min-h-[250px] min-w-0">
                <ResponsiveContainer key={playKey} width="100%" height="100%">
                  <BarChart data={displayedData.slice(1)} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2f3336" vertical={false} />
                    <XAxis dataKey="cycle" stroke="#71767b" tick={{fill: '#71767b', fontSize: 12}} tickLine={false} axisLine={false} />
                    <YAxis stroke="#71767b" tick={{fill: '#71767b', fontSize: 12}} tickLine={false} axisLine={false} tickFormatter={(value) => value >= 1000000 ? `${(value / 1000000).toFixed(1)}M` : value >= 1000 ? `${(value / 1000).toFixed(1)}k` : value} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#16181c', borderColor: '#2f3336', borderRadius: '12px', color: '#e7e9ea', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}
                      cursor={{fill: '#2f3336', opacity: 0.4}}
                    />
                    <Legend wrapperStyle={{ fontSize: '12px', color: '#71767b' }} />
                    <Bar dataKey="likes" name={t.charts.likes} stackId="a" fill="#f91880" radius={[0, 0, 0, 0]} isAnimationActive={!isSlowPlaying} animationDuration={chartAnimDuration} animationEasing="ease-out" />
                    <Bar dataKey="retweets" name={t.charts.retweets} stackId="a" fill="#00ba7c" radius={[0, 0, 0, 0]} isAnimationActive={!isSlowPlaying} animationDuration={chartAnimDuration} animationEasing="ease-out" />
                    <Bar dataKey="replies" name={t.charts.replies} stackId="a" fill="#1d9bf0" radius={[0, 0, 0, 0]} isAnimationActive={!isSlowPlaying} animationDuration={chartAnimDuration} animationEasing="ease-out" />
                    <Bar dataKey="bookmarks" name={t.charts.bookmarks} stackId="a" fill="#ffd400" radius={[4, 4, 0, 0]} isAnimationActive={!isSlowPlaying} animationDuration={chartAnimDuration} animationEasing="ease-out" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          </div>

          {/* Detailed Rulebook (Bottom Right) */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="bg-[#16181c] border border-[#2f3336] rounded-2xl p-0 relative overflow-hidden shadow-2xl mt-8">
            <div className="bg-[#202327] px-6 py-4 border-b border-[#2f3336] flex items-center gap-3 flex-wrap">
              <BookOpen size={20} className="text-[#1d9bf0]" />
              <h3 className="text-lg font-bold text-[#e7e9ea]">{t.rulebook.title}</h3>
              
              <a 
                href="https://github.com/twitter/the-algorithm" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs font-medium text-[#71767b] hover:text-[#e7e9ea] bg-[#2f3336]/50 hover:bg-[#2f3336] px-3 py-1.5 rounded-full transition-colors ml-2"
              >
                <Github size={14} />
                <span>{t.rulebook.officialCode}</span>
                <ExternalLink size={12} className="opacity-70" />
              </a>

              <span className="ml-auto text-xs font-mono text-[#1d9bf0] bg-[#1d9bf0]/10 border border-[#1d9bf0]/30 px-2 py-1 rounded">Community Consensus v2.5</span>
            </div>
            
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Column 1 */}
              <div className="space-y-6">
                <div className="bg-[#1d9bf0]/5 border border-[#1d9bf0]/20 p-4 rounded-xl">
                  <h4 className="text-[#1d9bf0] font-bold text-sm flex items-center gap-2 mb-2">
                    <AlertTriangle size={16} /> {t.rulebook.warningTitle}
                  </h4>
                  <p className="text-[#71767b] text-xs leading-relaxed" dangerouslySetInnerHTML={{ __html: t.rulebook.warningText }} />
                </div>

                <div>
                  <h4 className="text-[#1d9bf0] font-bold text-sm flex items-center gap-2 mb-2">
                    <Heart size={16} /> {t.rulebook.coreFormulaTitle}
                  </h4>
                  <p className="text-[#71767b] text-xs leading-relaxed mb-2">
                    {t.rulebook.coreFormulaText}
                  </p>
                  <div className="bg-[#202327] p-3 rounded-lg font-mono text-xs text-[#e7e9ea] border border-[#2f3336]">
                    Score = (Bookmarks * 50) + (Replies * 20) + (Retweets * 20) + (Likes * 10)
                  </div>
                </div>
              </div>

              {/* Column 2 */}
              <div className="space-y-6">
                <div>
                  <h4 className="text-[#00ba7c] font-bold text-sm flex items-center gap-2 mb-2">
                    <Zap size={16} /> {t.rulebook.inNetworkTitle}
                  </h4>
                  <p className="text-[#71767b] text-xs leading-relaxed" dangerouslySetInnerHTML={{ __html: t.rulebook.inNetworkText }} />
                </div>

                <div>
                  <h4 className="text-[#f91880] font-bold text-sm flex items-center gap-2 mb-2">
                    <ShieldAlert size={16} /> {t.rulebook.penaltiesTitle}
                  </h4>
                  <ul className="text-[#71767b] text-xs leading-relaxed space-y-2 list-disc pl-4">
                    <li dangerouslySetInnerHTML={{ __html: t.rulebook.penaltiesList1 }} />
                    <li dangerouslySetInnerHTML={{ __html: t.rulebook.penaltiesList2 }} />
                    <li dangerouslySetInnerHTML={{ __html: t.rulebook.penaltiesList3 }} />
                  </ul>
                </div>

                <div>
                  <h4 className="text-[#ffd400] font-bold text-sm flex items-center gap-2 mb-2">
                    <Clock size={16} /> {t.rulebook.timeDecayTitle}
                  </h4>
                  <p className="text-[#71767b] text-xs leading-relaxed" dangerouslySetInnerHTML={{ __html: t.rulebook.timeDecayText }} />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Novice Guide (Bottom Right) */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="bg-[#16181c] border border-[#2f3336] rounded-2xl p-0 relative overflow-hidden shadow-2xl mt-8">
            <div className="bg-[#202327] px-6 py-4 border-b border-[#2f3336] flex items-center gap-3">
              <Lightbulb size={20} className="text-[#ffd400]" />
              <h3 className="text-lg font-bold text-[#e7e9ea]">{t.guide.title}</h3>
              <span className="ml-auto text-xs font-medium text-[#71767b]">{t.guide.subtitle}</span>
            </div>
            
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Dos */}
              <div className="space-y-4">
                <h4 className="text-[#00ba7c] font-bold text-sm flex items-center gap-2 border-b border-[#2f3336] pb-2">
                  <CheckCircle2 size={16} /> {t.guide.dosTitle}
                </h4>
                <ul className="space-y-4">
                  <li className="flex gap-3">
                    <div className="mt-0.5 text-[#00ba7c]"><Bookmark size={14} /></div>
                    <div>
                      <strong className="text-[#e7e9ea] text-sm block mb-1">{t.guide.dos1Title}</strong>
                      <p className="text-[#71767b] text-xs leading-relaxed">{t.guide.dos1Text}</p>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <div className="mt-0.5 text-[#00ba7c]"><Film size={14} /></div>
                    <div>
                      <strong className="text-[#e7e9ea] text-sm block mb-1">{t.guide.dos2Title}</strong>
                      <p className="text-[#71767b] text-xs leading-relaxed">{t.guide.dos2Text}</p>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <div className="mt-0.5 text-[#00ba7c]"><MessageCircle size={14} /></div>
                    <div>
                      <strong className="text-[#e7e9ea] text-sm block mb-1">{t.guide.dos3Title}</strong>
                      <p className="text-[#71767b] text-xs leading-relaxed">{t.guide.dos3Text}</p>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <div className="mt-0.5 text-[#00ba7c]"><BadgeCheck size={14} /></div>
                    <div>
                      <strong className="text-[#e7e9ea] text-sm block mb-1">{t.guide.dos4Title}</strong>
                      <p className="text-[#71767b] text-xs leading-relaxed">{t.guide.dos4Text}</p>
                    </div>
                  </li>
                </ul>
              </div>

              {/* Don'ts */}
              <div className="space-y-4">
                <h4 className="text-[#f91880] font-bold text-sm flex items-center gap-2 border-b border-[#2f3336] pb-2">
                  <XCircle size={16} /> {t.guide.dontsTitle}
                </h4>
                <ul className="space-y-4">
                  <li className="flex gap-3">
                    <div className="mt-0.5 text-[#f91880]"><LinkIcon size={14} /></div>
                    <div>
                      <strong className="text-[#e7e9ea] text-sm block mb-1">{t.guide.donts1Title}</strong>
                      <p className="text-[#71767b] text-xs leading-relaxed">{t.guide.donts1Text}</p>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <div className="mt-0.5 text-[#f91880]"><ShieldAlert size={14} /></div>
                    <div>
                      <strong className="text-[#e7e9ea] text-sm block mb-1">{t.guide.donts2Title}</strong>
                      <p className="text-[#71767b] text-xs leading-relaxed">{t.guide.donts2Text}</p>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <div className="mt-0.5 text-[#f91880]"><Clock size={14} /></div>
                    <div>
                      <strong className="text-[#e7e9ea] text-sm block mb-1">{t.guide.donts3Title}</strong>
                      <p className="text-[#71767b] text-xs leading-relaxed">{t.guide.donts3Text}</p>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <div className="mt-0.5 text-[#f91880]"><Eye size={14} /></div>
                    <div>
                      <strong className="text-[#e7e9ea] text-sm block mb-1">{t.guide.donts4Title}</strong>
                      <p className="text-[#71767b] text-xs leading-relaxed">{t.guide.donts4Text}</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>

        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#2f3336] mt-12 py-8 bg-[#000000]">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-[#71767b] text-sm">
            © {new Date().getFullYear()} X Recommendation Simulator.
          </div>
          <div className="flex items-center gap-6">
            <a 
              href="https://github.com/macheng2017/XRecommendationSimulator" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-[#71767b] hover:text-[#e7e9ea] transition-colors text-sm"
            >
              <Github size={18} />
              <span>GitHub</span>
            </a>
            <a 
              href="https://x.com/mac20777" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-[#71767b] hover:text-[#1d9bf0] transition-colors text-sm"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true" className="w-[18px] h-[18px] fill-current"><g><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></g></svg>
              <span>@mac20777</span>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
