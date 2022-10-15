import path from 'path'

export default {
    mode: 'development',
    entry: {
        map: './src/js/map.js',
        addImages: './src/js/addImages.js',
    },
    output: {
        filename: '[name].js',
        path: path.resolve('public/js')
    }
}