import path from "path";
import nested from 'tailwindcss/nesting';
import comment from "postcss-comment";
import tailwindcss from "tailwindcss";
import autoprefixer from "autoprefixer";
import postcssPresetEnv from 'postcss-preset-env';
import postcssImport from "postcss-import";

export default {
  parser: comment,
  plugins: [
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
    tailwindcss({
      config: "./tailwind.config.js",
    }),
    postcssPresetEnv({
      stage: 3,
      features: { 'nesting-rules': false },
    }),
    autoprefixer({
      remove: true,
    }),
  ],
};