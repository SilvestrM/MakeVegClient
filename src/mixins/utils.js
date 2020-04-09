const utils = {
    methods: {
        $encodeb64: function (buffer) {
            return btoa(String.fromCharCode.apply(null, buffer))
        }
    }
}

export default utils