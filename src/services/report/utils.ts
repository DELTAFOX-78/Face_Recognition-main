export const getFilenameFromHeaders = (headers: Record<string, string>): string => {
  const contentDisposition = headers['content-disposition'];
  if (!contentDisposition) {
    return generateDefaultFilename();
  }
  
  const matches = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(contentDisposition);
  if (!matches || matches.length < 2) {
    return generateDefaultFilename();
  }
  
  return matches[1].replace(/['"]/g, '');
};

export const generateDefaultFilename = (): string => {
  const date = new Date().toISOString().split('T')[0];
  return `attendance_report_${date}.xlsx`;
};

export const downloadBlob = (blob: Blob, filename: string): void => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  
  // Cleanup
  link.remove();
  window.URL.revokeObjectURL(url);
};