import FileManager from './services/system/FileManager.js';
import ImageEngine from './services/system/ImageEngine.js';
import { dbQueryE } from './system/global/DataBase.js';

const ie = new ImageEngine();

const hI = async (p) => {
    try {
        const cn = JSON.parse(p.content);
        const oldFile = await FileManager.getFromWebStorage(`/Posts/Images/${cn.Image.file_name}`);

        if (oldFile) {
            const newImage = await ie.create({
                file: oldFile,
                path: 'posts/images',
                simpleSize: 900,
                preview: true
            })

            let newContent: any = {
                images: [
                    {
                        img_data: newImage,
                        file_name: cn?.Image?.orig_name || null,
                        file_size: oldFile.length
                    }
                ]
            }

            if (cn.Image?.censoring === true) {
                newContent.censoring = true;
            }
    
            await dbQueryE('UPDATE posts SET content = ? WHERE id = ?', [JSON.stringify(newContent), p.id]);
        } else {
            await dbQueryE('UPDATE posts SET content = null WHERE id = ?', [p.id]);
        }
    } catch (e) {
        console.log(e);
        await dbQueryE('UPDATE posts SET content = null WHERE id = ?', [p.id]);
    }
}

const hIS = async (p) => {
    let images: any = [];
    try {
        const cn = JSON.parse(p.content);
        
        for (const i of cn.images) {
            const oldFile = await FileManager.getFromWebStorage(`/Posts/Images/${i.file_name}`);
            const newImage = await ie.create({
                file: oldFile,
                path: 'posts/images',
                simpleSize: 900,
                preview: true
            })
            images.push({
                img_data: newImage,
                file_name: i?.orig_name || null,
                file_size: oldFile.length
            });
        }

        let newContent: any = {
            images: images
        }

        if (images.censoring === true) {
            newContent.censoring = true;
        }

        await dbQueryE('UPDATE posts SET content = ? WHERE id = ?', [JSON.stringify(newContent), p.id]);
    } catch (e) {
        console.log(e);
        await dbQueryE('UPDATE posts SET content = null WHERE id = ?', [p.id]);
    }
}

const hF = async (p) => {
    try {
        const cn = JSON.parse(p.content);
        const oldFile = await FileManager.getFromWebStorage(`/Posts/Files/${cn.File.file_name}`);

        if (oldFile) {
            const newFile = await FileManager.saveFile('posts/files', oldFile);

            if (newFile) {
                let newContent: any = {
                    files: [
                        {
                            file: newFile,
                            name: cn.File?.orig_name || null,
                            size: oldFile.length
                        }
                    ],
                }

                await dbQueryE('UPDATE posts SET content = ? WHERE id = ?', [JSON.stringify(newContent), p.id]);
            }
        } else {
            await dbQueryE('UPDATE posts SET content = null WHERE id = ?', [p.id]);
        }
    } catch (e) {
        console.log(e);
        await dbQueryE('UPDATE posts SET content = null WHERE id = ?', [p.id]);
    }
}

const hV = async (p) => {
    try {
        const cn = JSON.parse(p.content);
        const oldFile = await FileManager.getFromWebStorage(`/Posts/Video/${cn.Video.file_name}`);

        if (oldFile) {
            const newFile = await FileManager.saveFile('posts/videos', oldFile);

            if (newFile) {
                let newContent: any = {
                    videos: [
                        {
                            file: newFile,
                            name: cn.Video?.orig_name || null,
                            size: oldFile.length,
                            info: {
                                width: cn.Video.width,
                                height: cn.Video.height
                            }
                        }
                    ],
                }

                await dbQueryE('UPDATE posts SET content = ? WHERE id = ?', [JSON.stringify(newContent), p.id]);
            }
        } else {
            await dbQueryE('UPDATE posts SET content = null WHERE id = ?', [p.id]);
        }
    } catch (e) {
        console.log(e); 
        await dbQueryE('UPDATE posts SET content = null WHERE id = ?', [p.id]);
    }
}

const hA = async (p) => {
    try {
        const cn = JSON.parse(p.content);
       
        let newContent: any = {
            songs: [
                {
                    song_id: cn.Song.song_id,
                }
            ]
        }

        await dbQueryE('UPDATE posts SET content = ? WHERE id = ?', [JSON.stringify(newContent), p.id]);
    } catch (e) {
        console.log(e);
        await dbQueryE('UPDATE posts SET content = null WHERE id = ?', [p.id]);
    }
}

const run = async () => {
    const posts = await dbQueryE('SELECT * FROM posts');
    
    for (const p of posts) {
        try {
            switch (p.content_type) {
                case 'image':
                    await hI(p);
                    break;
                case 'images':
                    await hIS(p);
                    break;
                case 'file':
                    await hF(p);
                    break;
                case 'video':
                    await hV(p);
                    break;
                case 'audio':
                    await hA(p);
                    break;
                default: 
                    break;
            }
            console.log('Обработан пост: ', p.id);
        } catch (e) {
            console.error(`Ошибка при обработке поста ID ${p.id}:`, e);
        }
    }
};

run();