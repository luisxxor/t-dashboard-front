/* eslint-disable import/prefer-default-export */
/**
 * Generates a random string
 * @param {int} length - The length of the random string (default = 7)
 * @return {String} Random text.
 */
export function randomString(length = 7) {
    const possibleChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
    let text = ''

    for (let i = 0; i < length; i += 1) {
        text += possibleChars.charAt(Math.floor(Math.random() * possibleChars.length))
    }

    return text
}
