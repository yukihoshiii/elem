import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Animate } from '../../../System/Elements/Function';
import AddLink from '../Partitions/AddLink';
import EditLink from '../Partitions/EditLink';
import ChangeUsername from '../Partitions/ChangeUsername';
import Sessions from '../Partitions/Sessions';
import ChangeEmail from '../Partitions/ChangeEmail';
import ChangePassword from '../Partitions/ChangePassword';
import Status from '../Partitions/Status';
import ChangeLanguage from '../Partitions/ChangeLanguage';
import Authors from '../Partitions/Authors';
import Storage from '../Partitions/Storage';
import { NavigatedHeader } from '../../../UIKit';

const partitionComponents = {
  add_link: {
    title: 'Добавить ссылку',
    element: AddLink,
  },
  edit_link: {
    title: 'Редактировать ссылку',
    element: EditLink,
  },
  change_username: {
    title: 'Изменение ун. имени',
    element: ChangeUsername,
  },
  change_password: {
    title: 'Смена пароля',
    element: ChangePassword,
  },
  change_email: {
    title: 'Смена почты',
    element: ChangeEmail,
  },
  sessions: {
    title: 'Мои сессии',
    element: Sessions,
  },
  change_language: {
    title: 'Изменение языка',
    element: ChangeLanguage,
  },
  authors: {
    title: 'Авторы',
    element: Authors,
  },
  profile_status: {
    title: 'Мой статус',
    element: Status,
  },
  storage: {
    title: 'Управление хранилищем',
    element: Storage,
  },
};

const PartitionTitle = ({ type }) => {
  return partitionComponents[type.type].title;
};

const Partition_getType = ({ type, params, setPartitionOpen }) => {

  const { element: Component } = partitionComponents[type.type] || {};
  if (!Component) return null;

  return <Component params={params} setPartitionOpen={setPartitionOpen} />;
};

export const Partitions = ({ setPartitionOpen, propsPartitionType, params }) => {
  const scrollRef = useRef(null);
  
  useEffect(() => {
    Animate('.UI-PartitionBody', 'PARTITION_PAGE-SHOW', 0.4);
    Animate('#SETTINGS-BODY', 'SCROLL_VIEW-HIDE', 0.4);
  }, []);

  const closePartition = () => {
    Animate('.UI-PartitionBody', 'PARTITION_PAGE-HIDE', 0.4);
    Animate('#SETTINGS-BODY', 'SCROLL_VIEW-SHOW', 0.4);
    setTimeout(() => {
      setPartitionOpen(false);
    }, 500);
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Escape') {
      closePartition();
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, []);

  return (
    <>
      <div className="UI-PartitionBody">
        <NavigatedHeader
          title={<PartitionTitle type={propsPartitionType} />}
          onBack={closePartition}
          scrollRef={scrollRef}
        />
        <div ref={scrollRef} className="UI-ScrollView">
          <div className="UI-PB_Content">
            {Partition_getType({
              type: propsPartitionType,
              setPartitionOpen,
              closePartition,
              params
            })}
          </div>
        </div>
      </div>
    </>
  );
};
