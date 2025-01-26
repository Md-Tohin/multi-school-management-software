const jwt = require('jsonwebtoken')

const authMiddleware = (roles=[]) => {
    return (req, res, next) => {
        try {
            const token = req.header("Authorization")?.replace("Bearer ", "");
            if(!token){
                return res.status(401).json({
                    success: false,
                    error: true,
                    message: "No token, Authorization denied"
                })
            }
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            if(decoded) {
                req.user = decoded;
                if(roles.length > 0 && !roles.includes(req.user.role)){
                    return res.status(403).json({
                        success: false,
                        error: true,
                        message: "Access denied"
                    })
                }
                next();
            }
        } catch (error) {
            
        }
    }
}

module.exports = authMiddleware;