import { Configuration, OpenAIApi } from 'openai';
import dotenv from 'dotenv';
import express from 'express';
import bodyParser from 'body-parser';
dotenv.config();


const configuration = new Configuration({
    organization: " org-qcdxhVTle64n1lOuIHQTyYj0",
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);


const app = express()
const port = 4000
app.use(bodyParser.json())

app.post('/chat', async (req, res) => {

    const {prompt} = req.body;

    const completion =  await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
            {role: "user", content: `${prompt}`},
        ],
        max_tokens: 4000,
        temperature: 0.2,
        top_p: 1,
    });

    res.json({
        message: completion.data.choices[0].message
    })

})

app.listen(port, () => {
    console.log(` app listening at http://localhost:${port}`)
})
