import { connectAccount } from '../../system/global/AccountManager.js';
import AccountManager from '../../services/account/AccountManager.js';
import LinkManager from '../../services/account/LinkManager.js';
import { dbQueryE } from '../../system/global/DataBase.js';

const connect = async (ws, data) => {
  if (!data?.S_KEY) {
    return 'S-KEY не найден.';
  }

  const session = await connectAccount({ S_KEY: data.S_KEY, ws: ws });

  if (!session) {
    return { status: 'error', message: 'S-KEY не актуален.' };
  }

  const accountManager = new AccountManager(session.ID);

  if (!accountManager) {
    return { status: 'error', message: 'Аккаунт не найден.' };
  }

  const linkManager = new LinkManager(session.ID);
  const goldStatus = await accountManager.getGoldStatus();
  const permissions = await accountManager.getPermissions();

  ws.account = { ...session, permissions: permissions };

  return {
    status: 'success',
    accountData: {
      id: session.ID,
      name: session.Name,
      username: session.Username,
      email: session.Email,
      avatar: session.Avatar,
      cover: session.Cover,
      description: session.Description,
      e_balls: session.Eballs,
      permissions: permissions,
      channels: await accountManager.getChannels(),
      gold_status: goldStatus && goldStatus?.activated || false,
      gold_history: await accountManager.getGoldHistory(),
      links: await linkManager.getLinks(),
      messenger_notifications: await accountManager.getMessengerNotifications()
    }
  }
}

const logout = async (ws, data) => {
  if (!data.S_KEY) {
    return { status: 'error', message: 'S-KEY не найден' };
  }

  const session = await dbQueryE('SELECT * FROM `accounts_sessions` WHERE `s_key` = ?', [data.S_KEY]);

  if (!session || session.length === 0 || !session[0].uid) {
    return { status: 'error', message: 'S-KEY не актуален' };
  };

  if (session) {
    await dbQueryE('DELETE FROM `accounts_sessions` WHERE `s_key` = ?', [data.S_KEY]);
  }

  if (session[0].uid === ws.account.ID) {
    ws.account = null;
  }

  return { status: 'success' };
}

const handlers = {
  connect: connect,
  logout: logout
}

const authorization = async (ws, action, data) => {
  if (!handlers[action]) {
    return { status: 'error', message: 'Такого действия нет' };
  }

  const result = await handlers[action](ws, data);
  return { action, ...result };
};

export default authorization;