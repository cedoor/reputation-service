// import config from "src/config"
// import {addUnverifiedUser } from  '../../../utils/email/mongo_add_user';
// import {checkUserStatus } from '../../../utils/email/mongo_check_user';
import type { NextApiHandler, NextApiRequest, NextApiResponse } from "next"
import { withSentry } from "@sentry/nextjs"
import createEmailAccount from "src/core/email/createEmailAccount"
import logger from "src/utils/backend/logger"

async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    const userEmail = JSON.parse(req.body).address

    console.log("Email address: ", userEmail)

    let message

    try {
        // -------------------checking email format-----------------
        if (!userEmail || !userEmail.includes("@hotmail")) {
            message = "invalid email, must be an @hotmail address"

            res.status(402).json({ message })
        } else {
            // user has valid hotmail account
            try {
                logger.silly("trying to make account")
                await createEmailAccount(userEmail, "hotmail").then((message) => {
                    console.log("createEmailAccount message", message)

                    res.status(200).json({ message })
                })
            } catch (err) {
                console.log(err)
            }
        }
    } catch (err) {
        message = "invalid email, must be an @hotmail address"

        res.status(402).json({ message })
    }
}

export default withSentry(handler as NextApiHandler)
