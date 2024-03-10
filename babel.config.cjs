module.exports = (api) => {
  api.cache(true);
  return {
    presets: [
      '@babel/preset-typescript',
      [
        '@babel/preset-env',
        {
          modules: false,
          targets: {
            node: 20,
          },
        },
      ],
    ],
  };
};
