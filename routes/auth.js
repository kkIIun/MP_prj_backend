const { OAuth2Client } = require("google-auth-library");

exports.isAuthToken = async (req, res, next) => {
  try {
    const client = new OAuth2Client(env.process.CLIENT_ID);
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const userid = payload["sub"];
    next();
  } catch (error) {
    return res.status(500).json({
      code: 500,
      message: "토큰이 유효하지 않습니다.",
    });
  }
};
