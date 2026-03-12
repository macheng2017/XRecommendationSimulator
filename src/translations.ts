export type Language = 'zh' | 'en';

export const translations = {
  zh: {
    title: "X (Twitter) 推荐算法推演模拟器",
    subtitle: "基于官方开源 Heavy Ranker 架构与 2026 最新权重修正",
    demo: "在线演示",
    stats: {
      estImpressions: "预估总展现量",
      likes: "点赞数",
      retweets: "转推数",
      bookmarks: "收藏数",
      replies: "评论数",
      newFollowers: "新增粉丝数",
      negative: "负面反馈数"
    },
    controls: {
      initialFollowers: "初始粉丝展现",
      likeRate: "点赞率",
      replyRate: "评论率",
      retweetRate: "转推率",
      bookmarkRate: "收藏率",
      negativeRate: "负面反馈率",
      likeWeight: "点赞权重",
      replyWeight: "评论权重",
      retweetWeight: "转推权重",
      bookmarkWeight: "收藏权重",
      followerConversion: "粉丝转化率",
      decayFactor: "时间衰减因子",
      outOfNetworkPenalty: "破圈互动保留率",
      simSpeed: "动画速度",
      cycles: "推演轮数"
    },
    toggles: {
      xPremium: "蓝V认证 (X Premium)",
      containsMedia: "包含图片/视频",
      containsLink: "包含外部链接",
      containsToxicity: "包含敏感/引战词汇"
    },
    buttons: {
      instantSim: "一键酷炫推演",
      stepSim: "慢速逐轮推演",
      simulating: "推演中..."
    },
    charts: {
      impressionTrend: "展现量趋势",
      engagementComparison: "互动数据对比",
      impressions: "展现量",
      likes: "点赞",
      retweets: "转推",
      replies: "评论",
      bookmarks: "收藏",
      cycle: "第 {n} 轮"
    },
    rulebook: {
      title: "X 算法规则白皮书 (2026 修正版)",
      officialCode: "2023 官方开源代码",
      warningTitle: "⚠️ 关于开源代码的时效性",
      warningText: "官方代码开源于 2023 年初。本模拟器不仅基于该底层架构，还结合了马斯克最新公开确认及社区大规模逆向工程的结果，对参数进行了<strong>现代化修正</strong>：<br/><br/><span className=\"text-[#e7e9ea]\">1. 收藏 (Bookmarks) 史诗级加强</span>，权重远超点赞。<br/><span className=\"text-[#e7e9ea]\">2. 点赞通货膨胀</span>，基础权重被大幅削弱。<br/><span className=\"text-[#e7e9ea]\">3. 视频流量倾斜</span>，平台全力扶持视频内容。<br/><span className=\"text-[#e7e9ea]\">4. 外链极度打压</span>，带外部链接的推文几乎被“判死刑”。",
      coreFormulaTitle: "1. 核心权重体系 (The Core Formula)",
      coreFormulaText: "算法通过预测用户互动的概率来给推文打分。最新修正的得分公式大致为：",
      inNetworkTitle: "2. 破圈屏障 (In-Network vs Out-of-Network)",
      inNetworkText: "推特严格区分“粉丝”和“非粉丝”。当你的推文被放入 <strong>For You (为你推荐)</strong> 页面展示给陌生人时，由于缺乏信任基础，互动率通常会暴跌至粉丝的 10%-20%。<br/><br/><strong>破局点：</strong> 如果一条推文在“陌生人”群体中依然能保持较高的互动率，算法就会判定其具有“病毒性”，从而打开流量水龙头。",
      penaltiesTitle: "3. 致命降权与惩罚 (Penalties)",
      penaltiesList1: "<strong className=\"text-[#e7e9ea]\">负面反馈 (-74分)：</strong> 用户点击“不感兴趣”或“屏蔽作者”，惩罚力度是点赞的数倍。极少量的负面反馈就能杀死一条爆款。",
      penaltiesList2: "<strong className=\"text-[#e7e9ea]\">外链限流 (Link Penalty)：</strong> 平台不希望用户离开App。带有外部链接的推文会被严重限流。",
      penaltiesList3: "<strong className=\"text-[#e7e9ea]\">敏感/引战 (Toxicity)：</strong> 被NLP模型标记为不友善或NSFW的内容，直接降权 90% 以上。",
      timeDecayTitle: "4. 时间半衰期 (Time Decay)",
      timeDecayText: "推特是实时新闻平台，对“旧闻”毫不留情。推文的半衰期大约只有 <strong>6小时</strong>。这意味着每过6小时，推文的推荐权重就会下降 50%。"
    },
    guide: {
      title: "新手发推指南 (Dos & Don'ts)",
      subtitle: "基于算法推演的实战建议",
      dosTitle: "提升效果的好习惯 (Dos)",
      dos1Title: "引导收藏 (Bookmarks)",
      dos1Text: "算法目前最看重收藏。发布有长效价值、值得反复查看的内容（如干货长文、资源汇总、工具推荐），能获得极高的算法加权。",
      dos2Title: "多发原生视频/图文",
      dos2Text: "平台大力扶持原生多媒体内容。相比纯文本，带图或视频的推文在初始曝光和“为你推荐”流中拥有更高的基础权重。",
      dos3Title: "积极互动与回复",
      dos3Text: "推文发布后的前几个小时是黄金期。积极回复评论区的留言，能大幅增加推文的生命周期，并向算法释放“高参与度”信号。",
      dos4Title: "购买蓝V认证 (X Premium)",
      dos4Text: "官方明确的流量加权。不仅在“为你推荐”中更容易被分发，在别人的评论区也会获得更高的展示优先级。",
      dontsTitle: "影响效果的坏习惯 (Don'ts)",
      donts1Title: "首条推文带外链",
      donts1Text: "平台极度反感用户离开App。带外链的推文会被严重限流。如果必须发链接，请放在评论区，或者先发纯文本积累流量后再修改加上链接。",
      donts2Title: "负面/引战内容 (Toxicity)",
      donts2Text: "算法对“不感兴趣”、“屏蔽”等负面反馈的惩罚是致命的（权重扣减极大）。避免使用容易被系统判定为敏感或引战的词汇。",
      donts3Title: "错峰发推 (Bad Timing)",
      donts3Text: "推文半衰期极短（约6小时）。在你的粉丝最不活跃的时间发推，会导致冷启动失败，无法积累足够的初始互动进入下一个流量池。",
      donts4Title: "纯文字无排版 (Wall of Text)",
      donts4Text: "缺乏视觉焦点的长篇大论容易被快速划过，导致“停留时间”过短。停留时间也是算法衡量内容质量的重要隐性指标。"
    },
    sections: {
      contentFeatures: "1. 内容特征 (Content Features)",
      engagementRates: "2. 互动转化率 (Engagement Rates)",
      algorithmWeights: "3. 算法权重 (Algorithm Weights)",
      globalParams: "4. 全局参数 (Global Params)"
    },
    mediaTypes: {
      text: "纯文本",
      image: "图文",
      video: "视频",
      link: "外链"
    }
  },
  en: {
    title: "X (Twitter) Algorithm Simulator",
    subtitle: "Based on official open-source Heavy Ranker & 2026 latest weight adjustments",
    demo: "Live Demo",
    stats: {
      estImpressions: "Est. Impressions",
      likes: "Likes",
      retweets: "Retweets",
      bookmarks: "Bookmarks",
      replies: "Replies",
      newFollowers: "New Followers",
      negative: "Negative Feedback"
    },
    controls: {
      initialFollowers: "Initial Follower Reach",
      likeRate: "Like Rate",
      replyRate: "Reply Rate",
      retweetRate: "Retweet Rate",
      bookmarkRate: "Bookmark Rate",
      negativeRate: "Negative Feedback Rate",
      likeWeight: "Like Weight",
      replyWeight: "Reply Weight",
      retweetWeight: "Retweet Weight",
      bookmarkWeight: "Bookmark Weight",
      followerConversion: "Follower Conversion",
      decayFactor: "Time Decay Factor",
      outOfNetworkPenalty: "Out-of-Network Retention",
      simSpeed: "Animation Speed",
      cycles: "Simulation Cycles"
    },
    toggles: {
      xPremium: "X Premium (Blue)",
      containsMedia: "Contains Media (Image/Video)",
      containsLink: "Contains External Link",
      containsToxicity: "Contains Toxicity"
    },
    buttons: {
      instantSim: "Instant Simulation",
      stepSim: "Step-by-Step Simulation",
      simulating: "Simulating..."
    },
    charts: {
      impressionTrend: "Impression Trend",
      engagementComparison: "Engagement Comparison",
      impressions: "Impressions",
      likes: "Likes",
      retweets: "Retweets",
      replies: "Replies",
      bookmarks: "Bookmarks",
      cycle: "Cycle {n}"
    },
    rulebook: {
      title: "X Algorithm Rulebook (2026 Edition)",
      officialCode: "2023 Official Source Code",
      warningTitle: "⚠️ About the Timeliness of Open Source Code",
      warningText: "The official code was open-sourced in early 2023. This simulator is not only based on that underlying architecture but also incorporates Elon Musk's latest public confirmations and the results of large-scale community reverse engineering, applying <strong>modern corrections</strong> to the parameters:<br/><br/><span className=\"text-[#e7e9ea]\">1. Bookmarks Epic Buff</span>, weight far exceeds likes.<br/><span className=\"text-[#e7e9ea]\">2. Like Inflation</span>, base weight has been significantly nerfed.<br/><span className=\"text-[#e7e9ea]\">3. Video Traffic Tilt</span>, the platform fully supports video content.<br/><span className=\"text-[#e7e9ea]\">4. External Links Severely Suppressed</span>, tweets with external links are almost 'sentenced to death'.",
      coreFormulaTitle: "1. The Core Formula",
      coreFormulaText: "The algorithm scores tweets by predicting the probability of user interaction. The latest revised scoring formula is roughly:",
      inNetworkTitle: "2. In-Network vs Out-of-Network",
      inNetworkText: "Twitter strictly distinguishes between 'followers' and 'non-followers'. When your tweet is placed in the <strong>For You</strong> page and shown to strangers, the interaction rate usually plummets to 10%-20% of followers due to a lack of trust.<br/><br/><strong>The Breakthrough Point:</strong> If a tweet can still maintain a high interaction rate among the 'stranger' group, the algorithm will judge it as 'viral' and open the traffic floodgates.",
      penaltiesTitle: "3. Penalties",
      penaltiesList1: "<strong className=\"text-[#e7e9ea]\">Negative Feedback (-74 points):</strong> Users clicking 'Not interested' or 'Block author', the penalty is several times that of a like. A tiny amount of negative feedback can kill a viral hit.",
      penaltiesList2: "<strong className=\"text-[#e7e9ea]\">Link Penalty:</strong> The platform does not want users to leave the App. Tweets with external links will be severely throttled.",
      penaltiesList3: "<strong className=\"text-[#e7e9ea]\">Toxicity:</strong> Content flagged by NLP models as unfriendly or NSFW is directly downgraded by over 90%.",
      timeDecayTitle: "4. Time Decay",
      timeDecayText: "Twitter is a real-time news platform and shows no mercy to 'old news'. The half-life of a tweet is only about <strong>6 hours</strong>. This means that every 6 hours, the recommendation weight of a tweet will drop by 50%."
    },
    guide: {
      title: "Novice Guide (Dos & Don'ts)",
      subtitle: "Practical advice based on algorithm simulation",
      dosTitle: "Good Habits to Boost Performance (Dos)",
      dos1Title: "Encourage Bookmarks",
      dos1Text: "The algorithm currently values bookmarks the most. Publishing content with long-term value that is worth reviewing repeatedly (such as long-form guides, resource compilations, tool recommendations) can get extremely high algorithm weighting.",
      dos2Title: "Post Native Video/Media",
      dos2Text: "The platform strongly supports native multimedia content. Compared to pure text, tweets with images or videos have a higher base weight in initial exposure and the 'For You' stream.",
      dos3Title: "Active Interaction & Replies",
      dos3Text: "The first few hours after a tweet is published are the golden period. Actively replying to comments can significantly increase the lifespan of the tweet and send a 'high engagement' signal to the algorithm.",
      dos4Title: "Get X Premium (Blue Check)",
      dos4Text: "Official explicit traffic weighting. Not only is it easier to be distributed in 'For You', but it also gets higher display priority in other people's comment sections.",
      dontsTitle: "Bad Habits that Hurt Performance (Don'ts)",
      donts1Title: "External Links in First Tweet",
      donts1Text: "The platform extremely dislikes users leaving the App. Tweets with external links will be severely throttled. If you must post a link, put it in the comments, or post pure text first to accumulate traffic and then edit to add the link.",
      donts2Title: "Toxicity / Baiting",
      donts2Text: "The algorithm's punishment for negative feedback like 'Not interested' or 'Block' is fatal (massive weight deduction). Avoid using words that are easily judged by the system as sensitive or baiting.",
      donts3Title: "Bad Timing",
      donts3Text: "The half-life of a tweet is extremely short (about 6 hours). Tweeting when your followers are least active will lead to a failed cold start, unable to accumulate enough initial interaction to enter the next traffic pool.",
      donts4Title: "Wall of Text",
      donts4Text: "Long speeches lacking visual focus are easily swiped past quickly, resulting in too short a 'dwell time'. Dwell time is also an important implicit metric for the algorithm to measure content quality."
    },
    sections: {
      contentFeatures: "1. Content Features",
      engagementRates: "2. Engagement Rates",
      algorithmWeights: "3. Algorithm Weights",
      globalParams: "4. Global Params"
    },
    mediaTypes: {
      text: "Text Only",
      image: "Image",
      video: "Video",
      link: "External Link"
    }
  }
};
