// import { param2Obj } from '@/utils'

const userMap = {
  admin: {
    roles: ['admin'],
    token: 'admin',
    introduction: '我是超级管理员',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    name: 'Super Admin',
    d: { id: 'bb470f7b-a1f4-11e8-bd47-5254c4c3f329', phone: '17000000001', userName: '测试账号' },
    e: '000000',
    m: '登陆成功'
  },
  editor: {
    roles: ['editor'],
    token: 'editor',
    introduction: '我是编辑',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    name: 'Normal Editor'
  }
}

export default {
  loginByUsername: config => {
    // const { username } = JSON.parse(config.body)
    return userMap['admin']
  },
  getUserInfo: config => {
    // const { token } = param2Obj(config.url)
    // console.log(token)
    if (userMap['admin']) {
      return userMap['admin']
    } else {
      return false
    }
  },
  logout: () => 'success'
}
