import { useState, useEffect, useRef, MouseEvent } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { createPortal } from 'react-dom';

interface ContextMenuItem {
  icon: React.ReactNode;
  title: string;
  onClick: () => void;
  divider?: boolean;
}

interface ContextMenuProps {
  items: ContextMenuItem[];
  children: React.ReactNode;
  className?: string;
}

const ContextMenu: React.FC<ContextMenuProps> = ({ items, children, className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const menuRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleContextMenu = (e: MouseEvent) => {
    e.preventDefault();

    const x = e.clientX;
    const y = e.clientY;
    
    setPosition({ x, y });
    setIsOpen(true);
  };

  const handleItemClick = (callback: () => void) => {
    callback();
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: globalThis.MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleScroll = () => {
      setIsOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('scroll', handleScroll);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const variants = {
    show: {
      opacity: 1,
      boxShadow: '0px 1px 10px 1px var(--AIR_CONTEXT_SHADOW_COLOR_END)',
      transition: { duration: 0.2 }
    },
    hide: {
      opacity: 0,
      boxShadow: '0px 0px 0px 0px var(--AIR_CONTEXT_SHADOW_COLOR_START)',
      transition: { duration: 0.2 }
    }
  };

  return (
    <div 
      ref={containerRef}
      className={`UI-ContextMenu-Container ${className}`} 
      onContextMenu={handleContextMenu}
    >
      {children}
      
      {createPortal(
        <AnimatePresence>
          {isOpen && (
            <motion.div
              ref={menuRef}
              className="UI-GovernButtons"
              style={{ 
                position: 'fixed',
                top: position.y,
                left: position.x,
                right: 'auto',
                zIndex: 100
              }}
              initial="hide"
              animate="show"
              exit="hide"
              variants={variants}
            >
              <div className="Container">
                {items.map((item, index) => (
                  <button 
                    key={index} 
                    onClick={() => handleItemClick(item.onClick)}
                  >
                    {item.icon}
                    {item.title}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
};

export default ContextMenu; 