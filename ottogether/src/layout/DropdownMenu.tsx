import { useEffect, useRef, type RefObject } from "react";
import S from './DropdownMenu.module.css';

interface DropdownProps {
  buttonRef: RefObject<HTMLButtonElement>;
  onClose: () => void;
  children: React.ReactNode;
  role?: string;
  className?: string;
  "aria-label"?: string;
}

function DropdownMenu({ buttonRef, onClose, children, className = '' }:DropdownProps) {

  const containerRef = useRef<HTMLDivElement>(null);

  // 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (e:MouseEvent) => {
      const clickTarget = e.target as Node;

      const isOutsideContainer = containerRef.current && !containerRef.current.contains(clickTarget);
      const isOutsideButton = buttonRef.current && !buttonRef.current.contains(clickTarget);

      if ( isOutsideContainer && isOutsideButton ) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // ESC 눌렀을 때 닫기
  useEffect(() => {
    const handleKeyDown = (e:KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      onClose();
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className={`${S.container} ${ className ? className : ''}`.trim()} ref={containerRef}>
      {children}
    </div>
  )
}
export default DropdownMenu