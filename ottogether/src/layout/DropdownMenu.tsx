import { useEffect, useRef, useState, type RefObject } from "react";
import S from './DropdownMenu.module.css';

interface DropdownProps {
  buttonRef: RefObject<HTMLButtonElement>;
  onClose: () => void;
  children: React.ReactNode;
  closeTrigger?: boolean;
  role?: string;
  className?: string;
  "aria-label"?: string;
}

function DropdownMenu({ buttonRef, onClose, children, className = '', closeTrigger = false }:DropdownProps) {

  const [ isClosing, setIsClosing ] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  /* 드롭다운 메뉴 닫기 */
  const triggerClose = () => {
    if (isClosing) return;
    
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 150);
  };

  // 부모로부터 close trigger를 받으면 닫기
  useEffect(() => {
    if(closeTrigger) {
      triggerClose();
    }
  }, [closeTrigger])

  // 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (e:MouseEvent) => {
      const clickTarget = e.target as Node;

      const isOutsideContainer = containerRef.current && !containerRef.current.contains(clickTarget);
      const isOutsideButton = buttonRef.current && !buttonRef.current.contains(clickTarget);

      if ( isOutsideContainer && isOutsideButton ) {
        triggerClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // ESC 눌렀을 때 닫기
  useEffect(() => {
    const handleKeyDown = (e:KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      triggerClose();
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className={
      `${S.container} 
      ${ isClosing ? S["dropdown-menu-exit"] : S["dropdown-menu-enter"] }
      ${ className ? className : ''}`
      .trim()} ref={containerRef}>
      {children}
    </div>
  )
}
export default DropdownMenu