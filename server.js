// server.js
const express = require("express");
const cors = require("cors");
const oracledb = require("oracledb");

const app = express();
app.use(cors());
app.use(express.json());

const dbConfig = {
  user: "C##LESBY_USER",
  password: "bingo",
  connectString: "localhost:1521/FREE"
};

app.post("/register", async (req, res) => {
  const { nazwa, imie, nazwisko, email, tel, haslo } = req.body;
  try {
    const conn = await oracledb.getConnection(dbConfig);
    await conn.execute(
      `INSERT INTO UZYTKOWNIK
        (NAZWA_UZYT, IMIE, NAZWISKO, EMAIL, NR_TEL, HASLO)
       VALUES (:nazwa, :imie, :nazwisko, :email, :tel, :haslo)`,
      { nazwa, imie, nazwisko, email, tel, haslo },
      { autoCommit: true }
    );
    await conn.close();
    res.json({ status: "ok" });
  } catch (err) {
    console.error(err);
    res.json({ status: "blad" });
  }
});

app.post("/login", async (req, res) => {
  const { login, haslo } = req.body;
  try {
    const conn = await oracledb.getConnection(dbConfig);
    const result = await conn.execute(
      `SELECT ID_UZYT, NAZWA_UZYT FROM UZYTKOWNIK
       WHERE NAZWA_UZYT = :login AND HASLO = :haslo`,
      { login, haslo },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    await conn.close();

    if (result.rows.length > 0)
      res.json({ status: "ok", user: result.rows[0] });
    else
      res.json({ status: "blad" });
  } catch (err) {
    console.error(err);
    res.json({ status: "blad" });
  }
});

app.post("/gra", async (req, res) => {
  const { Id_uzyt, data_start, data_koniec } = req.body;
  if (!Id_uzyt || !data_start || !data_koniec) {
    return res.status(400).json({ error: "Brak danych" });
  }

  try {
    const conn = await oracledb.getConnection(dbConfig);
    await conn.execute(
      `INSERT INTO GRA (ID_UZYT, DATA_START, DATA_KONIEC)
       VALUES (:id, TO_TIMESTAMP(:start, 'YYYY-MM-DD HH24:MI:SS'), TO_TIMESTAMP(:koniec, 'YYYY-MM-DD HH24:MI:SS'))`,
      {
        id: Id_uzyt,
        start: data_start,
        koniec: data_koniec
      },
      { autoCommit: true }
    );
    await conn.close();
    res.json({ status: "ok" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Błąd serwera" });
  }
});

app.get("/ranking-today", async (req, res) => {
  try {
    const conn = await oracledb.getConnection(dbConfig);

    const today = new Date();
    today.setHours(0,0,0,0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const sql = `
      SELECT g.ID_UZYT, u.NAZWA_UZYT as nazwa_uzyt, g.DATA_START as data_start, g.DATA_KONIEC as data_koniec
      FROM GRA g
      JOIN UZYTKOWNIK u ON g.ID_UZYT = u.ID_UZYT
      WHERE g.DATA_START >= TO_TIMESTAMP(:startDate, 'YYYY-MM-DD HH24:MI:SS')
        AND g.DATA_START < TO_TIMESTAMP(:endDate, 'YYYY-MM-DD HH24:MI:SS')
      ORDER BY (g.DATA_KONIEC - g.DATA_START)
    `;

    const binds = {
      startDate: today.toISOString().slice(0,19).replace('T',' '),
      endDate: tomorrow.toISOString().slice(0,19).replace('T',' ')
    };

    const result = await conn.execute(sql, binds, { outFormat: oracledb.OUT_FORMAT_OBJECT });
    await conn.close();

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => console.log("Server działa na porcie 3000"));

app.listen(3000, () => console.log("API działa"))