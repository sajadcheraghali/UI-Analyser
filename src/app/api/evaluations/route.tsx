import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { Evaluation } from "../../entities/Evaluation";
import { AppDataSource } from "../../lib/database";
import { User } from "../../entities/User";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req });

  if (!session || !session.user?.id) {
    return res.status(401).json({ message: "لطفاً وارد شوید" });
  }

  await AppDataSource.initialize();

  if (req.method === "POST") {
    try {
      const { url, feedback, usability, design, performance } = req.body;

      const evaluation = new Evaluation();
      evaluation.user = Object.assign(new User(), { id: parseInt(session.user.id) });
      evaluation.url = url;
      evaluation.feedback = feedback;
      evaluation.scores = { usability, design, performance };
      evaluation.status = "pending";

      await evaluation.save();

      return res.status(201).json({ message: "ارزیابی ثبت شد" });
    } catch (error) {
      return res.status(500).json({ message: "خطا در ثبت ارزیابی" });
    }
  }

  return res.status(405).json({ message: "متد غیر مجاز" });
}
