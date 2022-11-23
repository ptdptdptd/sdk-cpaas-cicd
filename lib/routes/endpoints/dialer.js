const functions = require('../../functions');
const router = require('express').Router();
const WebhookResponse = require('@jambonz/node-client').WebhookResponse;

const transcribeTN = {
    transcriptionHook: '/dialer/transcription',
    recognizer: {
        vendor: 'google',
        language: 'vi-VN'
    }
}
router.post('/', async (req, res) => {
    const { logger } = req.app.locals;
    logger.debug({ payload: req.body }, 'POST /gather');
    const responses = JSON.parse(process.env.RESPONSES)
    try {
        const app = new WebhookResponse();
        app.play({ url: process.env.TD1 });
        app.gather({
            actionHook: '/dialer/route', //Gửi đến Function action sau khi đã collect xong
            input: ['speech'],
            timeout: 10, //Số giây chờ người dùng nhập
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
    logger.debug({ payload: req.body }, 'POST /dialer/route');
    try {
        const transcript = req.body?.speech?.alternatives[0]?.transcript
        //check transcipt & intent => intent: 'BUSY'
        const intent = functions.findIntent({ searchObj: process.env.UTTERS, searchStr: transcript })
        console.log({ intent })
        const app = new WebhookResponse();
        if (intent === 'BUSY') {
            app.redirect({ actionHook: '/dialer/busy' });
            return res.status(200).json(app);
        }
        else if (intent === 'AFFIRM') {
            app.redirect({ actionHook: '/dialer/affirm' });
            return res.status(200).json(app);
        }
        else if (intent === 'DENY') {
            app.redirect({ actionHook: '/dialer/deny' });
            return res.status(200).json(app);
        }
        else if (intent === 'FALLBACK') {
            app.redirect({ actionHook: '/dialer/' });
            return res.status(200).json(app);
        }
        else {
            app.redirect({ actionHook: '/dialer/' });
            return res.status(200).json(app);
        }
    } catch (err) {
        logger.error({ err }, 'Error');
        res.sendStatus(503);
    }
});

//For BUSY
router.post('/busy', async (req, res) => {
    const { logger } = req.app.locals;
    logger.debug({ payload: req.body }, 'POST /dialer/busy');
    const app = new WebhookResponse();
    try {
        app.play({ url: process.env.TD2 });
        app.hangup();
        return res.status(200).json(app);
    } catch (err) {
        logger.error({ err }, 'Error');
        res.sendStatus(503);
    }
});

//For DENY
router.post('/deny', async (req, res) => {
    const { logger } = req.app.locals;
    logger.debug({ payload: req.body }, 'POST /dialer/deny');
    const app = new WebhookResponse();
    try {
        app.play({ url: process.env.TD6 });
        app.hangup();
        return res.status(200).json(app);
    } catch (err) {
        logger.error({ err }, 'Error');
        res.sendStatus(503);
    }
});
//For AFFIRM
router.post('/affirm', async (req, res) => {
    const { logger } = req.app.locals;
    logger.debug({ payload: req.body }, 'POST /dialer/affirm');
    const app = new WebhookResponse();
    try {
        app.play({ url: process.env.TD8 });
        app.gather({
            actionHook: '/dialer/route2', //Gửi đến Function action sau khi đã collect xong
            input: ['speech'],
            timeout: 10, //Số giây chờ người dùng nhập
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
    } catch (err) {
        logger.error({ err }, 'Error');
        res.sendStatus(503);
    }
});

router.post('/route2', async (req, res) => {
    const { logger } = req.app.locals;
    logger.debug({ payload: req.body }, 'POST /dialer/route2');
    const responses = JSON.parse(process.env.RESPONSES)
    const intents = JSON.parse(process.env.INTENTS)
    try {
        const transcript = req.body?.speech?.alternatives[0]?.transcript

        const intent = functions.findIntent({ searchObj: process.env.UTTERS, searchStr: transcript })

        console.log({ intent })

        const app = new WebhookResponse();
        if (intent === 'UNEMPLOY') {
            app.redirect({ actionHook: '/dialer/unemploy' });
            return res.status(200).json(app);
        }
        else if (intent === 'EMPLOY') {
            app.redirect({ actionHook: '/dialer/employ' });
            return res.status(200).json(app);
        }
        else {
            app.redirect({ actionHook: '/dialer/affirm' });
            return res.status(200).json(app);
        }
    } catch (err) {
        logger.error({ err }, 'Error');
        res.sendStatus(503);
    }
});

//For EMPLOY
router.post('/employ', async (req, res) => {
    const { logger } = req.app.locals;
    logger.debug({ payload: req.body }, 'POST /dialer/employ');
    const app = new WebhookResponse();
    try {
        app.play({ url: process.env.TD9 });
        app.hangup();
        return res.status(200).json(app);
    } catch (err) {
        logger.error({ err }, 'Error');
        res.sendStatus(503);
    }
});

//For UNEMPLOY
router.post('/unemploy', async (req, res) => {
    const { logger } = req.app.locals;
    logger.debug({ payload: req.body }, 'POST /dialer/unemploy');
    const app = new WebhookResponse();
    try {
        app.play({ url: process.env.TD3 });
        app.gather({
            actionHook: '/dialer/route3', //Gửi đến Function action sau khi đã collect xong
            input: ['speech'],
            timeout: 10, //Số giây chờ người dùng nhập
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
    } catch (err) {
        logger.error({ err }, 'Error');
        res.sendStatus(503);
    }
});

router.post('/route3', async (req, res) => {
    const { logger } = req.app.locals;
    logger.debug({ payload: req.body }, 'POST /dialer/route3');
    const responses = JSON.parse(process.env.RESPONSES)
    const intents = JSON.parse(process.env.INTENTS)
    try {
        const transcript = req.body?.speech?.alternatives[0]?.transcript

        const intent = functions.findIntent({ searchObj: process.env.UTTERS, searchStr: transcript })

        console.log({ intent })

        const app = new WebhookResponse();
        if (intent === 'AFFIRM') {
            app.redirect({ actionHook: '/dialer/affirm2' });
            return res.status(200).json(app);
        }
        else if (intent === 'DENY') {
            app.redirect({ actionHook: '/dialer/deny2' });
            return res.status(200).json(app);
        }
        else {
            app.redirect({ actionHook: '/dialer/unemploy' });
            return res.status(200).json(app);
        }
    } catch (err) {
        logger.error({ err }, 'Error');
        res.sendStatus(503);
    }
});


//For AFFIRM2
router.post('/affirm2', async (req, res) => {
    const { logger } = req.app.locals;
    logger.debug({ payload: req.body }, 'POST /dialer/affirm2');
    const app = new WebhookResponse();
    try {
        app.play({ url: process.env.TD4 });
        app.gather({
            actionHook: '/dialer/route4', //Gửi đến Function action sau khi đã collect xong
            input: ['speech'],
            timeout: 10, //Số giây chờ người dùng nhập
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
    } catch (err) {
        logger.error({ err }, 'Error');
        res.sendStatus(503);
    }
});

//For DENY2
router.post('/deny2', async (req, res) => {
    const { logger } = req.app.locals;
    logger.debug({ payload: req.body }, 'POST /dialer/deny2');
    try {
        app.play({ url: process.env.TD6 });
        app.hangup();
        return res.status(200).json(app);
    } catch (err) {
        logger.error({ err }, 'Error');
        res.sendStatus(503);
    }
});

router.post('/route4', async (req, res) => {
    const { logger } = req.app.locals;
    logger.debug({ payload: req.body }, 'POST /dialer/route4');
    const responses = JSON.parse(process.env.RESPONSES)
    const intents = JSON.parse(process.env.INTENTS)
    try {
        const transcript = req.body?.speech?.alternatives[0]?.transcript

        const intent = functions.findIntent({ searchObj: process.env.UTTERS, searchStr: transcript })

        console.log({ intent })

        const app = new WebhookResponse();
        if (intent === 'AFFIRM') {
            app.redirect({ actionHook: '/dialer/user' });
            return res.status(200).json(app);
        }
        else if (intent === 'DENY') {
            app.redirect({ actionHook: '/dialer/deny3' });
            return res.status(200).json(app);
        }
        else {
            app.redirect({ actionHook: '/dialer/affirm2' });
            return res.status(200).json(app);
        }
    } catch (err) {
        logger.error({ err }, 'Error');
        res.sendStatus(503);
    }
});

//For User
router.post('/user', async (req, res) => {
    const { logger } = req.app.locals;
    logger.debug({ payload: req.body }, 'POST /dialer/user');
    const app = new WebhookResponse();
    try {
        app.play({ url: process.env.TD14 });
        app.dial({
            target: [
                {
                    type: 'user',
                    name: '101@congtyb.com',
                }
            ],
            transcribe: {
                transcriptionHook: '/call-transcriptions',
                recognizer: {
                    vendor: 'default',
                    language: 'default',
                    vad: {
                        enable: true, //Delay kết nối đến STT Engine khi chưa phát hiện được giọng nói
                        mode: 2 //Độ nhạy của phát hiện giọng nói. Mức 0-3
                    },
                }
            }
        });
        return res.status(200).json(app);
    } catch (err) {
        logger.error({ err }, 'Error');
        res.sendStatus(503);
    }
});

//For DENY3
router.post('/deny3', async (req, res) => {
    const { logger } = req.app.locals;
    logger.debug({ payload: req.body }, 'POST /dialer/deny3');
    const app = new WebhookResponse();
    try {
        app.play({ url: process.env.TD6 });
        app.hangup();
        return res.status(200).json(app);
    } catch (err) {
        logger.error({ err }, 'Error');
        res.sendStatus(503);
    }
});

module.exports = router;