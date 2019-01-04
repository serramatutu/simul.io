import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

export default [{
    input: 'scripts/app.js',
    output: {
        name: 'simulIoApp',
        file: 'scripts/dist/simul-io-app.js',
        format: 'iife',
        globals: {
            "pixi.js": "PIXI"
        }
    },
    external: [
        'pixi.js'
    ],
    plugins: [
        resolve(),
        commonjs()
    ]
}]