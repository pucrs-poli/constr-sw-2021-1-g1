const request = require('supertest');
const app = require('../app');

// Information to be used in the tests below;
let buildingID = '60b1afd2192c2767d666b3c1'; // temporário, troque por um ID válido local, deixar só let buildingID; quando tiver o beforeAll e afterAll funcionando

beforeAll(() => {
  // usar rota de POST aqui pra adicionar dados de teste, adicionar pelo menos 1 building
  // atribuir o valor do id de um objeto criado para buildingID
});

afterAll(() => {
  // usar rota de DELETE aqui pra remover os dados de teste, remover buildings adicionados ali no início
  // limpar o valor de buildingID
});

test('should update an existing building and return code 200', async () => {
  await request(app)
    .put(`/api/buildings/${buildingID}`)
    .send({
      floors: 5,
      name: 'Prédio 32',
      description: 'Escola Politécnica da PUCRS',
      maxCapacity: 4999,
    })
    .expect(200);
});

test('should not update an building that does not exist', async () => {
  let invalidBuildingID = '60b155555555555555555';

  await request(app)
    .put(`/api/buildings/${invalidBuildingID}`)
    .send({
      floors: 5,
      name: 'Prédio 32',
      description: 'Escola Politécnica da PUCRS',
      maxCapacity: 4999,
    })
    .expect(404);
});

test('should update attributes of an existing building', async () => {
  await request(app)
    .patch(`/api/buildings/${buildingID}`)
    .send({
      name: 'Prédio 12',
    })
    .expect(200);
});

test('should not update an attribute that does not exist', async () => {
  await request(app)
    .patch(`/api/buildings/${buildingID}`)
    .send({
      attribute: 'Prédio 22',
    })
    .expect(412);
});

test('should not update attributes from a building that does not exist', async () => {
  let invalidBuildingID = '60b155555555555555555';

  await request(app)
    .patch(`/api/buildings/${invalidBuildingID}`)
    .send({
      attribute: 'Prédio 22',
    })
    .expect(404);
});
