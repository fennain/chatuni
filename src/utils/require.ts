/** vite的特殊性, 需要处理图片 */
export const require = (imgPath: string): string => {
  const handlePath = imgPath.replace("@", "..");
  // https://vitejs.cn/guide/assets.html#the-public-directory
  return new URL(import.meta.env.VITE_PUBLIC_PATH + handlePath, import.meta.url)
    .href;
};
