module.exports = {
    chainWebpack: config => config.resolve.symlinks(false),
    baseUrl: process.env.NODE_ENV === 'production'
        ? '/'
        : '/'
}