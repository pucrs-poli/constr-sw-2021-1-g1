const KcAdminClient = require('keycloak-admin').default;

const kcAdminClient = new KcAdminClient();

kcAdminClient.setConfig({
  baseUrl: 'http://ec2-3-141-37-122.us-east-2.compute.amazonaws.com:8080/auth',
  realmName: 'constr-sw-2021',
});

module.exports = kcAdminClient;
