/**
 * Created by bjcwq on 16/8/2.
 */
import Account from '../models/account.js';

async function initAccount(uid) {
  return new Promise((resolve, reject) => {
    (async () => {
      try {
        let account = await Account.findOne({ uid });
        if (!account) {
          const now = Date.now();
          account = await Account.create({
            uid,
            balance: 0,
            income: 0,
            create_at: now,
            update_at: now,
          });
        }
        resolve(account);
      } catch (e) {
        reject(e);
      }
    })();
  });
}

export default {
    initAccount,
}