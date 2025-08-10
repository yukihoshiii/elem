import ChannelManager from '../../../../../services/account/ChannelManager.js';
import RouterHelper from '../../../../../services/system/RouterHelper.js';

const name = async ({ account, data }) => {
    const { name } = data;

    if (await ChannelManager.checkOwner(account.ID, data.channel_id)) {
        const channelManager = new ChannelManager(data.channel_id);
        const answer = await channelManager.changeName(name);
    
        return answer;
    } else {
        return RouterHelper.sendError('Вы не владелец канала.');
    }
}

export default name;