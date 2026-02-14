const _cv = document.createElement('canvas');
const _cx = _cv.getContext('2d')!;

export function measureText(text: string, fontSize = 14): number {
  _cx.font = `500 ${fontSize}px DM Sans,sans-serif`;
  return _cx.measureText(text).width;
}
