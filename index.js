import express from 'express' 

const app = express()

function logRequest(req, res, next) {
    console.log(`Request to ${req.url} and method is ${req.method}`)
    next()
}

const activeSessions = [
    {session: "awsldfjqpwoeu298234", user: "john@doe.com"},
    {session: "qwe698werqweroiyuqw", user: "jane@doe.com"},
]

function getUser(session) {
    const foundSession = activeSessions.find(s => s.session === session)
    if (!foundSession) {
        return false
    }

    return foundSession.user
}

function checkSession(req, res, next) {
    if (req.query.session) {
        const user = getUser(req.query.session)
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

app.get("/", (req, res) => {
    res.send("Hello esteemed user " + (req.user || "Unknown") )
})

app.get("/private/greeting", (req, res) => {
    res.send("Hello esteemed user " + req.user)
})

app.post("/login", (req, res) => {
    res.send("No implemented")
})

app.listen(8080, () => {console.log("App listening on 8080")})

