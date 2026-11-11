"""Create a deployment ZIP containing only the explicitly approved public files."""
from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED
import sys
ROOT = Path(__file__).resolve().parent.parent
PUBLIC = ['index.html', 'css/style.css', 'js/app.js', 'js/register.js',
          'manifest.webmanifest', 'sw.js', '_headers', 'icons/favicon.svg',
          'icons/icon-192.png', 'icons/icon-512.png', 'icons/apple-touch-180.png']
def package(output):
    for name in PUBLIC:
        path = ROOT / name
        if not path.is_file() or path.is_symlink() or not path.resolve().is_relative_to(ROOT):
            raise ValueError(f'Invalid public asset: {name}')
    with ZipFile(output, 'w', ZIP_DEFLATED) as archive:
        for name in PUBLIC:
            archive.write(ROOT / name, name)
    print(f'Packaged {len(PUBLIC)} public assets: {output}')
if __name__ == '__main__':
    package(Path(sys.argv[1]) if len(sys.argv) > 1 else Path('/tmp/last-night-deploy.zip'))
