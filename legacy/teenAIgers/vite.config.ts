import { defineConfig } from 'vite';
// @ts-ignore
import nested from 'tailwindcss/nesting';
import tailwindcss from 'tailwindcss';
import tailwindcssConfig from './tailwind.config.js'; // 注意匹配实际文件
import uni from '@dcloudio/vite-plugin-uni';
import uniTailwind from '@uni-helper/vite-plugin-uni-tailwind';
import path from "path";
import comment from "postcss-comment";
import autoprefixer from "autoprefixer";
import postcssPresetEnv from 'postcss-preset-env';
import postcssImport from "postcss-import";
import { uniPostcssPlugin } from '@dcloudio/uni-cli-shared'


// https://vitejs.dev/config/
export default defineConfig({
    server: {
        port: 3011 // 将端口改为 3001
    },
    css: {
        // 只能在 Vite 配置文件内处理 postcss 配置
        // https://github.com/dcloudio/uni-app/issues/3367
        postcss: {
            parser: comment,
            plugins: [
                tailwindcss(tailwindcssConfig),
                nested(),
                postcssImport({
                    resolve(id, basedir, importOptions) {
                        if (id.startsWith("~@/")) {
                            return path.resolve(process.env.UNI_INPUT_DIR, id.substr(3));
                        } else if (id.startsWith("@/")) {
                            return path.resolve(process.env.UNI_INPUT_DIR, id.substr(2));
                        } else if (id.startsWith("/") && !id.startsWith("//")) {
                            return path.resolve(process.env.UNI_INPUT_DIR, id.substr(1));
                        }
                        return id;
                    },
                }),
                uniPostcssPlugin(),
                postcssPresetEnv({
                    stage: 3,
                    features: { 'nesting-rules': false },
                }),
                autoprefixer({
                    remove: true,
                }),
            ],
        },

    },
    plugins: [
        uni(),
        uniTailwind({
            /* options */
        }),
    ],

    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
});