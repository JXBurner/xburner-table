module.exports = {
  presets: [
    '@vue/app'
  ],
  plugins: [
    '@babel/plugin-proposal-optional-chaining',
    [
      '@babel/plugin-transform-modules-commonjs',
      {
        allowTopLevelThis: true
      }
    ]
  ]
}
