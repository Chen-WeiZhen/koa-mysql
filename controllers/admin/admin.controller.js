const jwt = require('jsonwebtoken');

class User {
  static async login(ctx) {
    let userName = ctx.request.body.userName || '',
      password = ctx.request.body.password || '';
    if (!userName || !password) {
      ctx.body = {
        success: 0,
        message: '用户名或密码不能为空'
      };
      return;
    }

    try {
      let results = await ctx.execSql(
        `SELECT id, hashedPassword, salt FROM user WHERE role='ADMIN' and userName = ?`,
        userName
      );
      if (results.length > 0) {
        let hashedPassword = results[0].hashedPassword,
          salt = results[0].salt,
          hashPassword = helper.encryptPassword(password, salt);
        if (hashedPassword === hashPassword) {
          ctx.session.user = userName;
          // 用户token
          const userToken = {
            name: userName,
            id: results[0].id
          };
          // 签发token
          const token = jwt.sign(userToken, config.tokenSecret, {
            expiresIn: '2h'
          });
          ctx.body = {
            success: 1,
            token: token,
            message: ''
          };
        } else {
          ctx.body = {
            success: 0,
            message: '用户名或密码错误'
          };
        }
      } else {
        ctx.body = {
          success: 0,
          message: '用户名或密码错误'
        };
      }
    } catch (error) {
      console.log(error);
      ctx.body = {
        success: 0,
        message: '查询数据出错'
      };
    }
  }
  static async test(ctx){
    console.log(111);
    const userName = 1
    let results = await ctx.execSql(
      `SELECT * from users`,
      userName
    );
    ctx.status = 200
    ctx.body = {
      name:'恭喜你忙活了一天成功了',
      data:results
    }
  }
}

module.exports = User