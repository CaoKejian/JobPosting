// vite.config.ts
import { defineConfig } from "file:///Users/duibagroup/Desktop/myself/myPlugin/node_modules/vite/dist/node/index.js";
import vue from "file:///Users/duibagroup/Desktop/myself/myPlugin/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import vueJsx from "file:///Users/duibagroup/Desktop/myself/myPlugin/node_modules/@vitejs/plugin-vue-jsx/dist/index.mjs";

// src/vite_plugins/svgstore.js
import path from "path";
import fs from "fs";
import store from "file:///Users/duibagroup/Desktop/myself/myPlugin/node_modules/svgstore/src/svgstore.js";
import { optimize } from "file:///Users/duibagroup/Desktop/myself/myPlugin/node_modules/svgo/lib/svgo-node.js";
var svgstore = (options = {}) => {
  const inputFolder = options.inputFolder || "src/assets/icons";
  return {
    name: "svgstore",
    resolveId(id) {
      if (id === "@svgstore") {
        return "svg_bundle.js";
      }
    },
    load(id) {
      if (id === "svg_bundle.js") {
        const sprites = store(options);
        const iconsDir = path.resolve(inputFolder);
        for (const file of fs.readdirSync(iconsDir)) {
          const filepath = path.join(iconsDir, file);
          const svgid = path.parse(file).name;
          let code2 = fs.readFileSync(filepath, { encoding: "utf-8" });
          sprites.add(svgid, code2);
        }
        const { data: code } = optimize(sprites.toString({ inline: options.inline }), {
          plugins: [
            "cleanupAttrs",
            "removeDoctype",
            "removeComments",
            "removeTitle",
            "removeDesc",
            "removeEmptyAttrs",
            { name: "removeAttrs", params: { attrs: "(data-name|data-xxx)" } }
          ]
        });
        return `const div = document.createElement('div')
div.innerHTML = \`${code}\`
const svg = div.getElementsByTagName('svg')[0]
if (svg) {
  svg.style.position = 'absolute'
  svg.style.width = 0
  svg.style.height = 0
  svg.style.overflow = 'hidden'
  svg.setAttribute("aria-hidden", "true")
}
// listen dom ready event
document.addEventListener('DOMContentLoaded', () => {
  if (document.body.firstChild) {
    document.body.insertBefore(div, document.body.firstChild)
  } else {
    document.body.appendChild(div)
  }
})`;
      }
    }
  };
};

