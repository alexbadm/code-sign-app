export function saveAs(
  content: string,
  filename: string,
  contentType = 'text/csv',
  charset = 'utf-8',
) {
  const a = document.createElement('a');
  a.download = `${filename}-${new Date().toISOString()}.${contentType.split('/')[1]}`;
  a.href = `data:${contentType};charset=${charset},` + content;
  a.click();
  a.remove();
}
