# POP MART風3Dレンダー画像（グラデ背景）→ 透過・正方形512px・細白リムのフィギュア画像に加工
# 使い方: python3 scripts/process_char3d.py <入力.png> <出力.png>
# 背景除去はrembg（U2Net）。グラデーション背景・ソフトシャドウでも綺麗に抜ける。
import sys
from PIL import Image, ImageFilter
from rembg import remove

RIM_PX = 13  # 512px時の白リム幅（フィギュアの切り抜き感＋ビビッド背景での視認性）

def main(src: str, dst: str) -> None:
    im = Image.open(src).convert("RGBA")
    cut = remove(im)
    bbox = cut.getbbox()
    if not bbox:
        raise SystemExit(f"empty after rembg: {src}")
    cut = cut.crop(bbox)
    cw, ch = cut.size
    side = int(max(cw, ch) * 1.03)  # 余白は白リムぶんだけ（カード内の空白を作らない）
    canvas = Image.new("RGBA", (side, side), (0, 0, 0, 0))
    canvas.paste(cut, ((side - cw) // 2, (side - ch) // 2), cut)
    canvas = canvas.resize((512, 512), Image.LANCZOS)
    # 細い白リム（アルファ膨張→ぼかし→白敷き）
    alpha = canvas.getchannel("A").filter(ImageFilter.MaxFilter(RIM_PX))
    alpha = alpha.filter(ImageFilter.GaussianBlur(1.0))
    rim = Image.new("RGBA", canvas.size, (255, 255, 255, 0))
    rim.putalpha(alpha)
    Image.alpha_composite(rim, canvas).save(dst)
    print(f"OK {dst}")

if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2])
