function handleMessage(msg) {
    if (msg === 'ping') {
        return 'pong!';
    } else {
        return null;
    }
}
module.exports = handleMessage;