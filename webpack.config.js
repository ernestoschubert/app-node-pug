import path from 'path'

export default {
    mode: 'development',
    entry: {
        map: './src/js/map.js',
        addImages: './src/js/addImages.js',
        showMap: './src/js/showMap.js',
        mapHome: './src/js/mapHome.js',
    },
    output: {
        filename: '[name].js',
        path: path.resolve('public/js')
    }
}