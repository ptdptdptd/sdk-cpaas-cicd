const { response } = require('express');
const functions = require('../../functions');
const router = require('express').Router();
const WebhookResponse = require('@jambonz/node-client').WebhookResponse;

router.post('/', async (req, res) => {
    const { logger } = req.app.locals;
    logger.debug({ payload: req.body }, 'POST /gather');
    const responses = JSON.parse(process.env.RESPONSES)

    try {
        const app = new WebhookResponse();
        app.play({ url: response.TD1.audio })
        app.gather({
            actionHook: '/demo/route', //Gửi đến Function action sau khi đã collect xong
            input: ['speech'],
            timeout: 20, //Số giây chờ người dùng nhập
            recognizer: {
                vendor: 'default',
                language: 'default',
                vad: {
                    enable: true, //Delay kết nối đến STT Engine khi chưa phát hiện được giọng nói
                    mode: 2 //Độ nhạy của phát hiện giọng nói. Mức 0-3
                }
            }
        })
        res.status(200).json(app);
    } catch (err) {
        logger.error({ err }, 'Error');
        res.sendStatus(503);
    }
});

router.post('/route', async (req, res) => {
    const { logger } = req.app.locals;
    logger.debug({ payload: req.body }, 'POST /demo/route');
    const responses = JSON.parse(process.env.RESPONSES)
    const intents = JSON.parse(process.env.INTENTS)

    try {
        const transcript = req.body?.speech?.alternatives[0]?.transcript
        //check transcipt & intent => intent: 'BUSY'
        const intent = functions.findIntent({ searchObj: process.env.UTTERS, searchStr: transcript })
        //from result of intent => TD number
        const TD_number = intents[intent]
        const TD_obj = responses[TD_number]
        // console.log({ intent })
        console.log({ TD_obj })
        if (TD_obj.affirm_next != null){
            
        }
        // console.log({ text: responses[TD_number] })
        // console.log({ TD_obj.affirm_next })
        const app = new WebhookResponse();
        if (TD_obj.listen === "break") {
            app.play({ url: TD_obj.audio });
            app.hangup();
            return res.status(200).json(app);
        }
        else if (TD_obj.listen === "agent") {
            app.play({ url: response.TD10.audio })
            app.dial({
                target: [
                    {
                        type: 'sip',
                        user: '100@congtyb.com'
                    }
                ]
            })
        }
        else {
            app.play({ url: TD_obj.audio });
            app.gather({
                actionHook: '/demo/route', //Gửi đến Function action sau khi đã collect xong
                input: ['speech'],
                timeout: 30, //Số giây chờ người dùng nhập
                recognizer: {
                    vendor: 'default',
                    language: 'default',
                    vad: {
                        enable: true, //Delay kết nối đến STT Engine khi chưa phát hiện được giọng nói
                        mode: 2 //Độ nhạy của phát hiện giọng nói. Mức 0-3
                    }
                }
            })
            return res.status(200).json(app);
        }
    } catch (err) {
        logger.error({ err }, 'Error');
        res.sendStatus(503);
    }
});

module.exports = router;