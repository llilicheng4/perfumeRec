// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { NearTextType } from 'types';
import type { NextApiRequest, NextApiResponse } from 'next';
import { Pinecone } from '@pinecone-database/pinecone';

const pinecone = new Pinecone({
    apiKey: "814bf931-ac67-45b8-943a-cbb9ecd7328a",
    environment: 'gcp-starter',
});
const index = pinecone.index('bert-test');

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Object>
) {

    const data = req.body;
    try {
        const queryResponse = await index.query({
            topK: 10,
            vector: data
        });

        return res.status(200).json(queryResponse);

    } catch (err) {
        console.error(err);
        res.status(500);
    }
}
