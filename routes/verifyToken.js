import jsonwebtoken from "jsonwebtoken"

function verifyToken(req, res, next) {

    const beareHeader = req.headers["authorization"];

    if (beareHeader) {

        const bearer = beareHeader.split(" ");
        const bearerToken = bearer[1];

        if (bearer[0] !== "Bearer" || !bearerToken) {
            return res.status(401).json({
                error: "Invalid Authorization Header"
            });
        }

        jsonwebtoken.verify(
            bearerToken,
            process.env.SECRET_KEY,
            (err, authData) => {

                if (err) {
                    return res.status(403).json({
                        error: "Invalid or Expired Token"
                    });
                }

                req.user = authData;

                next();
            }
        );

    } else {
        return res.status(401).json({
            error: "Authentication Required"
        });
    }
}

export default verifyToken;
      