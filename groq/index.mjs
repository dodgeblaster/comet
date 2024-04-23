import Groq from 'groq-sdk'

const models = {
    l3: 'llama3-8b-8192',
    l370: 'llama3-70b-8192',
    gemma: 'gemma-7b-it'
}

export default function (key) {
    async function llm({
        start,
        end,
        prompt,
        temperature = 0.9,
        model = 'l3'
    }) {
        const groq = new Groq({
            apiKey: key
        })
        const res = await groq.chat.completions.create({
            messages: [
                {
                    role: 'user',
                    content: prompt
                },
                {
                    user: 'assistant',
                    content: start
                }
            ],
            model: models[model],
            temperature,
            max_tokens: 2000,
            stop: [end]
        })
        return res.chatCompletion.choices[0]?.message?.content || ''
    }

    return {
        llm
    }
}