// vite.config.ts
var vite_config_default = defineConfig({
  plugins: [
    vue(),
    svgstore(),
    vueJsx({
      transformOn: true,
      mergeProps: true
    })
  ],
  server: {
    host: "172.16.227.98",
    // host: '192.168.3.126',
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:3000"
      }
    }
  }
  // css: {
  //   postcss: {
  //     plugins: [
  //       postcsspxtoviewport({
  //         unitToConvert: 'px', // 要转化的单位
  //         viewportWidth: 750, // UI设计稿的宽度
  //         unitPrecision: 6, // 转换后的精度，即小数点位数
  //         propList: ['*'], // 指定转换的css属性的单位，*代表全部css属性的单位都进行转换
  //         viewportUnit: 'vw', // 指定需要转换成的视窗单位，默认vw
  //         fontViewportUnit: 'vw', // 指定字体需要转换成的视窗单位，默认vw
  //         selectorBlackList: ['ignore-'], // 指定不转换为视窗单位的类名，
  //         minPixelValue: 1, // 默认值1，小于或等于1px则不进行转换
  //         mediaQuery: true, // 是否在媒体查询的css代码中也进行转换，默认false
  //         replace: true, // 是否转换后直接更换属性值
  //         landscape: false // 是否处理横屏情况
  //       })
  //     ]
  //   }
  // }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiLCAic3JjL3ZpdGVfcGx1Z2lucy9zdmdzdG9yZS5qcyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9Vc2Vycy9kdWliYWdyb3VwL0Rlc2t0b3AvbXlzZWxmL215UGx1Z2luXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvZHVpYmFncm91cC9EZXNrdG9wL215c2VsZi9teVBsdWdpbi92aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvZHVpYmFncm91cC9EZXNrdG9wL215c2VsZi9teVBsdWdpbi92aXRlLmNvbmZpZy50c1wiO2ltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gJ3ZpdGUnXG5pbXBvcnQgdnVlIGZyb20gJ0B2aXRlanMvcGx1Z2luLXZ1ZSdcbmltcG9ydCB2dWVKc3ggZnJvbSAnQHZpdGVqcy9wbHVnaW4tdnVlLWpzeCdcbmltcG9ydCBwb3N0Y3NzcHh0b3ZpZXdwb3J0IGZyb20gXCJwb3N0Y3NzLXB4LXRvLXZpZXdwb3J0XCIgLy9cdTYzRDJcdTRFRjZcbmltcG9ydCB7IHN2Z3N0b3JlIH0gZnJvbSAnLi9zcmMvdml0ZV9wbHVnaW5zL3N2Z3N0b3JlJ1xuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gIHBsdWdpbnM6IFt2dWUoKSwgc3Znc3RvcmUoKSwgdnVlSnN4KHtcbiAgICB0cmFuc2Zvcm1PbjogdHJ1ZSxcbiAgICBtZXJnZVByb3BzOiB0cnVlXG4gIH0pLFxuICBdLFxuICBcbiAgc2VydmVyOiB7XG4gICAgaG9zdDogJzE3Mi4xNi4yMjcuOTgnLFxuICAgIC8vIGhvc3Q6ICcxOTIuMTY4LjMuMTI2JyxcbiAgICBwb3J0OiA1MTczLFxuICAgIHByb3h5OiB7XG4gICAgICAnL2FwaSc6IHtcbiAgICAgICAgdGFyZ2V0OiAnaHR0cDovL2xvY2FsaG9zdDozMDAwJyxcbiAgICAgIH1cbiAgICB9XG4gIH0sXG4gIC8vIGNzczoge1xuICAvLyAgIHBvc3Rjc3M6IHtcbiAgLy8gICAgIHBsdWdpbnM6IFtcbiAgLy8gICAgICAgcG9zdGNzc3B4dG92aWV3cG9ydCh7XG4gIC8vICAgICAgICAgdW5pdFRvQ29udmVydDogJ3B4JywgLy8gXHU4OTgxXHU4RjZDXHU1MzE2XHU3Njg0XHU1MzU1XHU0RjREXG4gIC8vICAgICAgICAgdmlld3BvcnRXaWR0aDogNzUwLCAvLyBVSVx1OEJCRVx1OEJBMVx1N0EzRlx1NzY4NFx1NUJCRFx1NUVBNlxuICAvLyAgICAgICAgIHVuaXRQcmVjaXNpb246IDYsIC8vIFx1OEY2Q1x1NjM2Mlx1NTQwRVx1NzY4NFx1N0NCRVx1NUVBNlx1RkYwQ1x1NTM3M1x1NUMwRlx1NjU3MFx1NzBCOVx1NEY0RFx1NjU3MFxuICAvLyAgICAgICAgIHByb3BMaXN0OiBbJyonXSwgLy8gXHU2MzA3XHU1QjlBXHU4RjZDXHU2MzYyXHU3Njg0Y3NzXHU1QzVFXHU2MDI3XHU3Njg0XHU1MzU1XHU0RjREXHVGRjBDKlx1NEVFM1x1ODg2OFx1NTE2OFx1OTBFOGNzc1x1NUM1RVx1NjAyN1x1NzY4NFx1NTM1NVx1NEY0RFx1OTBGRFx1OEZEQlx1ODg0Q1x1OEY2Q1x1NjM2MlxuICAvLyAgICAgICAgIHZpZXdwb3J0VW5pdDogJ3Z3JywgLy8gXHU2MzA3XHU1QjlBXHU5NzAwXHU4OTgxXHU4RjZDXHU2MzYyXHU2MjEwXHU3Njg0XHU4OUM2XHU3QTk3XHU1MzU1XHU0RjREXHVGRjBDXHU5RUQ4XHU4QkE0dndcbiAgLy8gICAgICAgICBmb250Vmlld3BvcnRVbml0OiAndncnLCAvLyBcdTYzMDdcdTVCOUFcdTVCNTdcdTRGNTNcdTk3MDBcdTg5ODFcdThGNkNcdTYzNjJcdTYyMTBcdTc2ODRcdTg5QzZcdTdBOTdcdTUzNTVcdTRGNERcdUZGMENcdTlFRDhcdThCQTR2d1xuICAvLyAgICAgICAgIHNlbGVjdG9yQmxhY2tMaXN0OiBbJ2lnbm9yZS0nXSwgLy8gXHU2MzA3XHU1QjlBXHU0RTBEXHU4RjZDXHU2MzYyXHU0RTNBXHU4OUM2XHU3QTk3XHU1MzU1XHU0RjREXHU3Njg0XHU3QzdCXHU1NDBEXHVGRjBDXG4gIC8vICAgICAgICAgbWluUGl4ZWxWYWx1ZTogMSwgLy8gXHU5RUQ4XHU4QkE0XHU1MDNDMVx1RkYwQ1x1NUMwRlx1NEU4RVx1NjIxNlx1N0I0OVx1NEU4RTFweFx1NTIxOVx1NEUwRFx1OEZEQlx1ODg0Q1x1OEY2Q1x1NjM2MlxuICAvLyAgICAgICAgIG1lZGlhUXVlcnk6IHRydWUsIC8vIFx1NjYyRlx1NTQyNlx1NTcyOFx1NUE5Mlx1NEY1M1x1NjdFNVx1OEJFMlx1NzY4NGNzc1x1NEVFM1x1NzgwMVx1NEUyRFx1NEU1Rlx1OEZEQlx1ODg0Q1x1OEY2Q1x1NjM2Mlx1RkYwQ1x1OUVEOFx1OEJBNGZhbHNlXG4gIC8vICAgICAgICAgcmVwbGFjZTogdHJ1ZSwgLy8gXHU2NjJGXHU1NDI2XHU4RjZDXHU2MzYyXHU1NDBFXHU3NkY0XHU2M0E1XHU2NkY0XHU2MzYyXHU1QzVFXHU2MDI3XHU1MDNDXG4gIC8vICAgICAgICAgbGFuZHNjYXBlOiBmYWxzZSAvLyBcdTY2MkZcdTU0MjZcdTU5MDRcdTc0MDZcdTZBMkFcdTVDNEZcdTYwQzVcdTUxQjVcbiAgLy8gICAgICAgfSlcbiAgLy8gICAgIF1cbiAgLy8gICB9XG4gIC8vIH1cbn0pXG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9Vc2Vycy9kdWliYWdyb3VwL0Rlc2t0b3AvbXlzZWxmL215UGx1Z2luL3NyYy92aXRlX3BsdWdpbnNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy9kdWliYWdyb3VwL0Rlc2t0b3AvbXlzZWxmL215UGx1Z2luL3NyYy92aXRlX3BsdWdpbnMvc3Znc3RvcmUuanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL2R1aWJhZ3JvdXAvRGVza3RvcC9teXNlbGYvbXlQbHVnaW4vc3JjL3ZpdGVfcGx1Z2lucy9zdmdzdG9yZS5qc1wiO2ltcG9ydCBwYXRoIGZyb20gJ3BhdGgnXG5pbXBvcnQgZnMgZnJvbSAnZnMnXG5pbXBvcnQgc3RvcmUgZnJvbSAnc3Znc3RvcmUnXG5pbXBvcnQgeyBvcHRpbWl6ZSB9IGZyb20gJ3N2Z28nXG5cbmV4cG9ydCBjb25zdCBzdmdzdG9yZSA9IChvcHRpb25zID0ge30pID0+IHtcbiAgY29uc3QgaW5wdXRGb2xkZXIgPSBvcHRpb25zLmlucHV0Rm9sZGVyIHx8ICdzcmMvYXNzZXRzL2ljb25zJzsgLy9cdTVCNThcdTY1M0VzdmdcdTc2ODRcdThERUZcdTVGODRcbiAgcmV0dXJuIHtcbiAgICBuYW1lOiAnc3Znc3RvcmUnLFxuICAgIHJlc29sdmVJZChpZCkge1xuICAgICAgaWYgKGlkID09PSAnQHN2Z3N0b3JlJykge1xuICAgICAgICByZXR1cm4gJ3N2Z19idW5kbGUuanMnXG4gICAgICB9XG4gICAgfSxcbiAgICBsb2FkKGlkKSB7XG4gICAgICBpZiAoaWQgPT09ICdzdmdfYnVuZGxlLmpzJykge1xuICAgICAgICBjb25zdCBzcHJpdGVzID0gc3RvcmUob3B0aW9ucyk7XG4gICAgICAgIGNvbnN0IGljb25zRGlyID0gcGF0aC5yZXNvbHZlKGlucHV0Rm9sZGVyKTtcbiAgICAgICAgZm9yIChjb25zdCBmaWxlIG9mIGZzLnJlYWRkaXJTeW5jKGljb25zRGlyKSkge1xuICAgICAgICAgIGNvbnN0IGZpbGVwYXRoID0gcGF0aC5qb2luKGljb25zRGlyLCBmaWxlKTtcbiAgICAgICAgICBjb25zdCBzdmdpZCA9IHBhdGgucGFyc2UoZmlsZSkubmFtZVxuICAgICAgICAgIGxldCBjb2RlID0gZnMucmVhZEZpbGVTeW5jKGZpbGVwYXRoLCB7IGVuY29kaW5nOiAndXRmLTgnIH0pO1xuICAgICAgICAgIHNwcml0ZXMuYWRkKHN2Z2lkLCBjb2RlKVxuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHsgZGF0YTogY29kZSB9ID0gb3B0aW1pemUoc3ByaXRlcy50b1N0cmluZyh7IGlubGluZTogb3B0aW9ucy5pbmxpbmUgfSksIHtcbiAgICAgICAgICBwbHVnaW5zOiBbXG4gICAgICAgICAgICAnY2xlYW51cEF0dHJzJywgJ3JlbW92ZURvY3R5cGUnLCAncmVtb3ZlQ29tbWVudHMnLCAncmVtb3ZlVGl0bGUnLCAncmVtb3ZlRGVzYycsXG4gICAgICAgICAgICAncmVtb3ZlRW1wdHlBdHRycycsXG4gICAgICAgICAgICB7IG5hbWU6IFwicmVtb3ZlQXR0cnNcIiwgcGFyYW1zOiB7IGF0dHJzOiBcIihkYXRhLW5hbWV8ZGF0YS14eHgpXCIgfSB9XG4gICAgICAgICAgXVxuICAgICAgICB9KVxuICAgICAgICByZXR1cm4gYGNvbnN0IGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG5kaXYuaW5uZXJIVE1MID0gXFxgJHtjb2RlfVxcYFxuY29uc3Qgc3ZnID0gZGl2LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdzdmcnKVswXVxuaWYgKHN2Zykge1xuICBzdmcuc3R5bGUucG9zaXRpb24gPSAnYWJzb2x1dGUnXG4gIHN2Zy5zdHlsZS53aWR0aCA9IDBcbiAgc3ZnLnN0eWxlLmhlaWdodCA9IDBcbiAgc3ZnLnN0eWxlLm92ZXJmbG93ID0gJ2hpZGRlbidcbiAgc3ZnLnNldEF0dHJpYnV0ZShcImFyaWEtaGlkZGVuXCIsIFwidHJ1ZVwiKVxufVxuLy8gbGlzdGVuIGRvbSByZWFkeSBldmVudFxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsICgpID0+IHtcbiAgaWYgKGRvY3VtZW50LmJvZHkuZmlyc3RDaGlsZCkge1xuICAgIGRvY3VtZW50LmJvZHkuaW5zZXJ0QmVmb3JlKGRpdiwgZG9jdW1lbnQuYm9keS5maXJzdENoaWxkKVxuICB9IGVsc2Uge1xuICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoZGl2KVxuICB9XG59KWBcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBNlMsU0FBUyxvQkFBb0I7QUFDMVUsT0FBTyxTQUFTO0FBQ2hCLE9BQU8sWUFBWTs7O0FDRnVVLE9BQU8sVUFBVTtBQUMzVyxPQUFPLFFBQVE7QUFDZixPQUFPLFdBQVc7QUFDbEIsU0FBUyxnQkFBZ0I7QUFFbEIsSUFBTSxXQUFXLENBQUMsVUFBVSxDQUFDLE1BQU07QUFDeEMsUUFBTSxjQUFjLFFBQVEsZUFBZTtBQUMzQyxTQUFPO0FBQUEsSUFDTCxNQUFNO0FBQUEsSUFDTixVQUFVLElBQUk7QUFDWixVQUFJLE9BQU8sYUFBYTtBQUN0QixlQUFPO0FBQUEsTUFDVDtBQUFBLElBQ0Y7QUFBQSxJQUNBLEtBQUssSUFBSTtBQUNQLFVBQUksT0FBTyxpQkFBaUI7QUFDMUIsY0FBTSxVQUFVLE1BQU0sT0FBTztBQUM3QixjQUFNLFdBQVcsS0FBSyxRQUFRLFdBQVc7QUFDekMsbUJBQVcsUUFBUSxHQUFHLFlBQVksUUFBUSxHQUFHO0FBQzNDLGdCQUFNLFdBQVcsS0FBSyxLQUFLLFVBQVUsSUFBSTtBQUN6QyxnQkFBTSxRQUFRLEtBQUssTUFBTSxJQUFJLEVBQUU7QUFDL0IsY0FBSUEsUUFBTyxHQUFHLGFBQWEsVUFBVSxFQUFFLFVBQVUsUUFBUSxDQUFDO0FBQzFELGtCQUFRLElBQUksT0FBT0EsS0FBSTtBQUFBLFFBQ3pCO0FBQ0EsY0FBTSxFQUFFLE1BQU0sS0FBSyxJQUFJLFNBQVMsUUFBUSxTQUFTLEVBQUUsUUFBUSxRQUFRLE9BQU8sQ0FBQyxHQUFHO0FBQUEsVUFDNUUsU0FBUztBQUFBLFlBQ1A7QUFBQSxZQUFnQjtBQUFBLFlBQWlCO0FBQUEsWUFBa0I7QUFBQSxZQUFlO0FBQUEsWUFDbEU7QUFBQSxZQUNBLEVBQUUsTUFBTSxlQUFlLFFBQVEsRUFBRSxPQUFPLHVCQUF1QixFQUFFO0FBQUEsVUFDbkU7QUFBQSxRQUNGLENBQUM7QUFDRCxlQUFPO0FBQUEsb0JBQ0ssSUFBSTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsTUFpQmxCO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFDRjs7O0FEOUNBLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLFNBQVM7QUFBQSxJQUFDLElBQUk7QUFBQSxJQUFHLFNBQVM7QUFBQSxJQUFHLE9BQU87QUFBQSxNQUNsQyxhQUFhO0FBQUEsTUFDYixZQUFZO0FBQUEsSUFDZCxDQUFDO0FBQUEsRUFDRDtBQUFBLEVBRUEsUUFBUTtBQUFBLElBQ04sTUFBTTtBQUFBO0FBQUEsSUFFTixNQUFNO0FBQUEsSUFDTixPQUFPO0FBQUEsTUFDTCxRQUFRO0FBQUEsUUFDTixRQUFRO0FBQUEsTUFDVjtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFvQkYsQ0FBQzsiLAogICJuYW1lcyI6IFsiY29kZSJdCn0K
