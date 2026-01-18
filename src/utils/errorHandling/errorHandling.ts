import { ApiError } from './types';
import { notification } from '../notification';

export const handleApiError = (error: ApiError, defaultMessage: string = 'An error occurred'): void => {
  console.error('API Error:', error);
  
  const errorMessage = error.response?.data?.message || defaultMessage;
  notification.show(errorMessage, 'error');
  
  // Log error to monitoring service (if implemented)
  logError(error);
};

const logError = (error: ApiError): void => {
  // Implement error logging to a monitoring service
  // For now, just console.error
  console.error('Error details:', {
    message: error.message,
    stack: error.stack,
    response: error.response
  });
};