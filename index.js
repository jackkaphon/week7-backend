const express = require('express')
const app = express()
const port = 3000
const bodyParser = require('body-parser')
const mysql = require('mysql')
const cors = require('cors')

app.use(cors())

const con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'week6-db'
})

con.connect()

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get('/', (req, res) => {
    res.send('api')
})

app.get('/user/:id', (req, res)=> {
    const {id} = req.params
    const params = [id]
    const query = "SELECT id, email, password, username, firstname, lastname FROM user WHERE id = ?"
    con.query(query, params, (err, result) => {
        if (err) throw err
        res.send(result)
    })
})

app.post('/login', (req, res) => {
    const {email, password} = req.body
    const params = [email, password]
    const query = "SELECT id FROM user WHERE email = ? AND password = ?"
    con.query(query, params, (err, result) => {
        if (err) throw err

        if(result.length > 0){
            res.send({
                status: 200,
                msg: 'Login success'
            })
        }else{
            res.send({
                status: 404,
                msg: "User does not exist"
            })
        }
    })
})

app.post('/register', (req, res) => {
    const {email, password, firstname, lastname, username} = req.body
    const params = [email, password, firstname, lastname, username]
    const query = "INSERT INTO user (email, password, firstname, lastname, username) VALUES (?, ?, ?, ?, ?)"
    con.query(query, params, (err, result) => {
        if (err) throw err
        res.send('Insert success')
    })
})

app.put('/updateUser', (req, res) => {
    const {email, pass, id} = req.body
    const params = [email, pass, id]
    const query = "UPDATE user SET email = ?, password = ? WHERE id = ?"
    con.query(query, params, (err, result) => {
        if (err) throw err
        res.send('Update success')
    })
})

app.delete('/deleteUser', (req, res) => {
    const {id} = req.body
    const params = [id]
    const query = "DELETE FROM user WHERE id = ?"
    con.query(query, params, (err, result) => {
        if (err) throw err
        res.send('Delete success')
    })
})

app.listen(port)