import resolve from '@rollup/plugin-node-resolve';

export default {
    input: 'src/index.js',
    output: [
        { file: 'src/index.cjs.js', format: 'cjs' },
        { file: 'src/index.esm.js', format: 'es' }
    ],
    plugins: [
        resolve()
    ]
};
