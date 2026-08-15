import type { Metadata } from "next";
import { ArticleShell, H2, H3, P, Note, Sources, ShindanCta } from "@/components/article";
import { getArticle } from "@/lib/articles";

const article = getArticle("hogen-accent-chizu")!;

export const metadata: Metadata = {
  title: `${article.title} | 方言ラボ`,
  description: article.description,
  alternates: { canonical: "https://hogen.mainichi-lab.com/blog/hogen-accent-chizu" },
};

/** 高低パターンを見せる小さな図 */
function Pitch({
  label,
  mora,
  pattern,
  note,
}: {
  label: string;
  mora: string[];
  /** "H" | "L" の配列。mora と同じ長さ */
  pattern: ("H" | "L")[];
  note?: string;
}) {
  return (
    <div className="flex items-center gap-3 py-2">
      <span className="text-[12px] text-sub w-14 shrink-0">{label}</span>
      <span className="flex items-end gap-0.5">
        {mora.map((m, i) => (
          <span key={i} className="flex flex-col items-center w-7">
            <span
              className={`block w-full h-0.5 rounded ${
                pattern[i] === "H" ? "bg-primary" : "bg-line"
              } ${pattern[i] === "H" ? "mb-1.5" : "mt-4 mb-1.5"}`}
            />
            <span className="text-[13px] font-bold leading-none">{m}</span>
          </span>
        ))}
      </span>
      {note && <span className="text-[11px] text-sub">{note}</span>}
    </div>
  );
}

