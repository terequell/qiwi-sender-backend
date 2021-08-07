import express from 'express';
import cors from 'cors';
import QiwiController from './controllers/QiwiController.js';
const PORT = process.env.PORT || 3005;

const app = express();

const router = express.Router();
router.get('/user', QiwiController.userInfo);
router.post('/send', QiwiController.sendp2p);

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

app.use('/', router);

app.listen(PORT, () => console.log('Server is running on port 3005'));
