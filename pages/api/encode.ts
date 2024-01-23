// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { NearTextType } from 'types';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Object>
) {

  const data = req.body;
  try {
    const response = await fetch(
      "https://api-inference.huggingface.co/models/Blaxzter/LaBSE-sentence-embeddings",
      {
        headers: { Authorization: `Bearer ${process.env.HUGGINGFACEAPIKEY}` },
        method: "POST",
        body: data,
      }
    );
    const result = await response.json();
    console.log(result);

    return res.status(200).json(result);

  } catch (err) {
    console.error(err);
    res.status(500);
  }
}
