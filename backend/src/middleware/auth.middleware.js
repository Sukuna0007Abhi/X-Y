export const protectRoute = async (req, res, next) => { 
    if (!req.auth().isAuthenticated()) {
        return res.status(401).json({ message: 'Unauthorized-you must log in' });
    }

    next();
};