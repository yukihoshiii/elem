import classNames from 'classnames';
import NeoImage from './NeoImage';
import { useNavigate } from 'react-router-dom';
import UploadLoader from '../Loaders/UploadLoader';
import { memo, useCallback, useMemo } from 'react';

interface AvatarProps {
    avatar?: string | null;
    name: string;
    className?: string;
    onClick?: () => void;
    to?: string;
    loading?: boolean;
    isLoaded?: boolean;
    isUploading?: boolean;
    size?: 'small' | 'medium' | 'large';
}

const Avatar: React.FC<AvatarProps> = memo(({
    avatar,
    name,
    className,
    onClick,
    to,
    loading = false,
    isLoaded = false,
    isUploading = false,
    size = 'medium'
}) => {
    const navigate = useNavigate();

    const handleClick = useCallback(() => {
        if (to) {
            navigate(to);
        }
        if (onClick) {
            onClick();
        }
    }, [to, onClick, navigate]);

    const parsedAvatar = useMemo(() => {
        if (!avatar) return null;
        if (typeof avatar === 'string') {
            try {
                return JSON.parse(avatar);
            } catch {
                return null;
            }
        }
        return avatar;
    }, [avatar]);

    return (
        <div
            onClick={handleClick}
            className={classNames('Avatar', className, {
                'Avatar-small': size === 'small',
                'Avatar-medium': size === 'medium',
                'Avatar-large': size === 'large'
            })}
        >
            {
                !avatar ? (
                    <div className="NonAvatar">{name?.length > 0 ? name.charAt(0) : '?'}</div>
                ) : (
                    <NeoImage
                        image={parsedAvatar}
                        style={{}}
                    />
                )
            }
            {
                (loading && !isLoaded) && (
                    <div className="UI-PRELOAD"></div>
                )
            }
            {
                isUploading && (
                    <UploadLoader />
                )
            }
        </div>
    );
}, (prevProps, nextProps) => {
    return prevProps.avatar === nextProps.avatar &&
        prevProps.name === nextProps.name &&
        prevProps.isUploading === nextProps.isUploading &&
        prevProps.loading === nextProps.loading &&
        prevProps.isLoaded === nextProps.isLoaded &&
        prevProps.size === nextProps.size &&
        prevProps.className === nextProps.className &&
        prevProps.onClick === nextProps.onClick &&
        prevProps.to === nextProps.to;
});

export default Avatar;
export type { AvatarProps };
