# キャラ画像のコンタクトシート（一覧確認用グリッド）を作る
# 使い方: python3 scripts/contact_sheet.py <入力dir> <出力.png>
import sys
from pathlib import Path
from PIL import Image, ImageDraw

def main(indir: str, dst: str) -> None:
    files = sorted(Path(indir).glob("*.png"))
    if not files:
        raise SystemExit("no images")
    cols, cell = 6, 200
    rows = (len(files) + cols - 1) // cols
    sheet = Image.new("RGB", (cols * cell, rows * (cell + 22)), (250, 247, 240))
    d = ImageDraw.Draw(sheet)
    for i, f in enumerate(files):
        im = Image.open(f).convert("RGBA")
        im.thumbnail((cell - 8, cell - 8), Image.LANCZOS)
        x, y = (i % cols) * cell, (i // cols) * (cell + 22)
        sheet.paste(im, (x + (cell - im.width) // 2, y + (cell - im.height) // 2), im)
        d.text((x + 6, y + cell + 2), f.stem, fill=(60, 50, 55))
    sheet.save(dst)
    print(f"OK {dst} ({len(files)}体, {rows}行)")

if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2])
