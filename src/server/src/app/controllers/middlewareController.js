const jwt = require("jsonwebtoken");

class MiddlewareController {
    //verifyToken
    verifyToken = (req, res, next) => {
        const token = req.headers.token;
        if (token) {
            //Bearer 122344
            const accessToken = token.split(" ")[1]; // => 122344
            jwt.verify(accessToken, process.env.JWT_ACCESS_KEY, (err, user) => {
                if (err) {
                    return res
                        .status(403)
                        .json({ message: "Token is not valid" });
                }
                req.user = user;
                next();
            });
        } else {
            return res
                .status(401)
                .json({ message: "You are not authenticated !" });
        }
    };

    verifyTokenAndAdmin = (req, res, next) => {
        this.verifyToken(req, res, () => {
            if (req.user.role == "admin") {
                next();
            } else {
                res.status(403).json({ message: "You are not 'admin' !!!" });
            }
        });
    };

    verifyTokenAndQL_Admin = (req, res, next) => {
        this.verifyToken(req, res, () => {
            if (req.user.role == "admin" || req.user.role == "ql_kho") {
                next();
            } else {
                res.status(403).json({
                    message: "You are not 'admin' or 'ql_kho' !!!",
                });
            }
        });
    };

    authUserName = (req, res, next) => {
        const token = req.headers.token;
        if (token) {
            const accessToken = token.split(" ")[1];
            try {
                // Giải mã token
                const decoded = jwt.verify(token, process.env.JWT_ACCESS_KEY);
                req.username = decoded.username;
                next();
            } catch (error) {
                res.status(401).json({
                    message: "You are not authenticated !",
                });
            }
        } else {
            return res
                .status(401)
                .json({ message: "You are not authenticated !" });
        }
    };
}
module.exports = new MiddlewareController();
