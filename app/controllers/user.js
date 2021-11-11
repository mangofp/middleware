import { v4 as uuid } from 'uuid'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const saltRounds = 10
const jwtKey = "aödslkjfadfaöldkfjöalgkjqwopeiurqwpoeir"

const users = {
    "john@doe.com": {
        password: "some_password1234",
        name: "John Doe"
    },
    "jane@doe.com": {
        password: "987654321",
        name: "Jane Doe"
    },
}

const activeSessions = []

export function getUserFromToken(token) {
    try {
        let data = jwt.verify(
            token,
            jwtKey
        )
        return data.account || false
    } catch (err) {
        console.log(err.message)
        return false
    }
}

export function checkPassword(accountName, password) {
    if (!users[accountName]) {
        return false
    }
    return users[accountName].password === password
}

export function addSession(accountName) {
    const foundSession = activeSessions.find(s => s.user === accountName)
    if (foundSession) {
        return foundSession.session
    }
    const sessionId = uuid()
    activeSessions.push({session: sessionId, user: accountName})
    return sessionId
}

export async function addUser(account, password) {
    const result = getUserByAccount(account)
    if (result) {
        return false
    }

    const salt = await bcrypt.genSalt(saltRounds)
    const passwordHash = await bcrypt.hash(password, salt)
    const newUser = {
        account: account,
        passwordHash: passwordHash
    }
    users[account] = newUser
    return newUser
}

export async function verifyUserPassword(account, password) {
    const user = getUserByAccount(account)
    if (!user) {
        false
    }
    return bcrypt.compare(password, user.passwordHash)
}

export function getUserByAccount(account) {
    return users[account]
}

export function generateSession(account) {
    const token = jwt.sign(
        {account},
        jwtKey,
        {expiresIn: '1h'}
    )

    return token
}