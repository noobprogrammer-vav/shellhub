const PORT = 2002
const LOCAL_IP = "192.168.1.18"
const cors = require("cors")
const path = require('path')
const { spawn } = require("child_process")
const express = require("express")
const app = express()
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({extended : true}))
app.use(express.static(path.join(__dirname,'/')))

app.listen(PORT, LOCAL_IP, () => {
    console.log(`Shell-Hub is running on port http://${LOCAL_IP}:${PORT}/ ...`)
})

app.get("/",(req,res) => {
    console.log(req.ip)
    res.sendFile(path.join(__dirname + '/assets/home.html'))
})

app.post("/hitshell", (req,res) => {
    console.log(req.body)
    var command = req.body.command
    var shell = spawn("cmd.exe",["/c", command])
    var output = []
    var error = []

    shell.stdout.on("data",(data) => {
        console.log("output", data.toString())
        output.push(data.toString().replaceAll("\r\n", "<br />"))
    })

    shell.stderr.on("data",(data) => {
        console.log("error", data.toString())
        error.push(data.toString().replaceAll("\r\n", "<br />"))
    })

    shell.on("close", (code) => {
        console.log("child process exited with code " + code)
        if(output.length == 0 && error.length == 0){output.push("Success")}
        res.status(200).send({output, error})
    })

})