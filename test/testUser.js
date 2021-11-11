import assert from 'assert'
import {getUserFromToken, checkPassword, addSession, addUser, getUserByAccount, verifyUserPassword, generateSession} from '../app/controllers/user.js'

describe('Tests for ensuring that User authentication works', function() {
    describe('checkPassword', function() {
        it('Wrong password or wrong account returs false', function() {
            let result = checkPassword('jane@doe.com', 'wrong_passord')
            assert.equal(result, false)
            result = checkPassword('janet@doe.com', '987654321')
            assert.equal(result, false)
        })
        it('Correcc password returs true', function() {
            let result = checkPassword('jane@doe.com', '987654321')
            assert.equal(result, true)
        })
    })

    describe('addUser', function() {
        it('should create a new user and hash the password', async function () {
            const account = 'test@test.com'
            const password = 'test_password'
            const result = await addUser(account, password)
            const user = getUserByAccount(account)
            assert.equal(account, user.account)
            assert.notEqual(password, user.passwordHash)
        })
        it('adding same account twice should generate error', async function () {
            const account = 'test2@test.com'
            const password = 'test_password'
            let result = await addUser(account, password)
            assert.notEqual(false, result)
            result = await addUser(account, password)
            assert.equal(false, result)
        })
        it('should verify user password', async function () {
            const account = 'test3@test.com'
            const password = 'test_password'
            let result = await addUser(account, password)
            
            result = await verifyUserPassword(account, password)
            assert.equal(true, result)

            result = await verifyUserPassword(account, "wrong_password")
            assert.equal(false, result)
        })
        it('should generate jwt token containing user acccount', async function () {
            const account = 'test4@test.com'
            
            let result = await generateSession(account) 
            assert.equal(164, result.length)

        })
        it('should verify jwt token and return account from the session', async function () {
            const account = 'test5@test.com'
            let token = await generateSession(account) 
            let accountInSession = getUserFromToken(token)
            assert.equal(account, accountInSession)
        })
    })
})