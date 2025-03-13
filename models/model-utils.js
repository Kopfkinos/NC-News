exports.generatePromiseReject = (status, resource) => {
  let errorMsg = "error"

  if (status === 404) {
    errorMsg = `${resource} doesn't exist! (yet...)`
  }

  if (status === 400) {
    switch (resource) {
      case "vote":
        errorMsg = `The sent vote obj was invalid. Did someone say election interference?`
        break
      case "comment":
        errorMsg = "Keep invalid comments to yourself"
        break
      case "query":
        errorMsg =
          "There are no bad questions, but there are bad queries, much like the one you just entered."
        break
      default:
        errorMsg = `Invalid ${resource}!`
    }
  }

  const errorObj = { status, msg: errorMsg }

  return Promise.reject(errorObj)
}
