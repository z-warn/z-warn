module.exports = {
  target: 'webworker',
  entry: './src/index.js',
  mode: 'production',
  node: {
    fs: 'empty',
  },
  module: {
    rules: [
      {
        test: /\.mjs$/,
        include: /node_modules/,
        type: 'javascript/auto',
      },
    ],
  },
  performance: {
    hints: false,
  },
};
