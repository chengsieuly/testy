export function validator(obj, compartee, errors = {}) {
    Object.keys(obj).forEach(key => {
        if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
            validator(obj[key], compartee[key], errors);
        }

        try {
            if (compartee.hasOwnProperty(key)) {
                if (typeof obj[key] !== typeof compartee[key]) {
                    errors[key] = `Data type does not match. Received ${typeof compartee[key]}.`;
                }
            } else {
                errors[key] = 'Expected property is missing.';
            }
        } catch(err) {
            errors[key] = err.message;
        }
    });

    return errors;
}

export function validateResponse(fixture) {
    if (!fixture.validator) {
        return Promise.resolve(null);
    }

    const { url, ...options } = fixture.validator;
    const mockedData = fixture.data || {};

    return fetch(url, options)
        .then(response => {
            return response;
        })
        .then(response => response.json())
        .then(data => {
            const errors = validator(mockedData, data);

            if (Object.keys(errors).length === 0) {
                return null;
            }

            return errors;
        })
        .catch(err => ({ error: err.message }));
}

export default validateResponse;