import scanner from 'sonarqube-scanner';
scanner(
  {
    serverUrl: 'http://localhost:9000',
    options: {
      'sonar.projectKey': 'Quisvar-Frontend',
      'sonar.sources': './src',
      'sonar.login': 'sqp_dde6588bcdd187a2d2339cfe2c207c0e8f819a35',
      'sonar.typescript.file.suffixes': '.ts,.tsx',
    },
  },
  () => process.exit()
);
