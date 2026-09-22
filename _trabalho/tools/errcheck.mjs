import { launch, navigate } from './cdp.mjs';
const c = await launch({ port: 9342 });
const errs = [];
c.on(m => { if (m.method === 'Runtime.exceptionThrown') errs.push(m.params.exceptionDetails.exception?.description || m.params.exceptionDetails.text); });
await navigate(c, 'file:///C:/Users/tvnn/Desktop/site%20minha%20mae/_trabalho/render/scene.html', 500);
console.log(errs.join('\n---\n').slice(0, 4000));
c.close(); process.exit(0);
