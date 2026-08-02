# 生成PNG（白背景）→ 透過・正方形512px・均一白フチのステッカー風キャラ画像に加工する
# 使い方: python3 scripts/process_char.py <入力.png> <出力.png>
# 手順:
#   1. 外周からのフラッドフィルで背景白を除去（生成ごとにバラつく die-cut フチも一旦除去）
#   2. コンテンツをクロップ→正方形パディング→512pxに縮小
#   3. シルエットを膨張させた「均一の白フチ」を全キャラ共通で合成（LINEスタンプ風の統一感）
import sys
from PIL import Image, ImageDraw, ImageFilter

MARKER = (255, 0, 255)
BORDER_PX = 23  # 512px時の白フチ幅（MaxFilterのカーネル: 奇数）

def remove_bg(im: Image.Image) -> Image.Image:
    w, h = im.size
    seeds = [(0, 0), (w - 1, 0), (0, h - 1), (w - 1, h - 1),
             (w // 2, 0), (w // 2, h - 1), (0, h // 2), (w - 1, h // 2)]
    for xy in seeds:
        if im.getpixel(xy) != MARKER:
            ImageDraw.floodfill(im, xy, MARKER, thresh=42)
    rgba = im.convert("RGBA")
    px = rgba.load()
    for y in range(h):
        for x in range(w):
            if px[x, y][:3] == MARKER:
                px[x, y] = (0, 0, 0, 0)
    return rgba

def main(src: str, dst: str) -> None:
    rgba = remove_bg(Image.open(src).convert("RGB"))
    bbox = rgba.getbbox()
    if not bbox:
        raise SystemExit(f"empty after bg removal: {src}")
    rgba = rgba.crop(bbox)
    # 正方形パディング（白フチと浮遊の余白ぶんを確保）
    cw, ch = rgba.size
    side = int(max(cw, ch) * 1.16)
    canvas = Image.new("RGBA", (side, side), (0, 0, 0, 0))
    canvas.paste(rgba, ((side - cw) // 2, (side - ch) // 2), rgba)
    canvas = canvas.resize((512, 512), Image.LANCZOS)
    # 均一白フチ: アルファを膨張→軽くぼかしてアンチエイリアス→白で敷く
    alpha = canvas.getchannel("A").filter(ImageFilter.MaxFilter(BORDER_PX))
    alpha = alpha.filter(ImageFilter.GaussianBlur(1.2))
    sticker = Image.new("RGBA", canvas.size, (255, 255, 255, 0))
    sticker.putalpha(alpha)
    out = Image.alpha_composite(sticker, canvas)
    out.save(dst)
    print(f"OK {dst}")

if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2])
