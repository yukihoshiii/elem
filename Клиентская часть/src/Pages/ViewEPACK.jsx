import { useEffect, useRef, useState } from 'react';
import { NavLink } from 'react-router';
import { HandleTimeAge, HandleFileSize, HandleFileIcon } from '../System/Elements/Handlers';
import { I_COMMENT, I_DISLIKE, I_INFO, I_LIKE } from '../System/UI/IconPack';
import GoldUsers from '../System/Elements/GoldUsers';
import { useTranslation } from 'react-i18next';
import { DragDropArea } from '../System/Elements/DragDropArea';
import './ViewEPACK.scss';
import { useModal } from '../System/Context/Modal';
import { FormButton } from '../UIKit';

function Modal({ Title, Content }) {
  alert(`${Title}: ${Content}`);
}

const HandleEPACKAvatar = ({ avatar, name }) => {
  if (avatar) {
    return <img src={`data:image/jpeg;base64,${avatar}`} />;
  } else {
    return <div className="NonAvatar">{name[0] || '?'}</div>;
  }
};

const HandleEPACKComment = ({ eVer, comment }) => {
  return (
    <>
      {
        (eVer === '1.4' || eVer === '1.9.2' || eVer === '1.9.4') && (
          <div className="UI-Block Comment">
            <div className="TopBar">
              <div className="Info">
                <NavLink to={`/e/${comment.Username}`} className="Avatar">
                  <HandleEPACKAvatar avatar={comment.Avatar} name={comment.Name} />
                </NavLink>
                <div>
                  <NavLink to={`/e/${comment.Username}`} className="Name">
                    {comment.Name}
                  </NavLink>
                  <div className="Date">
                    <HandleTimeAge inputDate={comment.Date} />
                  </div>
                </div>
              </div>
            </div>
            <div className="Text">{comment.Text}</div>
          </div>
        )
      }
      {
        eVer === '2.1' && (
          <div className="UI-Block Comment">
            <div className="TopBar">
              <div className="Info">
                <NavLink to={`/e/${comment.author_data.username}`} className="Avatar">
                  <HandleEPACKAvatar avatar={comment.author_data.avatar} name={comment.author_data.name} />
                </NavLink>
                <div>
                  <NavLink to={`/e/${comment.author_data.username}`} className="Name">
                    {comment.author_data.name}
                  </NavLink>
                  <div className="Date">
                    <HandleTimeAge inputDate={comment.date} />
                  </div>
                </div>
              </div>
            </div>
            <div className="Text">{comment.text}</div>
          </div>
        )
      }
    </>
  );
};

