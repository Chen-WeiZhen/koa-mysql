const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const query = require('./util/mysql')
const routers = require('./routes/index')

const session = require('koa-session2');


app.use(session({
  key: "SESSIONID",   //default "koa:sess"
}));

// error handler
onerror(app)

// app.use(async(ctx,next)=>{
//   ctx.execSql = query
//   ctx.set('Access-Control-Allow-Origin',true)
// })
app.proxy = true
app.use(async function(ctx, next) {
  ctx.execSql = query  
  ctx.set("Access-Control-Allow-Origin", ctx.request.header.origin)
  ctx.set("Access-Control-Allow-Credentials", true);
  ctx.set("Access-Control-Max-Age", 86400000);
  ctx.set("Access-Control-Allow-Methods", "OPTIONS, GET, PUT, POST, DELETE");
  ctx.set("Access-Control-Allow-Headers", "x-requested-with, accept, origin, content-type");
  if (ctx.request.method == "OPTIONS") {
    ctx.response.status = 200
  }
  await next()
})

// middlewares
app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
}))
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

app.use(views(__dirname + '/views', {
  extension: 'pug'
}))

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// routes
app.use(routers.routes(), routers.allowedMethods())
// app.use(users.routes(), users.allowedMethods())
// app.use(ctx => {
//   let n = ctx.session.views || 0;
//   ctx.session.views = ++n;
//   ctx.body = n + ' views';
// });


// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app
