import api from "../api";
import { AxiosResponse } from "axios";
import { downloadBlob } from "./utils";
import { handleApiError } from "../../utils/errorHandling";
import { showNotification } from "../../utils/notification/notification.ts";

class ReportService {
  // private readonly BASE_URL = `/teacher/attendance-report`;

  async downloadAttendanceReport(date: string): Promise<void> {
    try {
      const response: AxiosResponse<Blob> = await api.get<Blob>(
        `/teacher/attendance-report?date=${date}`,
        {
          responseType: "blob",
          headers: {
            Accept:
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          },
        }
      );
      const filename = `attendance_report_${date}.xlsx`;

      const blob = new Blob([response.data], {
        type: response.headers["content-type"],
      });

      downloadBlob(blob, filename);
      showNotification("Report downloaded successfully", "success");
    } catch (error) {
      handleApiError(error, "Failed to download report");
      throw error;
    }
  }

  // private async fetchReport(): Promise<DownloadResponse> {
  //   return api.get(this.BASE_URL, {
  //     responseType: 'blob'
  //   });
  // }
}

export const reportService = new ReportService();
