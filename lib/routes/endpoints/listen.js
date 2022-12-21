const router = require('express').Router();
const WebhookResponse = require('@jambonz/node-client').WebhookResponse;
router.post('/', (req, res) => {
  const {logger} = req.app.locals;
  logger.debug({payload: req.body}, 'POST /listen-test');
  try {
    const app = new WebhookResponse();
    app.listen({
      url: 'wss://8685-2001-ee0-d749-63a0-d56f-fa9-d9cf-66b4.ap.ngrok.io/audiofeed'
    });
    res.status(200).json(app);
  } catch (err) {
    logger.error({err}, 'Error');
    res.sendStatus(503);
  }
});

module.exports = router;