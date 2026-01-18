export interface DownloadResponse {
  data: Blob;
  headers: {
    'content-type': string;
    'content-disposition'?: string;
  };
}

export interface ReportService {
  downloadAttendanceReport(): Promise<void>;
}