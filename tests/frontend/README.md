# Frontend Tests — TODO

Chưa setup. Khi cần thêm test cho frontend, dùng **Vitest** + **Vue Test Utils**.

## Setup (~15 phút)

```bash
cd frontend
npm i -D vitest @vue/test-utils jsdom @pinia/testing
```

Add to `package.json`:

```json
"scripts": {
  "test": "vitest"
}
```

Add `vitest.config.js` ở `frontend/`:

```js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: { alias: { '@': path.resolve(__dirname, './src') } },
  test: {
    environment: 'jsdom',
    globals: true,
  },
})
```

## Cái gì đáng test trên frontend

**ROI cao** — nên viết:
- `composables/createPoller.js` — start/stop, visibility skip, anti-overlap (fake timers)
- Pinia stores: `startWatching*` / `stopWatching*` lifecycle, refcount, không leak timer
- Pure utility functions trong `utils/`

**ROI thấp** — đừng viết:
- Component rendering cơ bản (Vue/Quasar đã test rồi)
- Visual style
- Wiring (mapState, mapActions)
- Form validation cơ bản

## Cấu trúc đề xuất khi làm

```
tests/frontend/
├── composables/
│   └── createPoller.test.js
└── stores/
    ├── orderStore.test.js
    └── dashboardStore.test.js
```
