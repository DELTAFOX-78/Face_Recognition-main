import { useRef, useState, useCallback } from 'react';
import Webcam from 'react-webcam';

export const useWebcam = () => {
  const webcamRef = useRef<Webcam>(null);
  const [error, setError] = useState<string | null>(null);

  const capture = useCallback((): string | null => {
    try {
      const imageSrc = webcamRef.current?.getScreenshot();
      return imageSrc || null;
    } catch (err) {
      setError('Failed to capture image');
      return null;
    }
  }, []);

  const resetError = useCallback(() => {
    setError(null);
  }, []);

  return {
    webcamRef,
    error,
    capture,
    resetError
  };
};