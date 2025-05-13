<template>
  <div>
    <!-- Judul visualisasi -->
    <h2 class="text-xl font-bold mb-4">Visualisasi Ontologi Tempat Bersejarah (Class & Subclass)</h2>

    <!-- Container untuk grafik D3 -->
    <div ref="graphContainer" class="border p-4 bg-white" style="height: 600px;"></div>

    <!-- Panel detail node yang diklik -->
    <div v-if="clickedNode" class="mt-4 p-4 border bg-gray-100">
      <h3 class="font-bold">Detail Node</h3>
      <p><strong>Nama:</strong> {{ clickedNode.name }}</p>
      <p><strong>Jenis:</strong> {{ clickedNode.type }}</p>

      <!-- Daftar individu dari class yang dipilih -->
      <div v-if="individuList.length">
        <p class="mt-2 font-semibold">Individu dalam class ini:</p>
        <ul class="list-disc ml-6">
          <li v-for="(ind, index) in individuList" :key="index">
            {{ formatLocalName(ind) }}
          </li>
        </ul>
      </div>
      <p v-else class="italic text-sm text-gray-500 mt-2">Tidak ada individu yang ditemukan</p>
    </div>

    <!-- Tombol kontrol zoom -->
    <div class="mt-4 flex gap-2">
      <button @click="zoomIn" class="px-3 py-1 bg-blue-500 text-white rounded">Zoom In</button>
      <button @click="zoomOut" class="px-3 py-1 bg-blue-500 text-white rounded">Zoom Out</button>
      <button @click="fitGraph" class="px-3 py-1 bg-green-500 text-white rounded">Fit All Nodes</button>
    </div>
  </div>
</template>

<script setup>
// Mengimpor fitur Vue dan D3
import { ref, onMounted, watch } from "vue";
import { useStore } from "vuex";
import * as d3 from "d3";

// Ref untuk elemen DOM
const graphContainer = ref(null);
const clickedNode = ref(null);
const individuList = ref([]);
const store = useStore();
const graphData = ref([]);

let svgElement, zoomInstance, simulation;

// Fungsi untuk format nama individu (ini yang kamu minta)
function formatLocalName(iri) {
  const raw = iri.split("#").pop().split("/").pop();

  // Step 1: ganti underscore _ jadi spasi
  let formatted = raw.replace(/_/g, " ");

  // Step 2: kasih spasi di antara huruf kecil dan huruf besar (CamelCase -> Spasi)
  formatted = formatted.replace(/([a-z])([A-Z])/g, "$1 $2");

  // Step 3: kapitalisasi huruf pertama setiap kata
  formatted = formatted.replace(/\b\w/g, (char) => char.toUpperCase());

  return formatted.trim();
}

// Saat komponen mount
onMounted(async () => {
  await store.dispatch("fetchGraphData");
  graphData.value = store.state.visualisasi_graph;
  drawGraph();
});

// Update grafik kalau data berubah
watch(
  () => store.state.visualisasi_graph,
  (newData) => {
    graphData.value = newData;
    drawGraph();
  }
);

