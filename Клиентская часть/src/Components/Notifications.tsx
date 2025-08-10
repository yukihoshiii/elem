import { useDispatch } from 'react-redux';
import { addMessage, updateChat } from '../Store/Slices/messenger';
import { useMessengerEvent } from '../System/Context/WebSocket';
import { useAuth } from '../System/Hooks/useAuth';

const Notifications = () => {
    const { updateAccount } = useAuth();
    const dispatch = useDispatch();

    const handleNewMessage = (data) => {
        const newMessage = {
            mid: data.mid,
            uid: data.uid,
            decrypted: JSON.parse(data.message),
            is_decrypted: true,
            date: data.date
        }
        dispatch(addMessage({
            chat_id: data.target.id,
            chat_type: data.target.type,
            message: newMessage
        }));
        dispatch(updateChat({
            chat_id: data.target.id,
            chat_type: data.target.type,
            newData: {
                last_message: newMessage.decrypted?.text,
                last_message_date: new Date().toISOString()
            },
            notificationsDelta: +1
        }));
        updateAccount({
            messenger_notificationsDelta: +1
        })
    }

    useMessengerEvent('new_message', handleNewMessage)

    return null;
}

export default Notifications;
