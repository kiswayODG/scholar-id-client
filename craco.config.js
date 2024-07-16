const path = require("path");

module.exports = {
    webpack: {
        alias : {
            '@modules' : path.resolve(__dirname,'./src/modules'),
            '@appConfigs' : path.resolve(__dirname,'./src/appConfigs'),
            '@components' : path.resolve(__dirname,'./src/components'),
            '@utils' : path.resolve(__dirname,'./src/utilities'),
            '@hooks' : path.resolve(__dirname,'./src/hooks'),
            '@assets' : path.resolve(__dirname,'./src/assets'),

        }, plugins: {
            add: [
              /* ... */
            ],
            remove: [
              /* ... */
            ],
          },
          configure: (webpackConfig, { env, paths }) => {
            /* ... */
            return webpackConfig;
          },
        },
    
}