const HandlePost = ({ post }) => {
  return (
    <>
      {
        post.E_VER === '1.4' && (
          <div className="EPACK-Post Post UI-Block">
            <div className="TopBar">
              <NavLink to={`/e/${post.Username}`}>
                <div className="Avatar">
                  <HandleEPACKAvatar avatar={post.Avatar} name={post.Name} />
                </div>
              </NavLink>
              <div>
                <div className="Name">{post.Name}</div>
                <div className="Date"><HandleTimeAge inputDate={post.Date} /></div>
              </div>
            </div>
            <div className="Text">{post.Text}</div>
            {post.Content && post.Content.Type === 'Image' && (() => {
              const image = 'data:image/jpeg;base64,' + post.Content.Image;
              return (
                <div className="UserContent-Image" img-name={post.Content.Name} img-size={post.Content.Size}>
                  <img className="IMG" src={image} alt={post.Content.Name} />
                  <div className="Blur"></div>
                  <img className="BlurIMG" src={image} alt={post.Content.Name} />
                </div>
              );
            })()}
            {post.Content && post.Content.Type === 'File' && (() => {
              const fileOrigName = post.Content.Name;
              return (
                <div className="UserContent-File">
                  <HandleFileIcon fileName={fileOrigName} />
                  <div className="FileInfo">
                    <div className="FileName">{fileOrigName}</div>
                    <div className="FileSize">
                      <HandleFileSize bytes={post.Content.Size} />
                    </div>
                    <a href={`data:application/octet-stream;base64,${post.Content.File}`} download={fileOrigName}>
                      Скачать
                    </a>
                  </div>
                </div>
              );
            })()}
            <div className="Interaction">
              <div className="InteractionCount">
                <I_LIKE />
                <div className="Likes">{post.LikesCount}</div>
              </div>
              <div className="InteractionCount">
                <I_DISLIKE />
                <div className="Dislikes">{post.DislikesCount}</div>
              </div>
            </div>
          </div>
        )
      }
      {
        (post.E_VER === '1.9.2' || post.E_VER === '1.9.4') && (
          <div className="EPACK-Post Post UI-Block">
            <div className="TopBar">
              <NavLink to={`/e/${post.Username}`}>
                <div className="Avatar">
                  <HandleEPACKAvatar avatar={post.Avatar} name={post.Name} />
                </div>
              </NavLink>
              <div>
                <div className="Name">{post.Name}</div>
                <div className="Date"><HandleTimeAge inputDate={post.Date} /></div>
              </div>
            </div>
            <div className="Text">{post.Text}</div>
            {post.Content &&
              post.Content.Type === 'Image' &&
              (() => {
                const image = 'data:image/jpeg;base64,' + post.Content.ImageB64;
                return (
                  <div
                    className="UserContent-Image"
                    img-name={post.Content.orig_name}
                    img-size={post.Content.file_size}
                  >
                    <img className="IMG" src={image} alt={post.Content.orig_name} />
                    <div className="Blur"></div>
                    <img className="BlurIMG" src={image} alt={post.Content.orig_name} />
                  </div>
                );
              })()}
            {post.Content &&
              post.Content.Type === 'File' &&
              (() => {
                const fileOrigName = post.Content.orig_name;
                return (
                  <div className="UserContent-File">
                    <HandleFileIcon fileName={fileOrigName} />
                    <div className="FileInfo">
                      <div className="FileName">{fileOrigName}</div>
                      <div className="FileSize">
                        <HandleFileSize bytes={post.Content.Size} />
                      </div>
                      <a
                        href={`data:application/octet-stream;base64,${post.Content.FileB64}`}
                        download={fileOrigName}
                      >
                        Скачать
                      </a>
                    </div>
                  </div>
                );
              })()}
            <div className="Interaction">
              <div className="InteractionCount">
                <I_LIKE />
                <div className="Likes">{post.LikesCount}</div>
              </div>
              <div className="InteractionCount">
                <I_DISLIKE />
                <div className="Dislikes">{post.DislikesCount}</div>
              </div>
              <div className="InteractionCount">
                <I_COMMENT />
                <div className="Comments">{post.CommentsCount}</div>
              </div>
            </div>
          </div>
        )
      }
      {
        (post.E_VER === '2.1') && (
          <div className="EPACK-Post Post UI-Block">
            <div className="TopBar">
              <NavLink to={`/e/${post.author_data.username}`}>
                <div className="Avatar">
                  <HandleEPACKAvatar avatar={post.author_data.avatar} name={post.author_data.name} />
                </div>
              </NavLink>
              <div>
                <div className="Name">{post.author_data.name}</div>
                <div className="Date"><HandleTimeAge inputDate={post.date} /></div>
              </div>
            </div>
            <div className="Text">{post.text}</div>
            {post.content &&
              post.content.type === 'image' &&
              (() => {
                const image = 'data:image/jpeg;base64,' + post.content.file;
                return (
                  <div
                    className="UserContent-Image"
                    img-name={post.content.orig_name}
                    img-size={post.content.file_size}
                  >
                    <img className="IMG" src={image} alt={post.content.orig_name} />
                    <div className="Blur"></div>
                    <img className="BlurIMG" src={image} alt={post.content.orig_name} />
                  </div>
                );
              })()}
            {post.content &&
              post.content.type === 'file' &&
              (() => {
                const fileOrigName = post.content.orig_name;
                return (
                  <div className="UserContent-File">
                    <HandleFileIcon fileName={fileOrigName} />
                    <div className="FileInfo">
                      <div className="FileName">{fileOrigName}</div>
                      <div className="FileSize">
                        <HandleFileSize bytes={post.content.size} />
                      </div>
                      <a
                        href={`data:application/octet-stream;base64,${post.content.file}`}
                        download={fileOrigName}
                      >
                        Скачать
                      </a>
                    </div>
                  </div>
                );
              })()}
            <div className="Interaction">
              <div className="InteractionCount">
                <I_LIKE />
                <div className="Likes">{post.likes_count}</div>
              </div>
              <div className="InteractionCount">
                <I_DISLIKE />
                <div className="Dislikes">{post.dislikes_count}</div>
              </div>
              <div className="InteractionCount">
                <I_COMMENT />
                <div className="Comments">{post.comments_count}</div>
              </div>
            </div>
          </div>
        )
      }
    </>
  )
}

