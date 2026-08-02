// 方言キャラタイプ（MBTI型のアイデンティティ供給）＋相性診断ロジック

export type DialectType = {
  slug: string; // URL用ASCIIキー
  dialect: string; // data.tsの方言名と一致させる
  name: string; // タイプ名
  emoji: string;
  tagline: string; // 一言キャッチ
  desc: string; // 性格診断文（褒め成分多め）
  love: string; // 恋愛・人間関係の傾向
  aruaru: string; // あるある
  best: string[]; // 相性の良いslug
  tricky: string[]; // 火花が散るslug
};

export const TYPES: DialectType[] = [
  {
    slug: "kansai",
    dialect: "大阪弁",
    name: "天性のムードメーカー",
    emoji: "🎤",
    tagline: "笑いで場を回す、コミュ力の化身",
    desc: "会話にオチを求め、沈黙を許さないサービス精神の持ち主。ツッコミの速さは思考の速さ。誰とでも距離を縮める天才で、あなたがいるだけで場が明るくなります。",
    love: "好きな人ほどイジってしまう。笑いのツボが合う相手と最強のカップルに。",
    aruaru: "「なんでやねん」が1日3回は出る。",
    best: ["hakata", "hokkaido"],
    tricky: ["kyoto"],
  },
  {
    slug: "kyoto",
    dialect: "京都弁",
    name: "はんなり戦略家",
    emoji: "🍵",
    tagline: "柔らかい言葉に、芯の強さを隠して",
    desc: "物腰は柔らかいのに、内側には確固たる美意識と判断力。直接言わずに伝える高等コミュニケーション術の使い手です。品の良さと知性で、気づけば周囲を動かしています。",
    love: "駆け引き上手。すぐには本心を見せないミステリアスさが最大の武器。",
    aruaru: "「考えとくわ」は大体NOの意味。",
    best: ["izumo", "kanazawa"],
    tricky: ["tosa"],
  },
  {
    slug: "hakata",
    dialect: "博多弁",
    name: "まっすぐ情熱家",
    emoji: "🔥",
    tagline: "好きなものは好きと言う、裏表ゼロ",
    desc: "思ったことを真っ直ぐ伝える正直者。情に厚く、仲間のためなら全力で動きます。「すいとーよ」に代表される素直な言葉は、聞く人の心を一瞬でつかみます。",
    love: "駆け引きなしの直球勝負。告白の成功率が高いのはこのタイプ。",
    aruaru: "語尾の「〜と？」で他県民をきゅんとさせがち。",
    best: ["kansai", "tosa"],
    tricky: ["izumo"],
  },
  {
    slug: "tsugaru",
    dialect: "津軽弁",
    name: "寡黙な職人",
    emoji: "❄️",
    tagline: "最小の言葉に、最大の想いを込めて",
    desc: "「どさ」「ゆさ」で会話が成立する省エネの美学。多くを語らないぶん、一言一言に重みがあります。不器用に見えて、実は誰よりも周りを見ている観察眼の持ち主。",
    love: "言葉より行動で示すタイプ。気づいたら隣で支えてくれている。",
    aruaru: "標準語で話すと「怒ってる？」と聞かれる。",
    best: ["akita", "kagoshima"],
    tricky: ["kansai"],
  },
  {
    slug: "hokkaido",
    dialect: "北海道弁",
    name: "おおらか開拓者",
    emoji: "🌌",
    tagline: "細かいことは「なんもなんも」",
    desc: "広い大地で育った、器の大きさが自慢。多少のトラブルは「なんもだよ〜」で受け流し、新しいことにも物怖じせず飛び込みます。一緒にいると呼吸が楽になる存在です。",
    love: "束縛しない自由な関係を好む。おおらかさに救われる人多数。",
    aruaru: "冬でも室内では半袖アイス。",
    best: ["kansai", "okinawa"],
    tricky: ["nagoya"],
  },
  {
    slug: "sendai",
    dialect: "仙台弁",
    name: "共感のプロフェッショナル",
    emoji: "🌾",
    tagline: "「だから〜！」で心の距離を縮める",
    desc: "相手の話に全力で乗っかる共感力こそ最大の才能。「だから！」の一言で「わかる〜！」を表現できる、聞き上手の鑑です。穏やかで争いを好まず、集団の潤滑油になります。",
    love: "共感ベースの安心できる恋。愚痴も自慢も全部受け止めてくれる。",
    aruaru: "「だから」で会話が通じず、続きを待たれる。",
    best: ["izumo", "akita"],
    tricky: ["hakata"],
  },
  {
    slug: "nagoya",
    dialect: "名古屋弁",
    name: "堅実なリアリスト",
    emoji: "🏯",
    tagline: "見栄より実利、コスパの求道者",
    desc: "地に足のついた合理主義者。モーニング文化に象徴される「賢くお得に楽しむ」精神の体現者です。派手さはなくても、決めるときは大胆。信頼できる参謀タイプ。",
    love: "記念日はしっかり祝うが、普段は堅実。長続きカップル率No.1。",
    aruaru: "「机をつる」が通じなくて衝撃を受ける。",
    best: ["kyoto", "hiroshima"],
    tricky: ["okinawa"],
  },
  {
    slug: "hiroshima",
    dialect: "広島弁",
    name: "面倒見のいい兄貴・姉御",
    emoji: "⚓",
    tagline: "「たいぎい」と言いつつ、結局やる",
    desc: "口は悪めでも情は深い、頼れるリーダー気質。「〜じゃけえ」の力強い響きとは裏腹に、困っている人を放っておけません。仲間からの信頼はダントツです。",
    love: "ぶっきらぼうな優しさで沼らせるタイプ。ギャップ萌えの宝庫。",
    aruaru: "「みてる」（なくなる）が通じず二度言う。",
    best: ["nagoya", "tosa"],
    tricky: ["kyoto"],
  },
  {
    slug: "izumo",
    dialect: "出雲弁",
    name: "縁結びの聞き上手",
    emoji: "⛩️",
    tagline: "ご縁を大切に、そっと寄り添う",
    desc: "神話の国で育まれた、穏やかで奥ゆかしい人柄。自分が話すより相手の話をじっくり聞き、人と人を静かにつなぎます。あなたの周りでは、なぜか良いご縁が生まれます。",
    love: "運命を信じるロマンチスト。焦らないことで最良の縁を引き寄せる。",
    aruaru: "「だんだん」（ありがとう）の温かさを布教したくなる。",
    best: ["kyoto", "sendai"],
    tricky: ["hakata"],
  },
  {
    slug: "tosa",
    dialect: "土佐弁",
    name: "豪快な冒険家",
    emoji: "🐋",
    tagline: "「〜ぜよ」と言い切る、龍馬の末裔",
    desc: "スケールの大きな話が大好きな、生まれながらの冒険者。細かいことは気にせず、思い立ったら即行動。その豪快さと明るさに、周囲は自然とついていきます。",
    love: "情熱的で一途。好きになったら全力アタックの猪突猛進型。",
    aruaru: "宴会での「返杯」文化に他県民が驚く。",
    best: ["hakata", "hiroshima"],
    tricky: ["kyoto"],
  },
  {
    slug: "kagoshima",
    dialect: "鹿児島弁",
    name: "不言実行のサムライ",
    emoji: "🌋",
    tagline: "議を言うな、背中で語れ",
    desc: "「ぐだぐだ言わずにやる」薩摩隼人の精神を受け継ぐ実行者。口数は少なくても、決めたことは必ずやり遂げます。芯の強さと義理堅さで、一生モノの信頼を勝ち取るタイプ。",
    love: "愛情表現は不器用だが、一度決めた相手には一途を貫く。",
    aruaru: "「〜もす」で時代劇と言われるが誇りに思っている。",
    best: ["tsugaru", "hiroshima"],
    tricky: ["kansai"],
  },
  {
    slug: "okinawa",
    dialect: "沖縄方言",
    name: "なんくるないさ楽天家",
    emoji: "🌺",
    tagline: "だいじょうぶ、なんとかなるさ〜",
    desc: "南国の太陽のような、圧倒的ポジティブオーラの持ち主。「なんくるないさ」の精神で、どんなピンチも笑顔に変えます。あなたの周りには自然と人が集まり、時間がゆったり流れます。",
    love: "細かいことを気にしない癒し系。一緒にいるだけで元気になれる恋人。",
    aruaru: "「だからよ〜」で全てに共感できる。",
    best: ["hokkaido", "awa"],
    tricky: ["nagoya"],
  },
  {
    slug: "akita",
    dialect: "秋田弁",
    name: "マイペースな癒し職人",
    emoji: "🍶",
    tagline: "急がない、慌てない、それがいい",
    desc: "自分のリズムを大切にする、天然の癒し系。「んだんだ」の相づちには、聞く人の肩の力を抜く不思議な力があります。飾らない素朴さこそ、あなたの最強の魅力です。",
    love: "ゆっくり育てる発酵型の恋。気づけば一番落ち着く存在になっている。",
    aruaru: "県外で「え、今の何語？」と聞き返される。",
    best: ["tsugaru", "sendai"],
    tricky: ["tosa"],
  },
  {
    slug: "yamagata",
    dialect: "山形弁",
    name: "実直な働き者",
    emoji: "🍒",
    tagline: "口下手でも、手は誰より動く",
    desc: "黙々と積み上げる努力を惜しまない、信頼の塊のような人。派手なアピールはしませんが、周囲はあなたの働きをちゃんと見ています。感謝の「もっけだの」が似合う、義理堅い人柄です。",
    love: "尽くす愛情表現。言葉より弁当や送り迎えで愛を示すタイプ。",
    aruaru: "「んだず」「んだにゃ〜」のバリエーションで全会話が成立する。",
    best: ["sendai", "niigata"],
    tricky: ["kobe"],
  },
  {
    slug: "ibaraki",
    dialect: "茨城弁",
    name: "飾らない自然体",
    emoji: "🍈",
    tagline: "「だっぺ」で通じ合える気楽さ",
    desc: "見栄を張らず、誰にでも同じ態度で接するフラットさが最大の魅力。細かいことを気にしないおおらかさで、一緒にいる人の肩の力を抜いてくれます。実は面倒見も抜群。",
    love: "気取らない等身大の恋。飾らなさが逆に新鮮で沼る人続出。",
    aruaru: "怒ってないのに「怒ってる？」と聞かれる（イントネーションのせい）。",
    best: ["hokkaido", "shizuoka"],
    tricky: ["kanazawa"],
  },
  {
    slug: "niigata",
    dialect: "新潟弁",
    name: "粘り強い努力家",
    emoji: "🌾",
    tagline: "雪に鍛えられた、へこたれない心",
    desc: "コツコツ型の頑張り屋で、一度決めたら簡単には諦めません。豪雪を越えるたび強くなる米どころの心で、逆境ほど本領を発揮します。控えめだけど芯は誰より太いタイプ。",
    love: "ゆっくり深く愛を育てる。長期戦に強く、結婚後に真価を発揮。",
    aruaru: "「〜ら？」「そいがー」が県外で通じずびっくりする。",
    best: ["yamagata", "kanazawa"],
    tricky: ["okinawa"],
  },
  {
    slug: "kanazawa",
    dialect: "金沢弁",
    name: "雅な完璧主義者",
    emoji: "✨",
    tagline: "美意識だけは、ゆずれんげん",
    desc: "加賀百万石の文化に育まれた、審美眼の持ち主。持ち物も言葉選びも所作も、さりげなく上質。「あんやと」の柔らかな響きのように、丁寧な暮らしを大切にします。",
    love: "雰囲気重視のロマンチスト。記念日やデートの演出センスは全タイプ随一。",
    aruaru: "語尾の「〜げん」「〜まっし」が可愛いと褒められがち。",
    best: ["kyoto", "niigata"],
    tricky: ["ibaraki"],
  },
  {
    slug: "shinshu",
    dialect: "信州弁",
    name: "山の哲学者",
    emoji: "⛰️",
    tagline: "「ずく」を出せば、何でもできる",
    desc: "理屈で納得しないと動かない、思慮深い理論派。でも一度「ずく（やる気）」を出せば、山をも動かす行動力を見せます。議論好きで、本質を突く一言に周囲がハッとさせられます。",
    love: "誠実で一途。口説き文句より将来設計を語り出す堅実派。",
    aruaru: "「ずくなし」と言われると地味に一番傷つく。",
    best: ["shizuoka", "izumo"],
    tricky: ["kansai"],
  },
  {
    slug: "shizuoka",
    dialect: "静岡弁",
    name: "マイペースな大物",
    emoji: "🗻",
    tagline: "のんびり「だら〜」でも、器は富士山級",
    desc: "急かされてもマイペースを崩さない、天性のリラックス体質。その穏やかさは周囲への安心感になり、いざという時は富士山のようにどっしり構えて頼りになります。",
    love: "焦らない大らかな恋。「〜だら？」の柔らかい響きに癒される人多数。",
    aruaru: "お茶の消費量と歩くスピードの遅さには自信がある。",
    best: ["iyo", "ibaraki"],
    tricky: ["hakata"],
  },
  {
    slug: "kobe",
    dialect: "神戸弁",
    name: "おしゃれな社交家",
    emoji: "🌉",
    tagline: "「知っとう？」港町仕込みのセンス",
    desc: "新しいものと古いものを軽やかにミックスする、都会的なバランス感覚の持ち主。関西のノリと洗練を両立し、どんな場でもスマートに立ち回ります。さりげない気配りも一級品。",
    love: "デートコース選びが上手いエスコート派。距離の詰め方が絶妙。",
    aruaru: "「大阪と一緒にせんといて」と心の中で思っている。",
    best: ["nagasaki", "kansai"],
    tricky: ["yamagata"],
  },
  {
    slug: "okayama",
    dialect: "岡山弁",
    name: "晴れの国の楽観家",
    emoji: "🍑",
    tagline: "でーれー前向き、心はいつも晴れ",
    desc: "「晴れの国」で育った、カラッと明るいポジティブ思考の持ち主。失敗しても「まあ、ええが」と切り替えが早く、周囲まで前向きにさせます。実は計画性もあるしっかり者。",
    love: "明るく健全な恋愛観。ジメジメした駆け引きとは無縁の太陽タイプ。",
    aruaru: "「でーれー」「ぼっけー」「もんげー」の使い分けを聞かれて困る。",
    best: ["sanuki", "hiroshima"],
    tricky: ["niigata"],
  },
  {
    slug: "sanuki",
    dialect: "讃岐弁",
    name: "コシの強い実務家",
    emoji: "🍜",
    tagline: "うどん県仕込みの段取り力",
    desc: "うどんのコシのように、しなやかで折れない実務能力の持ち主。段取り上手で無駄がなく、頼まれごとは「ほな、しよか」と淡々とこなします。「〜けん」「ほんだら」と話が早く、気づけば周りの世話まで焼いています。",
    love: "世話焼き型。好きな人の生活がどんどん快適になっていく。",
    aruaru: "うどんは飲み物。年越しもうどん。",
    best: ["okayama", "iyo"],
    tricky: ["tosa"],
  },
  {
    slug: "iyo",
    dialect: "伊予弁",
    name: "ほんわか平和主義者",
    emoji: "🍊",
    tagline: "「〜やけん」で角が立たない",
    desc: "おっとりした語り口で、争いごとを自然に丸くおさめる調停の名人。みかんのような甘くて優しい雰囲気の中に、瀬戸内育ちの芯の明るさがあります。あなたの周りはいつも穏やかです。",
    love: "包容力で愛される癒し系。ケンカになっても先に折れてくれる。",
    aruaru: "蛇口からポンジュースは「半分本当」と説明する。",
    best: ["sanuki", "shizuoka"],
    tricky: ["kagoshima"],
  },
  {
    slug: "kumamoto",
    dialect: "熊本弁",
    name: "肥後もっこすの一徹者",
    emoji: "🐻",
    tagline: "曲げん、譲らん、でも情に厚か",
    desc: "一度こうと決めたら梃子でも動かない「肥後もっこす」気質。頑固に見えて、その実まっすぐで裏表がなく、仲間のためなら損得抜きで動きます。信念を持つあなたの背中に人がついてきます。",
    love: "不器用な一途型。「好いとる」の一言に全てを込める。",
    aruaru: "「あとぜき」（開けたドアを閉める）が標準語だと思っていた。",
    best: ["kagoshima", "hakata"],
    tricky: ["kyoto"],
  },
  {
    slug: "nagasaki",
    dialect: "長崎弁",
    name: "開かれた国際派",
    emoji: "⛵",
    tagline: "ちゃんぽん文化のミックス上手",
    desc: "異文化を柔軟に受け入れてきた港町の血を引く、好奇心旺盛なオープンマインド。初対面の人ともすぐ打ち解け、違う価値観を面白がれる懐の深さがあります。新しい風を運ぶ存在です。",
    love: "国境も県境も越えるボーダレスな恋愛観。遠距離にも強い。",
    aruaru: "「とっとっと？」の無限ループ会話で他県民を混乱させる。",
    best: ["kobe", "okinawa"],
    tricky: ["shinshu"],
  },
  {
    slug: "iwate",
    dialect: "南部弁",
    name: "雨ニモマケヌ辛抱人",
    emoji: "🐴",
    tagline: "口数少なく、芯は南部鉄器",
    desc: "厳しい冬を静かに越える、忍耐力の化身。多くを語らず、決して焦らず、それでも最後までやり抜きます。宮沢賢治の故郷に流れる「みんなのために」の心を、あなたも受け継いでいます。",
    love: "派手さゼロの誠実な愛。10年後も変わらず隣にいてくれる安心感。",
    aruaru: "わんこそばの自己記録を静かに更新し続けている。",
    best: ["tsugaru", "akita"],
    tricky: ["kansai"],
  },
  {
    slug: "fukushima",
    dialect: "福島弁",
    name: "じっくり人情家",
    emoji: "🌸",
    tagline: "「さすけね」で全部包み込む",
    desc: "何があっても「さすけね（大丈夫）」と受け止める、懐の深い人情派。打ち解けるまで時間はかかりますが、一度仲間と認めたら一生モノの付き合いをします。芯の粘り強さは折り紙付き。",
    love: "ゆっくり燃えるろうそく型。派手な告白より日々の積み重ねで愛を証明。",
    aruaru: "「んだべした」のイントネーションで出身がバレる。",
    best: ["sendai", "ibaraki"],
    tricky: ["kobe"],
  },
  {
    slug: "toyama",
    dialect: "富山弁",
    name: "粘り強い商人魂",
    emoji: "🌷",
    tagline: "「きときと」の目利きは伊達じゃない",
    desc: "薬売りの伝統を受け継ぐ、信用第一の堅実派。コツコツ信頼を積み上げ、約束は必ず守ります。質の良いものを見抜く目利き力と、雪国仕込みの粘り強さで、着実に成果を出すタイプ。",
    love: "誠実さで勝負する正攻法。家計管理を任せたら日本一頼れる。",
    aruaru: "「〜ちゃ」と言うたびド◯えもんと言われるが富山の方が先だと思っている。",
    best: ["kanazawa", "niigata"],
    tricky: ["okinawa"],
  },
  {
    slug: "hida",
    dialect: "飛騨弁",
    name: "山里の寡黙な匠",
    emoji: "🪵",
    tagline: "言葉より、手仕事で語る",
    desc: "飛騨の匠の血を引く、こだわりの職人気質。口数は少なくても、仕上げた仕事の美しさが全てを物語ります。山里のゆったりした時間感覚で、丁寧な暮らしを大切にする人です。",
    love: "手作りのプレゼントや修理で愛を伝える不器用な優しさ。",
    aruaru: "「〜やさ」「〜のやお」が県外で通じず、結局標準語に直す。",
    best: ["shinshu", "nagoya"],
    tricky: ["hakata"],
  },
  {
    slug: "ise",
    dialect: "伊勢弁",
    name: "おかげさまの和み人",
    emoji: "🦞",
    tagline: "「〜やんか」のゆるふわ関西風",
    desc: "お伊勢参りの参拝客を千年迎えてきた土地柄そのままの、おもてなし上手。関西のノリと東海ののんびりが絶妙にブレンドされた、誰とでも波長を合わせられる和みの達人です。",
    love: "「おかげさま」の感謝を忘れない、穏やかで長続きする恋。",
    aruaru: "関西人には「関西弁ちゃうやん」、東海人には「関西弁やん」と言われる。",
    best: ["kansai", "wakayama"],
    tricky: ["tsugaru"],
  },
  {
    slug: "wakayama",
    dialect: "和歌山弁",
    name: "熊野のパワフル自由人",
    emoji: "🌊",
    tagline: "細かいことは気にせん、太陽気質",
    desc: "黒潮のようにエネルギッシュで、型にはまらない自由人。「ざ」が「だ」になっても気にしない、おおらかさと度胸が持ち味です。自然体の明るさで、周囲をぐいぐい引っ張ります。",
    love: "情熱的なストレート勝負。回りくどい駆け引きは一切なし。",
    aruaru: "「ぞうきん」を「どうきん」と言って一瞬会話が止まる。",
    best: ["ise", "kansai"],
    tricky: ["kanazawa"],
  },
  {
    slug: "tottori",
    dialect: "鳥取弁",
    name: "砂丘の静かな夢想家",
    emoji: "🐫",
    tagline: "のんびり、でも星はちゃんと見とる",
    desc: "日本一人口の少ない県で育った、マイペースな夢追い人。騒がず焦らず、自分の世界を大切に育てます。星空のように澄んだ感性と、意外な行動力のギャップが魅力です。",
    love: "静かに想いを温める片想い長期型。実らせたら一途一筋。",
    aruaru: "「鳥取と島根どっちが右？」に慣れすぎて怒りもしない。",
    best: ["izumo", "okayama"],
    tricky: ["tosa"],
  },
  {
    slug: "yamaguchi",
    dialect: "山口弁",
    name: "志高き改革者",
    emoji: "🐡",
    tagline: "「〜ちゃ」で決める維新の血筋",
    desc: "維新の志士を生んだ土地の、未来を見据える戦略家。穏やかな「〜ちゃ」の語り口とは裏腹に、変化を恐れず新しい道を切り拓きます。目標を決めたときの集中力は歴史が証明済み。",
    love: "将来のビジョンを語り合える相手に惹かれる。結婚後の設計図はもう出来ている。",
    aruaru: "「ぶち」は広島弁と言われるたびに「山口でも言う」と訂正する。",
    best: ["hiroshima", "hakata"],
    tricky: ["kanazawa"],
  },
  {
    slug: "awa",
    dialect: "阿波弁",
    name: "踊る楽天家",
    emoji: "🥁",
    tagline: "踊る阿呆に見る阿呆、なら踊らにゃ損",
    desc: "阿波おどりの血が騒ぐ、リズム感抜群のポジティブ人間。「まけまけいっぱい」の人生を楽しみ、落ち込んでもすぐ立ち直ります。あなたが輪の中心にいると、自然と祭りが始まります。",
    love: "楽しさ最優先の恋。一緒に笑える相手となら、どこまでも行ける。",
    aruaru: "8月になると体が勝手に二拍子を刻み出す。",
    best: ["sanuki", "kansai"],
    tricky: ["kanazawa"],
  },
  {
    slug: "oita",
    dialect: "大分弁",
    name: "マイペースな湯治人",
    emoji: "♨️",
    tagline: "「よだきい」と言いつつ、湯加減は完璧",
    desc: "日本一の温泉県で育った、脱力系の癒し人。「よだきい（面倒くさい）」が口癖でも、やる時はきっちりやる緩急の使い手です。あなたと一緒にいると、温泉に浸かったように心がほぐれます。",
    love: "束縛なしのぬるま湯的心地よさ。気づけば長湯ならぬ長い付き合いに。",
    aruaru: "「しんけん」（とても）が通じず真剣な顔をされる。",
    best: ["iyo", "kumamoto"],
    tricky: ["nagoya"],
  },
];

