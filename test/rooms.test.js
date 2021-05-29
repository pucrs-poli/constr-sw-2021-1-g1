const request = require('supertest');
const app = require('../app');

// Information to be used in the tests below;
let roomID = '60b1be52192c2767d666b3c3';

beforeAll(() => {
  // usar rota de POST aqui pra adicionar dados de teste, adicionar pelo menos 1 room
  // atribuir o valor do id de um objeto criado para roomID
});

afterAll(() => {
  // usar rota de DELETE aqui pra remover os dados de teste, remover rooms adicionados ali no início
  // limpar o valor de roomID
});

test('should update an existing room and return code 200', async () => {
  await request(app)
    .put(`/api/rooms/${roomID}`)
    .send({
      number: 104,
      description: 'Sala possui 3 projetores',
      maxCapacity: 100,
      type: 'Auditório',
    })
    .expect(200);
});

test('should update attributes of an existing room', async () => {
  await request(app)
    .patch(`/api/rooms/${roomID}`)
    .send({
      type: 'Sala',
    })
    .expect(200);
});
