import {
  authenticate,
  deleteSubscription,
  getAllSubscriptions,
  getUsersByLogin,
} from "@lib/Twitch";

export default async function handler(req, res) {
  try {
    // authorise
    if (
      req.headers["whst-subscriptionkey"] !== process.env.API_SUBSCRIPTION_KEY
    ) {
      res.status(401).json();
      return;
    }

    const authToken = await authenticate();
    const username = req.query.login;
    const users = await getUsersByLogin(username, authToken);
    const user = users.data[0];
    const userid = user.id;
    const subs = await getAllSubscriptions(authToken);
    const substodelete = subs.data.filter((d) => {
      return d.condition.broadcaster_user_id == userid;
    });
    for (let index = 0; index < substodelete.length; index++) {
      const sid = substodelete[index];
      await deleteSubscription(authToken, sid.id);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send();
  }

  res.status(200).send();
}
