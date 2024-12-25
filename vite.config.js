import { defineConfig } from 'vite'
import { resolve} from 'path';

import vue from '@vitejs/plugin-vue'

import Components from 'unplugin-vue-components/vite'
import AutoImport from 'unplugin-auto-import/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

export default defineConfig({
  plugins: [
    vue()
    ,
    Components({
      dirs: ['src/components'],
      resolvers: [ElementPlusResolver()],
    }),
    AutoImport({
      imports: ['vue', 'vue-router', "pinia"],
      resolvers: [ElementPlusResolver()],
    })
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'), // 配置项目根路径 实际上就是将dirname和src拼接
      '~bootstrap': resolve(__dirname, 'node_modules/bootstrap'),
    },
 },
})
