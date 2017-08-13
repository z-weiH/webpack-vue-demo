module.exports = {
  plugins: [
    // 两种都可以增加 css3前缀 browsers后面的参数不明，百度的
    require("postcss-cssnext")({browsers: ["last 0 versions"]})
    // require("autoprefixer")({browsers: ["last 0 versions"]})
  ]
}