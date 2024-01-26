import isUrl from 'is-url';
const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg'];
export const isImageUrl = (url) => {
  if (!url) return false;
  if (!isUrl(url)) return false;
  const ext = new URL(url).pathname.split('.').pop();
  return imageExtensions.includes(ext);
};
