var elasticsearch = require("elasticsearch");

var elasticClient = new elasticsearch.Client({
  host: "localhost:9200",
  log: "info",
});

var indexName = "randomindex";

/**
 * Delete an existing index
 */
function deleteIndex() {
  return elasticClient.indices.delete({
    index: indexName,
  });
}
exports.deleteIndex = deleteIndex;

/**
 * create the index
 */
function initIndex() {
  return elasticClient.indices.create({
    index: indexName,
  });
}
exports.initIndex = initIndex;

/**
 * check if the index exists
 */
function indexExists() {
  return elasticClient.indices.exists({
    index: indexName,
  });
}
exports.indexExists = indexExists;

function initMapping() {
  return elasticClient.indices.putMapping({
    index: indexName,
    type: "document",
    body: {
      properties: {
        title: { type: "text" },
        content: { type: "text" },
        firstName: {
          type: "completion",
          analyzer: "simple",
          search_analyzer: "simple",
        },
      },
    },
  });
}
exports.initMapping = initMapping;

function addDocument(document) {
  return elasticClient.index({
    index: indexName,
    type: "document",
    body: {
      title: document.title,
      content: document.content,
      firstName: {
        input: document.title.split(" "),
      },
    },
  });
}
exports.addDocument = addDocument;

function getSuggestions(input) {
  return elasticClient.search({
    index: indexName,
    type: "document",
    body: {
      suggest: {
        songsuggest: {
          prefix: input,
          completion: {
            field: "firstName",
          },
        },
      },
    },
  });
}
exports.getSuggestions = getSuggestions;
