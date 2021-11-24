module.exports = {
  presets: ['@vue/cli-plugin-babel/preset'],
  plugins: [
    '@babel/plugin-syntax-dynamic-import',
    [
      'import',
      {
        libraryName: 'vxe-table',
        style: true // 样式也按需加载
      }
    ]
  ]
}
