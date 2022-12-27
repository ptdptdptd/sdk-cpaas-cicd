const router = require('express').Router();
const WebhookResponse = require('@jambonz/node-client').WebhookResponse;

router.post('/', async(req, res) => {
  const {logger} = req.app.locals;
  logger.debug({payload: req.body}, 'POST /gather');
  try {
    const app = new WebhookResponse();
    app.say({
      text: 'Say something'
    });
    app.
    gather({
      actionHook: '/2.1.2/action', //Gửi đến BE sau khi đã collect xong
      input: ['speech'], // Loại input mà người dùng sẽ nhập. Cả nhập số và âm thanh
      timeout: 15, //Số giây chờ người dùng nhập
      recognizer : {
        vendor: 'default',
        language: 'default',
        vad: {
          enable: true,
          mode: 2 
        }
      }
    })
    res.status(200).json(app);
  } catch (err) {
    logger.error({err}, 'Error');
    res.sendStatus(503);
  }
});
router.post('/action', async(req, res) => {
  const {logger} = req.app.locals;
  logger.debug({payload: req.body}, 'POST /action');
  logger.debug({payload: req.body.speech.alternatives[0].transcript}, 'POST /rasa/action 2');
  try {
    if (req.body.speech.alternatives[0].transcript.includes('tư vấn')) {
      const app = new WebhookResponse();
      app.say({text: 'Vui lòng chờ, em đang kết nối tới bộ phận tư vấn'});
      app.dial({
        target: [
          {
               type: 'phone',
               number: '54321',
               trunk: 'fusionpbx'
          }
      ]
      });
      return res.status(200).json(app);
    }
  } catch (err) {
    logger.error({err}, 'Error');
    res.sendStatus(503);
  }
});
module.exports = router;
