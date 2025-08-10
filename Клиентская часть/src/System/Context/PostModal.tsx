import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface PostModalContextProps {
  isOpen: boolean;
  postId: string | null;
  openPostModal: (id: string) => void;
  closePostModal: () => void;
  scrollPosition: number;
}

const PostModalContext = createContext<PostModalContextProps>({
  isOpen: false,
  postId: null,
  openPostModal: () => {},
  closePostModal: () => {},
  scrollPosition: 0,
});

export const usePostModal = () => useContext(PostModalContext);

export const PostModalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [postId, setPostId] = useState<string | null>(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const [fromFeed, setFromFeed] = useState(false);
  const [directNavigation, setDirectNavigation] = useState(true);

  useEffect(() => {
    const match = location.pathname.match(/\/post\/([^\/]+)/);
    if (match && match[1]) {
      setDirectNavigation(true);
      setFromFeed(false);
    } else {
      setDirectNavigation(false);
    }
  }, []);

  useEffect(() => {
    const match = location.pathname.match(/\/post\/([^\/]+)/);
    
    if (match && match[1] && fromFeed && !directNavigation) {
      const id = match[1];
      setPostId(id);
      setIsOpen(true);
      
      const previousPath = sessionStorage.getItem('previousPath') || '/';
      const previousScroll = parseInt(sessionStorage.getItem('previousScroll') || '0', 10);
      setScrollPosition(previousScroll);

      if (!sessionStorage.getItem('previousPath')) {
        sessionStorage.setItem('previousPath', '/');
        sessionStorage.setItem('previousScroll', '0');
      }
    }
  }, [location.pathname, fromFeed, directNavigation]);

  const openPostModal = (id: string) => {
    setFromFeed(true);
    setDirectNavigation(false);
    
    const currentScroll = window.scrollY;
    const currentPath = location.pathname;
    
    if (!isOpen) {
      sessionStorage.setItem('previousPath', currentPath);
      sessionStorage.setItem('previousScroll', currentScroll.toString());
      setScrollPosition(currentScroll);
    }

    window.history.pushState(null, '', `/post/${id}`);
    
    setPostId(id);
    setIsOpen(true);
    
    document.body.style.overflow = 'hidden';
  };

  const closePostModal = () => {
    setIsOpen(false);
    setFromFeed(false);
    
    document.body.style.overflow = '';
    
    const previousPath = sessionStorage.getItem('previousPath') || '/';
    const previousScroll = parseInt(sessionStorage.getItem('previousScroll') || '0', 10);
    
    window.history.replaceState(null, '', previousPath);
    
    setTimeout(() => {
      window.scrollTo({
        top: previousScroll,
        behavior: 'auto'
      });
    }, 50);
  };

  useEffect(() => {
    const handlePopState = () => {
      if (isOpen) {
        closePostModal();
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [isOpen]);

  return (
    <PostModalContext.Provider value={{ isOpen, postId, openPostModal, closePostModal, scrollPosition }}>
      {children}
    </PostModalContext.Provider>
  );
}; 