import { Configuration, OpenAIApi } from 'openai';
import dotenv from 'dotenv';
import express from 'express';
import bodyParser from 'body-parser';
import NodeCache from 'node-cache';
dotenv.config();

const configuration = new Configuration({
    organization: " org-qcdxhVTle64n1lOuIHQTyYj0",
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

// Initialize a cache object
const cache = new NodeCache({ stdTTL: 600, checkperiod: 120 });

const app = express()
const port = 4001
app.use(bodyParser.json())

app.post('/recipe', async (req, res) => {

    let { prompt } = req.body;
    if (prompt) prompt = prompt.toLowerCase();
    


    // Check if the query result is already in cache
    const cacheKey = `${prompt}`;
    const cachedResult = cache.get(cacheKey);
    if (cachedResult) {
        console.log(`Cache hit for key: ${cacheKey}`);
        return res.json({ message: cachedResult });
    }

    const completion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
            { role: "user", content: `write me a recipe for ${prompt} and also give me the calorie count` },
        ],
        max_tokens: 4000,
        temperature: 0.5,
        top_p: 1,
        frequency_penalty: 0.5,
        presence_penalty: 0.0,

    });

    const result = completion.data.choices[0].message;
    // Store the query result in cache
    cache.set(cacheKey, result);
    console.log(`Added result to cache with key: ${cacheKey}`);

    res.json({ message: result });
})

app.listen(port, () => {
    console.log(` app listening at http://localhost:${port}`)
})
