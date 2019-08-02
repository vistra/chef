import * as express from "express";
import * as http from "http";
import * as config from "../config/project.config";
import * as path from "path";

const app = express();

app.use("/assets", express.static(path.join(__dirname, '../../client/assets')));

if (config.useWebpackDevMiddleware) {
    //debug('Enabling webpack dev and HMR middleware')
    const webpack = require('webpack');
    const webpackConfig = require('../webpack.config');
    const compiler = webpack(webpackConfig);
    app.use(require('webpack-dev-middleware')(compiler
        , {
            publicPath: webpackConfig.output.publicPath,
            contentBase: config.paths.client(),
            hot: true,
            quiet: config.compiler_quiet,
            noInfo: config.compiler_quiet,
            lazy: false,
            stats: config.compiler_stats
        }
    ));
    app.use(require('webpack-hot-middleware')(compiler, {
        path: '/__webpack_hmr'
    }));
} else {
  console.log("serving static bundle");
  app.use("/dist", express.static(path.join(__dirname, '../../dist')));
}

const server = app.listen(config.server_port, function() {
    app.emit('listening');
    return console.info(`Express server listening on port ${server.address().port}`);
});

