import express from 'express';
const router = express.Router();
import LineVote from '../../models/LineVote';

router.post('/vote', (req, res) => {
  // receber parametros: rating, userId, date
  // salvar num modelo de Line
  const q = req.query
  console.log(q);
  const vote = new LineVote({
    vote: q.vote,
    userId: q.userId,
    date: Date.now(),
  });
  vote.save((err) => {
    if (err) console.log("Erro voteLine.save", err);
    res.status(200).send('SUCESSO')
  });
})

router.get('/', (req, res) => {
  const query = LineVote.find({})
  query.exec((err, data) => {
    if(err) {
      console.log("ERROR ON LINES GET", err);
    }
    // console.log(data);
    const r = data.reduce((prev, curr) => {
      console.log("PREV", prev.vote);
      console.log("CURR", curr.vote);
      return prev.vote + curr.vote
    })
    console.log("R", r);
  })
  res.status(200).json("res")
})

module.exports = router;
