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
const port = 3000
app.use(bodyParser.json())
let ans="";
app.post('/chat', async (req, res) => {

    const {prompt} = req.body;
    let str1="\n\nYou: ";
    ans+=str1;
    ans+=prompt;

    console.log("before call"+ans);
    const completion =  await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
            {role: "user", content: `${ans}`},
        ],
        max_tokens: 4000,
        temperature: 0.99,
        top_p: 1,
        frequency_penalty: 0.5,
        presence_penalty: 0.0,
        // stop: ["\n\n"]
    });
    ans+="\n\n"
    ans+=completion.data.choices[0].message.content;
    console.log("after call"+ans);
    res.json({
        message: completion.data.choices[0].message
    })

})

app.listen(port, () => {
    console.log(` app listening at http://localhost:${port}`)
})       