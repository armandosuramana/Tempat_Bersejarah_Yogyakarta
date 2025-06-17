<template>
  <div class="content">
    <h2>Visualisasi Ontologi Tempat Bersejarah (Kelas, Subkelas, dan Relasi Objek Properti)</h2>
    <div ref="graphContainer" style="height: 700px; border: 1px solid #ccc;"></div>

    <!-- Panel Detail Individu -->
    <div v-if="selectedClass && individuals.length" class="mt-4 p-4 border bg-gray-100">
      <h3 class="font-semibold">Individu dari: {{ selectedClass }}</h3>
      <ul class="list-disc ml-6">
        <li v-for="(item, idx) in individuals" :key="idx">{{ formatName(item) }}</li>
      </ul>
    </div>
    <div v-else-if="selectedClass" class="mt-4 p-4 text-gray-500 italic">
      Tidak ditemukan individu untuk class "{{ selectedClass }}"
    </div>
  </div>
</template>

<script>
import { Network } from 'vis-network';

export default {
  name: 'VisualisasiTempatBersejarah',
  data() {
    return {
      nodes: [],
      edges: [],
      selectedClass: null,
      individuals: [],
    };
  },
  async mounted() {
    await this.fetchGraphData();
    this.drawGraph();
  },
  methods: {
    async fetchGraphData() {
      const query = `
        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
        PREFIX owl: <http://www.w3.org/2002/07/owl#>

        SELECT DISTINCT ?source ?sourceLabel ?target ?targetLabel ?predicate WHERE {
          {
            ?source rdfs:subClassOf ?target .
            BIND(rdfs:subClassOf AS ?predicate)
          }
          UNION {
            ?predicate a owl:ObjectProperty ;
                       rdfs:domain ?source ;
                       rdfs:range ?target .
          }

          OPTIONAL { ?source rdfs:label ?sourceLabel }
          OPTIONAL { ?target rdfs:label ?targetLabel }

          FILTER (!isBlank(?source) && !isBlank(?target))
          FILTER (?target != owl:Thing && ?source != owl:Thing)
          FILTER (STRSTARTS(STR(?source), "http://") || STRSTARTS(STR(?source), "https://"))
          FILTER (STRSTARTS(STR(?target), "http://") || STRSTARTS(STR(?target), "https://"))
        }
      `;

      const response = await fetch('http://localhost:3030/TempatBersejarah/sparql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/sparql-query',
          Accept: 'application/sparql-results+json',
        },
        body: query,
      });

      if (!response.ok) {
        console.error('SPARQL Error:', await response.text());
        return;
      }

      const json = await response.json();
      const nodeMap = new Map();
      const edgeList = [];

      json.results.bindings.forEach(b => {
        const sourceIRI = b.source.value;
        const targetIRI = b.target.value;
        const predicateIRI = b.predicate.value;
        const sourceLabel = b.sourceLabel?.value || this.formatName(sourceIRI);
        const targetLabel = b.targetLabel?.value || this.formatName(targetIRI);
        const predicateLabel = this.formatName(predicateIRI);

        if (!nodeMap.has(sourceIRI)) {
          nodeMap.set(sourceIRI, {
            id: sourceIRI,
            label: sourceLabel,
            iri: sourceIRI,
            color: '#3498db',
            size: 20,
          });
        }

        if (!nodeMap.has(targetIRI)) {
          nodeMap.set(targetIRI, {
            id: targetIRI,
            label: targetLabel,
            iri: targetIRI,
            color: '#2ecc71',
            size: 20,
          });
        }

        edgeList.push({
          from: sourceIRI,
          to: targetIRI,
          arrows: 'to',
          label: predicateLabel,
        });
      });

      this.nodes = Array.from(nodeMap.values());
      this.edges = edgeList;
    },

    drawGraph() {
      const container = this.$refs.graphContainer;
      const data = {
        nodes: this.nodes,
        edges: this.edges,
      };

      const options = {
        layout: { improvedLayout: true },
        nodes: {
          shape: 'dot',
          font: { size: 14 },
        },
        edges: {
          arrows: 'to',
          font: { align: 'middle', size: 10 },
        },
        physics: {
          enabled: true,
          solver: 'forceAtlas2Based',
          forceAtlas2Based: {
            gravitationalConstant: -50,
            centralGravity: 0.01,
            springLength: 150,
            damping: 0.4,
          },
          stabilization: { iterations: 200 },
        },
      };

      const network = new Network(container, data, options);
      network.once('stabilizationIterationsDone', () => {
        network.fit();
      });

      network.on('click', async (params) => {
        if (params.nodes.length > 0) {
          const clickedNode = this.nodes.find(n => n.id === params.nodes[0]);
          const classIRI = clickedNode?.iri;

          this.selectedClass = this.formatName(classIRI);
          this.individuals = await this.fetchIndividualsByClassIRI(classIRI);
        } else {
          this.selectedClass = null;
          this.individuals = [];
        }
      });
    },

    async fetchIndividualsByClassIRI(classIRI) {
      const query = `
        PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>

        SELECT ?individual WHERE {
          ?individual rdf:type <${classIRI}> .
          FILTER (STRSTARTS(STR(?individual), "http://") || STRSTARTS(STR(?individual), "https://"))
        }
      `;

      const response = await fetch(`http://localhost:3030/TempatBersejarah/sparql`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/sparql-query',
          Accept: 'application/sparql-results+json',
        },
        body: query,
      });

      if (!response.ok) {
        console.error("SPARQL Error:", await response.text());
        return [];
      }

      const json = await response.json();
      return json.results.bindings.map(b => b.individual.value);
    },

    formatName(iri) {
      const raw = iri.split('#').pop().split('/').pop();
      return raw.replace(/_/g, ' ')
                .replace(/([a-z])([A-Z])/g, '$1 $2')
                .replace(/^\w/, c => c.toUpperCase());
    },
  },
};
</script>

<style scoped>
.content {
  padding: 20px;
}
h2 {
  margin-bottom: 20px;
  font-weight: bold;
}
</style>
