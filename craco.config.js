const path = require("path");

module.exports = {
    webpack: {
        alias : {
            '@modules' : path.resolve(__dirname,'./src/modules'),
            '@config' : path.resolve(__dirname,'./src/config'),
            '@components' : path.resolve(__dirname,'./src/components'),
            '@utils' : path.resolve(__dirname,'./src/utils'),
            '@hooks' : path.resolve(__dirname,'./src/hooks'),


        }
    }
}