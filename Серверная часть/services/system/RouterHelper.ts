class RouterHelper {
    static sendError(message) {
        return {
            status: 'error',
            message: message
        };
    }

    static sendAnswer(data = {}) {
        return {
            status: 'success',
            ...data
        };
    }
}

export default RouterHelper;
