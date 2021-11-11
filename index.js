import express from 'express' 
import { 
    addUser, 
    verifyUserPassword, 
    generateSession,
    getUserFromToken
} from './app/controllers/user.js'

const app = express()

function logRequest(req, res, next) {
    console.log(`Request to ${req.url} and method is ${req.method}`)
    next()
}

function checkSession(req, res, next) {
    if (req.query.session) {
        const user = getUserFromToken(req.query.session)
        if (!user) {
            res.status(400).send({error: "Unknown user"})
            return
        }
        req.user = user
        next()
    } else {
        res.status(400).send({error: "User not authenticated"})
    }
}

app.use(logRequest)
app.use("/private", checkSession)
app.use(express.json())
 
app.get("/", (req, res) => {
    res.send("Hello esteemed user " + (req.user || "Unknown") )
})

app.get("/private/greeting", (req, res) => {
    res.send("Hello esteemed user " + req.user)
})

app.post("/user", async (req, res) => {
    const account = req.body.accountName
    const password = req.body.password
    const result = await addUser(account, password)
    if (!result) {
        res.status(406).send()
        return false
    }
    
    res.status(201).send()
})

app.post("/login", async (req, res) => {
    if (await verifyUserPassword(req.body.accountName, req.body.password)) {
        const sessionId = generateSession(req.body.accountName)
        return res.status(200).send({sessionId})

    } else {
        res.status(400).send({error: "Wrong username or password"})
    }
})

app.listen(8080, () => {console.log("App listening on 8080")})

