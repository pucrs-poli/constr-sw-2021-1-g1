const supertest = require('supertest');
const app = require('../app');
const mongoose = require("mongoose");


beforeAll((done) => {
    // usar rota de POST aqui pra adicionar dados de teste, adicionar pelo menos 1 building
    // atribuir o valor do id de um objeto criado para buildingID
    mongoose.connect("mongodb://127.0.0.1:27017/predios",
    { useNewUrlParser: true, useUnifiedTopology: true },
    () => done());
  });
  
  afterAll((done) => {
    // usar rota de DELETE aqui pra remover os dados de teste, remover buildings adicionados ali no início
    // limpar o valor de buildingID
    //mongoose.connection.db.dropDatabase(() => {
    //    mongoose.connection.close(() => done())
    //  });
  });

test("Should return a list of existing buildings from complex queries", async () => {
    //const post = await Post.create({ title: "Post 1", content: "Lorem ipsum" });
  
    await supertest(app).get("/api/buildings/findBy")
      .query({
        floors: 10,
        name: "Prédio 32",
        description: "Escola Politécnica da PUCRS",
        maxCapacity: 5000
      })
      .expect(200)
      .then((response) => {
        // Check type and length
        expect(Array.isArray(response.body)).toBeTruthy();
        expect(response.body.length).toEqual(2);
  
        // Check data
        expect(response.body[0].floors).toBe(10);
        expect(response.body[0].name).toBe("Prédio 32");
        expect(response.body[0].description).toBe("Escola Politécnica da PUCRS");
        expect(response.body[0].maxCapacity).toBe(5000);
      });
  });

  test("Should return empty list from complex queries", async ()=>{
    await supertest(app).get("/api/buildings/findBy")
        .query({})
        .expect(200)
        .then((response)=>{
            expect(Array.isArray(response.body)).toBeTruthy;
            expect(response.body.length).toEqual(0);        
        });
  });

  test("Should return a list of existing buildings from simple query", async () => {
    //const post = await Post.create({ title: "Post 1", content: "Lorem ipsum" });
  
    await supertest(app).get("/api/buildings")
      .query({
        name: "Prédio 32"
      })
      .expect(200)
      .then((response) => {
        // Check type and length
        expect(Array.isArray(response.body)).toBeTruthy();
        expect(response.body.length).toEqual(2);
  
        // Check data
        expect(response.body[0].floors).toBe(10);
        expect(response.body[0].name).toBe("Prédio 32");
        expect(response.body[0].description).toBe("Escola Politécnica da PUCRS");
        expect(response.body[0].maxCapacity).toBe(5000);
      });
    });
  
    test("Should return empty list from simple query", async ()=>{
        await supertest(app).get("/api/buildings/")
            .query({})
            .expect(200)
            .then((response)=>{
                expect(Array.isArray(response.body)).toBeTruthy;
                expect(response.body.length).toEqual(0);        
            });
      });