import axios from "axios";
import { liveAdapter } from "./liveAdapter";
// Auth, tags, training levels and provinces use the real backend (see liveAdapter);
// every other route has no backend counterpart yet and is served by the demo adapter.
export const axiosInstance = axios.create({ adapter: liveAdapter });
axiosInstance.interceptors.response.use(response => response.data);
