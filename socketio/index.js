let io;
let ioid;

class Socketio {
    constructor() {
    }

    static setIo(InstanceIo, instanceId) {
        io = InstanceIo;
        ioid = instanceId;
    }

    static getIo() {
        return { io: io, ioid: ioid };
    }

    static returnIo() {
        return io
    }

    static returnIoId() {
        return ioid
    }
}


module.exports = Socketio;