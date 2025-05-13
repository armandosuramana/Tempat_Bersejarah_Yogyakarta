// store.js
import { createStore } from "vuex";

export default createStore({
  state: {
    visualisasi_graph: [],
  },

  mutations: {
    setVisualisasiGraph(state, data) {
      state.visualisasi_graph = data;
    },
  },

  actions: {
    async fetchGraphData({ commit }) {
      const query = `
        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
        PREFIX owl: <http://www.w3.org/2002/07/owl#>
        PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>

        SELECT ?source ?relation ?target
        WHERE {
          ?source rdfs:subClassOf ?target. 
          BIND("subClassOf" AS ?relation)
          FILTER (!isBlank(?source))
          FILTER (!isBlank(?target))
          FILTER NOT EXISTS { ?source owl:intersectionOf ?list }
          FILTER NOT EXISTS { ?target owl:intersectionOf ?list }
          FILTER (STRSTARTS(STR(?source), "http://") || STRSTARTS(STR(?source), "https://"))
          FILTER (STRSTARTS(STR(?target), "http://") || STRSTARTS(STR(?target), "https://"))
        }
      `;
      const encodedQuery = encodeURIComponent(query);
      const url = `http://localhost:3030/TempatBersejarah/query?query=${encodedQuery}`;

      try {
        const response = await fetch(url, {
          headers: {
            Accept: "application/sparql-results+json",
          },
        });

        const json = await response.json();

        const results = json.results.bindings.map((item) => ({
          source: item.source.value,
          target: item.target.value,
          relation: item.relation.value,
        }));

        console.log("Hasil dari SPARQL:", results);
        commit("setVisualisasiGraph", results);
      } catch (error) {
        console.error("Gagal mengambil data visualisasi:", error);
      }
    },

    async fetchIndividualsByClass(_, className) {
      const query = `
        PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
        PREFIX tb: <http://ukdw.ac.id/ontologi/tempatbersejarah#>

        SELECT ?individual
        WHERE {
          ?individual rdf:type tb:${className} .
          FILTER (STRSTARTS(STR(?individual), "http://") || STRSTARTS(STR(?individual), "https://"))
        }
      `;

      const encodedQuery = encodeURIComponent(query);
      const url = `http://localhost:3030/TempatBersejarah/query?query=${encodedQuery}`;

      try {
        const response = await fetch(url, {
          headers: {
            Accept: "application/sparql-results+json",
          },
        });

        const json = await response.json();

        // Buat map unik berdasarkan nama hasil format
        const uniqueMap = new Map();

        json.results.bindings.forEach((b) => {
          const iri = b.individual.value;
          const formattedName = formatLocalName(iri).toLowerCase(); // format dulu lalu lowercase

          if (!uniqueMap.has(formattedName)) {
            uniqueMap.set(formattedName, iri);
          }
        });

        return Array.from(uniqueMap.values());
      } catch (error) {
        console.error("Gagal fetch individu:", error);
        return [];
      }
    },
  },
});

// Helper function untuk formatting nama
function formatLocalName(iri) {
  const raw = iri.split("#").pop().split("/").pop();
  let formatted = raw.replace(/_/g, " ");
  formatted = formatted.replace(/([a-z])([A-Z])/g, "$1 $2");
  formatted = formatted.replace(/\b\w/g, (char) => char.toUpperCase());
  return formatted;
}
