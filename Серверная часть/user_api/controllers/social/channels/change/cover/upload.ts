import ChannelManager from '../../../../../../services/account/ChannelManager.js';
import RouterHelper from '../../../../../../services/system/RouterHelper.js';

const upload_cover = async ({ account, data }) => {
    const { file } = data;
    
    if (await ChannelManager.checkOwner(account.ID, data.channel_id)) {
        const channelManager = new ChannelManager(data.channel_id);
        const answer = await channelManager.changeCover(file);
    
        return answer;
    } else {
        return RouterHelper.sendError('Вы не владелец канала.');
    }
}

export default upload_cover;