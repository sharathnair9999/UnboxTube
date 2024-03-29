import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  Reducer,
} from "react";
import {
  Navigate,
  NavigateFunction,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { toast } from "react-toastify";
import { callAPI, capitalize } from "../../app-utils";
import { VideoType } from "../Video-Context/VideoContext.types";
import { initialUserState, userReducer, initialModalState } from "./user-utils";
import {
  PlaylistType,
  UserActions,
  UserActionType,
  UserStateType,
} from "./UserContext.types";

const AuthContext: React.Context<UserStateType> =
  createContext(initialUserState);

type AuthProviderTypes = {
  children: React.ReactNode;
};

const AuthProvider = ({ children }: AuthProviderTypes) => {
  const [userState, userDispatch] = useReducer<
    Reducer<UserStateType, UserActionType>
  >(userReducer, initialUserState);
  const navigate: NavigateFunction = useNavigate();

  const testUser = {
    email: "chandlerbing@friends.com",
    password: "chandlerbing",
  };
  const localDetails = localStorage.getItem("userToken");
  const userDetails = localDetails
    ? JSON.parse(localDetails)
    : {
        encodedToken: "",
        firstName: "",
        lastName: "",
      };

  const loginUser = async (credentials: {}): Promise<void> => {
    try {
      const {
        data: {
          encodedToken,
          foundUser: {
            firstName,
            lastName,
            likes,
            watchlater,
            history,
            playlists,
          },
        },
      } = await callAPI("POST", "/api/auth/login", credentials);
      localStorage.setItem(
        "userToken",
        JSON.stringify({
          encodedToken: encodedToken,
          firstName: firstName,
          lastName: lastName,
        })
      );
      userDispatch({
        type: UserActions.LOGIN_USER,
        payload: {
          firstName: firstName,
          lastName: lastName,
          likedVideos: likes,
          watchlater: watchlater,
          history: history,
          playlists: playlists,
        },
      });
      navigate(-1);
    } catch (error) {
      toast.error("Could not login at this moment!");
    }
  };

  const signUpUser = async (details: {}): Promise<void> => {
    try {
      const {
        data: { createdUser },
      } = await callAPI("POST", "/api/auth/signup", details);

      toast.success(
        `Welcome to UnboxTube ${capitalize(createdUser.firstName)} ${capitalize(
          createdUser.lastName
        )}`
      );
    } catch (error) {
      toast.error("This user already exists");
    }
  };

  const logoutUser = (): void => {
    localStorage.removeItem("userToken");
    userDispatch({ type: UserActions.LOGOUT_USER });
    toast.success("Logged Out Successfully");
  };

  const getAllLikedVideos = async (): Promise<void> => {
    if (!userState.isLoggedIn || !userDetails) {
      return;
    }
    try {
      const {
        data: { likes },
      } = await callAPI(
        "GET",
        "/api/user/likes",
        null,
        userDetails?.encodedToken
      );
      userDispatch({ type: UserActions.LIKED_VIDEOS, payload: likes });
    } catch (error) {
      toast.error("Error Retrieving Liked Videos");
    }
  };

  const addToLikedVideos = async (video: VideoType): Promise<void> => {
    try {
      const {
        data: { likes },
      } = await callAPI(
        "POST",
        "/api/user/likes",
        { video },
        userDetails?.encodedToken
      );
      userDispatch({ type: UserActions.LIKED_VIDEOS, payload: likes });
      toast.success("Video Added to Likes");
    } catch (error) {
      toast.error("Couldn't like the video");
    }
  };
  const removeFromLikedVideos = async (_id: string) => {
    try {
      const {
        data: { likes },
      } = await callAPI(
        "DELETE",
        `/api/user/likes/${_id}`,
        null,
        userDetails?.encodedToken
      );
      userDispatch({ type: UserActions.LIKED_VIDEOS, payload: likes });
      toast.success("Video Removed From Likes");
    } catch (error) {
      toast.error("Seems you are not sure disliking!");
    }
  };

  const getUserHistory = async () => {
    if (!userState.isLoggedIn || !userDetails) {
      return;
    }
    try {
      const {
        data: { history },
      } = await callAPI(
        "GET",
        "/api/user/history",
        null,
        userDetails?.encodedToken
      );
      userDispatch({ type: UserActions.HISTORY, payload: history });
    } catch (error) {
      toast.error("Problem in retrieving your history!");
    }
  };

  const getUserWatchLater = async () => {
    if (!userState.isLoggedIn || !userDetails) {
      return;
    }
    try {
      const {
        data: { watchlater },
      } = await callAPI(
        "GET",
        "/api/user/watchlater",
        null,
        userDetails?.encodedToken
      );
      userDispatch({ type: UserActions.WATCH_LATER, payload: watchlater });
    } catch (error) {
      toast.error("Problem in retrieving your watch later videos!");
    }
  };

  const addToHistory = async (video: VideoType) => {
    try {
      const {
        data: { history },
      } = await callAPI(
        "POST",
        "/api/user/history",
        { video: video },
        userDetails?.encodedToken
      );
      userDispatch({ type: UserActions.HISTORY, payload: history });
    } catch (error) {
      toast.error("Couldn't add videos to history");
    }
  };
  const addToWatchLater = async (video: VideoType) => {
    try {
      const {
        data: { watchlater },
      } = await callAPI(
        "POST",
        "/api/user/watchlater",
        { video: video },
        userDetails?.encodedToken
      );
      userDispatch({ type: UserActions.WATCH_LATER, payload: watchlater });
      toast.success("Added Video to Watch Later");
    } catch (error) {
      toast.error("Couldn't add videos to watch later");
    }
  };

  const removeVideoFromHistory = async (_id: string) => {
    try {
      const {
        data: { history },
      } = await callAPI(
        "DELETE",
        `/api/user/history/${_id}`,
        null,
        userDetails?.encodedToken
      );
      userDispatch({ type: UserActions.HISTORY, payload: history });
      toast.success("Removed Video from History");
    } catch (error) {
      toast.error("Could not remove video from history.");
    }
  };
  const removeFromWatchLater = async (_id: string): Promise<void> => {
    try {
      const {
        data: { watchlater },
      } = await callAPI(
        "DELETE",
        `/api/user/watchlater/${_id}`,
        null,
        userDetails?.encodedToken
      );
      userDispatch({ type: UserActions.WATCH_LATER, payload: watchlater });
      toast.success("Removed Video from Watch Later");
    } catch (error) {
      toast.error("Could not remove video from watch later.");
    }
  };

  const emptyHistory = async () => {
    if (userState.history.length === 0) {
      toast.warn("There are no videos here to delete");
      return;
    }
    try {
      const {
        data: { history },
      } = await callAPI(
        "DELETE",
        `/api/user/history/all`,
        null,
        userDetails?.encodedToken
      );
      userDispatch({ type: UserActions.HISTORY, payload: history });
      toast.success("Cleared History.");
    } catch (error) {
      toast.error("Could not empty your history");
    }
  };

  const getAllPlaylists = async () => {
    if (!userState.isLoggedIn) {
      return;
    }
    try {
      const {
        data: { playlists },
      } = await callAPI(
        "GET",
        "/api/user/playlists",
        null,
        userDetails?.encodedToken
      );
      userDispatch({ type: UserActions.ALL_PLAYLISTS, payload: playlists });
    } catch (error) {
      toast.error("Could not retrieve playlist information");
    }
  };

  const createPlaylist = async (title: string, description: string) => {
    if (
      userState.playlists.some(
        (playlist: PlaylistType) => playlist.title === title
      )
    ) {
      toast.error("Playlist with that name already exists");
      return;
    }
    try {
      const {
        data: { playlists },
      } = await callAPI(
        "POST",
        "/api/user/playlists",
        {
          playlist: { title, description },
        },
        userDetails?.encodedToken
      );
      userDispatch({ type: UserActions.ALL_PLAYLISTS, payload: playlists });
      toast.success(`Added ${title} - Playlist successfully!`);
    } catch (error) {
      toast.error("Could not create the playlist");
    }
  };

  const deletePlaylist = async (
    _id: string,
    fromPlaylistRoute: boolean,
    navigate: NavigateFunction
  ) => {
    try {
      const {
        data: { playlists },
      } = await callAPI(
        "DELETE",
        `/api/user/playlists/${_id}`,
        null,
        userDetails?.encodedToken
      );
      if (fromPlaylistRoute) {
        navigate("/playlists", { replace: true });
      }
      userDispatch({ type: UserActions.ALL_PLAYLISTS, payload: playlists });
      toast.success(`Deleted Playlist successfully!`);
    } catch (error) {
      toast.error("Could not delete the playlist");
    }
  };

  const getPlaylist = async (_id: string) => {
    if (!userState.isLoggedIn) {
      return;
    }
    try {
      const {
        data: { playlist },
      } = await callAPI(
        "GET",
        `/api/user/playlists/${_id}`,
        null,
        userDetails?.encodedToken
      );
      userDispatch({ type: UserActions.SINGLE_PLAYLIST, payload: playlist });
    } catch (error) {
      navigate("/invalid-page");
      toast.error("Could not retrieve the playlist");
    }
  };

  const addVideoToPlaylist = async (_id: string, video: VideoType) => {
    try {
      const {
        data: { playlist },
      } = await callAPI(
        "POST",
        `/api/user/playlists/${_id}`,
        { video },
        userDetails?.encodedToken
      );

      userDispatch({ type: UserActions.ADD_TO_PLAYLIST, payload: playlist });
      toast.success("Video added to playlist successfully");
    } catch (error) {
      toast.error("Error uploading video");
    }
  };

  const deleteVideoFromPlaylist = async (
    playlistId: string,
    videoId: string
  ) => {
    try {
      const {
        data: { playlist },
      } = await callAPI(
        "DELETE",
        `/api/user/playlists/${playlistId}/${videoId}`,
        null,
        userDetails?.encodedToken
      );
      userDispatch({
        type: UserActions.DELETE_FROM_PLAYLIST,
        payload: playlist,
      });
      userDispatch({ type: UserActions.SINGLE_PLAYLIST, payload: playlist });
      toast.success("Deleted Video From Playlist");
    } catch (error) {
      toast.error("Could not delete video from Playlist");
    }
  };

  const handlePlaylistModal = (
    open: boolean,
    video: VideoType,
    fromPlaylist: boolean
  ) => {
    userDispatch({
      type: UserActions.PLAYLIST_MODAL,
      payload: {
        openModal: open,
        video: video,
        fromPlaylist: fromPlaylist,
      },
    });
  };

  useEffect(() => {
    getAllLikedVideos();
    getAllPlaylists();
    getUserWatchLater();
    getUserHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value: any = {
    userState,
    userDispatch,
    loginUser,
    signUpUser,
    logoutUser,
    getAllLikedVideos,
    getUserWatchLater,
    addToLikedVideos,
    removeFromLikedVideos,
    getUserHistory,
    addToHistory,
    removeVideoFromHistory,
    emptyHistory,
    addToWatchLater,
    removeFromWatchLater,
    getAllPlaylists,
    createPlaylist,
    deletePlaylist,
    getPlaylist,
    addVideoToPlaylist,
    deleteVideoFromPlaylist,
    handlePlaylistModal,
    testUser,
    initialModalState,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

const RequireAuth = ({ children }: { children: JSX.Element }) => {
  const { userState } = useAuth();
  const location = useLocation();
  if (!userState.isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
};
const RedirectLoggedInUser = ({ children }: { children: JSX.Element }) => {
  const { userState } = useAuth();
  const location = useLocation();
  if (userState.isLoggedIn) {
    return <Navigate to={"/"} replace state={{ from: location }} />;
  }
  return children;
};

const useAuth = (): any => useContext(AuthContext);

export { useAuth, AuthProvider, RequireAuth, RedirectLoggedInUser };
