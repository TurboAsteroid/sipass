module.exports = {
  mariadb: {
    connectionLimit: 10000,
    waitForConnections: true,
    host: '10.1.255.208',
    port: '3333',
    database: 'gs3',
    user: 'gs3',
    password: 'g77TTrsf8q'
  },
  ldap: {
    url: 'ldap://10.1.255.29',
    baseDN: 'dc=elem,dc=ru',
    username: 'gs2@elem.ru',
    password: 'gs2-1'
  },
  jwtSecret: 'iasnmdflkiudj9)*&89079q234rhw^(912683764-907HHHuashdfoiuaostd',
  configSiPass: {
    'user': 'ITuser',
    'password': '1c*b3G3525f-',
    'server': '10.10.1.1',
    'database': 'asco4',
    'requestTimeout': 30000,
    'connectionTimeout': 30000,
    'options': {
      'encrypt': false
    }
  },
  kpps: [
    {value: '11002', text: 'Центральная проходная'},
    {value: '11008', text: 'Инженерный корпус'}
  ],
  keys: {
    privkey: '/etc/letsencrypt/live/apps.elem.ru/privkey.pem',
    cert: '/etc/letsencrypt/live/apps.elem.ru/cert.pem',
    chain: '/etc/letsencrypt/live/apps.elem.ru/chain.pem'
  },
  sap: {
    u: 'skud_uem',
    p: 'sRec137K'
  }
}
