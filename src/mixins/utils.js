const utils = {
    methods: {
        $encodeb64: function (buffer) {
            let data = ''
            const bytes = new Uint8Array(buffer)
            for (let i = 0; i < bytes.length; i += 100000) {
                data += (String.fromCharCode.apply(null, bytes.slice(i, Math.min(i + 100000, bytes.length))))
            }
            return btoa(data)
        }
    }
}

export default utils