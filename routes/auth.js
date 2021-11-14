const { OAuth2Client } = require("google-auth-library");

exports.isAuthToken = async (req, res, next) => {
  try {
    const client = new OAuth2Client(process.env.CLIENT_ID);
    await client.verifyIdToken({
      idToken: req.get("Authorization"),
    });
    next();
  } catch (error) {
    return res.status(500).json({
      code: 500,
      message: "토큰이 유효하지 않습니다.",
      mes: error._message,
    });
  }
};
