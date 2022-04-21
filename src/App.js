import "./App.css";
import { Route, Routes } from "react-router-dom";
import Mockman from "mockman-js";
import {
  ErrorPage,
  History,
  Landing,
  LikedVideos,
  Login,
  Playlist,
  Signup,
  SingleVideoPage,
  VideoListing,
  WatchLater,
} from "./pages";
import {
  RedirectLoggedInUser,
  RequireAuth,
} from "./contexts/User-Context/user-context";
import { Footer, NavBar } from "./components";

function App() {
  return (
    <div className="App">
      <NavBar />
      <div className="main-container">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="explore">
            <Route index element={<VideoListing />} />
            <Route path=":videoId" element={<SingleVideoPage />} />
          </Route>
          <Route
            path="login"
            element={
              <RedirectLoggedInUser>
                <Login />
              </RedirectLoggedInUser>
            }
          />
          <Route
            path="signup"
            element={
              <RedirectLoggedInUser>
                <Signup />
              </RedirectLoggedInUser>
            }
          />
          <Route
            path="liked"
            element={
              <RequireAuth>
                <LikedVideos />
              </RequireAuth>
            }
          />
          <Route
            path="watch-later"
            element={
              <RequireAuth>
                <WatchLater />
              </RequireAuth>
            }
          />
          <Route
            path="history"
            element={
              <RequireAuth>
                <History />
              </RequireAuth>
            }
          />
          <Route
            path="playlists"
            element={
              <RequireAuth>
                <Playlist />
              </RequireAuth>
            }
          />
          <Route path="mockapi" element={<Mockman />} />
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      <Footer />
      </div>
    </div>
  );
}

export default App;
