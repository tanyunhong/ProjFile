//应用查询的端点  path是查询的路径
let prefix = ''//'api1/'//'monitor/'
export default {
  data: [{
    label: '自动配置',
    path: prefix + 'autoconfig'
  }, {
    label: '属性配置',
    path: prefix + 'configprops'
  }, {
    label: 'Bean监控',
    path: prefix + 'beans'
  }, {
    label: '线程信息',
    path: prefix + 'dump'
  }, {
    label: '环境变量',
    path: prefix + 'env'
  }, {
    label: '健康指标',
    path: prefix + 'health'
  }, {
    label: '应用信息',
    path: prefix + 'info'
  }, {
    label: 'URL映射',
    path: prefix + 'mappings'
  }, {
    label: 'Http跟踪',
    path: prefix + 'trace'
  }, {
    label: '关闭应用',
    path: prefix + 'shutdown'
  }, {
    label: '测试',
    path: prefix + 'getActuorInfo'
  }
  ]
}
