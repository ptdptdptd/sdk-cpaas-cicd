const N8N_HEADER = new Headers().append('Content-Type', 'application/x-www-form-urlencoded')
const N8N_API = 'https://inter.epacific.net/webhook/9cd040a5-902c-49a5-b37b-c675ad92a2b7'

const n8n = {
    sendToN8N: async ({ payload = null }) => {
        if (payload === null) {
            return;
        }
        await fetch(N8N_API, {
            method: 'POST',
            headers: N8N_HEADER,
            mode: 'no-cors',
            body: JSON.stringify(payload),
        })

    }
}

module.exports = n8n;