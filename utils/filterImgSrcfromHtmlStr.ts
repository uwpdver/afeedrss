export function filterImgSrcfromHtmlStr(htmlStr: string): string {
  let result = "";
  const imgReg = /<img.*?(?:>|\/>)/i;
  const srcReg = /src=['"]?([^'"]*)['"]?/i;
  const imgs = htmlStr.match(imgReg);

  if (Array.isArray(imgs) && imgs.length > 0) {
    const srcResult = imgs[0].match(srcReg);
    if (srcResult !== null) {
      result = srcResult[1];
    }
  }
  return result;
}
