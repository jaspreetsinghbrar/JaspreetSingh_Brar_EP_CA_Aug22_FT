const request = require("supertest");
const app = require("../app");
const db = require("../models/index");

describe("Todo API", () => {
  let token;
  let tokenAdmin;

  afterAll(async () => {
    await db.sequelize.sync({ force: true });
  });

  describe("1. POST /setup", () => {
    it("should setup the DB and return 200 if success or 400 if fail status code", async () => {
      const res = await request(app).post("/setup").send();
        expect(res.statusCode).toEqual(200);
    });
  });

  describe("2. POST /signup", () => {
    it("should create a new user and return 200 status code", async () => {
      const res = await request(app).post("/signup").send({
        username: "test",
        email: "test@gmail.com",
        password: "1234",
      });

      expect(res.statusCode).toEqual(201);
    });
  });

  describe("3. POST /login", () => {
    it("should login new user and return 200 status code", async () => {
      const res = await request(app).post("/login").send({
        username: "test",
        password: "1234",
      });
      token = res.body.token;
      expect(res.statusCode).toEqual(200);
    });
  });

  describe("4. POST /category", () => {
    it("should create a new category return 201 status code", async () => {
      const resAdmin = await request(app).post("/login").send({
        username: "Admin",
        password: "P@ssword2023",
      });
      tokenAdmin = resAdmin.body.token;

      const res = await request(app)
        .post("/category")
        .send({
          name: "CAT_TEST",
        })
        .set("Authorization", `Bearer ${tokenAdmin}`);
      expect(res.statusCode).toEqual(201);
    });
  });

  describe("5. POST /item", () => {
    it("should create a new item return 201 status code", async () => {
      const category = await db.Category.findOne({
        where: { name: "CAT_TEST" },
      });

      const res = await request(app)
        .post("/item")
        .send({
          name: "ITEM_TEST",
          price: 20,
          stockQuantity: 4,
          sku: "TE122",
          categoryId: category.id,
        })
        .set("Authorization", `Bearer ${tokenAdmin}`);
      expect(res.statusCode).toEqual(201);
    });
  });

  describe("6. POST /search", () => {
    it("should search 3 items at least and return 200 status code", async () => {
      const res = await request(app).post("/search").send({
        type: "item",
        keyword: "mart",
      });
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveLength(3);
    });
  });

  describe("7. POST /search", () => {
    it("should search 3 items at least and return 200 status code", async () => {
      const res = await request(app).post("/search").send({
        type: "item",
        keyword: "Laptop",
      });

      expect(res.statusCode).toEqual(200);
    });
  });

  describe("8. Test the Admin user endpoints with a normal user", () => {
    it("should return 401 status code", async () => {
      const res = await request(app)
        .post("/category")
        .send({
          name: "CAT_TEST",
        })
        .set("Authorization", `Bearer ${token}`);

      expect(res.statusCode).toEqual(401);
    });

    it("should return 401 status code", async () => {
      const res = await request(app)
        .put("/category/:id")
        .send({
          name: "CAT_TEST",
        })
        .set("Authorization", `Bearer ${token}`);

      expect(res.statusCode).toEqual(401);
    });

    it("should return 401 status code", async () => {
      const res = await request(app)
        .delete("/category/1")
        .send()
        .set("Authorization", `Bearer ${token}`);

      expect(res.statusCode).toEqual(401);
    });
  });

  describe("9.  Delete all the values added by tests", () => {
    it("should return 200 status code", async () => {
      const item = await db.Items.findOne({
        where: { name: "ITEM_TEST" },
      });

      const res = await request(app)
        .delete(`/item/${item.id}`)
        .send()
        .set("Authorization", `Bearer ${tokenAdmin}`);

      expect(res.statusCode).toEqual(200);
    });

    it("should return 200 status code", async () => {
      const category = await db.Category.findOne({
        where: { name: "CAT_TEST" },
      });

      const res = await request(app)
        .delete(`/category/${category.id}`)
        .send()
        .set("Authorization", `Bearer ${tokenAdmin}`);

      expect(res.statusCode).toEqual(200);
    });

    it("should delete user 'test' ", async () => {
      db.User.destroy({
        where: {
          username: "test",
        },
      });
    });
  });

  describe("10. POST /setup", () => {
    it("should setup the DB and return  400 status code", async () => {
      const res = await request(app).post("/setup").send();
      expect(res.statusCode).toEqual(400);
    });
  });
});
