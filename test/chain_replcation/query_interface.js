import fs from 'fs';
import crypto from 'crypto';
import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
chai.use(chaiHttp);
import InMemoryStorageLevelDb from '../../lib/inmemory/inmemory_leveldb';
import { ReplicaNode } from '../../lib/chain_replication/ReplicaNode';
import { HttpInterface } from '../../lib/chain_replication/remote/transport/Http';

describe.only('testing http request interface', () => {

  const dbPath = './testdb';
  const { publicKey, privateKey } = generateKeyPair();
  let node;

  before(() => {
    cleanDb(dbPath);
    const db = new InMemoryStorageLevelDb({
      publicKey,
      path: dbPath,
      modulusLength: 1024,
    });
    node = new ReplicaNode(db);
    node.setQueryInterface(new HttpInterface (8000));
  });

  it('', async () => {
    let res = await chai.request('http://localhost:8000')
      .get('/query?key=test');
    console.log(res.body);
    res = await chai.request('http://localhost:8000')
      .post('/update')
      .send({key: 'test', value: 'value'});
    console.log(res.body);
    res = await chai.request('http://localhost:8000')
      .get('/query?key=test');
    console.log(res.body);
  });

  after(() => {
    cleanDb(dbPath);
  });
});

function generateKeyPair() {
  return crypto.generateKeyPairSync('rsa', {
    modulusLength: 1024,
    publicKeyEncoding: {
      type: 'pkcs1',
      format: 'pem',
    },
    privateKeyEncoding: {
      type: 'pkcs1',
      format: 'pem',
    },
  });
}
function cleanDb(path) {
  if (fs.existsSync(path)) {
    fs.readdirSync(path).forEach(p => {
      fs.unlinkSync(`${path}/${p}`);
    });
    fs.rmdirSync(path);
  }
}
