import { gzipSync, gunzipSync } from 'fflate';

const GZIP_LEVEL = 6;

export function compressSnapshot(snapshot: unknown): Buffer {
	const json = JSON.stringify(snapshot);
	const compressed = gzipSync(new TextEncoder().encode(json), { level: GZIP_LEVEL });
	return Buffer.from(compressed);
}

export function decompressSnapshot<T>(data: Buffer): T {
	const decompressed = gunzipSync(new Uint8Array(data));
	return JSON.parse(new TextDecoder().decode(decompressed)) as T;
}
