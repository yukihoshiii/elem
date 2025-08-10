import { useState, useEffect } from 'react';
import { I_GITHUB, I_SAVE } from '../UI/IconPack';
import { motion, AnimatePresence } from 'framer-motion';
import classNames from 'classnames';

export const SavesAvatar = () => (
    <div className="Avatar SavesAvatar">
        <I_SAVE />
    </div>
);

export const GitHubButton = ({ title, link }) => {
    const goToLink = () => {
        window.open(link, '_blank', 'noopener,noreferrer')
    }

    return (
        <button onClick={goToLink} className="UI-GitHubButton">
            <I_GITHUB />
            {title}
        </button>
    )
}

export const ProgressRing = ({ progress, size = 100, stroke = 4 }) => {
    const [normalizedRadius, setNormalizedRadius] = useState(0);
    const [circumference, setCircumference] = useState(0);
    const [offset, setOffset] = useState(0);

    useEffect(() => {
        const calculatedRadius = (size / 2) - stroke;
        const circumference = 2 * Math.PI * calculatedRadius;
        setNormalizedRadius(calculatedRadius);
        setCircumference(circumference);

        const progressOffset = circumference - (progress / 100) * circumference;
        setOffset(isNaN(progressOffset) ? 0 : progressOffset);
    }, [progress, size, stroke]);

    return (
        <svg
            className="Progress"
            width={size}
            height={size}
            viewBox={`0 0 ${size} ${size}`}
        >
            <circle
                stroke="currentColor"
                fill="transparent"
                strokeLinecap="round"
                strokeWidth={stroke}
                strokeDasharray={`${circumference} ${circumference}`}
                style={{ strokeDashoffset: offset }}
                r={normalizedRadius}
                cx={size / 2}
                cy={size / 2}
            />
        </svg>
    );
};

export const Tabs = ({ tabs, select, className }) => {
    const [activeTab, setActiveTab] = useState(0);

    const selectTab = (i) => {
        setActiveTab(i);
        select(i);
    }

    return (
        <div className={classNames('UI-Tabs', className)}>
            {tabs.map((tab, i) => (
                <button
                    key={i}
                    className={classNames('Tab', i === activeTab && 'ActiveTab')}
                    onClick={() => { selectTab(i) }}
                >
                    {tab.title}
                </button>
            ))}
        </div>
    )
}

export const GovernButtons = ({ isOpen, buttons }) => {
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
        },
    }

    return (
        <AnimatePresence>
            {
                isOpen && (
                    <motion.div
                        className="UI-GovernButtons"
                        variants={variants}
                        initial="hide"
                        animate="show"
                        exit="hide"
                    >
                        <div className="Container">
                            {buttons.map((button, i) => (
                                <button key={i} onClick={button.onClick}>
                                    {button.icon}
                                    {button.title}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )
            }
        </AnimatePresence>
    );
}