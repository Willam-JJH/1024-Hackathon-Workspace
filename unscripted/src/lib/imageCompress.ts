/**
 * 在浏览器端先把图片压小再上传。
 *
 * 免费档存储只有 1GB，而且不含服务端图片处理，
 * 手机随手拍一张就 4–8MB，不压的话额度很快见底。
 *
 * 非图片、或压缩后反而更大的，原样返回。
 */
export async function compressImage(
  file: File,
  maxDimension = 1920,
  quality = 0.82
): Promise<File> {
  if (!file.type.startsWith("image/")) return file;
  // GIF 可能是动图，压了会变成静帧
  if (file.type === "image/gif") return file;

  try {
    const bitmap = await createImageBitmap(file);

    const scale = Math.min(1, maxDimension / Math.max(bitmap.width, bitmap.height));
    const width = Math.round(bitmap.width * scale);
    const height = Math.round(bitmap.height * scale);

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d");
    if (!ctx) return file;

    ctx.drawImage(bitmap, 0, 0, width, height);
    bitmap.close();

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/webp", quality)
    );

    if (!blob || blob.size >= file.size) return file;

    const name = file.name.replace(/\.[^.]+$/, "") + ".webp";
    return new File([blob], name, { type: "image/webp", lastModified: Date.now() });
  } catch {
    // 压缩只是优化，失败就用原图
    return file;
  }
}
