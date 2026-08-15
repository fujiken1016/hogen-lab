import type { Metadata } from "next";
import { ArticleShell, H2, H3, P, Note, WordCard, Sources, ShindanCta } from "@/components/article";
import { getArticle } from "@/lib/articles";

const article = getArticle("okinawa-ryukyu-kotoba")!;

export const metadata: Metadata = {
  title: `${article.title} | 方言ラボ`,
  description: article.description,
  alternates: { canonical: "https://hogen.mainichi-lab.com/blog/okinawa-ryukyu-kotoba" },
};

/** 本土日本語 ↔ うちなーぐち の対応を1行で見せる */
function Pair({ hondo, oki, note }: { hondo: string; oki: string; note?: string }) {
  return (
    <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 py-2 border-b border-line last:border-0">
      <span className="text-[14px] font-bold w-24 shrink-0">{hondo}</span>
      <span className="text-sub" aria-hidden>
        →
      </span>
      <span className="font-display text-lg font-bold text-primary-deep">{oki}</span>
      {note && <span className="text-[11.5px] text-sub w-full sm:w-auto">{note}</span>}
    </div>
  );
}

export default function Page() {
  return (
    <ArticleShell article={article}>
      <P>
        「めんそーれ」「ちゅら海」「ちむどんどん」。
        沖縄のことばは全国的にもよく知られていますが、他の方言と並べて聞くと、明らかに毛色が違います。
        東北弁や関西弁は聞き取れなくても単語の見当がつきますが、うちなーぐちは
        <strong>そもそも文全体が別の言語のように聞こえる</strong>。
      </P>
      <P>
        実際、言語学ではこれを日本語の方言と呼ぶべきか、別の言語と呼ぶべきかが長く議論されてきました。
        この記事では、うちなーぐちがどう日本語とつながっているのかを、音・語彙・文法の順に見ていきます。
      </P>

      <H2>まず前提：琉球のことばは「ひとつ」ではない</H2>
      <P>
        沖縄方言というと一括りにされがちですが、南西諸島のことばは島ごとに大きく異なります。
        ユネスコが2009年に発表した消滅危機言語の調査では、日本国内から8つが挙げられました。
        アイヌ語、八丈語、そして<strong>奄美語・国頭語・沖縄語・宮古語・八重山語・与那国語</strong>の6つです。
      </P>
      <P>
        つまり奄美と宮古と与那国は、それぞれ別々に数えられています。
        沖縄本島の人が宮古のことばを聞いても通じない、というのは実際によく言われることです。
        私たちが「沖縄の方言」と呼んでいるものは、正確には
        <strong>沖縄本島中南部（首里・那覇）のことば</strong>を指していることが多いのです。
      </P>
      <Note title="方言か、言語か">
        言語と方言の線引きに、言語学的な絶対基準はありません。
        通じ合えるかどうかで見れば別言語に近く、歴史的な系統で見れば日本語と同じ祖先から分かれた姉妹です。
        近年は「日本語族（日琉語族）のなかの琉球語群」と位置づけ、
        本土の日本語と対等な枝として扱う整理がよく使われます。
      </Note>

      <H2>音の対応法則：エ段は i に、オ段は u に</H2>
      <P>
        うちなーぐちがまったく別の言葉に聞こえるいちばんの理由は、母音のずれです。
        本土日本語の<strong>オ段が /u/ に、エ段が /i/ に対応する</strong>という規則があり、
        この一点を知っているだけで、聞き取れる語が一気に増えます。
      </P>

      <div className="card p-4 sm:p-5 my-5">
        <Pair hondo="こころ（心）" oki="くくる" note="ko→ku、ro→ru" />
        <Pair hondo="あめ（雨）" oki="あみ" note="me→mi" />
        <Pair hondo="ふね（船）" oki="ふに" />
        <Pair hondo="かぜ（風）" oki="かじ" note="ze→ji" />
        <Pair hondo="こめ（米）" oki="くみ" note="オ段とエ段が両方ずれる" />
      </div>

      <P>
        「ちむどんどん」の「ちむ」も、この法則で読み解けます。
        もとは<strong>「肝（きも）」</strong>。ki が ci（チ）に、mo が mu に変わって「ちむ」。
        肝が高鳴る＝胸が高鳴る、というわけです。
        日本語でも「肝を冷やす」「肝がすわる」と言うように、
        感情の在りかを肝に置く発想は共通しています。
      </P>

      <H2>語彙：古い日本語がそのまま残っている</H2>

      <WordCard
        word="ちゅら"
        reading="churaa"
        dialect="沖縄"
        meaning="美しい、きれいな"
        example="ちゅら海（美しい海）／ちゅらさん（美しい）"
      >
        語源は古語の<strong>「清（きよ）ら」</strong>。平安時代の文献にも見える、
        美しさ・上品さを表す言葉です。ki→ci、yo→u の変化を経て「ちゅら」になりました。
        「美ら海」という表記は現代の当て字で、もとの字は「清」のほうです。
      </WordCard>

      <WordCard
        word="めんそーれ"
        dialect="沖縄"
        meaning="いらっしゃいませ、ようこそ"
        example="沖縄へ めんそーれ"
      >
        語源には諸説あり、「参り召しおわれ」あるいは「参り候へ（まいりそうらえ）」が変化したもの、
        という説明がよく知られています。いずれにせよ
        <strong>「おいでください」という敬語表現</strong>が縮まった形です。
        現代の標準語で言えば「お越しくださいませ」にあたります。
      </WordCard>

      <WordCard
        word="にふぇーでーびる"
        dialect="沖縄"
        meaning="ありがとうございます"
        example="いっぺー にふぇーでーびる（本当にありがとうございます）"
      >
        「にふぇー」が感謝、「でーびる」が「〜ございます」にあたる丁寧語。
        <strong>「御拝（みはい）で侍（はべ）る」</strong>＝拝んでかしこまる、が由来とされます。
        「侍り」という平安時代の丁寧語が生きているのが見どころです。
      </WordCard>

      <P>
        並べてみるとわかるのは、うちなーぐちが
        <strong>崩れた日本語ではなく、古い日本語をよく保存したことば</strong>だということ。
        中心から遠い土地に古い形が残るという方言周圏論の考え方が、ここでもきれいに当てはまります。
      </P>

      <H2>文法：終止形と連体形が、まだ分かれている</H2>
      <P>
        現代の標準語では、「行く」（終止形）と「行く人」（連体形）が同じ形です。
        でも古典日本語では終止形と連体形が別々の形を持っていました。
        <strong>沖縄語には、この区別が残っています</strong>。
      </P>
      <H3>助詞の使い分け</H3>
      <P>
        主語につく助詞にも古い体系が残っています。首里方言では、
        主語が人のときは「が」、人以外のときは「ぬ」を使う、という使い分けがあると記述されています。
        古典日本語の連体格「が」と主格「ぬ（の）」の名残です。
      </P>
      <P>
        高校の古文でつまずくあの区別が、現役の話しことばとして残っている。
        「方言は古い日本語の博物館だ」と言われるのは、こういう例を指しています。
      </P>

      <H2>いま、話者が急速に減っている</H2>
      <P>
        ユネスコは沖縄語を「危険（definitely endangered）」に分類しています。
        親から子へ受け継がれなくなりつつある段階という意味です。
        日常的に使う世代が高齢層に偏り、若い世代は理解はできても自分では話さない、という状況が進んでいます。
      </P>
      <P>
        国立国語研究所は消滅危機言語の記録保存プロジェクトを進め、
        文法記述・辞書・談話資料の形で各地のことばを残す作業を続けています。
        <strong>ことばが消えるとき、失われるのは単語だけではありません。</strong>
        感情を肝の場所で言い表す発想も、敬語の細かい階層も、一緒に消えます。
      </P>
      <Note title="なお、与那国語はさらに変わっている">
        日本最西端の与那国島のことばは /i, a, u/ の3母音体系で、
        日琉語族のなかでもっとも母音の数が少ないとされています。
        「沖縄のことば」という一語で片づけるには、南西諸島はあまりに多様です。
      </Note>

      <H2>まとめ</H2>
      <P>
        オ段が u に、エ段が i に。この対応さえ押さえれば、うちなーぐちの語彙の多くは本土日本語とつながります。
        そして「ちゅら」も「にふぇーでーびる」も、平安時代の日本語がそのまま生き延びた形でした。
      </P>
      <P>
        沖縄のことばは、日本語から遠いのではありません。
        <strong>日本語の古いところに、いちばん近い</strong>のです。
      </P>

      <ShindanCta
        title="あなたの言葉は、どの島に近い？"
        body="14問・約2分。全国35体のご当地キャラから、あなたの言語感覚に近い相棒を判定します。沖縄のキャラも待っています。"
      />

      <Sources
        items={[
          {
            label: "Wikipedia「沖縄語」（母音の対応・終止形／連体形の区別・格助詞ガとヌの使い分け・危機言語の分類）",
            url: "https://ja.wikipedia.org/wiki/%E6%B2%96%E7%B8%84%E8%AA%9E",
          },
          {
            label: "Wikipedia「琉球諸語」「与那国語」（8つの危機言語の内訳・与那国語の3母音体系）",
            url: "https://ja.wikipedia.org/wiki/%E7%90%89%E7%90%83%E8%AB%B8%E8%AA%9E",
          },
          {
            label: "国立国語研究所「消滅危機言語の保存研究」",
            url: "https://www.ninjal.ac.jp/research/cr-project/project-4/endangered-languages/",
          },
          {
            label: "国立国語研究所「沖縄語辞典 データ集」",
            url: "https://mmsrv.ninjal.ac.jp/okinawago/",
          },
          {
            label: "Wikipedia「めんそーれ」／ウィクショナリー日本語版「にふぇーでーびる」（語源の諸説）",
            url: "https://ja.wikipedia.org/wiki/%E3%82%81%E3%82%93%E3%81%9D%E3%83%BC%E3%82%8C",
          },
        ]}
      />
    </ArticleShell>
  );
}
