import {Configuration,  OpenAIApi} from "openai"
// const topic = "the importance of dental hygiene " 
// const keywords = "infection prevention antibiotics"
const botType = "blog post"
const model = "gpt-3.5-turbo"

export default async function handler(req, res) {
    const config = new Configuration({
        apiKey : process.env.OPENAI_API_KEY
    });
    const {topic, keywords} =req.body;

    const openai = new OpenAIApi(config);

    const postContentResult = await openai.createChatCompletion({
        model:`${model}`,
        temperature: 0,
        messages: [
            {
              role: 'system',
              content: `You are a ${botType} generator.`,
            },
            {
              role: 'user',
              content: `Write a long and detailed SEO-friendly as a ${botType} about ${topic}, that targets the following comma-separated keywords: ${keywords}. 
            The response should be formatted in SEO-friendly HTML, 
            limited to the following HTML tags: p, h1, h2, h3, h4, h5, h6, strong, i, ul, li, ol.`,
            },
          ],
        })

        const postContent = postContentResult.data.choices[0]?.message.content;

        const titleResult = await openai.createChatCompletion({
            model: `${model}`,
            messages: [
              {
                role: 'system',
                content: `You are a ${botType} generator.`,
              },
              {
                role: 'user',
                content: `Write a long and detailed SEO-friendly ${botType} about ${topic}, that targets the following comma-separated keywords: ${keywords}. 
              The response should be formatted in SEO-friendly HTML, 
              limited to the following HTML tags: p, h1, h2, h3, h4, h5, h6, strong, i, ul, li, ol.`,
              },
              {
                role: 'assistant',
                content: postContent,
              },
              {
                role: 'user',
                content: `Generate appropriate title tag text for the above ${botType}`,
              },
            ],
            temperature: 0,
          });

          const metaDescriptionResult = await openai.createChatCompletion({
            model: `${model}`,
            messages: [
              {
                role: 'system',
                content: `You are a ${botType} generator.`,
              },
              {
                role: 'user',
                content: `Write a long and detailed SEO-friendly ${botType} about ${topic}, that targets the following comma-separated keywords: ${keywords}. 
              The response should be formatted in SEO-friendly HTML, 
              limited to the following HTML tags: p, h1, h2, h3, h4, h5, h6, strong, i, ul, li, ol.`,
              },
              {
                role: 'assistant',
                content: postContent,
              },
              {
                role: 'user',
                content:
                  `Generate SEO-friendly meta description content for the above ${botType}`,
              },
            ],
            temperature: 0,
          });
        
          const title = titleResult.data.choices[0]?.message.content;
          const metaDescription = metaDescriptionResult.data.choices[0]?.message.content;

            console.log('POST CONTENT: ', postContent);
            console.log('TITLE: ', title);
            console.log('META DESCRIPTION: ', metaDescription);

            res.status(200).json({
                post: {
                    postContent,
                    title,
                    metaDescription
                },
            })
          
  }
  