module.exports = {
  monorepo: {
    mainVersionFile: 'package.json', // or `lerna.json`, or whatever a json file you can read the latest `version` from.
    packagesToBump: ['packages/*', 'docs', 'examples/*'],
    packagesToPublish: [
      'packages/core',
      'packages/cli',
      'packages/diagrams',
      'packages/generators',
      'packages/language-server',
      'packages/layouts'
    ]
  },
  updateChangelog: false,
  publishCommand: ({ tag }) => `yarn npm publish --tag ${tag} --access public`
}
