const router = require('express').Router();
const WebhookResponse = require('@jambonz/node-client').WebhookResponse;

router.post('/', (req, res) => {
  const { logger } = req.app.locals;
  logger.debug({ payload: req.body }, 'POST /dial/user');
  try {
    const app = new WebhookResponse();
    // app.say({ text: 'Vui lòng chờ chúng tôi đang kết nối đến cuộc gọi của bạn' })
    // app.dial({
    //   target: [{ type: 'phone', number: '012345', trunk: 'pbx' }],
    //   listen: ({
    //     url: 'wss://d792-42-118-228-255.ap.ngrok.io/audiofeed',
    //     mixType: 'mono',
    //     timeout: 10000
    //   }),
      // transcribe: ({
      //   transcriptionHook: 'https://d792-42-118-228-255.ap.ngrok.io/audio-transcribe',
      //   recognizer: {
      //     vendor: 'default',
      //     language: 'default',
      //     dualChannel: true,
      //     vad: {
      //       enable: true,
      //       mode: 1 //Độ nhạy khi phát hiện giọng nói. 0-3
      //     },
      //     separateRecognitionPerChannel: true //Nhận dạng người nói và người gọ
      //   }
      // })
    // })
    // app.config({
    //   record: {
    //     action: 'startCallRecording',
    //     siprecServerURL: 'sip:srs@siprec.servertesting.tk:3000'
    //     // siprecServerURL: 'sip:srs@10.128.0.7'

    //   }
    // })
    app.dial({
      target: [{
        type: 'user', number: '100', trunk: 'fusionpbx'
      }],
    })

    res.status(200).json(app);
  } catch (err) {
    logger.error({ err }, 'Error');
    res.sendStatus(503);
  }
});

module.exports = router;