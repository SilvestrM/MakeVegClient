const path = require('path')
module.exports = {
    css: {
        loaderOptions: {
            sass: {
                sassOptions: {
                    includePaths: [
                        path.resolve(__dirname, 'src/styles/')
                    ],
                },
                prependData: `
                    @import "https://cdn.materialdesignicons.com/4.9.95/css/materialdesignicons.min.css";
                    @import "~bulma/sass/utilities/_all";
                    @import "_theme.scss";
                    @import "bulma";
                    @import "~buefy/src/scss/buefy";
                    @import "animations.scss";
                    @import "style.scss";
                    `
            }
        }
    },
    outputDir: path.resolve(__dirname, '../server/public'),
    devServer: {
        proxy: {
            '/api': {
                target: 'http://localhost:3000'
            }
        }
    }
}