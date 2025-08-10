import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useModal } from '../../../System/Context/Modal';
import { FormButton, TextInput } from '../../../UIKit';
import { useWebSocket } from '../../../System/Context/WebSocket';

const ChangePassword = () => {
  const { t } = useTranslation();
  const { wsClient } = useWebSocket();
  const { openModal } = useModal();
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const changePassword = () => {
    const data = {
      type: 'social',
      action: 'change_profile/password',
      old_password: oldPassword,
      new_password: newPassword,
    };

    wsClient.send(data).then((res) => {
      if (res.status === 'success') {
        openModal({
          type: 'info',
          title: t('success'),
          text: 'Пароль изменён'
        })
      } else if (res.status === 'error') {
        openModal({
          type: 'info',
          title: t('error'),
          text: res.message
        })
      }
    })
  };

  return (
    <>
      <img
        src="/static_sys/Images/All/ChangePassword.svg"
        className="UI-PB_Image"
        alt="фыр"
      />
      <div className="UI-PB_InputText">
        Запомните или запишите пароль, если вы его забудете, вы не сможете войти
        в аккаунт.
      </div>
      <TextInput
        placeholder="Старый пароль"
        type="text"
        value={oldPassword}
        onChange={(e) => { setOldPassword(e.target.value) }}
      />
      <TextInput
        placeholder="Новый пароль"
        type="text"
        value={newPassword}
        onChange={(e) => { setNewPassword(e.target.value) }}
      />
      <FormButton
        title={t('change')}
        onClick={changePassword}
      />
    </>
  );
};

export default ChangePassword;