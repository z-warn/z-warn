class ZwarnError extends Error {
    constructor(code, message) {
        super()
        this.ok = false
        this.code = code
        this.message = message
    }
}

export default ZwarnError