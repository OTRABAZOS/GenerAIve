# ENG: Automatic News Generation with Trawlingweb and OpenAI
This project aims to create original and novel news using data obtained from the Trawlingweb API and OpenAI's GPT LLM. The application automates the process of news collection, content generation, and storage in a database.

## Project Description

The project is designed to perform the following tasks:

1. **Database Connection**: Connects to a MySQL database to store the generated news.
2. **Querying the Trawlingweb API**: Retrieves news based on a specific query.
3. **News Generation**: Uses an OpenAI GPT model to generate original content from the retrieved news.
4. **News Storage**: Saves the generated news in the database.

**Technologies Used**

- **[Trawlingweb](https://www.trawlingweb.com)**: A system that captures and processes over 18 million pieces of information with real-time current content. It allows creating the desired content set through its API to prepare them for the prompt.

- **[OpenAI](https://www.openai.com)**: Uses OpenAI's GPT-3.5 model, a powerful natural language processing tool that generates original and coherent content from the provided data. This model can interpret and synthesize information to create high-quality news articles.

- **MySQL Database**: A relational database management system used to store the generated news. MySQL provides a robust and scalable solution to manage large volumes of data, ensuring data integrity and accessibility.

**Requirements**

To use this project, you need:

1. An API key from [Trawlingweb](https://www.trawlingweb.com).
2. An API key from [OpenAI](https://www.openai.com).

## Code Structure

### Configuration

```javascript
const DB_URL = 'jdbc:mysql://YOUR_DB_URL';
const USER = 'YOUR_USER';
const PASS = 'YOUR_PASSWORD*';
const tableName = 'GenerAIve';
const TW_API_URL = "https://api.trawlingweb.com";
const token = "YOUR_TRAWLINGWEB_API_KEY";
const q = 'site_language:es AND title:("Open AI" OR "openai" OR "chatgpt" OR "chat gpt" OR "dalle" OR "sam altman" OR "the AI" OR "la IA" OR "artificial intelligence" OR "inteligencia artificial" OR "google intelligence"~10 OR "google inteligencia"~10 OR "amazon intelligence"~10 OR "amazon inteligencia"~10 OR "microsoft intelligence"~10 OR "microsoft inteligencia"~10 OR grok)'; // Example to create a content collection about AI if we want to create content about AI
```

### Main Functions

#### Database Connection

```javascript
function connectToDatabase() {
  console.log('Establishing connection to the database...');
  return Jdbc.getConnection(DB_URL, USER, PASS);
}
```

#### Table Verification and Creation

```javascript
function ensureTableAndColumnsExist(conn, tableName) {
  // Definition of required columns and their creation if they do not exist
}
```

#### Fetching News from Trawlingweb

```javascript
function fetchNewsFromTrawlingweb(token, query) {
  // Logic to query the Trawlingweb API and process the retrieved data
}
```

#### Generating News with OpenAI

```javascript
function generateNews(newsData, author) {
  // Using the OpenAI API to generate content from the retrieved news
}
```

#### Storing Generated News

```javascript
function storeGeneratedNews(conn, news) {
  // Inserting the generated news into the database
}
```

### Main Flow

```javascript
function main() {
  var db = connectToDatabase();
  ensureTableAndColumnsExist(db, tableName);

  try {
    var newsData = fetchNewsFromTrawlingweb(token, q);
    if (newsData.length > 0) {
      console.log('newsData:', newsData);
      var generatedNews = generateNews(newsData, "GenerAIve Author");
      if (generatedNews) {
        storeGeneratedNews(db, generatedNews);
      }
    } else {
      console.log('Not enough news found to generate a new one.');
    }
  } catch (e) {
    console.error("Error during execution:", e);
  }

  db.close();
  console.log('Process completed and connection closed.');
}
```

## Configuration

1. **Database**: Make sure you have a MySQL database configured and accessible with the credentials provided in the script.
2. **Trawlingweb API**: You will need a valid access token for the Trawlingweb API.
3. **OpenAI API**: You must have a valid API key for OpenAI.

## Execution

To run the project, make sure you have all the necessary dependencies and execute the main `main` script. This will start the complete flow of collecting, generating, and storing news.

## Notes

- Ensure to handle database credentials and API keys securely.
- The structure and format of the generated news can be adjusted according to specific needs.

## License

This project is licensed under the terms of the MIT License. See the `LICENSE` file for more details.

***



# ESP: Generación Automática de Noticias con Trawlingweb y OpenAI

Este proyecto tiene como objetivo la creación de noticias originales y novedosas utilizando datos obtenidos de la API de Trawlingweb y LLM GPT de OpenAI. La aplicación automatiza el proceso de recopilación de noticias, generación de contenido y almacenamiento en una base de datos.

## Descripción del Proyecto

El proyecto está diseñado para realizar las siguientes tareas:

1. **Conexión a la base de datos**: Conecta a una base de datos MySQL para almacenar las noticias generadas.
2. **Consulta a la API de Trawlingweb**: Recupera noticias basadas en una consulta específica.
3. **Generación de Noticias**: Utiliza un modelo GPT de OpenAI para generar contenido original a partir de las noticias recuperadas.
4. **Almacenamiento de Noticias**: Guarda las noticias generadas en la base de datos.

**Tecnologías Usadas**

- **[Trawlingweb](https://www.trawlingweb.com)**: Sistema que captura y procesa más de 18 millones de informaciones con contenidos actuales en tiempo real. Permite crear el conjunto de contenidos que deseamos mediante su API para prepararlos para el prompt.

- **[OpenAI](https://www.openai.com)**: Utiliza el modelo GPT-3.5 de OpenAI, una potente herramienta de procesamiento de lenguaje natural que genera contenido original y coherente a partir de los datos proporcionados. Este modelo es capaz de interpretar y sintetizar información para crear noticias de alta calidad.

- **Base de Datos MySQL**: Sistema de gestión de bases de datos relacional utilizado para almacenar las noticias generadas. MySQL proporciona una solución robusta y escalable para gestionar grandes volúmenes de datos, asegurando la integridad y accesibilidad de la información.

**Requisitos**

Para utilizar este proyecto, es necesario tener:

1. Una clave API de [Trawlingweb](https://www.trawlingweb.com).
2. Una clave API de [OpenAI](https://www.openai.com).


## Estructura del Código

### Configuración

```javascript
const DB_URL = 'jdbc:mysql://TU_RUTA_DB';
const USER = 'TU_USER';
const PASS = 'TU_PASSWORD*';
const tableName = 'GenerAIve';
const TW_API_URL = "https://api.trawlingweb.com";
const token = "TU_TRAWLING_TOKEN_APIKEY";
const q = 'site_language:es AND title:("Open AI" OR "openai" OR "chatgpt" OR "chat gpt" OR "dalle" OR "sam altman" OR "the AI" OR "la IA" OR "artificial intelligence" OR "inteligencia artificial" OR "google intelligence"~10 OR "google inteligencia"~10 OR "amazon intelligence"~10 OR "amazon inteligencia"~10 OR "microsoft intelligence"~10 OR "microsoft inteligencia"~10 OR grok)'; // Ejemplo para crear colección de contenidos sobre IA en el supuesto en el que queremos crear un contenido sobre IA
```

### Funciones Principales

#### Conexión a la Base de Datos

```javascript
function connectToDatabase() {
  console.log('Estableciendo conexión con la base de datos...');
  return Jdbc.getConnection(DB_URL, USER, PASS);
}
```

#### Verificación y Creación de Tabla

```javascript
function ensureTableAndColumnsExist(conn, tableName) {
  // Definición de columnas requeridas y su creación si no existen
}
```

#### Recuperación de Noticias desde Trawlingweb

```javascript
function fetchNewsFromTrawlingweb(token, query) {
  // Lógica para consultar la API de Trawlingweb y procesar los datos recuperados
}
```

#### Generación de Noticias con OpenAI

```javascript
function generateNews(newsData, author) {
  // Uso de la API de OpenAI para generar contenido a partir de las noticias recuperadas
}
```

#### Almacenamiento de Noticias Generadas

```javascript
function storeGeneratedNews(conn, news) {
  // Inserción de las noticias generadas en la base de datos
}
```

### Flujo Principal

```javascript
function main() {
  var db = connectToDatabase();
  ensureTableAndColumnsExist(db, tableName);

  try {
    var newsData = fetchNewsFromTrawlingweb(token, q);
    if (newsData.length > 0) {
      console.log('newsData:', newsData);
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
```

## Configuración

1. **Base de Datos**: Asegúrate de tener una base de datos MySQL configurada y accesible con las credenciales proporcionadas en el script.
2. **API de Trawlingweb**: Necesitarás un token de acceso válido para la API de Trawlingweb.
3. **API de OpenAI**: Debes tener una clave de API válida para OpenAI.

## Ejecución

Para ejecutar el proyecto, asegúrate de tener todas las dependencias necesarias y ejecuta el script principal `main`. Esto iniciará el flujo completo de recopilación, generación y almacenamiento de noticias.

## Notas

- Asegúrate de manejar las credenciales de la base de datos y las claves de API de forma segura.
- La estructura y el formato de las noticias generadas pueden ser ajustados según las necesidades específicas.

## Licencia

Este proyecto está licenciado bajo los términos de la Licencia MIT. Consulta el archivo `LICENSE` para más detalles.
