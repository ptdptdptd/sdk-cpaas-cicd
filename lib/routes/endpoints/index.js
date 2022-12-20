const router = require('express').Router();

router.use('/call-status', require('./call-status'));
router.use('/dial-time', require('./dial-time'));
router.use('/auth', require('./auth'));
router.use('/2.1.1', require('./2.1.1'));
router.use('/2.1.2', require('./2.1.2'));
router.use('/2.1.3', require('./2.1.3'));
router.use('/test', require('./test'));
router.use('/attended-transfer', require('./attended-transfer'));
router.use('/dial', require('./dial'));
router.use('/demo', require('./demo'));
router.use('/dialer', require('./dialer'));
router.use('/call-transcriptions', require('./call-transcriptions'));
router.use('/tts-test', require('./tts-test'));
router.use('/listen', require('./listen'));

module.exports = router;

