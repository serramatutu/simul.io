import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

export default {
    input: 'src/scripts/app.js',
    format: 'iife',
    output: {
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
}