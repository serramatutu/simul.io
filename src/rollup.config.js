export default [{
    input: 'scripts/app.js',
    output: {
        file: 'scripts/dist/simul-io-app.js',
        format: 'iife',
        globals: {
            "buckets-js": "buckets",
            "pixi.js": "PIXI"
        }
    },
    external: [
        'pixi.js',
        'buckets-js'
    ]
}]