import Link from "next/link";

// ブランド404: 迷子でも遊びに繋げる
export default function NotFound() {
  return (
    <div className="max-w-xl mx-auto text-center space-y-5 py-16">
      <p className="font-display font-black text-7xl text-primary/30">404</p>
      <h1 className="text-xl font-bold">このページ、どっか行ってもうたわ</h1>
      <p className="text-sub text-sm leading-relaxed">
        URLが変わったか、もともと存在しないページです。
        <br />
        よかったら診断か図鑑から遊び直してください。
      </p>
      <div className="flex gap-2 justify-center flex-wrap">
        <Link href="/shindan" className="btn-primary px-8 py-3">
          方言診断をはじめる
        </Link>
        <Link href="/" className="btn-secondary">
          トップにもどる
        </Link>
      </div>
    </div>
  );
}
