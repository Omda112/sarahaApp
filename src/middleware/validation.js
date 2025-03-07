export const validation = (schema) => {
    return (req, res, next) => {
        console.log("🔍 Headers:", req.headers);

        let validationResult = [];

        for (const key of Object.keys(schema)) {
            console.log(`🔍 Validating: ${key}, Received:`, req[key]);

            if (!req[key]) {
                console.warn(`⚠️ Warning: req.${key} is undefined!`);
                continue;
            }

            const validateSchema = schema[key].validate(req[key], { abortEarly: false });

            if (validateSchema?.error) {
                validationResult.push(...validateSchema.error.details);
            }
        }

        if (validationResult.length > 0) {
            return res.status(400).json({
                msg: "Validation Error",
                errors: validationResult
            });
        }

        next();
    };
};