export default function Page() {
  return (
    <ArticleShell article={article}>
      <P>
        上京して「なまってるね」と言われた人が、心当たりを探して自分の語彙を点検する——というのはよくある光景です。
        でも本人が「〜だべ」も「〜やん」も使っていないなら、指摘されたのはたぶん単語ではありません。
        <strong>音の高さの上がり下がり、つまりアクセント</strong>です。
      </P>
      <P>
        アクセントは語彙と違って自覚しにくく、意識して直すのも難しい。
        それでいて日本地図の上できれいに分布しています。この記事では、日本語のアクセントがどう分かれていて、
        どこで何が起きているのかを整理します。
      </P>

      <H2>日本語のアクセントは「高低」で意味を区別する</H2>
      <P>
        英語のアクセントは強く読む場所（強弱アクセント）ですが、日本語は音の高さで区別します（高低アクセント）。
        有名な例が「箸」と「橋」です。母音も子音もまったく同じなのに、どこで音が下がるかだけで別の語になります。
      </P>

      <div className="card p-4 sm:p-5 my-5">
        <p className="text-xs font-bold text-sub mb-1">東京式（東京）</p>
        <Pitch label="箸" mora={["は", "し"]} pattern={["H", "L"]} note="頭が高い" />
        <Pitch label="橋" mora={["は", "し"]} pattern={["L", "H"]} note="後ろが高い" />
        <p className="text-xs font-bold text-sub mt-4 mb-1">京阪式（京都・大阪）</p>
        <Pitch label="箸" mora={["は", "し"]} pattern={["L", "H"]} />
        <Pitch label="橋" mora={["は", "し"]} pattern={["H", "L"]} />
        <p className="text-[12px] text-sub leading-[1.9] mt-3">
          東と西で、ちょうど入れ替わります。関西の人が「はし（橋）」と言うと、
          関東の人には「箸」に聞こえてしまう——という行き違いが実際に起こります。
        </p>
      </div>

      <P>
        さらに「端」を加えると、東京式では「橋」と「端」も区別されます。
        どちらも「低・高」で始まりますが、助詞をつけると差が出ます。
        「橋が」は<strong>「が」で下がる</strong>のに対し、「端が」は<strong>「が」まで高いまま</strong>。
        単語だけを聞き比べても違いがわからないのに、助詞を足したとたん別物になるのが日本語のアクセントの厄介なところです。
      </P>

      <H2>大きく分けて4つの系統がある</H2>
      <P>
        日本語のアクセントは、研究上いくつかの型に分類されます。ここでは代表的な4つを見ていきます。
      </P>

      <H3>① 東京式アクセント（いちばん広い）</H3>
      <P>
        北海道、東北北部、関東西部、甲信越、東海（三重県を除く）、奈良県南部、近畿北西部、中国地方、
        四国南西部、九州北東部などに分布します。
        面積でいえば日本でもっとも広く使われている型で、標準語のアクセントもこの系統です。
        <strong>どこで下がるか（下げ核の位置）だけが問題</strong>になり、語頭の高低は自動的に決まります。
      </P>

      <H3>② 京阪式アクセント（近畿・四国）</H3>
      <P>
        近畿の大部分と、福井県小浜市付近、岐阜県揖斐川町、四国の大半に分布します。
        東京式より情報量が多く、下がる位置に加えて
        <strong>語の始まりが高いか低いかも意味の区別に使われます</strong>。
        だからこそ「箸」と「橋」で東京式と正反対の結果になるわけです。
        京阪式は東京式より古い体系を保っているとされ、平安時代の京都のアクセントに近いと考えられています。
      </P>

      <H3>③ 無アクセント（高低で区別しない）</H3>
      <P>
        東北南部・関東北東部、八丈島、静岡県大井川上流域、福井県嶺北地方の平野部、
        九州中部（宮崎県など）に分布します。
        <strong>ピッチが意味の区別に使われないため、「箸」も「橋」も「端」も同じ発音になります</strong>。
        文脈で判断するので、話者自身は不便を感じません。
        「崩れている」のではなく、高低を弁別に使わないという別の体系です。
      </P>
      <Note title="無アクセントは特殊なのか">
        世界の言語を見渡せば、高さで単語を区別しない言語のほうが多数派です。
        日本語のなかで無アクセント地域が例外的に見えるのは、あくまで日本語内部の比較の話にすぎません。
      </Note>

      <H3>④ 一型・二型アクセント（九州南部・琉球）</H3>
      <P>
        宮崎県都城市や鹿児島県の旧志布志町では、
        <strong>すべての単語・文節で最終音節を高く発音する</strong>「一型アクセント」が使われます。
        単語ごとの型がひとつしかない、という意味です。
      </P>
      <P>
        九州西南部や琉球には、型が2種類しかない「二型アクセント」が分布します。
        長崎県南部、鹿児島県の大部分などが該当します。
        東京式（下げ核の位置の数だけ型がある）に比べると、語のパターンが極端に少ない体系です。
      </P>

      <H2>この分布、どこかで見た形をしている</H2>
      <P>
        並べ直すと、面白い順序が浮かび上がります。
        <strong>中央に複雑な京阪式、その両脇に東京式、さらに外側に二型、いちばん外に無アクセント</strong>。
        中心から外へ行くほど体系が単純になっていくのです。
      </P>
      <P>
        これは方言周圏論——京都を中心に新しい言い方が波紋のように広がり、遠い土地ほど古い形が残る——
        という考え方で説明されることがあります。
        アクセントについては「古い形が残った」のか「単純化が独立に起きた」のか議論があり、
        無アクセントを日本語アクセント史のどこに位置づけるかは、いまも研究テーマであり続けています。
      </P>

      <H2>アクセントは、自分では気づけない</H2>
      <P>
        語彙の方言は「これは方言かも」と疑うことができます。
        でもアクセントは、自分の耳では正しく聞こえてしまうので疑いようがありません。
        テレビの言葉を真似して育った世代でも、家庭で覚えた語のアクセントだけ残る、という現象がよく起きます。
      </P>
      <P>
        だから「なまってる」と言われたときの正体はたいてい、
        <strong>本人が方言だと思っていない部分</strong>にあります。
        雨と飴、橋と箸、牡蠣と柿。試しに家族と読み比べてみると、
        思っていた以上に自分の言葉が土地に結びついていることがわかるはずです。
      </P>

      <H2>まとめ</H2>
      <P>
        東京式・京阪式・無アクセント・一型／二型。日本語のアクセントはこの4系統に大きく分かれ、
        中央から外へ向かって単純になる形で分布しています。
        単語が同じでも、音の高さの設計図が土地ごとに違う。それが「なまり」の中身です。
      </P>

      <ShindanCta
        title="言葉づかいから、あなたの土地を当てにいきます"
        body="14問・約2分。語尾や言い回しの選び方から、あなたの言語感覚に近いご当地キャラを判定します。"
      />

      <Sources
        items={[
          {
            label: "Wikipedia「日本語の方言のアクセント」（分布・型の分類・周圏的分布の記述）",
            url: "https://ja.wikipedia.org/wiki/%E6%97%A5%E6%9C%AC%E8%AA%9E%E3%81%AE%E6%96%B9%E8%A8%80%E3%81%AE%E3%82%A2%E3%82%AF%E3%82%BB%E3%83%B3%E3%83%88",
          },
          {
            label: "Wikipedia「無アクセント」（弁別機能を持たないことの説明）",
            url: "https://ja.wikipedia.org/wiki/%E7%84%A1%E3%82%A2%E3%82%AF%E3%82%BB%E3%83%B3%E3%83%88",
          },
          {
            label: "高山倫明「無アクセントの史的位置づけ」九州大学学術情報リポジトリ",
            url: "https://api.lib.kyushu-u.ac.jp/opac_download_md/16874/pa001.pdf",
          },
          {
            label: "「方言アクセントの誕生」国立国語研究所学術情報リポジトリ",
            url: "https://repository.ninjal.ac.jp/record/566/files/review000203.pdf",
          },
        ]}
      />
    </ArticleShell>
  );
}