// マスコット名（キャラクターとしての名前。診断結果やキャラ図鑑に表示）
export const MASCOT_NAMES: Record<string, string> = {
  kansai: "ツッコミにゃん吉",
  kyoto: "はんなりコン吉",
  hakata: "めんたい熱男",
  tsugaru: "じょっぱりりんご坊",
  hokkaido: "でっかいどうグマ",
  sendai: "伊達すずめ",
  nagoya: "金しゃちメガネ",
  hiroshima: "兄貴ライオン",
  izumo: "えんむすび宮司",
  tosa: "麦わら土佐犬",
  kagoshima: "せごどん犬",
  okinawa: "シーサーちゃん",
  akita: "秋田犬まる",
  yamagata: "さくらんぼ職人",
  ibaraki: "だっぺ君",
  niigata: "コシヒカリとき丸",
  kanazawa: "加賀の雅ねこ",
  shinshu: "哲学ざる",
  shizuoka: "ちゃっきり坊や",
  kobe: "港町ベレー猫",
  okayama: "きびだんご猿吉",
  sanuki: "うどん番長",
  iyo: "みかん湯あがり姫",
  kumamoto: "もっこすグマ",
  nagasaki: "尾曲がりマドロス猫",
  iwate: "わんこそば犬",
  fukushima: "あかべこどん",
  toyama: "きときと雷鳥",
  hida: "さるぼぼ匠",
  ise: "おかげ犬みち助",
  wakayama: "熊野パンダ",
  tottori: "因幡のしろうさぎ",
  yamaguchi: "ふぐ提灯志士",
  awa: "踊りだぬき囃子",
  oita: "湯けむりモンキー",
};

