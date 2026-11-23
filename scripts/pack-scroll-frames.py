#!/usr/bin/env python3
"""Bundle byte-identical desktop WebPs for scroll playback. No re-encoding.
Format: 16 little-endian uint32 lengths (64 bytes), then original WebP bytes.
Run from any directory. Existing frame URLs remain the fallback.
"""
from pathlib import Path
import struct

root = Path(__file__).resolve().parents[1] / 'public/sequences/inventor-story-481'
for profile, source in [('hd', root / 'hd'), ('full', root)]:
    destination = root / 'packs-v1' / profile
    destination.mkdir(parents=True, exist_ok=True)
    for start in range(0, 481, 16):
        frames = [(source / f'frame_{i+1:04}.webp').read_bytes()
                  for i in range(start, min(start + 16, 481))]
        sizes = [len(frame) for frame in frames]
        header = struct.pack('<16I', *(sizes + [0] * (16 - len(sizes))))
        (destination / f'{start//16:03}.bin').write_bytes(header + b''.join(frames))
