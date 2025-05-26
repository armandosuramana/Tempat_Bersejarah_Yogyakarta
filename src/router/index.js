import { createRouter, createWebHistory } from 'vue-router'
// Views
import HomeView from '../views/HomeView.vue'
import VisualisasiView from '../views/VisualisasiView.vue'
import DetailKeratonView from '../views/DetailKeratonView.vue'
import DetailCandiPrambananView from '../views/DetailCandiPrambananView.vue'
import DetailBentengVredeburgView from '../views/DetailBentengVredeburgView.vue'
import DetailTamanSariView from '../views/DetailTamanSariView.vue'
import DetailCandiBorobudurView from '../views/DetailCandiBorobudurView.vue'

// Sub-Views
import BentengKelilingVredeburgView from '../views/BentengKelilingVredeburgView.vue'
import BangsalView from '../views/BangsalView.vue'
import BaleView from '../views/BaleView.vue'
import PlengkungView from '../views/PlengkungView.vue'
import GapuraKeratonView from '../views/GapuraKeratonView.vue'
import AlunAlunKeratonView from '../views/AlunAlunKeratonView.vue'
import GedungKeratonView from '../views/GedungKeratonView.vue'
import MasjidKeratonView from '../views/MasjidKeratonView.vue'
import GapuraTamanSariView from '../views/GapuraTamanSariView.vue'
import KolamPemandianTamanSariView from '../views/KolamPemandianTamanSariView.vue'
import SumurTamanSariView from '../views/SumurTamanSariView.vue'
import GerbangBaratVredeburgView from '../views/GerbangBaratVredeburgView.vue'
import CandiUtamaView from '../views/CandiUtamaView.vue'
import ArcadanReliefPrambananView from '../views/ArcadanReliefPrambananView.vue'
import CandiPendampingView from '../views/CandiPendampingView.vue'
import StupaBorobudurView from '../views/StupaBorobudurView.vue'
import ArcadanReliefBorobudurView from '../views/ArcadanReliefBorobudurView.vue'
import AboutUsView from '../views/AboutUsView.vue'

const routes = [
  { path: '/', name: 'Home', component: HomeView },
  { path: '/visualisasi', name: 'Visualisasi', component: VisualisasiView },
  { path: '/keraton', name: 'DetailKeraton', component: DetailKeratonView },
  { path: '/prambanan', name: 'DetailCandiPrambanan', component: DetailCandiPrambananView },
  { path: '/vredeburg', name: 'DetailBentengVredeburg', component: DetailBentengVredeburgView },
  { path: '/taman-sari', name: 'DetailTamanSari', component: DetailTamanSariView },
  { path: '/borobudur', name: 'DetailCandiBorobudur', component: DetailCandiBorobudurView },
    
  // Sub-paths
  { path: '/benteng-keliling-vredeburg', name: 'BentengKelilingVredeburg', component: BentengKelilingVredeburgView },
  { path: '/bangsal', name: 'Bangsal', component: BangsalView },
  { path: '/bale', name: 'Bale', component: BaleView },
  { path: '/plengkung', name: 'Plengkung', component: PlengkungView },
  { path: '/gapura-keraton', name: 'GapuraKeraton', component: GapuraKeratonView },
  { path: '/alun-alun-keraton', name: 'AlunAlunKeraton', component: AlunAlunKeratonView },
  { path: '/gedung-keraton', name: 'GedungKeraton', component: GedungKeratonView },
  { path: '/masjid-keraton', name: 'MasjidKeraton', component: MasjidKeratonView },
  { path: '/gapura-taman-sari', name: 'GapuraTamanSari', component: GapuraTamanSariView },
  { path: '/pemandian-taman-sari', name: 'KolamPemandianTamanSari', component: KolamPemandianTamanSariView },
  { path: '/sumur-taman-sari', name: 'SumurTamanSari', component: SumurTamanSariView },
  { path: '/gerbang-barat', name: 'GerbangBaratVredeburg', component: GerbangBaratVredeburgView },
  { path: '/candi-utama', name: 'CandiUtama', component: CandiUtamaView },
  { path: '/arca-relief-prambanan', name: 'ArcadanReliefPrambanan', component: ArcadanReliefPrambananView },
  { path: '/candi-pendamping', name: 'CandiPendamping', component: CandiPendampingView },
  { path: '/stupa-borobudur', name: 'StupaBorobudur', component: StupaBorobudurView },
  { path: '/arca-relief-borobudur', name: 'ArcadanReliefBorobudur', component: ArcadanReliefBorobudurView },
  { path: '/about', name: 'About', component: AboutUsView },

]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
