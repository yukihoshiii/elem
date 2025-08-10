import FileManager from './services/system/FileManager.js';
import ImageEngine from './services/system/ImageEngine.js';
import { dbQueryE } from './system/global/DataBase.js';

const ie = new ImageEngine();

const reply = (reply) => {
    if (reply) {
        return {
            comment_id: reply.ID,
            author: {
                id: reply.UID,
                name: reply.Name,
                username: reply.Username,
                avatar: reply.Avatar
            },
            text: reply.Text,
            update_date: reply.update_date
        }
    } else {
        return null;
    }
}

const hI = async (c) => {
    try {
        const cn = JSON.parse(c.content);
        const oldFile = await FileManager.getFromWebStorage(`/Comments/Images/${cn.Image.file_name}`);

        if (oldFile) {
            const newImage = await ie.create({
                file: oldFile,
                path: 'comments/images',
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

            if (cn.reply) {
                const r = reply(cn.reply);
    
                if (r) {
                    newContent.reply = r;
                }   
            }
    
            await dbQueryE('UPDATE comments SET content = ? WHERE id = ?', [JSON.stringify(newContent), c.id]);
        } else {
            await dbQueryE('UPDATE comments SET content = null WHERE id = ?', [c.id]);
        }
    } catch (e) {
        console.log(e);
        await dbQueryE('UPDATE comments SET content = null WHERE id = ?', [c.id]);
    }
}

const hIS = async (c) => {
    let images: any = [];
    try {
        const cn = JSON.parse(c.content);
        
        for (const i of cn.images) {
            const oldFile = await FileManager.getFromWebStorage(`/Comments/Images/${i.file_name}`);
            const newImage = await ie.create({
                file: oldFile,
                path: 'comments/images',
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

        if (cn.reply) {
            const r = reply(cn.reply);

            if (r) {
                newContent.reply = r;
            }   
        }

        await dbQueryE('UPDATE comments SET content = ? WHERE id = ?', [JSON.stringify(newContent), c.id]);
    } catch (e) {
        console.log(e);
        await dbQueryE('UPDATE comments SET content = null WHERE id = ?', [c.id]);
    }
}

const hF = async (c) => {
    try {
        const cn = JSON.parse(c.content);
        const oldFile = await FileManager.getFromWebStorage(`/Comments/Files/${cn.File.file_name}`);

        if (oldFile) {
            const newFile = await FileManager.saveFile('comments/files', oldFile);

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
        
                if (cn.reply) {
                    const r = reply(cn.reply);
        
                    if (r) {
                        newContent.reply = r;
                    }   
                }

                await dbQueryE('UPDATE comments SET content = ? WHERE id = ?', [JSON.stringify(newContent), c.id]);
            }
        } else {
            await dbQueryE('UPDATE comments SET content = null WHERE id = ?', [c.id]);
        }
    } catch (e) {
        console.log(e);
        await dbQueryE('UPDATE comments SET content = null WHERE id = ?', [c.id]);
    }
}

const chR = async (c) => {
    if (c.content) {
        const cn = JSON.parse(c.content);

        if (cn.reply) {
            const r = reply(cn.reply);
            const newContent = {
                reply: r
            }

            await dbQueryE('UPDATE comments SET content = ? WHERE id = ?', [JSON.stringify(newContent), c.id]);
        }
    }
}

const run = async () => {
    const comments = await dbQueryE('SELECT * FROM comments');
    
    for (const c of comments) {
        try {
            switch (c.type) {
                case 'image':
                    await hI(c);
                    break;
                case 'images':
                    await hIS(c);
                    break;
                case 'file':
                    await hF(c);
                    break;
                default: 
                    await chR(c);
                    break;
            }
            console.log('Обработан комментарий: ', c.id);
        } catch (e) {
            console.error(`Ошибка при обработке комментария ID ${c.id}:`, e);
        }
    }
};

run();