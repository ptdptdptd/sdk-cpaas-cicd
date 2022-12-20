const router = require('express').Router();
const WebhookResponse = require('@jambonz/node-client').WebhookResponse;

router.post('/', async(req, res) => {
  const {logger} = req.app.locals;
  logger.debug({payload: req.body}, 'POST /gather');
  try {
    const app = new WebhookResponse();
    // app.play({
    //   url: process.env.AUDIO_URL
    // });
    app.pause({length: 2})
    app.say({text: 'Xin chào, em là Mai, đến từ công ty đỉnh quang'})
    app.gather({
      actionHook: '/2.1.1/action', //Gửi đến Function action sau khi đã collect xong
      input: ['speech'], 
      timeout: 5, //Số giây chờ người dùng nhập
      recognizer : {
        vendor: 'default',
        language: 'default',
        vad: {
          enable: true, //Delay kết nối đến STT Engine khi chưa phát hiện được giọng nói
          mode: 2 //Độ nhạy của phát hiện giọng nói. Mức 0-3
        }
      }
    })
    app.listen({
      url: 'wss://1a6f-2001-ee0-d749-63a0-d56f-fa9-d9cf-66b4.ap.ngrok.io/audiofeed'
    });
    app.transcribe({
      transcriptionHook: 'https://1a6f-2001-ee0-d749-63a0-d56f-fa9-d9cf-66b4.ap.ngrok.io/audio-transcribe',
      recognizer: {
        vendor: 'google',
        language: 'vi-VN'
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
  logger.debug({payload: req.body}, 'POST /rasa/action');
  logger.debug({payload: req.body.speech.alternatives[0].transcript}, 'POST /rasa/action 2');
  try {
    if (req.body.speech.alternatives[0].transcript.includes('tư vấn')) {
      const app = new WebhookResponse();
      app.say({text: 'Vui lòng chờ, em đang kết nối tới bộ phận tư vấn'});
      app.dial({
        target: [
          {
               type: 'phone',
               number: '9999999999999',
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
