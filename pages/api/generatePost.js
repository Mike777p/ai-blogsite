import {Configuration,  OpenAIApi} from "openai"
import { getSession, withApiAuthRequired } from "@auth0/nextjs-auth0"
import clientPromise from "../../lib/mongodb";

const botType = "blog post"
const model = "gpt-3.5-turbo"

export default withApiAuthRequired(async function handler(req, res) {
  const {user} = await getSession(req, res);
  const client = await clientPromise;
  const db = client.db("blogStandard");
  console.log("User -> ", user)

  const userProfile = await db.collection("users").findOne(
    {auth0Id : user.sub});

    if (!userProfile?.availableTokens) {
      res.status(403);
      return
    }

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

            await db.collection("users").updateOne(
              {auth0Id : user.sub},
              {
                $inc : { availableTokens : -1}
              })

            const posts = await db.collection("posts").insertOne(
              {
                postContent :postContent,
                title : title,
                metaDescription : metaDescription,
                keywords : keywords,
                topic : topic,
                userId : userProfile._id,
                userInfo : userProfile,
                created : new Date(),
            },
            );

            res.status(200).json({
                post: {
                    postContent,
                    title,
                    metaDescription
                },
            })
          
  })
  