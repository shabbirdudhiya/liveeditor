import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

import Editor from "./pages/Editor";
import Home from "./pages/Home";
import Moderator from "./pages/Moderator";
import Viewer from "./pages/Viewer";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/moderator" element={<Moderator />} />
        <Route path="/viewer/fr" element={<Viewer languageCode={"fr"} />} />
        <Route path="/viewer/it" element={<Viewer languageCode={"it"} />} />
        <Route path="/editor/1" element={<Editor editorId={1} />} />
        <Route path="/editor/2" element={<Editor editorId={2} />} />
        <Route path="/editor/3" element={<Editor editorId={3} />} />
      </Routes>
    </Router>
  );
}

export default App;
