import { useEffect, useRef } from "react";
import S from './DropdownMenu.module.css';

interface DropdownProps {
  onClose: () => void;
  children: React.ReactNode;
  role?: string;
  className?: string;
  "aria-label"?: string;
}

function DropdownMenu({ onClose, children, className = '' }:DropdownProps) {

  const containerRef = useRef<HTMLDivElement>(null);

  // 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (e:MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
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