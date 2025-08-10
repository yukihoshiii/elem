import { useState, useEffect, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../System/Hooks/useAuth';
import { 
    I_WALLET
} from '../../System/UI/IconPack';
import '../../System/UI/balance.scss';

const Balance = () => {
    const { t } = useTranslation();
    const { accountData } = useAuth();
    const [balance, setBalance] = useState(accountData?.e_balls || 0);
    const [pageLoaded, setPageLoaded] = useState(false);

    useEffect(() => {
        setPageLoaded(true);
    }, []);
    
    const formatDate = useCallback(() => {
        const date = new Date();
        return date.toLocaleDateString('ru-RU');
    }, []);

    const balanceClass = useMemo(() => {
        return `Balance-Amount ${Number(balance) === 0 ? 'zero-balance' : ''}`;
    }, [balance]);

    return (
        <div className="UI-PAGE_BODY BalancePage">
            <div className="UI-ScrollView Content-Center">
                <div className="UI-C_M">
                    <div className="UI-Card Balance-Card UI-B_FIRST animate-fadeIn">
                        <div className="Balance-Title">{t('balance_current')}</div>
                        <div className={balanceClass}>
                            <div className="UI-Eball">E</div>
                            {balance}
                        </div>
                        <div className="Balance-Date">{t('balance_date')} {formatDate()}</div>
                    </div>

                    <div className="UI-Block UI-BLOCK_PANEL Earning-Block animate-fadeIn" style={{ animationDelay: '0.2s' }}>
                        <div className="UI-BLOCK_HEADER">
                            <div className="UI-Block-Title">{t('balance_ways_to_earn')}</div>
                        </div>
                        
                        <div className="UI-BLOCK_CONTENT">
                            <div className="Earning-Item UI-HOVER_EFFECT">
                                <div className="Earning-Icon UI-BTN_CIRCLE">
                                    <I_WALLET />
                                </div>
                                <div className="Earning-Info">
                                    <div className="Earning-Description">{t('balance_posts_1')}</div>
                                    <div className="Earning-Amount">
                                        <div className="UI-Eball">E</div> 0.001
                                    </div>
                                </div>
                            </div>
                            
                            <div className="Earning-Item UI-HOVER_EFFECT">
                                <div className="Earning-Icon UI-BTN_CIRCLE">
                                    <I_WALLET />
                                </div>
                                <div className="Earning-Info">
                                    <div className="Earning-Description">{t('balance_posts_10')}</div>
                                    <div className="Earning-Amount">
                                        <div className="UI-Eball">E</div> 0.01
                                    </div>
                                </div>
                            </div>
                            
                            <div className="Earning-Item UI-HOVER_EFFECT">
                                <div className="Earning-Icon UI-BTN_CIRCLE">
                                    <I_WALLET />
                                </div>
                                <div className="Earning-Info">
                                    <div className="Earning-Description">{t('balance_posts_100')}</div>
                                    <div className="Earning-Amount">
                                        <div className="UI-Eball">E</div> 0.1
                                    </div>
                                </div>
                            </div>
                            
                            <div className="Earning-Item UI-HOVER_EFFECT">
                                <div className="Earning-Icon UI-BTN_CIRCLE">
                                    <I_WALLET />
                                </div>
                                <div className="Earning-Info">
                                    <div className="Earning-Description">{t('balance_posts_1000')}</div>
                                    <div className="Earning-Amount">
                                        <div className="UI-Eball">E</div> 1
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="Info-Block">
                            <div className="Info-Title">{t('balance_accrual_title')}</div>
                            <div className="Info-Item">{t('balance_accrual_time')}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Balance;