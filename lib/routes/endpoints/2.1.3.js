const router = require('express').Router();
const WebhookResponse = require('@jambonz/node-client').WebhookResponse;
const text = 'Hi there.  Please say something and I will try to transcribe it for you';

router.post('/', async(req, res) => {
  const {logger} = req.app.locals;
  logger.debug({payload: req.body}, 'POST /transcribe');
  try {
    const app = new WebhookResponse();
    app
      .say({text: 'nói gì đi'})
      .transcribe({
        transcriptionHook: '/2.1.3/transcription',
        recognizer: {
          vendor: 'default',
          language: 'default',
        }
      });
    res.status(200).json(app);
  } catch (err) {
    logger.error({err}, 'Error');
    res.sendStatus(503);
  }
});

router.post('/transcription', (req, res) => {
  const {logger} = req.app.locals;
  logger.debug({payload: req.body}, '/transcribe/transcription');
  res.sendStatus(200);
});

module.exports = router;