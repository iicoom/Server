const mongoose = require('mongoose');


// 合同
const contract = new mongoose.Schema({
  orders: { type: Array }, // 订单列表
  batch: { type: Object }, // 批次
  product: { type: Object }, // 产品
  company: { type: Object }, // 牧场
  user: { type: Object }, // 用户
}, {
  timestamps: {
    createdAt: 'create_at',
    updatedAt: 'update_at',
  },
});

export default mongoose.model('Contract', contract);
