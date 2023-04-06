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
const port = 4000
app.use(bodyParser.json())

app.post('/giftsuggestions', async (req, res) => {

    let { occasion, gender, relation, age } = req.body;
    if (occasion) occasion = occasion.toLowerCase();
    if (gender) gender = gender.toLowerCase();
    if (relation) relation = relation.toLowerCase();


    // Check if the query result is already in cache
    const cacheKey = `${occasion}-${gender}-${relation}-${age}`;
    const cachedResult = cache.get(cacheKey);
    if (cachedResult) {
        console.log(`Cache hit for key: ${cacheKey}`);
        return res.json({ message: cachedResult });
    }

    const completion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
            { role: "user", content: `provide me 10 ${occasion} gift suggestions for a ${age} year old ${gender} ${relation} also suggest me some links where i can buy those gifts` },
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
