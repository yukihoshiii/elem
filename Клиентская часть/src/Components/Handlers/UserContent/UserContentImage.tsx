import { useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { useImageView } from '../../../System/Hooks/useImageView';
import LottieAnimation from '../../../UIKit/Components/Base/LotteAnimation';
import NeoImage from '../../../UIKit/Components/Base/NeoImage';
import classNames from 'classnames';

const UserContentImage = ({ image, censoring }) => {
    const [error, setError] = useState(false);
    const [isCensoring, setCensoring] = useState(censoring);
    const { openImage } = useImageView();

    const { ref: loadedRef, inView: isLoaded } = useInView({
        threshold: 0,
        triggerOnce: true
    });

    const handleOpen = () => {
        openImage({
            neo_file: image.img_data,
            metadata: {
                file_name: image.file_name,
                file_size: image.file_size
            }
        })
    }

    return (
        <div
            className="UserContent-Image"
            ref={loadedRef}
            onClick={handleOpen}
        >
            {isLoaded ? (
                !error ? (
                    <>
                        {isCensoring && (
                            <div className="Censoring">
                                <div className="Info">
                                    <div className="Text">Этот пост помечен как «Деликатный контент»</div>
                                    <button className="ShowButton" onClick={() => setCensoring(false)}>Показать</button>
                                </div>
                            </div>
                        )}
                        <NeoImage
                            className="IMG"
                            onError={() => setError(true)}
                            image={image.img_data}
                            draggable={false}
                        />
                        <div className={classNames('Blur', { 'NoBlur': isCensoring })}></div>
                        {
                            image.img_data?.preview && (
                                <img
                                    className="BlurIMG"
                                    src={image.img_data.preview}
                                    draggable={false}
                                    alt="фыр"
                                />
                            )
                        }
                    </>
                ) : (
                    <div className="Error">
                        <LottieAnimation className="Emoji" url="/static_sys/Lottie/Spider.json" />
                        <div className="Text">Ошибка загрузки файла</div>
                    </div>
                )
            ) : (
                <div className="UI-Loading">
                    <div className="UI-Loader_1"></div>
                </div>
            )
            }
        </div>
    )
}

export default UserContentImage;