// Fungsi menggambar graph
function drawGraph() {
  if (!graphContainer.value || graphData.value.length === 0) return;

  const container = graphContainer.value;
  container.innerHTML = "";

  const width = container.clientWidth;
  const height = container.clientHeight;

  const svg = d3.select(container)
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  const g = svg.append("g");
  svgElement = g;

  const filteredData = graphData.value.filter((d) => {
    const isBlankNode = (val) => typeof val === "string" && val.startsWith("_:");
    return d.relation === "subClassOf" && !isBlankNode(d.source) && !isBlankNode(d.target);
  });

  const links = filteredData.map((d) => ({
    source: d.source.split("#").pop(),
    target: d.target.split("#").pop(),
    relation: "subClassOf",
  }));

  const nodes = Array.from(new Set(links.flatMap((l) => [l.source, l.target])))
    .map((id) => ({
      id,
      name: id,
      type: "Class",
    }));

  zoomInstance = d3.zoom()
    .scaleExtent([0.1, 4])
    .on("zoom", (event) => g.attr("transform", event.transform));
  svg.call(zoomInstance);

  simulation = d3.forceSimulation(nodes)
    .force("link", d3.forceLink(links).id((d) => d.id).distance(150))
    .force("charge", d3.forceManyBody().strength(-600))
    .force("center", d3.forceCenter(width / 2, height / 2));

  const link = g.append("g")
    .attr("stroke", "#ccc")
    .selectAll("line")
    .data(links)
    .join("line")
    .attr("stroke-width", 2);

  const node = g.append("g")
    .attr("stroke", "#fff")
    .attr("stroke-width", 2)
    .selectAll("circle")
    .data(nodes)
    .join("circle")
    .attr("r", 15)
    .attr("fill", "#00aaff")
    .on("click", async (event, d) => {
      clickedNode.value = {
        name: d.name,
        type: d.type,
      };

      if (d.type === "Class") {
        individuList.value = await store.dispatch("fetchIndividualsByClass", d.name);
      } else {
        individuList.value = [];
      }
    })
    .call(
      d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended)
    );

  const text = g.append("g")
    .selectAll("text")
    .data(nodes)
    .join("text")
    .text((d) => d.name.replace(/([a-z])([A-Z])/g, "$1 $2"))
    .attr("font-size", 12)
    .attr("dy", 4)
    .attr("text-anchor", "middle")
    .attr("fill", "black")
    .attr("pointer-events", "none");

  const relText = g.append("g")
    .selectAll("text.relation")
    .data(links)
    .join("text")
    .attr("class", "relation")
    .text((d) => d.relation)
    .attr("font-size", 10)
    .attr("fill", "gray")
    .attr("text-anchor", "middle")
    .attr("pointer-events", "none");

  simulation.on("tick", () => {
    link
      .attr("x1", (d) => d.source.x)
      .attr("y1", (d) => d.source.y)
      .attr("x2", (d) => d.target.x)
      .attr("y2", (d) => d.target.y);

    node.attr("cx", (d) => d.x).attr("cy", (d) => d.y);
    text.attr("x", (d) => d.x).attr("y", (d) => d.y);
    relText
      .attr("x", (d) => (d.source.x + d.target.x) / 2)
      .attr("y", (d) => (d.source.y + d.target.y) / 2 - 5);
  });

  simulation.on("end", fitGraph);

  function dragstarted(event, d) {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  }
  function dragged(event, d) {
    d.fx = event.x;
    d.fy = event.y;
  }
  function dragended(event, d) {
    if (!event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  }
}

// Fungsi Zoom
function zoomIn() {
  if (!zoomInstance) return;
  const svg = d3.select(graphContainer.value).select("svg");
  zoomInstance.scaleBy(svg.transition().duration(750), 1.5);
}
function zoomOut() {
  if (!zoomInstance) return;
  const svg = d3.select(graphContainer.value).select("svg");
  zoomInstance.scaleBy(svg.transition().duration(750), 0.67);
}

// Fungsi Fit Graph
function fitGraph() {
  if (!svgElement || !zoomInstance) return;
  const svg = d3.select(graphContainer.value).select("svg");
  const width = graphContainer.value.clientWidth;
  const height = graphContainer.value.clientHeight;
  const bounds = svgElement.node().getBBox();

  const scale = 0.9 * Math.min(width / bounds.width, height / bounds.height);
  const translateX = width / 2 - (bounds.x + bounds.width / 2) * scale;
  const translateY = height / 2 - (bounds.y + bounds.height / 2) * scale;

  svg.transition()
    .duration(750)
    .call(zoomInstance.transform, d3.zoomIdentity.translate(translateX, translateY).scale(scale));
}
</script>


<style scoped>
svg {
  width: 100%;
  height: 100%;
}
</style>
