import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Server is running for MNU Collection!');
});

app.listen(PORT, () => {
  console.log(Server running on http://localhost:${PORT});
});
