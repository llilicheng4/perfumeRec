import { NearTextType } from 'types';
import type { NextApiRequest, NextApiResponse } from 'next';
import { WeaviateClient } from 'weaviate-ts-client';
import { getDb } from '@/lib/weaviateDB';

const client: WeaviateClient = getDb();

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Object>
) {
    try {
        const { method } = req;
        let { query } = req.body;

        switch (method) {

            case 'POST': {


                let recDataBuilder = client.graphql
                    .get()
                    .withClassName('Perfume')
                    .withWhere({
                        path: ['name'],
                        operator: 'Like',
                        valueText: "*" + query + "*",
                    })
                    .withFields(
                        'name brand image description'
                    )
                    .withLimit(4);

                const recData = await recDataBuilder.do();

                res.status(200).json(recData);
                break;
            }
            default:
                res.status(400);
                break;
        }
    } catch (err) {
        console.error(err);
        res.status(500);
    }
}
