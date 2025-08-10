import { useTranslation } from "react-i18next"

export const Loading = () => {
  const { t } = useTranslation();
  
  return (
    <div className="UI-Loading">
        <div className="LoadingContent">
        <div className="UI-Loader_1"></div>
        <div className="Text">{t('vpn_or_tor')}</div>
        </div>
    </div>
  )
}