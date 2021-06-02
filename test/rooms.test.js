const request = require('supertest');
const app = require('../app');
const STATUS_CODE = require('../utils/constants');

// Information to be used in the tests below;
let roomID = '60b1be52192c2767d666b3c3';
let buildingID = '60b6c7503c708973d8483098';
let invalidRoomID = '60b155555555555555555';
let postAndDeleteIDs;

beforeAll(async () => {
  // usar rota de POST aqui pra adicionar dados de teste, adicionar pelo menos 1 room

  const building = await request(app).post('/api/buildings/').send({
    floors: 8,
    name: 'Prédio 12',
    description: 'Escola Politécnica da PUCRS',
    maxCapacity: 4999,
  });
  buildingID = building.body.id;

  // atribuir o valor do id de um objeto criado para roomID
  const room = await request(app)
    .post('/api/rooms/')
    .send({
      buildingID,
      number: 104,
      description: 'Sala possui 3 projetores',
      maxCapacity: 100,
      type: 'Auditório',
    });
  roomID = room.body['_id'];
});

afterAll(async () => {
  // usar rota de DELETE aqui pra remover os dados de teste, remover rooms adicionados ali no início
  // limpar o valor de roomID
  await request(app)
    .delete(`/api/rooms/${roomID}`);
  
  await request(app).delete(`/api/buildings/${buildingID}`);
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
    buildingID,
    floors: 8,
    name: 'Prédio 25',
    description: 'teste',
    maxCapacity: 3000,
  })
  .expect(201);
  postAndDeleteIDs = room.body['_id'];
});

test('should delete the room and return 204', async () => {
  console.log('postAndDeleteIDs', postAndDeleteIDs);
  await request(app)
  .delete(`/api/rooms/${postAndDeleteIDs}`)
  .expect(204);
});

test('should not find any room with this ID and return not found', async () => {
  await request(app)
  .delete(`/api/rooms/${invalidRoomID}`)
  .expect(STATUS_CODE.not_found);
});