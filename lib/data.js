const responses = require('./responses.json')

module.exports = {
    responses,
    utters: {
        BUSY: 'có việc, xe, lái, lái xe, họp, đi đường, lúc khác, tối, chiều, chút, lát, khi khác, bận, không rảnh, đang làm, họp, sau',
        DENY: 'thôi, đừng, không, vắng, bận, chưa, không, thôi, không, không quan tâm, đừng gọi, không có, mẹ, điên, chịu, biến, cút, Không Quan Tâm',
        FALLBACK: 'a lô, gì, sao đấy, nói to, nói lại, ồn, sao, cái gì, rõ, không rõ',
        AFFIRM: 'đồng ý, ừ, oke, ok, okay, đúng, có, được, cũng đang, cân nhắc, đang tìm, thử, sao chị, công việc',
        UNEMPLOY: 'ở nhà, thất nghiệp',
        EMPLOY: 'đang làm, đã có việc',
        AGENT: 'chuyên viên, tổng đài viên, tư vấn, nói chuyện'
    },
    intents: {
        BUSY: "TD2",
        DENY: "TD6",
        FALLBACK: "TD7",
        EMPLOY: "TD9",
        UNEMPLOY: "TD3",
        AGENT: "TD10"
    }
}