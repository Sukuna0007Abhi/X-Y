import { aj } from '../config/arcjet.js';

// Arcjet middleware for rate limiting, bot protection and security 

export const arcjetMiddleware = async (req, res, next) => {
    try {
        const decision = await aj.protect(req, {
            requested: 1, // each request consumes 1 token
        });

        //handle denied requests
        if (decision.isDenied()) {
            if (decision.isRateLimited()) {
                return res.status(429).json({
                    message: 'Rate limit exceeded. Please try again later.',
                });
            } else if (decision.isBot()) {
              return res.status(403).json({
                 error: 'Access denied for bots.',
                 message: 'Bots are not allowed to access this resource.',
              });
            } else {
                return res.status(403).json({
                    error: 'Forbidden',
                    message: 'Access denied due to security rules.',
                });
            }
        }

        // check for spoofed bots 
        if (decision.results.some((result)=> result.reason.isBot() && result.reason.isSpoofed())) {
            return res.status(403).json({
                error: 'Access denied for spoofed bots. I will skin you alive spoof bot',
                message: 'Spoofed bots are not allowed to access this resource.I will track your IP and be ready for it',
            });
        }
      
        next(); // proceed to the next middleware or route handler
    } catch (error) {
        console.error('Arcjet middleware error:', error);
        // allow request to continue if Arcjet fails
        next(); 
    }
};