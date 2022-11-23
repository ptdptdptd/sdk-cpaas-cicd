/*1.1 Kết nối và nói chuyện với bot, khi người dùng không muốn nói chuyện với bot nữa thì sẽ khi bắt được "TỪ KHÓA" muốn chuyển cho bộ phận chuyên trách thì sẽ ngắt máy của bot
và chuyển đến chuyên viên mà khách hàng yêu cầu
Người dùng nói chuyện với bot, và sau khi muốn bot nhắn tới
*/
const router = require('express').Router();
const assert = require('assert');
const n8n = require('./n8n');
const WebhookResponse = require('@jambonz/node-client').WebhookResponse;

router.post('/', async (req, res) => {
  const { logger } = req.app.locals;
  logger.debug({ payload: req.body }, 'POST /rasa');
  try {
    assert(process.env.RASA_URL);

    const app = new WebhookResponse();
    app.pause({ length: 1 })
    app.rasa({
      url: process.env.RASA_URL,
      prompt: 'xin chào, em là trợ lý AI của công ty ABC',
      eventHook: '/1.1/event',
      actionHook: '/1.1/action'
    });
    res.status(200).json(app);
  } catch (err) {
    logger.error({ err }, 'Error');
    res.sendStatus(503);
  }
});
router.post('/event', async (req, res) => {
  const { logger } = req.app.locals;
  const payload = req.body;
  logger.debug({ payload }, 'POST /rasa/event');
  n8n.sendToN8N({ payload })
  try {
    if (payload.event === 'userMessage' && payload.message.includes('kỹ thuật')) {
      const app = new WebhookResponse();
      app.say({ text: 'Vui lòng chờ, em đang kết nối đến kỹ thuật' });
      app.dial({
        target: [
          {
            type: 'phone',
            number: '56789',
            trunk: 'fusionpbx'
          }
        ]
      });
      return res.status(200).json(app);
    }
    if (payload.event === 'userMessage' && payload.message.includes('bán hàng')) {
      const app = new WebhookResponse();
      app.say({ text: 'Vui lòng chờ, em đang kết nối đến bán hàng' });
      app.dial({
        target: [
          {
            type: 'phone',
            number: '33333',
            trunk: 'fusionpbx'
          }
        ]
      });

      return res.status(200).json(app);
    }
    res.sendStatus(200);
  } catch (err) {
    logger.error({ err }, 'Error');
    res.sendStatus(503);
  }
});
router.post('/action', async (req, res) => {
  const { logger } = req.app.locals;
  logger.debug({ payload: req.body }, 'POST /rasa/action');
  try {
    res.sendStatus(200);
  } catch (err) {
    logger.error({ err }, 'Error');
    res.sendStatus(503);
  }
});

module.exports = router;