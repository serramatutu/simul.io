export default [{
    input: 'scripts/app.js',
    output: {
        file: 'scripts/dist/simul-io-app.js',
        format: 'iife'
    },
    external: [
        'pixi.js',
        'buckets-js'
    ]
}]