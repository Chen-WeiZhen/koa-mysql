const router = require('koa-router')()
const main = require('./main')
const user = require('./users')
const admin = require('../controllers/admin/admin')

router.use(main.routes(), main.allowedMethods())
router.use(user.routes(), user.allowedMethods())
router.use(admin.routes(),admin.allowedMethods())

module.exports = router