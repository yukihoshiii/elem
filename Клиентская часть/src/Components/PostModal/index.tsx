import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWebSocket } from '../../System/Context/WebSocket';
import HandlePost from '../Post';
import { PreloadPost } from '../../System/UI/Preload';
import { NavigatedHeader } from '../../UIKit';
import Comments from '../Comments';
import { useTranslation } from 'react-i18next';

interface PostModalProps {
  isOpen: boolean;
  postID: string;
  onClose: () => void;
}

const PostModal = ({ isOpen, postID, onClose }: PostModalProps) => {
  const { t } = useTranslation();
  const { wsClient } = useWebSocket();
  const [postLoaded, setPostLoaded] = useState<boolean>(false);
  const [post, setPost] = useState<any>('');
  const modalRef = useRef(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (!isOpen || !postID) return;

    wsClient.send({
      type: 'social',
      action: 'load_post',
      pid: postID
    }).then((res: any) => {
      if (res.status === 'success') {
        const post = res.post;
        if (post?.id) {
          setPost(post);
        }
      }
      setPostLoaded(true);
    })
  }, [postID, isOpen]);

  useEffect(() => {
    if (postLoaded) {
      setPostLoaded(false);
    }
  }, [postID]);

  const modalVariants = {
    hidden: { y: '100%', opacity: 0 },
    visible: { y: '0%', opacity: 1, transition: { type: 'spring', damping: 25, stiffness: 300 } },
    exit: { y: '100%', opacity: 0, transition: { duration: 0.2 } }
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="PostModal-Container" onClick={handleBackdropClick}>
          <motion.div
            className="PostModal-Backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => onClose()}
          />
          <motion.div
            ref={modalRef}
            className="PostModal"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <NavigatedHeader
              onBack={onClose}
              scrollRef={scrollRef}
            />
            <div ref={scrollRef} className="PostModal-Content">
              {(postLoaded && !post.id) ? (
                <div className="PostModal-Error">{t('error')}</div>
              ) : (
                <>
                  {postLoaded ? (
                    <HandlePost
                      post={post}
                      className="UI-B_FIRST"
                      onDelete={() => { }}
                      isInModal={true}
                    />
                  ) : (
                    <PreloadPost className="UI-B_FIRST" />
                  )}

                  <div className="PostModal-Comments">
                    <Comments
                      postID={post.id}
                    />
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default PostModal; 