import { renderToString } from "react-dom/server";
import App from "./App";
export { projects } from "./data";
export function render() {
  return renderToString(<App />);
}
