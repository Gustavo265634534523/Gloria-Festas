import { launch, navigate } from './cdp.mjs';
const c = await launch({ port: 9333 });
await navigate(c, 'data:text/html,<canvas id=c></canvas>');
const info = await c.evaluate(`(() => { const gl = document.getElementById('c').getContext('webgl2'); if(!gl) return 'sem webgl2';
 const e = gl.getExtension('WEBGL_debug_renderer_info'); const f = gl.getExtension('EXT_color_buffer_float');
 return (e ? gl.getParameter(e.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER)) + ' | float FB: ' + !!f + ' | maxTex ' + gl.getParameter(gl.MAX_TEXTURE_SIZE); })()`);
console.log(info);
c.close();
process.exit(0);
