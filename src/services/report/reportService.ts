import api from "../api";
import { AxiosResponse } from "axios";
import { downloadBlob } from "./utils";
import { handleApiError } from "../../utils/errorHandling";
import { showNotification } from "../../utils/notification/notification.ts";

export interface FilterClass {
  className: string;
  sections: string[];
}

export interface FilterOption {
  branch: string;
  classes: FilterClass[];
}

export interface ReportFilters {
  date: string;
  branch?: string;
  class?: string;
  section?: string;
}

class ReportService {
  async getFilterOptions(): Promise<FilterOption[]> {
    try {
      const response = await api.get<FilterOption[]>('/teacher/filter-options');
      return response.data;
    } catch (error) {
      handleApiError(error, "Failed to fetch filter options");
      throw error;
    }
  }

  async downloadAttendanceReport(filters: ReportFilters): Promise<void> {
    try {
      const params = new URLSearchParams();
      params.append('date', filters.date);
      if (filters.branch) params.append('branch', filters.branch);
      if (filters.class) params.append('class', filters.class);
      if (filters.section) params.append('section', filters.section);

      const response: AxiosResponse<Blob> = await api.get<Blob>(
        `/teacher/attendance-report?${params.toString()}`,
        {
          responseType: "blob",
          headers: {
            Accept:
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          },
        }
      );
      const filename = `attendance_report_${filters.date}.xlsx`;

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
}

export const reportService = new ReportService();

