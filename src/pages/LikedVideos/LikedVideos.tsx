import React from "react";
import { constants } from "../../app-utils";
import { EmptyData, HorizontalCard } from "../../components";
import { useAuth } from "../../contexts";
import { VideoType } from "../../contexts/Video-Context/VideoContext.types";
import { useDocumentTitle } from "../../custom-hooks";
import "./LikedVideos.css";

const LikedVideos = () => {
  const {
    userState: { likedVideos },
  } = useAuth();

  const { titles } = constants;
  useDocumentTitle(titles.liked());

  return (
    <div className="flex-col flex justify-fs items-fs  gap-1 p-sm">
      <p className=" title">{`Liked Videos ${
        likedVideos?.length > 0 ? `- ${likedVideos?.length}` : ""
      }`}</p>
      {!likedVideos || likedVideos.length === 0 ? (
        <EmptyData
          msg={"You didn't like any videos from us!"}
          url={"/explore"}
        />
      ) : (
        <div className="flex justify-center items-center flex-col gap-sm w-100">
          {likedVideos?.map((video: VideoType, sNo: number) => (
            <HorizontalCard video={video} key={video._id} sNo={sNo} likeCard />
          ))}
        </div>
      )}
    </div>
  );
};

export default LikedVideos;
