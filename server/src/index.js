import express from 'express';
import cors from 'cors';
import messagesRoute from './routes/messages.js';

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); //express에서 json형태로 사용하겠다.

app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  })
);

messagesRoute.forEach(({ method, route, handler }) => {
  app[method](route, handler);
});
app.listen(8000, () => {
  // 서버가 실제로 띄어지면 콘솔
  console.log('server listening on 8000...');
});
