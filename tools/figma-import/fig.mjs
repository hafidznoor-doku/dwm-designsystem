// Load and index a .fig file (kiwi). Shared by the converter scripts.
import fs from 'fs'; import zlib from 'zlib';
import {decodeBinarySchema, compileSchema} from 'kiwi-schema';

export function loadFig(path) {
  const d = fs.readFileSync(path);
  let o = 12; const chunks = [];
  while (o < d.length) { const n = d.readUInt32LE(o); chunks.push(d.subarray(o + 4, o + 4 + n)); o += 4 + n; }
  const schema = compileSchema(decodeBinarySchema(zlib.inflateRawSync(chunks[0])));
  const msg = schema.decodeMessage(zlib.zstdDecompressSync(chunks[1]));
  return msg;
}

export const gid = g => g ? `${g.sessionID}:${g.localID}` : null;

export function index(msg) {
  const N = msg.nodeChanges;
  const byId = new Map(); N.forEach(n => byId.set(gid(n.guid), n));
  const kids = new Map();
  N.forEach(n => { const p = gid(n.parentIndex?.guid); if (p) { if (!kids.has(p)) kids.set(p, []); kids.get(p).push(n); } });
  for (const v of kids.values()) v.sort((a, b) => a.parentIndex.position < b.parentIndex.position ? -1 : a.parentIndex.position > b.parentIndex.position ? 1 : 0);
  const ch = n => kids.get(gid(n.guid)) || [];
  return {N, byId, kids, ch, blobs: msg.blobs};
}

// Decode a Figma path commands blob into SVG path data.
export function blobToPath(bytes) {
  const dv = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  let i = 0, out = [];
  const f = () => { const v = dv.getFloat32(i, true); i += 4; return +v.toFixed(3); };
  while (i < bytes.length) {
    const c = bytes[i++];
    if (c === 0) out.push('Z');
    else if (c === 1) out.push(`M${f()} ${f()}`);
    else if (c === 2) out.push(`L${f()} ${f()}`);
    else if (c === 3) out.push(`Q${f()} ${f()} ${f()} ${f()}`);
    else if (c === 4) out.push(`C${f()} ${f()} ${f()} ${f()} ${f()} ${f()}`);
    else break;
  }
  return out.join('');
}
