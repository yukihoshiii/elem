import ChannelManager from '../../../../../services/account/ChannelManager.js';
import RouterHelper from '../../../../../services/system/RouterHelper.js';

const description = async ({ account, data }) => {
    const { description } = data;

    if (await ChannelManager.checkOwner(account.ID, data.channel_id)) {
        const channelManager = new ChannelManager(data.channel_id);
        const answer = await channelManager.changeDescription(description);
    
        return answer;
    } else {
        return RouterHelper.sendError('Вы не владелец канала.');
    }
}

export default description;