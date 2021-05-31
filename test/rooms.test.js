const request = require('supertest');
const app = require('../app');

// Information to be used in the tests below;
let roomID = '60b1be52192c2767d666b3c3';
let invalidRoomID = '60b155555555555555555';
let postAndDeleteIDs;

beforeAll(async () => {
  // usar rota de POST aqui pra adicionar dados de teste, adicionar pelo menos 1 room
  // atribuir o valor do id de um objeto criado para roomID
  const room = await request(app)
    .post('/api/rooms/')
    .send({
      number: 104,
      description: 'Sala possui 3 projetores',
      maxCapacity: 100,
      type: 'Auditório',
    });
    roomID = room.body.id;
});

afterAll(() => {
  // usar rota de DELETE aqui pra remover os dados de teste, remover rooms adicionados ali no início
  // limpar o valor de roomID
  request(app)
  .delete(`/api/rooms/${roomID}`);
});

test('test get of all rooms and return code 200', async () => {
  await request(app)
    .get(`/api/rooms/all`)
    .expect(200);
});

test('test the get by id, using the ID from the rooms added at beforeAll', async () => {
  await request(app)
    .get(`/api/rooms/${roomID}`)
    .expect(200);
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

test('should not update a room that does not exist', async () => {

  await request(app)
    .put(`/api/rooms/${invalidRoomID}`)
    .send({
      number: 104,
      description: 'Sala possui 3 projetores',
      maxCapacity: 100,
      type: 'Auditório',
    })
    .expect(404);
});

test('should update attributes of an existing room', async () => {
  await request(app)
    .patch(`/api/rooms/${roomID}`)
    .send({
      type: 'Sala',
    })
    .expect(200);
});

test('should not update an attribute that does not exist', async () => {
  await request(app)
    .patch(`/api/rooms/${roomID}`)
    .send({
      room_type: 'Sala',
    })
    .expect(412);
});

test('should post the room and return 201', async () => {
  const room = await request(app)
  .post('/api/rooms/')
  .send({
    floors: 8,
    name: 'Prédio 25',
    description: 'teste',
    maxCapacity: 3000,
  })
  .expect(201);
  postAndDeleteIDs = room.body.id;
});

test('should delete the room and return 200', async () => {
  await request(app)
  .delete(`/api/rooms/${postAndDeleteIDs}`)
  .expect(200);
});

test('should not found any rom with this ID and return not found', async () => {
  await request(app)
  .delete(`/api/rooms/${invalidRoomID}`)
  .expect(STATUS_CODE.not_found);
});