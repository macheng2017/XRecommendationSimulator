import React, { useState, useMemo, useEffect, useRef } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area, BarChart, Bar } from 'recharts';
import { Heart, MessageCircle, Repeat2, Bookmark, Users, Eye, TrendingUp, Settings2, Info, Play, Sparkles, BadgeCheck, Image as ImageIcon, Film, Link as LinkIcon, ThumbsDown, Timer, Zap, Square, AlertTriangle, BookOpen, ShieldAlert, Clock, Github, ExternalLink, Lightbulb, CheckCircle2, XCircle } from 'lucide-react';
import { motion, useMotionValue, useTransform, animate } from 'motion/react';

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
              <h1 className="text-xl font-bold leading-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">X 推荐算法模拟器</h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[#71767b] text-xs">Heavy Ranker 深度推演版</span>
                <span className="bg-[#1d9bf0]/20 text-[#1d9bf0] text-[10px] px-1.5 py-0.5 rounded font-bold border border-[#1d9bf0]/30">2026 最新修正版</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSlowPlay}
              className="flex items-center gap-2 bg-[#2f3336] hover:bg-[#3e4144] text-white px-5 py-2.5 rounded-full font-bold text-sm transition-colors"
            >
              {isSlowPlaying ? <Square size={16} className="text-[#f91880]" /> : <Play size={16} />}
              <span>{isSlowPlaying ? '停止慢速' : '慢速推演'}</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handlePlay}
              className="flex items-center gap-2 bg-gradient-to-r from-[#1d9bf0] to-[#8a2be2] text-white px-6 py-2.5 rounded-full font-bold text-sm shadow-[0_0_20px_rgba(29,155,240,0.4)] hover:shadow-[0_0_30px_rgba(29,155,240,0.6)] transition-shadow relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
              <Sparkles size={16} className="relative z-10" />
              <span className="relative z-10">一键酷炫推演</span>
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
              <h2 className="text-lg font-bold">初始状态 & 内容特征</h2>
            </div>
            
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="flex flex-col justify-center bg-[#1d9bf0]/10 p-3 rounded-xl border border-[#1d9bf0]/20">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5">
                    <BadgeCheck size={16} className="text-[#1d9bf0]" />
                    <span className="text-xs font-medium text-[#e7e9ea]">X Premium</span>
                    <InfoTooltip text="蓝V认证用户在推荐流(For You)中拥有硬编码的流量乘数加成，更容易被推荐。" />
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
                    <span className="text-xs font-medium text-[#e7e9ea]">敏感/引战</span>
                    <InfoTooltip text="被NLP模型判定为有毒(Toxic)或NSFW的内容，不会被删，但推荐权重会被直接削减 90% 以上。" />
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
                内容类型 (媒体权重)
                <InfoTooltip text="视频权重最高；纯文本较低；带外部链接(Link)的推文会被严重限流，因为平台不想让用户跳出App。" />
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { id: 'text', label: '纯文本', icon: <span className="text-xs font-serif">Aa</span> },
                  { id: 'image', label: '图文', icon: <ImageIcon size={14} /> },
                  { id: 'video', label: '视频', icon: <Film size={14} /> },
                  { id: 'link', label: '外链', icon: <LinkIcon size={14} /> }
                ].map(t => (
                  <button
                    key={t.id}
                    onClick={() => setMediaType(t.id)}
                    className={`py-2 rounded-lg text-xs font-medium flex flex-col items-center justify-center gap-1.5 transition-colors ${mediaType === t.id ? 'bg-[#1d9bf0] text-white shadow-md' : 'bg-[#2f3336] text-[#71767b] hover:bg-[#2f3336]/80'}`}
                  >
                    {t.icon} {t.label}
                  </button>
                ))}
              </div>
            </div>

            <ControlSlider label="初始粉丝数" value={baseFollowers} setValue={setBaseFollowers} min={10} max={5000000} step={10} icon={Users} colorClass="text-[#e7e9ea]" tooltip="推文发布初期的基础流量池。粉丝基数越大，冷启动越容易。" allowInput={true} />
            <ControlSlider label="初始粉丝触达率" value={initialViewRate} setValue={setInitialViewRate} min={1} max={100} step={1} suffix="%" icon={Eye} colorClass="text-[#e7e9ea]" tooltip="并非所有粉丝都能看到你的推文。通常只有 5%-20% 的活跃粉丝会在第一时间刷到。" />
          </motion.div>

          {/* 2. 互动转化率 */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="bg-[#16181c]/80 backdrop-blur-md border border-[#2f3336] rounded-2xl p-6 shadow-lg">
            <div className="flex items-center gap-2 mb-6 border-b border-[#2f3336] pb-4">
              <Heart size={20} className="text-[#f91880]" />
              <h2 className="text-lg font-bold">互动转化率 (基于浏览量)</h2>
            </div>
            <ControlSlider label="点赞率 (Like)" value={likeRate} setValue={setLikeRate} min={0} max={20} step={0.1} suffix="%" icon={Heart} colorClass="text-[#f91880]" tooltip="看到推文的人中，点赞的比例。常规推文在 1%-5% 之间。" />
            <ControlSlider label="评论率 (Reply)" value={replyRate} setValue={setReplyRate} min={0} max={10} step={0.1} suffix="%" icon={MessageCircle} colorClass="text-[#1d9bf0]" tooltip="评论代表深度参与，虽然转化率低，但权重极高。" />
            <ControlSlider label="转发率 (Retweet)" value={retweetRate} setValue={setRetweetRate} min={0} max={10} step={0.1} suffix="%" icon={Repeat2} colorClass="text-[#00ba7c]" tooltip="内容裂变的核心。转发能直接将推文暴露给另一个粉丝网络。" />
            <ControlSlider label="收藏率 (Bookmark)" value={bookmarkRate} setValue={setBookmarkRate} min={0} max={10} step={0.1} suffix="%" icon={Bookmark} colorClass="text-[#1d9bf0]" tooltip="收藏被算法视为'高价值长效内容'的强烈信号。" />
            
            <div className="mt-6 pt-4 border-t border-[#2f3336]/50">
              <ControlSlider label="负面反馈率 (不感兴趣/拉黑)" value={negativeRate} setValue={setNegativeRate} min={0} max={1} step={0.01} suffix="%" icon={ThumbsDown} colorClass="text-[#f91880]" tooltip="点击'不感兴趣'或'屏蔽'的比例。这是算法最讨厌的行为，惩罚极重。" />
              <p className="text-xs text-[#f91880]/80 mt-1">警告：极小的负面反馈也会导致流量熔断</p>
            </div>
          </motion.div>

          {/* 3. 算法权重 */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="bg-[#16181c]/80 backdrop-blur-md border border-[#2f3336] rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-6 border-b border-[#2f3336] pb-4">
              <div className="flex items-center gap-2">
                <Settings2 size={20} className="text-[#ffd400]" />
                <h2 className="text-lg font-bold">算法权重 (单次互动带来浏览量)</h2>
              </div>
            </div>
            <ControlSlider label="点赞权重" value={likeWeight} setValue={setLikeWeight} min={0} max={50} step={1} icon={Heart} colorClass="text-[#f91880]" tooltip="开源代码中曾为 30，但目前已被大幅削弱，仅作为最基础的指标。" />
            <ControlSlider label="评论权重" value={replyWeight} setValue={setReplyWeight} min={0} max={50} step={1} icon={MessageCircle} colorClass="text-[#1d9bf0]" tooltip="开源代码中曾为 27。目前依然是深度参与的核心指标，尤其是作者回复的评论。" />
            <ControlSlider label="转发权重" value={retweetWeight} setValue={setRetweetWeight} min={0} max={100} step={1} icon={Repeat2} colorClass="text-[#00ba7c]" tooltip="开源代码中设定为 20。保持稳定，是内容裂变的基础。" />
            <ControlSlider label="收藏权重" value={bookmarkWeight} setValue={setBookmarkWeight} min={0} max={100} step={1} icon={Bookmark} colorClass="text-[#1d9bf0]" tooltip="马斯克公开确认的'安静的点赞'，目前权重史诗级加强，远超普通点赞。" />
          </motion.div>

          {/* 4. 全局参数 */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }} className="bg-[#16181c]/80 backdrop-blur-md border border-[#2f3336] rounded-2xl p-6 shadow-lg">
            <div className="flex items-center gap-2 mb-6 border-b border-[#2f3336] pb-4">
              <TrendingUp size={20} className="text-[#00ba7c]" />
              <h2 className="text-lg font-bold">全局参数</h2>
            </div>
            <ControlSlider label="破圈互动保留率 (陌生人互动衰减)" value={outOfNetworkPenalty} setValue={setOutOfNetworkPenalty} min={1} max={100} step={1} suffix="%" icon={Zap} colorClass="text-[#ffd400]" tooltip="推文被推给非粉丝(For You页面)时，陌生人的互动意愿通常只有粉丝的 10%-20%。" />
            <ControlSlider label="传播衰减系数 (时间半衰期)" value={decayFactor} setValue={setDecayFactor} min={0.1} max={1.5} step={0.05} icon={Clock} colorClass="text-[#ffd400]" tooltip="推特对老推文降权极快。开源算法中半衰期约为6小时（每过6小时权重减半）。" />
            <ControlSlider label="浏览 -> 关注转化率" value={followerConversionRate} setValue={setFollowerConversionRate} min={0} max={5} step={0.01} suffix="%" icon={Users} colorClass="text-[#00ba7c]" tooltip="每获得100个浏览量，能转化为多少个新粉丝。" />
            
            <div className="mt-6 pt-4 border-t border-[#2f3336]/50">
              <ControlSlider label="酷炫动画时长" value={simSpeed} setValue={setSimSpeed} min={0.5} max={5} step={0.1} suffix=" 秒" icon={Timer} colorClass="text-[#1d9bf0]" tooltip="调节'一键酷炫推演'的动画播放速度。" />
            </div>
          </motion.div>

        </div>

        {/* Right Content: Visualization */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Top Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard 
              playKey={playKey} speed={simSpeed} isSlowPlaying={isSlowPlaying}
              title="总浏览量 (Impressions)" 
              value={currentTotals.cumulativeViews} 
              icon={Eye} 
              colorClass="text-[#1d9bf0]"
              bgGradient="bg-[#1d9bf0]"
              subtitle={
                <span className="flex gap-1">
                  初始 <AnimatedCounter value={Math.round(baseFollowers * (initialViewRate / 100))} playKey={playKey} speed={simSpeed} isSlowPlaying={isSlowPlaying} /> + 
                  推荐 <AnimatedCounter value={currentTotals.cumulativeViews - Math.round(baseFollowers * (initialViewRate / 100))} playKey={playKey} speed={simSpeed} isSlowPlaying={isSlowPlaying} />
                </span>
              }
            />
            <StatCard 
              playKey={playKey} speed={simSpeed} isSlowPlaying={isSlowPlaying}
              title="最终粉丝数" 
              value={currentTotals.totalFollowers} 
              icon={Users} 
              colorClass="text-[#00ba7c]"
              bgGradient="bg-[#00ba7c]"
              subtitle={
                <span className="flex gap-1 text-[#00ba7c]">
                  新增 +<AnimatedCounter value={currentTotals.totalFollowers - baseFollowers} playKey={playKey} speed={simSpeed} isSlowPlaying={isSlowPlaying} />
                </span>
              }
            />
            <StatCard 
              playKey={playKey} speed={simSpeed} isSlowPlaying={isSlowPlaying}
              title="总互动量" 
              value={simulationData.slice(0, safeVisibleCycles + 1).reduce((acc, curr) => acc + curr.likes + curr.replies + curr.retweets + curr.bookmarks, 0)} 
              icon={Heart} 
              colorClass="text-[#f91880]"
              bgGradient="bg-[#f91880]"
              subtitle="点赞/评论/转发/收藏"
            />
            <StatCard 
              playKey={playKey} speed={simSpeed} isSlowPlaying={isSlowPlaying}
              title="负面反馈总计" 
              value={simulationData.slice(0, safeVisibleCycles + 1).reduce((acc, curr) => acc + curr.negatives, 0)} 
              icon={ThumbsDown} 
              colorClass="text-[#f91880]"
              bgGradient="bg-[#f91880]"
              subtitle="导致流量熔断的核心因素"
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
              流量传播趋势 (浏览量/轮次)
              {isSlowPlaying && <span className="ml-2 text-xs bg-[#1d9bf0]/20 text-[#1d9bf0] px-2 py-1 rounded animate-pulse">正在推演 第 {visibleCycles} 轮...</span>}
            </h3>
            <div className="h-[300px] w-full">
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
                  <Area type="monotone" dataKey="views" name="单轮新增浏览量" stroke="#1d9bf0" strokeWidth={3} fillOpacity={1} fill="url(#colorViews)" isAnimationActive={!isSlowPlaying} animationDuration={chartAnimDuration} animationEasing="ease-out" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-[#16181c]/80 backdrop-blur-md border border-[#2f3336] rounded-2xl p-6 shadow-lg">
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                <Users size={20} className="text-[#00ba7c]" />
                粉丝增长趋势
              </h3>
              <div className="h-[250px] w-full">
                <ResponsiveContainer key={playKey} width="100%" height="100%">
                  <LineChart data={displayedData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2f3336" vertical={false} />
                    <XAxis dataKey="cycle" stroke="#71767b" tick={{fill: '#71767b', fontSize: 12}} tickLine={false} axisLine={false} />
                    <YAxis stroke="#71767b" tick={{fill: '#71767b', fontSize: 12}} tickLine={false} axisLine={false} domain={['dataMin', 'dataMax']} tickFormatter={(value) => value >= 1000000 ? `${(value / 1000000).toFixed(1)}M` : value >= 1000 ? `${(value / 1000).toFixed(1)}k` : value} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#16181c', borderColor: '#2f3336', borderRadius: '12px', color: '#e7e9ea', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}
                    />
                    <Line type="monotone" dataKey="totalFollowers" name="总粉丝数" stroke="#00ba7c" strokeWidth={3} dot={{r: 4, fill: '#00ba7c', strokeWidth: 0}} activeDot={{r: 6, fill: '#fff', stroke: '#00ba7c', strokeWidth: 2}} isAnimationActive={!isSlowPlaying} animationDuration={chartAnimDuration} animationEasing="ease-out" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-[#16181c]/80 backdrop-blur-md border border-[#2f3336] rounded-2xl p-6 shadow-lg">
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                <Heart size={20} className="text-[#f91880]" />
                各轮互动量分解
              </h3>
              <div className="h-[250px] w-full">
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
                    <Bar dataKey="likes" name="点赞" stackId="a" fill="#f91880" radius={[0, 0, 0, 0]} isAnimationActive={!isSlowPlaying} animationDuration={chartAnimDuration} animationEasing="ease-out" />
                    <Bar dataKey="retweets" name="转发" stackId="a" fill="#00ba7c" radius={[0, 0, 0, 0]} isAnimationActive={!isSlowPlaying} animationDuration={chartAnimDuration} animationEasing="ease-out" />
                    <Bar dataKey="replies" name="评论" stackId="a" fill="#1d9bf0" radius={[0, 0, 0, 0]} isAnimationActive={!isSlowPlaying} animationDuration={chartAnimDuration} animationEasing="ease-out" />
                    <Bar dataKey="bookmarks" name="收藏" stackId="a" fill="#ffd400" radius={[4, 4, 0, 0]} isAnimationActive={!isSlowPlaying} animationDuration={chartAnimDuration} animationEasing="ease-out" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          </div>

          {/* Detailed Rulebook (Bottom Right) */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="bg-[#16181c] border border-[#2f3336] rounded-2xl p-0 relative overflow-hidden shadow-2xl mt-8">
            <div className="bg-[#202327] px-6 py-4 border-b border-[#2f3336] flex items-center gap-3 flex-wrap">
              <BookOpen size={20} className="text-[#1d9bf0]" />
              <h3 className="text-lg font-bold text-[#e7e9ea]">X 算法规则白皮书 (2026 修正版)</h3>
              
              <a 
                href="https://github.com/twitter/the-algorithm" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs font-medium text-[#71767b] hover:text-[#e7e9ea] bg-[#2f3336]/50 hover:bg-[#2f3336] px-3 py-1.5 rounded-full transition-colors ml-2"
              >
                <Github size={14} />
                <span>2023 官方开源代码</span>
                <ExternalLink size={12} className="opacity-70" />
              </a>

              <span className="ml-auto text-xs font-mono text-[#1d9bf0] bg-[#1d9bf0]/10 border border-[#1d9bf0]/30 px-2 py-1 rounded">Community Consensus v2.5</span>
            </div>
            
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Column 1 */}
              <div className="space-y-6">
                <div className="bg-[#1d9bf0]/5 border border-[#1d9bf0]/20 p-4 rounded-xl">
                  <h4 className="text-[#1d9bf0] font-bold text-sm flex items-center gap-2 mb-2">
                    <AlertTriangle size={16} /> ⚠️ 关于开源代码的时效性
                  </h4>
                  <p className="text-[#71767b] text-xs leading-relaxed">
                    官方代码开源于 2023 年初。本模拟器不仅基于该底层架构，还结合了马斯克最新公开确认及社区大规模逆向工程的结果，对参数进行了<strong>现代化修正</strong>：
                    <br/><br/>
                    <span className="text-[#e7e9ea]">1. 收藏 (Bookmarks) 史诗级加强</span>，权重远超点赞。<br/>
                    <span className="text-[#e7e9ea]">2. 点赞通货膨胀</span>，基础权重被大幅削弱。<br/>
                    <span className="text-[#e7e9ea]">3. 视频流量倾斜</span>，平台全力扶持视频内容。<br/>
                    <span className="text-[#e7e9ea]">4. 外链极度打压</span>，带外部链接的推文几乎被“判死刑”。
                  </p>
                </div>

                <div>
                  <h4 className="text-[#1d9bf0] font-bold text-sm flex items-center gap-2 mb-2">
                    <Heart size={16} /> 1. 核心权重体系 (The Core Formula)
                  </h4>
                  <p className="text-[#71767b] text-xs leading-relaxed mb-2">
                    算法通过预测用户互动的概率来给推文打分。最新修正的得分公式大致为：
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
                    <Zap size={16} /> 2. 破圈屏障 (In-Network vs Out-of-Network)
                  </h4>
                  <p className="text-[#71767b] text-xs leading-relaxed">
                    推特严格区分“粉丝”和“非粉丝”。当你的推文被放入 <strong>For You (为你推荐)</strong> 页面展示给陌生人时，由于缺乏信任基础，互动率通常会暴跌至粉丝的 10%-20%。<br/><br/>
                    <strong>破局点：</strong> 如果一条推文在“陌生人”群体中依然能保持较高的互动率，算法就会判定其具有“病毒性”，从而打开流量水龙头。
                  </p>
                </div>

                <div>
                  <h4 className="text-[#f91880] font-bold text-sm flex items-center gap-2 mb-2">
                    <ShieldAlert size={16} /> 3. 致命降权与惩罚 (Penalties)
                  </h4>
                  <ul className="text-[#71767b] text-xs leading-relaxed space-y-2 list-disc pl-4">
                    <li><strong className="text-[#e7e9ea]">负面反馈 (-74分)：</strong> 用户点击“不感兴趣”或“屏蔽作者”，惩罚力度是点赞的数倍。极少量的负面反馈就能杀死一条爆款。</li>
                    <li><strong className="text-[#e7e9ea]">外链限流 (Link Penalty)：</strong> 平台不希望用户离开App。带有外部链接的推文会被严重限流。</li>
                    <li><strong className="text-[#e7e9ea]">敏感/引战 (Toxicity)：</strong> 被NLP模型标记为不友善或NSFW的内容，直接降权 90% 以上。</li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-[#ffd400] font-bold text-sm flex items-center gap-2 mb-2">
                    <Clock size={16} /> 4. 时间半衰期 (Time Decay)
                  </h4>
                  <p className="text-[#71767b] text-xs leading-relaxed">
                    推特是实时新闻平台，对“旧闻”毫不留情。推文的半衰期大约只有 <strong>6小时</strong>。这意味着每过6小时，推文的推荐权重就会下降 50%。
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Novice Guide (Bottom Right) */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="bg-[#16181c] border border-[#2f3336] rounded-2xl p-0 relative overflow-hidden shadow-2xl mt-8">
            <div className="bg-[#202327] px-6 py-4 border-b border-[#2f3336] flex items-center gap-3">
              <Lightbulb size={20} className="text-[#ffd400]" />
              <h3 className="text-lg font-bold text-[#e7e9ea]">新手发推指南 (Dos & Don'ts)</h3>
              <span className="ml-auto text-xs font-medium text-[#71767b]">基于算法推演的实战建议</span>
            </div>
            
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Dos */}
              <div className="space-y-4">
                <h4 className="text-[#00ba7c] font-bold text-sm flex items-center gap-2 border-b border-[#2f3336] pb-2">
                  <CheckCircle2 size={16} /> 提升效果的好习惯 (Dos)
                </h4>
                <ul className="space-y-4">
                  <li className="flex gap-3">
                    <div className="mt-0.5 text-[#00ba7c]"><Bookmark size={14} /></div>
                    <div>
                      <strong className="text-[#e7e9ea] text-sm block mb-1">引导收藏 (Bookmarks)</strong>
                      <p className="text-[#71767b] text-xs leading-relaxed">算法目前最看重收藏。发布有长效价值、值得反复查看的内容（如干货长文、资源汇总、工具推荐），能获得极高的算法加权。</p>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <div className="mt-0.5 text-[#00ba7c]"><Film size={14} /></div>
                    <div>
                      <strong className="text-[#e7e9ea] text-sm block mb-1">多发原生视频/图文</strong>
                      <p className="text-[#71767b] text-xs leading-relaxed">平台大力扶持原生多媒体内容。相比纯文本，带图或视频的推文在初始曝光和“为你推荐”流中拥有更高的基础权重。</p>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <div className="mt-0.5 text-[#00ba7c]"><MessageCircle size={14} /></div>
                    <div>
                      <strong className="text-[#e7e9ea] text-sm block mb-1">积极互动与回复</strong>
                      <p className="text-[#71767b] text-xs leading-relaxed">推文发布后的前几个小时是黄金期。积极回复评论区的留言，能大幅增加推文的生命周期，并向算法释放“高参与度”信号。</p>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <div className="mt-0.5 text-[#00ba7c]"><BadgeCheck size={14} /></div>
                    <div>
                      <strong className="text-[#e7e9ea] text-sm block mb-1">购买蓝V认证 (X Premium)</strong>
                      <p className="text-[#71767b] text-xs leading-relaxed">官方明确的流量加权。不仅在“为你推荐”中更容易被分发，在别人的评论区也会获得更高的展示优先级。</p>
                    </div>
                  </li>
                </ul>
              </div>

              {/* Don'ts */}
              <div className="space-y-4">
                <h4 className="text-[#f91880] font-bold text-sm flex items-center gap-2 border-b border-[#2f3336] pb-2">
                  <XCircle size={16} /> 影响效果的坏习惯 (Don'ts)
                </h4>
                <ul className="space-y-4">
                  <li className="flex gap-3">
                    <div className="mt-0.5 text-[#f91880]"><LinkIcon size={14} /></div>
                    <div>
                      <strong className="text-[#e7e9ea] text-sm block mb-1">首条推文带外链</strong>
                      <p className="text-[#71767b] text-xs leading-relaxed">平台极度反感用户离开App。带外链的推文会被严重限流。如果必须发链接，请放在评论区，或者先发纯文本积累流量后再修改加上链接。</p>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <div className="mt-0.5 text-[#f91880]"><ShieldAlert size={14} /></div>
                    <div>
                      <strong className="text-[#e7e9ea] text-sm block mb-1">负面/引战内容 (Toxicity)</strong>
                      <p className="text-[#71767b] text-xs leading-relaxed">算法对“不感兴趣”、“屏蔽”等负面反馈的惩罚是致命的（权重扣减极大）。避免使用容易被系统判定为敏感或引战的词汇。</p>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <div className="mt-0.5 text-[#f91880]"><Clock size={14} /></div>
                    <div>
                      <strong className="text-[#e7e9ea] text-sm block mb-1">错峰发推 (Bad Timing)</strong>
                      <p className="text-[#71767b] text-xs leading-relaxed">推文半衰期极短（约6小时）。在你的粉丝最不活跃的时间发推，会导致冷启动失败，无法积累足够的初始互动进入下一个流量池。</p>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <div className="mt-0.5 text-[#f91880]"><Eye size={14} /></div>
                    <div>
                      <strong className="text-[#e7e9ea] text-sm block mb-1">纯文字无排版 (Wall of Text)</strong>
                      <p className="text-[#71767b] text-xs leading-relaxed">缺乏视觉焦点的长篇大论容易被快速划过，导致“停留时间”过短。停留时间也是算法衡量内容质量的重要隐性指标。</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>

        </div>
      </main>
    </div>
  );
}
