import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // `mode` に基づいて `.env` ファイルを読み込みます
  // 第3引数に空文字列を指定して、`VITE_` プレフィックスなしで環境変数を取得
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    server: {
      open: true,
    },
    base: env.VITE_ROOT_DIR
  }
});
