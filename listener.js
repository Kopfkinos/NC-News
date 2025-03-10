const app = require("./app")

app.listen(9090, (err) => {
  if (err) {
    console.log(err)
  } else {
    console.log("Reading you live and clear on our dev port Ulala...")
  }
})
