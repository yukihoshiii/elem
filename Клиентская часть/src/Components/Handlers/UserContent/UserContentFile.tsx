import { useTranslation } from 'react-i18next';
import { HandleFileIcon, HandleFileSize } from '../../../System/Elements/Handlers';

const UserContentFile = ({ file }) => {
    const { t } = useTranslation();

    const download = () => {

    }

    return (
        <div className="UserContent-File">
            <HandleFileIcon fileName={file.name} />
            <div className="FileInfo">
                <div className="FileName">{file.name}</div>
                <div className="FileSize"><HandleFileSize bytes={file.size} /></div>
                <button
                    onClick={download}
                >
                    {t('download')}
                </button>
            </div>
        </div>
    )
}

export default UserContentFile;