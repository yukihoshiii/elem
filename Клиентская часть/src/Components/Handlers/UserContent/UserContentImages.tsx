import { useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { useImageView } from '../../../System/Hooks/useImageView';
import NeoImage from '../../../UIKit/Components/Base/NeoImage';

const UserContentImages = ({ images, censoring }) => {
    const { openImage, openImages } = useImageView();
    const [isCensoring, setCensoring] = useState(censoring);

    const { ref: loadedRef, inView: isLoaded } = useInView({
        threshold: 0,
        triggerOnce: true
    });

    let S_I = 0;
    let L_I = images.length - 2;

    const handleOpen = (index) => {
        openImage({
            neo_file: images[index].img_data,
            metadata: {
                file_name: images[index].file_name,
                file_size: images[index].file_size
            }
        })
        openImages(images.map((image) => (
            {
                neo_file: image.img_data,
                metadata: {
                    file_name: image.file_name,
                    file_size: image.file_size
                }
            }
        )))
    }

    return (
        <div className="UserContent-Images" ref={loadedRef} >
            {isLoaded ?
                (<>
                    {
                        isCensoring && (
                            <div className="Censoring">
                                <div className="Info">
                                    <div className="Text">Этот пост помечен как «Деликатный контент»</div><button className="ShowButton" onClick={() => setCensoring(false)}>Показать</button></div>
                            </div>
                        )
                    }
                    {images.map((image, i) => {
                        if (i + 1 >= 4) {
                            return false;
                        }
                        S_I++;
                        return (
                            <div key={i} onClick={() => { handleOpen(i) }} className={`P${S_I}${S_I > 2 && L_I > 2 ? ' Blured' : ''}`}>
                                <NeoImage
                                    onClick={handleOpen}
                                    className="IMG"
                                    image={image.img_data}
                                    draggable={false}
                                />
                                {
                                    S_I > 2 && L_I > 2 && (
                                        <div className="Count">+{L_I}</div>
                                    )
                                }
                            </div>
                        )
                    })}
                </>) : (
                    <div className="UI-Loading">
                        <div className="UI-Loader_1"></div>
                    </div>
                )
            }
        </div>
    )
};

export default UserContentImages;