const ViewEPACK = () => {
  const { t } = useTranslation();
  const epackInputRef = useRef(null);
  const [epackVersion, setEpackVersion] = useState('');
  const [post, setPost] = useState('');
  const [comments, setComments] = useState([]);
  const { openModal } = useModal();

    const handleFileChange = (event) => {
    const input = event.target?.files?.[0];
      if (input) {
      const fileFormat = input.name.split('.').pop();
        if (input && fileFormat === 'epack') {
          const reader = new FileReader();
          reader.onload = (e) => {
          const fileContent = e.target?.result;
          if (fileContent && typeof fileContent === 'string') {
            HandleEPACK(JSON.parse(fileContent));
          }
          };
          reader.readAsText(input);
        } else {
        openModal({
          title: t('error'),
          text: 'Файл должен быть формата «epack»',
          type: 'alert'
          });
        }
      }
    };

  const handleFilesDrop = (files) => {
    if (files.length > 0) {
      const file = files[0];
      const fileFormat = file.name.split('.').pop();
      if (fileFormat === 'epack') {
        const reader = new FileReader();
        reader.onload = (e) => {
          const fileContent = e.target?.result;
          if (fileContent && typeof fileContent === 'string') {
            HandleEPACK(JSON.parse(fileContent));
      }
    };
        reader.readAsText(file);
      } else {
        openModal({
          title: t('error'),
          text: 'Файл должен быть формата «epack»',
          type: 'alert'
        });
      }
    }
  };

  const HandleEPACK = (postData) => {
    try {
      setEpackVersion(postData.E_VER);
      setPost(postData);
      setComments(postData?.Comments || postData?.comments || []);
    } catch (e) {
      openModal({
        title: 'Error',
        text: 'Ой, что-то пошло не так...',
        type: 'alert'
      });
    }
  }

  return (
    <>
      <div className="UI-C_L">
        <div className="UI-ScrollView">
          <div className="UI-Block UI-B_FIRST">
            <div className="UI-Title">Загрузка файла</div>
            <DragDropArea 
              className="EPACK-FileInput"
              data-text={t('drop_epack_file_here')}
              onFilesDrop={handleFilesDrop}
            >
              <input id="fileInput" type="file" accept=".epack" onChange={handleFileChange} />
              <label htmlFor="fileInput">
                {t('select_file')}
              </label>
              <div className="Text">
                {t('epack_warning')}
            </div>
            </DragDropArea>
          </div>
          <div className="UI-Block UI-InfoBlock">
            <I_INFO />
            <div>
              {t('epack_info')}
            </div>
          </div>
          <div>
            {post ? (
              <HandlePost post={post} />
            ) : (
              <div className="UI-ErrorMessage">Файл не выбран</div>
            )}
            {comments.length > 0 && (
              <>
                <div className="UI-PartitionName">Комментарии</div>
                {comments.map((comment, index) => (
                  <HandleEPACKComment
                    key={index}
                    eVer={epackVersion}
                    comment={comment}
                  />
                ))}
              </>
            )}
          </div>
        </div>
      </div>
      <div className="UI-C_R">
        <div className="UI-ScrollView">
          <div className="UI-Block UI-B_FIRST">
            <div className="UI-Title">{t('gold_users_list_1')}</div>
            <div className="GoldSub-Users">
              <GoldUsers />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ViewEPACK;
