import exp from "constants";
import supertest from "supertest";
import app from "../src/index";

const api = supertest(app);

describe("POST /fruits", () => {
  it("Se o body estiver errado deve retornar status 422 com os erros.", async () => {
    const createBody = { name: "Abacaxi", price: "R$50" };
    const result = await api.post("/fruits").send(createBody);
    expect(result.status).toEqual(422);
    expect(result.body).toMatchObject({
      error: expect.any(String),
    });
  });

  it("Se a fruta ja existir deve retornar status 409", async () => {
    const createBody = { name: "Banana", price: 100 };
    await api.post("/fruits").send(createBody);

    const result = await api.post("/fruits").send(createBody);
    expect(result.status).toEqual(409);
  });

  it("Deve retornar status 201 se o body estiver correto e a fruta não existir", async () => {
    const createBody = { name: "Melão", price: 60 };
    const result = await api.post("/fruits").send(createBody);

    expect(result.status).toEqual(201);
  });
});

describe("GET /fruits", () => {
  it("Deve retornar status 200 com o array de frutas", async () => {
    const result = await api.get("/fruits");

    expect(result.status).toEqual(200);
    expect(result.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(Number),
          name: expect.any(String),
          price: expect.any(Number),
        }),
      ])
    );
  });
});

describe("GET /fruits/:id", () => {
  it("Deve retornar status 404 se o id nao exitir", async () => {
    const result = await api.get("/fruits/10");

    expect(result.status).toEqual(404)
  });

  it("Deve retornar status 200 com a fruta", async () => {
    const result = await api.get("/fruits/1");

    expect(result.status).toEqual(200)
    expect(result.body).toMatchObject({
        id:expect.any(Number),
        name:expect.any(String),
        price:expect.any(Number),
    })
    
  });
});
