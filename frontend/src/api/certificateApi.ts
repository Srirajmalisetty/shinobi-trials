import { apiClient } from './client';
import { Certificate } from '../types/quiz';

const BASE_URL = import.meta.env.VITE_API_URL || '';

export const certificateApi = {
  /**
   * Get certificate metadata by unique code
   */
  getCertificate: (code: string): Promise<Certificate> => {
    return apiClient<Certificate>(`/api/certificates/${code}`);
  },

  /**
   * Get public verification status for a certificate code
   */
  verifyCertificate: (code: string): Promise<Certificate> => {
    return apiClient<Certificate>(`/api/certificates/${code}/verify`);
  },

  /**
   * Get the direct download URL for the Apache PDFBox rendered scroll PDF
   */
  getPdfDownloadUrl: (code: string): string => {
    return `${BASE_URL}/api/certificates/${code}/pdf`;
  },
};
