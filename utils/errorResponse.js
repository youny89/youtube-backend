export default (message, status) => {
    const error = new Error(message);
    error.statusCode = status;
    console.log(error);
    return error;
}