export function typeBySlug(slug: string): DialectType | undefined {
  return TYPES.find((t) => t.slug === slug);
}

export function typeByDialect(dialect: string): DialectType | undefined {
  return TYPES.find((t) => t.dialect === dialect);
}

// 安定した擬似乱数（同じペアなら常に同じスコア）
function pairHash(a: string, b: string): number {
  const s = [a, b].sort().join("|");
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

export type Affinity = { score: number; title: string; comment: string };

export function affinity(a: DialectType, b: DialectType): Affinity {
  const h = pairHash(a.slug, b.slug);
  // スコアは0〜100%のフルレンジを使う（極端な数字ほど盛り上がる）
  if (a.slug === b.slug) {
    return {
      score: 80 + (h % 16), // 80-95
      title: "鏡合わせの二人",
      comment: `同じ「${a.name}」同士。言わなくても通じる安心感は抜群。ただし似た者同士、譲らない場面ではとことん平行線になるかも。`,
    };
  }
  const isBest = a.best.includes(b.slug) || b.best.includes(a.slug);
  const isTricky = a.tricky.includes(b.slug) || b.tricky.includes(a.slug);
  if (isBest) {
    return {
      score: 86 + (h % 15), // 86-100
      title: "運命の黄金コンビ",
      comment: `${a.emoji}${a.name}と${b.emoji}${b.name}は、お互いの持ち味を最大限に引き出し合う最高の組み合わせ。一緒にいるほど二人らしくいられます。`,
    };
  }
  if (isTricky) {
    return {
      score: 2 + (h % 24), // 2-25
      title: "火花散る好敵手",
      comment: `${a.emoji}${a.name}と${b.emoji}${b.name}は、価値観が正面衝突する刺激マックスの関係。でもこの数字を一緒に笑えたら、実は誰より学び合える相手に化けます。`,
    };
  }
  return {
    score: 35 + (h % 45), // 35-79
    title: "じわじわ深まる仲",
    comment: `${a.emoji}${a.name}と${b.emoji}${b.name}は、急がずゆっくり距離が縮まるタイプの相性。共通の話題（まずは方言ネタ）から始めるのが吉。`,
  };
}

// ---------- シェア ----------
export function shareUrls(text: string, url: string) {
  const t = encodeURIComponent(text);
  const u = encodeURIComponent(url);
  return {
    x: `https://twitter.com/intent/tweet?text=${t}&url=${u}`,
    line: `https://social-plugins.line.me/lineit/share?url=${u}&text=${t}`,
  };
}
