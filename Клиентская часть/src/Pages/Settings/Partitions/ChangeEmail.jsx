import { useState } from 'react';
import { useModal } from '../../../System/Context/Modal';
import { useTranslation } from 'react-i18next';
import { FormButton, TextInput } from '../../../UIKit';
import { useAuth } from '../../../System/Hooks/useAuth';
import { useWebSocket } from '../../../System/Context/WebSocket';

const ChangeEmail = () => {
  const { accountData, updateAccount } = useAuth();
  const { wsClient } = useWebSocket();
  const { t } = useTranslation();
  const { openModal } = useModal();
  const [email, setEmail] = useState(accountData.email);

  const changeEmail = () => {
    if (email !== accountData.email) {

      wsClient.send({
        type: 'social',
        action: 'change_profile/email',
        email: email
      }).then((res) => {
        if (res.status === 'success') {
          updateAccount({ email: email });
          openModal({
            type: 'info',
            title: t('success'),
            text: 'Ваша почта была успешно изменена'
          })
        } else if (res.status === 'error') {
          openModal({
            type: 'info',
            title: t('error'),
            text: res.message
          })
        }
      })
    }
  }

  return (
    <>
      <img
        src="/static_sys/Images/All/ChangeEmail.svg"
        className="UI-PB_Image"
        alt="фыр"
      />
      <div id="S-CP_EmailTitle" className="UI-PB_InputText">
        Текущая: {accountData.email}
      </div>
      <TextInput
        placeholder="Введите почту"
        type="text"
        value={email}
        onChange={(e) => { setEmail(e.target.value) }}
      />
      <FormButton
        title={t('change')}
        onClick={changeEmail}
      />
    </>
  );
};

export default ChangeEmail;
