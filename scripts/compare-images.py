"""Compare captured UI PNGs. Requires Pillow; no source images are modified."""
import json
from pathlib import Path
from PIL import Image, ImageChops

root = Path('artifacts/visual')
results = []
for reference in sorted((root / 'reference').glob('*.png')):
    candidate = root / 'candidate' / reference.name
    if not candidate.exists():
        raise SystemExit(f'Missing candidate: {candidate}')
    a = Image.open(reference).convert('RGB')
    b = Image.open(candidate).convert('RGB')
    if a.size != b.size:
        raise SystemExit(f'Different dimensions: {reference.name}')
    difference = ImageChops.difference(a, b)
    changed = sum(1 for pixel in difference.getdata() if max(pixel) > 12)
    results.append({'file': reference.name, 'changedPixels': changed,
                    'totalPixels': a.width * a.height,
                    'changedPercent': round(100 * changed / (a.width * a.height), 5),
                    'exactMatch': difference.getbbox() is None})
(root / 'comparison.json').write_text(json.dumps(results, indent=2) + '\n')
print(json.dumps({'captures': len(results), 'matchingWithinTolerance': sum(r['changedPixels'] == 0 for r in results), 'maxChangedPercent': max((r['changedPercent'] for r in results), default=0)}))
if any(result['changedPixels'] for result in results):
    raise SystemExit(1)
