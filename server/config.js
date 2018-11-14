module.exports = {
  mariadb: {
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
    'server': '10.10.4.203',
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
    privkey: '/home/nightwelf/apps.elem.ru/privkey1.pem',
    cert: '/home/nightwelf/apps.elem.ru/cert1.pem',
    chain: '/home/nightwelf/apps.elem.ru/chain1.pem'
  }
}
