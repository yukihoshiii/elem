import RouterHelper from '../../../../../services/system/RouterHelper.js';
import { dbQueryE } from '../../../../../system/global/DataBase.js';

const load_codes = async () => {
    const rows = await dbQueryE('SELECT * FROM gold_codes ORDER BY id DESC');

    const codes = rows.map(code => ({
        id: code.id,
        key: code.code,
        activated: code.activated === 1
    }));

    return RouterHelper.sendAnswer({
        codes: codes
    })
}

export default load_codes;