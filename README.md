
## Getting started

```bash
# install dependency
npm install

# develop
npm run dev
```

This will automatically open http://localhost:9527.

## Build
```bash
# build for test environment
npm run build:sit

# build for production environment
npm run build:prod
```

## Advanced
```bash
# --report to build with bundle size analytics
npm run build:prod --report

# --preview to start a server in local to preview
npm run build:prod --preview

# lint code
npm run lint

# auto fix
npm run lint -- --fix
```


```bash
## api 请求返回统一格式
{
  msg: '描述信息',
  data: {}, //返回的具体数据，可以是数组或者对象
  code: 100001 // 返回的状态码 
}

code 状态码：

  /* 参数错误：10001-19999 */

  /* 用户错误：20001-29999*/

  /* 业务错误：30001-39999 */

  /* 系统错误：40001-49999 */

  /* 数据错误：50001-599999 */

  /* 接口错误：60001-69999 */

  /* 权限错误：70001-79999 */

```
