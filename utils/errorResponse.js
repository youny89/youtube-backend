export default (message, status) => {
    const error = new Error(message);
    error.statusCode = status;
    return error;
}