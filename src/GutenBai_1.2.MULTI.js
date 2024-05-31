// Crea más de una propuesta de articulos o contenidos originales en vez de una sola
const DB_URL = 'jdbc:mysql://TU_RUTA_DB';
const USER = 'TU_USER';
const PASS = 'TU_PASSWORD*';
const tableName = 'GenerAIve';
const TW_API_URL = "https://api.trawlingweb.com";
const token = "TU_TRAWLING_TOKEN_APIKEY";
const q = 'site_language:es AND title:("Open AI" OR "openai" OR "chatgpt" OR "chat gpt" OR "dalle" OR "sam altman" OR "the AI" OR
  "la IA" OR "artificial intelligence" OR "inteligencia artificial" OR "google intelligence"~10 OR "google inteligencia"~10 OR
  "amazon intelligence"~10 OR "amazon inteligencia"~10 OR "microsoft intelligence"~10 OR "microsoft inteligencia"~10 OR grok)';
    // Ejemplo para crear colección de contenidos sobre IA en el supuesto en el que queremos crear un contenido sobre IA

function main() {
  var db = connectToDatabase();
  ensureTableAndColumnsExist(db, tableName);

  try {
    var newsData = fetchNewsFromTrawlingweb(token, q);
    if (newsData.length > 0) {
      console.log('newsData:', newsData)
      var generatedNews = generateNews(newsData, "GenerAIve Author");
      if (generatedNews) {
        storeGeneratedNews(db, generatedNews);
      }
    } else {
      console.log('No se encontraron noticias suficientes para generar una nueva.');
    }
  } catch (e) {
    console.error("Error durante la ejecución:", e);
  }

  db.close();
  console.log('Proceso completado y conexión cerrada.');
}

function connectToDatabase() {
  console.log('Estableciendo conexión con la base de datos...');
  return Jdbc.getConnection(DB_URL, USER, PASS);
}

function ensureTableAndColumnsExist(conn, tableName) {
  const requiredColumns = {
    id: "INT AUTO_INCREMENT PRIMARY KEY",
    title: "VARCHAR(255)",
    lead: "VARCHAR(255)",
    text: "TEXT",
    author: "VARCHAR(100)",
    creationDate: "DATETIME",
    lastUpdated: "DATETIME",
    input_tokens: "INT DEFAULT 0",
    output_tokens: "INT DEFAULT 0",
    cost: "FLOAT DEFAULT 0",
    rawNoti: "TEXT"
  };

  const existingColumns = {};

  try {
    const resultSet = conn.getMetaData().getColumns(null, null, tableName, null);
    while (resultSet.next()) {
      const columnName = resultSet.getString("COLUMN_NAME");
      existingColumns[columnName] = resultSet.getString("TYPE_NAME");
    }
    resultSet.close();

    // Crear tabla si no existe
    if (Object.keys(existingColumns).length === 0) {
      var createStmt = conn.createStatement();
      var createSql = `CREATE TABLE IF NOT EXISTS ${tableName} (`;
      for (const column in requiredColumns) {
        createSql += `${column} ${requiredColumns[column]}, `;
      }
      createSql = createSql.slice(0, -2) + ")"; // Eliminar la última coma
      createStmt.executeUpdate(createSql);
      createStmt.close();
      console.log('Tabla creada con todas las columnas necesarias.');
    } else {
      // Verificar y agregar columnas faltantes
      for (const column in requiredColumns) {
        if (!existingColumns[column]) {
          var alterStmt = conn.createStatement();
          var alterSql = `ALTER TABLE ${tableName} ADD COLUMN ${column} ${requiredColumns[column]}`;
          alterStmt.executeUpdate(alterSql);
          alterStmt.close();
          console.log(`Columna ${column} añadida a la tabla.`);
        }
      }
    }
  } catch (e) {
    console.error('Error al asegurar la tabla y las columnas:', e);
  }
}

function fetchNewsFromTrawlingweb(token, query) {
  const days = 1;  // Adjust for the desired time interval, e.g., last hour
  let now = new Date();
  let tsStart = now.getTime() - (days * 24 * 60 * 60 * 1000);
  let tsEnd = now.getTime();
  let qq = encodeURIComponent(query).replace(/%3A/g, ':').replace(/%20/g, ' ');
  let url = `${TW_API_URL}?token=${token}&q=${qq}&ts=${tsStart}&tsi=${tsEnd}&order=desc&size=5`;

  console.log('Consulta URL:', url);

  let continueFetching = true;
  let allNews = [];
  uniqueTitles = new Set();
  while (continueFetching) {
    let response = UrlFetchApp.fetch(url, { 'muteHttpExceptions': true });
    let json = JSON.parse(response.getContentText());

    //console.log('Respuesta de la API:', JSON.stringify(json, null, 2));

    if (json && json.response && json.response.data && json.response.data.length > 0) {
      let concatenatedNews = json.response.data.filter(item => {
        // Filtramos noticias con títulos únicos
        console.log("Longitud del texto:", item.text.length);
        if (!uniqueTitles.has(item.title) && item.text.length < 6000) {
          uniqueTitles.add(item.title);
          return true;
        }
        console.log('JUMP')
        return false;
      }).map(item => {
        delete item.site
        delete item.site_region
        delete item.site_type
        delete item.author
        delete item.crawled
        delete item.unique_visitors
        delete item.site_language
        delete item.language
        delete item.published
        delete item.site_section
        delete item.url
        delete item.rank
        delete item.value
        delete item.id
        delete item.domain
        delete item.section
        delete item.site_country
        return item
      });
      allNews = allNews.concat(concatenatedNews);
      //console.log(allNews)
      if (json.next) {
        url = json.next;
      } else {
        continueFetching = false;
      }
    } else {
      console.log('No se encontraron datos en la respuesta de la API:', json);
      continueFetching = false;
    }
  }
  console.log('Noticias obtenidas hasta ahora:', allNews.length);

  return JSON.stringify(allNews);
}

