import { useEffect } from 'react';

/**
 * Locks body scroll when mobile navigation is open
 */
export function useMobileNavBodyLock(isOpen: boolean) {
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = originalOverflow || '';
    }
    
    return () => {
      document.body.style.overflow = originalOverflow || '';
    };
  }, [isOpen]);
}