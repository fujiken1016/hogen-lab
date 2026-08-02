# Pollinations.ai（無料・登録不要）で35キャラを一括生成する
# 実行: python3 scripts/gen_all_chars.py [出力dir]
# 既に存在するslugはスキップ（再実行で失敗分だけリトライできる）
import sys
import time
import urllib.parse
import urllib.request
from pathlib import Path

STYLE = (
    ", flat vector kawaii LINE sticker illustration, thick uniform dark brown outlines, "
    "simple rounded shapes, solid flat pastel colors, big glossy sparkly eyes, pink blush cheeks, "
    "chibi round egg-shaped body, white die-cut sticker border, plain white background, "
    "single character centered, full body, no text, sanrio style"
)

# POP MART風（ソフビ・ブラインドボックストイの3Dレンダー調）。--3d で使用
STYLE_3D = (
    ", POP MART style blind box designer toy figure, soft vinyl figure, "
    "cute chibi with big round head and small body, glossy smooth vinyl texture, "
    "soft 3D render, C4D octane render, vivid candy colors, big shiny round glossy eyes, "
    "blush cheeks, plain pure white background, studio product photo, "
    "single figure centered, full body, no text"
)

CHARS: dict[str, str] = {
    "kansai": "chubby orange tabby cat wearing a twisted orange headband, holding a microphone, laughing happily",
    "kyoto": "elegant white fox with a red ribbon on head, holding a red folding fan, gentle graceful smile",
    "hakata": "energetic boy in red happi coat with twisted white headband, bold eyebrows, raising a fist, big grin",
    "tsugaru": "shy boy in red knit beanie with very red cheeks, hugging a big red apple",
    "hokkaido": "chubby brown bear wearing a blue knit beanie, hugging a pink salmon fish, relaxed happy smile",
    "sendai": "small brown sparrow bird with a tiny red ribbon on head, dancing with wings spread, cheerful",
    "nagoya": "clever boy wearing a golden shachihoko fish hat and round glasses, confident smile",
    "hiroshima": "lion with a magnificent mane, twisted red headband, bold eyebrows, reliable big-brother grin",
    "izumo": "calm shrine priest in purple hakama with a small topknot, holding a lucky charm, serene smile",
    "tosa": "brown tosa dog wearing a straw hat, big hearty laugh",
    "kagoshima": "loyal black dog with a samurai topknot, bold eyebrows, dignified proud smile",
    "okinawa": "red shisa lion with a red hibiscus flower on ear, huge open-mouth cheerful laugh",
    "akita": "fluffy cream akita dog in a knit beanie, holding a kiritanpo rice stick, gentle smile",
    "yamagata": "farm girl with a white headscarf, holding red cherries, warm smile",
    "ibaraki": "simple honest boy with a yellow twisted headband, straightforward friendly smile",
    "niigata": "white crested ibis bird with a headband, holding a rice ball onigiri",
    "kanazawa": "elegant gold cat with a red ribbon, holding a folding fan, refined graceful smile",
    "shinshu": "wise brown monkey with a green leaf on head, calm philosophical smile",
    "shizuoka": "relaxed girl with a green tea sprout on head, holding a tea cup, easygoing smile",
    "kobe": "stylish blue-gray cat wearing a beret, sophisticated smile",
    "okayama": "cheerful monkey with a twisted headband, hugging a big pink peach",
    "sanuki": "udon shop boy with a headband, holding a steaming udon noodle bowl, proud smile",
    "iyo": "sweet girl with an orange blossom in hair, holding mikan oranges in both hands, kind smile",
    "kumamoto": "stubborn black bear with red cheeks, twisted headband, bold eyebrows, gruff but cute",
    "nagasaki": "pink-beige cat with a curled tail wearing a sailor beret, friendly port-town smile",
    "iwate": "humble white dog in a knit beanie, holding a small red soba bowl, modest gentle smile",
    "fukushima": "red akabeko cow with white spots, tilting head cutely, holding a peach",
    "toyama": "white ptarmigan bird with a headband, holding a yellowtail fish",
    "hida": "red sarubobo doll monkey with a leaf headband, holding a tiny wooden mallet",
    "ise": "white pilgrimage dog with a red ribbon collar and small bell, calm blessed smile",
    "wakayama": "panda with a pink flower on head, holding a mikan orange",
    "tottori": "white rabbit with a towel on head, holding a golden star, hare of inaba vibes",
    "yamaguchi": "cheerful boy with a headband, hugging a round cute pufferfish",
    "awa": "dancing tanuki raccoon dog with a leaf on head, holding two drum sticks, festival dance pose",
    "oita": "monkey with a white onsen towel on head, blissful hot-spring smile",
}


def gen(slug: str, desc: str, out: Path, seed: int, style: str = STYLE) -> bool:
    prompt = urllib.parse.quote(desc + style)
    url = (
        f"https://image.pollinations.ai/prompt/{prompt}"
        f"?width=768&height=960&model=flux&nologo=true&seed={seed}"
    )
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "hogen-lab-batch"})
        with urllib.request.urlopen(req, timeout=120) as r:
            data = r.read()
        if len(data) < 20000:  # エラーページ等の小さいレスポンスは失敗扱い
            return False
        out.write_bytes(data)
        return True
    except Exception as e:
        print(f"  ERR {slug}: {e}", flush=True)
        return False


def main() -> None:
    args = [a for a in sys.argv[1:] if a != "--3d"]
    use3d = "--3d" in sys.argv
    style = STYLE_3D if use3d else STYLE
    seed_base = 500 if use3d else 40
    outdir = Path(args[0] if args else "poll_chars")
    outdir.mkdir(parents=True, exist_ok=True)
    todo = [(s, d) for s, d in CHARS.items() if not (outdir / f"{s}.png").exists()]
    print(f"生成対象: {len(todo)}体 / 全{len(CHARS)}体 (style={'3D' if use3d else '2D'})", flush=True)
    ok = 0
    for i, (slug, desc) in enumerate(todo):
        seed = seed_base + list(CHARS).index(slug) * 7
        done = gen(slug, desc, outdir / f"{slug}.png", seed, style)
        ok += done
        print(f"[{i + 1}/{len(todo)}] {slug}: {'OK' if done else 'FAIL'}", flush=True)
        time.sleep(6)
    print(f"完了: 成功{ok} / 失敗{len(todo) - ok}", flush=True)


if __name__ == "__main__":
    main()
