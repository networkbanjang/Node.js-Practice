const schedule = require('node-schedule');
const { Good, Auction, User, sequelize } = require('./models');

//서버 시작될때마다 스케줄링

module.exports = async () => {
  try {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1); //어제
    const targets = await Good.findAll({     //경매가 끝난것 찾기
      where: {
        SoldId: null,   //구입자없음
        createAt: { [Op.lite]: yesterday },   //어제보다 더 전에 만들어진것 찾기
      },
    });

    targets.forEach(async (target) => {
      const t = await sequelize.transaction();
      try {
        const success = await Auction.findOne({
          where: { GoodId: target.id },
          order: [['bid', 'DESC']],
          transaction: t,
        });
        await Good.update({ SoldId: success.UserId }, { where: { id: target.id }, transaction: t, });
        await User.update({
          money: sequelize.literal(`money - ${success.bid}`),
        }, {
          where: { id: success.UserId },
          transaction: t,
        })
        await t.commit();
      } catch (error) {
        await t.rollback();
      }
    });

    const unsold = await Good.findAll({
      where: {
        SoldId: null,   //구입자없음
        createAt: { [Op.gt]: yesterday },  //어제와 지금 사이 
      },
    });
    unsold.forEach(async (target) => {
      try {
        const end = newData(unsold.createAt);
        end.setDate(end.getDate + 1);  // 만든 뒤 하루 뒤
        schedule.scheduleJob(end, async () => {
          const success = await Auction.findOne({
            where: { GoodId: target.id },
            order: [['bid', 'DESC']],
          });
          await Good.update({ SoldId: success.UserId }, { where: { id: target.id }, transaction: t, });
          await User.update({
            money: sequelize.literal(`money - ${success.bid}`),
          }, {
            where: { id: success.UserId },
          });
        })
      } catch (error) {
        console.error(error);
      }
    })
  } catch (error) {
    console.error(error);
    next();
  }
}

