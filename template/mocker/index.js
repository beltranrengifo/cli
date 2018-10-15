const delay = require('webpack-api-mocker/utils/delay')
const noProxy = process.env.NO_PROXY === 'true'

const proxy = {
  // Priority processing.
  // apiMocker(app, path, option)
  // This is the option parameter setting for apiMocker
  // webpack-api-mocker@1.5.15 support
  _proxy: {
    proxy: {
      '/repos/*': 'https://api.github.com/',
      '/:owner/:repo/raw/:ref/*': 'http://127.0.0.1:2018'
    },
    changeHost: true
  },
  // =====================
  'GET /api/user': {
    id: 1,
    username: 'kenny',
    sex: 6
  },
  'GET /api/user/list': [
    {
      id: 1,
      username: 'kenny',
      sex: 6
    }, {
      id: 2,
      username: 'kenny',
      sex: 6
    }
  ],
  'GET /api/:owner/:repo/raw/:ref/(.*)': (req, res) => {
    const { owner, repo, ref } = req.params
    // http://localhost:8081/api/admin/webpack-mock-api/raw/master/add/ddd.md
    // owner => admin
    // repo => webpack-mock-api
    // ref => master
    // req.params[0] => add/ddd.md
    return res.json({
      id: 1,
      owner,
      repo,
      ref,
      path: req.params[0]
    })
  },
  'POST /api/login/account': (req, res) => {
    const { password, username } = req.body
    if (password === 'admin' && username === 'admin') {
      return res.json({
        status: 'ok',
        code: 200,
        data: {
          token: 'UserAdmitted',
          user: {
            id: 'administrator',
            username: 'admin',
            email: 'admin@admin.es'
          }
        }
      })
    } else {
      return res.status(403).json({
        status: 'error',
        code: 403
      })
    }
  },
  'POST /api/login/email': (req, res) => {
    const { email } = req.body
    const users = [
      {id: 1, username: 'admin', email: 'admin@admin.es'},
      {id: 2, username: 'test', email: 'test@test.es'}
    ]
    let found = users.find(u => u.email === email)
    if (found) {
      return res.json({
        status: 'ok',
        code: 200,
        data: {
          found
        }
      })
    } else {
      return res.status(403).json({
        status: 'error',
        code: 403
      })
    }
  },
  'DELETE /api/user/:id': (req, res) => {
    console.log('---->', req.body)
    console.log('---->', req.params.id)
    res.send({ status: 'ok', message: '删除成功！' })
  }
}
module.exports = (noProxy ? {} : delay(proxy, 2500))