function generateNews(newsData, author) {
  var openaiApiKey = 'OPENAI_AIPKEY_AQUI';  // Asegúrate de poner tu clave de API aquí
  var headers = {
    "Authorization": "Bearer " + openaiApiKey,
    "Content-Type": "application/json"
  };
  const baseUrl = "https://api.openai.com/v1/chat/completions";
  console.log('newsData:', newsData)

  var prompt = `
  Misión: 
     1.- Te estamos entregando noticias para que tengas contexto en el cumplimiento de tu misión. Cada elemento que te enviamos es una noticia.
     2.- Crea un nuevo artículo utilizando el conomicimiento aportado con las noticias que te hemos entregado.
  Características del artículo: 
     1.- Ha de mezclar información e ideas de los artículos aportados.
     2.- Debe profundizar el tema a tratar y ser extenso.
     3.- Puede contener ejemplos y recursos.
     4.- Núnca puede tener menos de tres mil caractéres.
     5.- Ha de tener párrafos de inicio, nudo y desenlace.
     6.- No crees pequeños resúmenes de cada artículo aportado, crea un artículo estructurado,lógico, inteligente y con buena redacción.
     7.- MUY importante, evita terminos como "Por otro lado,", "Finalmente,", "En resumen,", "En esta ocasión", "En el ámbito", "Además,"
     8.- Presta mucha atención en los datos numéricos
     9.- Si puedes crea listas de conceptos.
     10.- Ha de tener como mínimo 12 párrafos.
  Formato de entrega: JSON
  Estructura: {noticia:{title:"",lead:"",text:""}]}
  Artículos aportados en formato JSON:
    ${newsData}
  `;

  var payload = JSON.stringify({
    model: "gpt-3.5-turbo",
    messages: [
      { "role": "system", "content": "Eres un experto redactor de noticias, un gran escritor, divertido y un poco sarcástico." },
      { "role": "user", "content": prompt }
    ],
    temperature: 0,
    max_tokens: 3024
  });

  var options = {
    "method": "post",
    "headers": headers,
    "payload": payload,
    "muteHttpExceptions": true
  };

  var response = UrlFetchApp.fetch(baseUrl, options);
  if (response.getResponseCode() === 200) {
    var responseBody = JSON.parse(response.getContentText());
    var content = responseBody.choices[0].message.content;

    var now = new Date();
    var formattedCreationDate = formatDateToMySQL(now);
    var inputTokens = responseBody.usage.total_tokens || 0;
    var outputTokens = responseBody.usage.completion_tokens || 0;
    var cost = calculateCost(inputTokens, outputTokens);
    const perInsert = {
      title: "Título generado",
      lead: "Entradilla generada",
      text: content,
      author: author,
      creationDate: formattedCreationDate,
      lastUpdated: formattedCreationDate,
      inputTokens: inputTokens,
      outputTokens: outputTokens,
      cost: cost,
      rawNoti: newsData
    };
    console.log("perInsert::", perInsert)
    return perInsert
  } else {
    console.error('Error al generar noticia:', response.getContentText());
    return null;
  }
}

function formatDateToMySQL(date) {
  return date.toISOString().slice(0, 19).replace('T', ' ');
}

function calculateCost(inputTokens, outputTokens) {
  const pricePerInputToken = 0.0000005;
  const pricePerOutputToken = 0.0000015;
  return (inputTokens * pricePerInputToken) + (outputTokens * pricePerOutputToken);
}

function storeGeneratedNews(conn, news) {
  var sql = `INSERT INTO ${tableName} (title, lead, text, author, creationDate, lastUpdated, input_tokens, output_tokens, cost, rawNoti) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  try {
    var stmt = conn.prepareStatement(sql);
    stmt.setString(1, news.title);
    stmt.setString(2, news.lead);
    stmt.setString(3, news.text);
    stmt.setString(4, news.author);
    stmt.setString(5, news.creationDate);
    stmt.setString(6, news.lastUpdated);
    stmt.setInt(7, news.inputTokens);
    stmt.setInt(8, news.outputTokens);
    stmt.setDouble(9, news.cost);
    stmt.setString(10, news.rawNoti);
    stmt.executeUpdate();
  } catch (e) {
    console.error('Error al insertar datos:', e);
  } finally {
    if (stmt) stmt.close();
  }
}
