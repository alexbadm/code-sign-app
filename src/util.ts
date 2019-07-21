export function saveAs(content: string, filename: string) {
  const a = document.createElement('a');
  a.download = `${filename}-${new Date().toISOString()}.csv`;
  a.href = 'data:text/csv;charset=utf-8,' + content;
  a.click();
  a.remove();
}
